#!/usr/bin/env node
/*
 * import-data.mjs — load the Command Center CSV "databases" into the new Postgres
 * (or Supabase) database defined by handoff/migration/schema.sql.
 *
 * WHY: the dashboard's participant/lead/wearable data currently lives in flat
 * CSVs under data/. Those CSVs are NOT shipped in this handoff package (they
 * contain real names + emails). The original owner sends them to you separately;
 * drop them into ./private-data/ and run this script to load them into your DB.
 *
 * SETUP
 *   1. Run the schema first:   psql "$DATABASE_URL" -f handoff/migration/schema.sql
 *   2. npm install pg          (the only dependency)
 *   3. Put the real CSVs in    ./private-data/   (gitignored — never commit them)
 *        master-participants.csv  all-submissions.csv  meta-leads.csv
 *        oura-database.csv  whoop-database.csv  fitbit-database.csv  apple-watch-database.csv
 *   4. export DATABASE_URL="postgres://user:pass@host:5432/dbname"
 *        (Supabase: Project Settings -> Database -> Connection string -> URI,
 *         use the SESSION pooler or direct connection.)
 *
 * RUN
 *   node handoff/migration/import-data.mjs            # load everything
 *   node handoff/migration/import-data.mjs --dry-run  # parse + report, write nothing
 *   node handoff/migration/import-data.mjs leads      # load only one table
 *
 * Idempotent: participants/leads/wearable_roster UPSERT on their keys; submissions
 * is truncated and reloaded (no natural key). Re-run safely.
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(HERE, 'private-data');           // <-- put the real CSVs here
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const only = args.filter(a => !a.startsWith('--'));

const DATABASE_URL = (process.env.DATABASE_URL || '').trim();
if (!DRY && !DATABASE_URL) {
  console.error('ERROR: set DATABASE_URL (or pass --dry-run to test parsing only).');
  process.exit(1);
}

// --- tiny quote-aware CSV parser (same approach as scripts/refresh-stats.mjs) ---
function parseCsv(path) {
  if (!existsSync(path)) { console.warn(`  ! missing: ${path} — skipping`); return null; }
  const text = readFileSync(path, 'utf8').replace(/^﻿/, '').trim();
  if (!text) return { headers: [], rows: [] };
  const lines = text.split(/\r?\n/);
  const splitLine = (line) => {
    const out = []; let cur = '', q = false;
    for (const ch of line) {
      if (ch === '"') q = !q;
      else if (ch === ',' && !q) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out.map(s => s.trim());
  };
  const headers = splitLine(lines[0]);
  const rows = lines.slice(1).filter(Boolean).map(line => {
    const vals = splitLine(line); const o = {};
    headers.forEach((h, i) => { o[h] = (vals[i] ?? '').trim(); });
    return o;
  });
  return { headers, rows };
}

const lc = (s) => (s || '').toLowerCase().trim() || null;
const nullable = (s) => { const v = (s ?? '').trim(); return v === '' ? null : v; };
const toDate = (s) => { const v = nullable(s); if (!v) return null; const d = new Date(v); return isNaN(d) ? null : d.toISOString().slice(0, 10); };
const toBool = (s) => { const v = lc(s); if (v == null) return null; return ['true', '1', 'yes', 'active', 'y'].includes(v); };

// --- importers: each returns { table, count } -------------------------------
async function importParticipants(client) {
  const f = parseCsv(join(DATA_DIR, 'master-participants.csv')); if (!f) return;
  let n = 0;
  for (const r of f.rows) {
    const email = lc(r.email); if (!email) continue;
    if (!DRY) await client.query(
      `INSERT INTO participants (email,name,user_id,gender,active,compliance_experiment,
         last_study_interacted,last_completed_date,last_withdrawal_date,reason,last_withdrawn_study_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (email) DO UPDATE SET
         name=EXCLUDED.name, user_id=EXCLUDED.user_id, gender=EXCLUDED.gender, active=EXCLUDED.active,
         compliance_experiment=EXCLUDED.compliance_experiment, last_study_interacted=EXCLUDED.last_study_interacted,
         last_completed_date=EXCLUDED.last_completed_date, last_withdrawal_date=EXCLUDED.last_withdrawal_date,
         reason=EXCLUDED.reason, last_withdrawn_study_name=EXCLUDED.last_withdrawn_study_name, imported_at=now()`,
      [email, nullable(r.name), nullable(r.user_id), nullable(r.gender), toBool(r.active),
       nullable(r.compliance_experiment), nullable(r.last_study_interacted), toDate(r.last_completed_date),
       toDate(r.last_withdrawal_date), nullable(r.reason), nullable(r.last_withdrawn_study_name)]);
    n++;
  }
  return { table: 'participants', count: n };
}

async function importSubmissions(client) {
  const f = parseCsv(join(DATA_DIR, 'all-submissions.csv')); if (!f) return;
  if (!DRY) await client.query('TRUNCATE submissions RESTART IDENTITY');
  let n = 0;
  for (const r of f.rows) {
    if (!DRY) await client.query(
      `INSERT INTO submissions (external_id,wearable,study,name,email,gender,location,eligible,answers,submitted_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [nullable(r.ID), nullable(r.wearable), nullable(r.Study), nullable(r.Name), lc(r.Email),
       nullable(r.Gender), nullable(r.Location), nullable(r.Eligible), nullable(r.Answers), toDate(r.Date)]);
    n++;
  }
  return { table: 'submissions', count: n };
}

async function importLeads(client) {
  const f = parseCsv(join(DATA_DIR, 'meta-leads.csv')); if (!f) return;
  let n = 0;
  for (const r of f.rows) {
    const email = lc(r.email); if (!email) continue;
    if (!DRY) await client.query(
      `INSERT INTO leads (email, full_name) VALUES ($1,$2)
       ON CONFLICT (email) DO UPDATE SET full_name=EXCLUDED.full_name, imported_at=now()`,
      [email, nullable(r.full_name)]);
    n++;
  }
  return { table: 'leads', count: n };
}

async function importWearables(client) {
  const sources = [
    ['oura-database.csv', 'oura'],
    ['whoop-database.csv', 'whoop'],
    ['fitbit-database.csv', 'fitbit'],
    ['apple-watch-database.csv', 'apple_watch'],
  ];
  let n = 0;
  for (const [file, device] of sources) {
    const f = parseCsv(join(DATA_DIR, file)); if (!f) continue;
    for (const r of f.rows) {
      const email = lc(r.email); if (!email) continue;
      if (!DRY) await client.query(
        `INSERT INTO wearable_roster (email, device, name, gender) VALUES ($1,$2,$3,$4)
         ON CONFLICT (email, device) DO UPDATE SET name=EXCLUDED.name, gender=EXCLUDED.gender, imported_at=now()`,
        [email, device, nullable(r.name), nullable(r.gender)]);
      n++;
    }
  }
  return { table: 'wearable_roster', count: n };
}

const importers = {
  participants: importParticipants,
  submissions: importSubmissions,
  leads: importLeads,
  wearables: importWearables,
};

// --- run --------------------------------------------------------------------
const toRun = only.length ? only.filter(k => importers[k]) : Object.keys(importers);
if (only.length && !toRun.length) {
  console.error(`Unknown table(s). Choose from: ${Object.keys(importers).join(', ')}`);
  process.exit(1);
}

let client = { query: async () => {} };           // no-op for --dry-run
let pg;
if (!DRY) {
  try { pg = await import('pg'); }
  catch { console.error('ERROR: `pg` is not installed. Run: npm install pg'); process.exit(1); }
  client = new pg.default.Client({ connectionString: DATABASE_URL });
  await client.connect();
}

console.log(`${DRY ? '[DRY RUN] ' : ''}Importing from ${DATA_DIR}\n`);
const results = [];
try {
  for (const name of toRun) {
    const res = await importers[name](client);
    if (res) { results.push(res); console.log(`  ${DRY ? 'parsed' : 'loaded'} ${res.count.toLocaleString()} -> ${res.table}`); }
  }
} catch (e) {
  console.error('\nImport failed:', e.message);
  process.exitCode = 1;
} finally {
  if (!DRY) await client.end();
}
console.log(`\nDone. ${results.reduce((a, r) => a + r.count, 0).toLocaleString()} rows ${DRY ? 'parsed' : 'written'}.`);
if (DRY) console.log('Re-run without --dry-run (and with DATABASE_URL set) to write to the database.');
