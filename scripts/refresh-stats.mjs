#!/usr/bin/env node
/*
 * Refreshes the Command Center data files — a faithful port of the four
 * GitHub Actions cron workflows (fetch-meta-ads / appsflyer / sendgrid /
 * recruiting-stats.yml), so a scheduled Claude session can produce the SAME
 * data/*.json output without GitHub Actions (which is disabled while the
 * akamoore account is flagged).
 *
 * Run:  node scripts/refresh-stats.mjs
 *
 * Required env vars (same values as the GitHub Actions secrets):
 *   META_ACCESS_TOKEN, META_AD_ACCOUNT_ID   -> data/meta-ads-stats.json
 *   APPSFLYER_API_TOKEN, APPSFLYER_APP_ID    -> data/appsflyer-stats.json
 *   SENDGRID_API_KEY                         -> data/sendgrid-stats.json
 *   API_KEY                                  -> data/recruiting-stats.json
 * A source with missing tokens is skipped (not an error).
 *
 * Network egress required: graph.facebook.com, *.appsflyer.com,
 * api.sendgrid.com, operations.reputablehealth.net
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');
mkdirSync(dataDir, { recursive: true });

// Load .env if present (so it works locally the same as in CI)
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const day = (offset = 0) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
const summary = [];
const note = (s) => { console.log(s); summary.push(s); };

async function metaAds() {
  const TOKEN = (process.env.META_ACCESS_TOKEN || '').trim();
  const ACCT = (process.env.META_AD_ACCOUNT_ID || '').trim();
  if (!TOKEN || !ACCT) return note('Meta Ads: skipped (META_ACCESS_TOKEN / META_AD_ACCOUNT_ID not set)');
  const start = day(90), end = day(0);
  const tr = encodeURIComponent(JSON.stringify({ since: start, until: end }));
  const base = `https://graph.facebook.com/v22.0/${ACCT}/insights`;

  // Daily account-level insights (paginated)
  let url = `${base}?access_token=${TOKEN}&time_range=${tr}&time_increment=1&fields=date_start,impressions,clicks,spend,cpc,cpm,ctr,actions&limit=100`;
  let rows = [];
  for (let page = 0; page < 10 && url; page++) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Meta HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const j = await r.json();
    rows = rows.concat(j.data || []);
    url = j.paging?.next;
  }
  const daily = rows.map(d => ({
    date: d.date_start,
    impressions: parseInt(d.impressions) || 0,
    clicks: parseInt(d.clicks) || 0,
    spend: parseFloat(d.spend) || 0,
    cpc: parseFloat(d.cpc) || 0,
    cpm: parseFloat(d.cpm) || 0,
    ctr: parseFloat(d.ctr) || 0,
  })).sort((a, b) => a.date.localeCompare(b.date));
  const totals = daily.reduce((a, d) => ({
    impressions: a.impressions + d.impressions,
    clicks: a.clicks + d.clicks,
    spend: a.spend + d.spend,
  }), { impressions: 0, clicks: 0, spend: 0 });
  totals.cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
  totals.cpm = totals.impressions > 0 ? totals.spend / totals.impressions * 1000 : 0;
  totals.ctr = totals.impressions > 0 ? totals.clicks / totals.impressions * 100 : 0;

  // Ad-level breakdown (for the Ads table; sorted by spend desc)
  let ads = [];
  try {
    const ar = await fetch(`${base}?access_token=${TOKEN}&time_range=${tr}&level=ad&fields=ad_name,campaign_name,impressions,clicks,spend,cpc,cpm,ctr&limit=100`);
    const aj = await ar.json();
    ads = (aj.data || []).map(a => ({
      adName: a.ad_name,
      campaignName: a.campaign_name,
      impressions: parseInt(a.impressions) || 0,
      clicks: parseInt(a.clicks) || 0,
      spend: parseFloat(a.spend) || 0,
      cpc: parseFloat(a.cpc) || 0,
      cpm: parseFloat(a.cpm) || 0,
      ctr: parseFloat(a.ctr) || 0,
    })).sort((a, b) => b.spend - a.spend);
  } catch (e) { console.warn('Meta ad-level fetch failed:', e.message); }

  writeFileSync(join(dataDir, 'meta-ads-stats.json'),
    JSON.stringify({ updated_at: new Date().toISOString(), period: { start, end }, totals, daily, ads }, null, 2));
  note(`Meta Ads: ${daily.length} days, ${ads.length} ads, $${totals.spend.toFixed(2)} spend`);
}

async function appsflyer() {
  const TOKEN = (process.env.APPSFLYER_API_TOKEN || '').trim();
  const APP = (process.env.APPSFLYER_APP_ID || '').trim();
  if (!TOKEN || !APP) return note('AppsFlyer: skipped (APPSFLYER_API_TOKEN / APPSFLYER_APP_ID not set)');
  const start = day(90), end = day(0);
  const hosts = ['hq1.appsflyer.com', 'hq.appsflyer.com', 'api2.appsflyer.com', 'api3.appsflyer.com'];
  let csv = null;
  for (const host of hosts) {
    try {
      const r = await fetch(`https://${host}/api/agg-data/export/app/${APP}/partners_by_date_report/v5?from=${start}&to=${end}&groupings=date&currency=USD`,
        { headers: { Accept: 'text/csv', Authorization: `Bearer ${TOKEN}` }, signal: AbortSignal.timeout(30000) });
      if (r.ok) { csv = (await r.text()).trim(); break; }
    } catch (_) { /* try next host */ }
  }
  if (!csv) {
    writeFileSync(join(dataDir, 'appsflyer-stats.json'),
      JSON.stringify({ updated_at: new Date().toISOString(), period: { start, end }, totals: { installs: 0, sessions: 0, uninstalls: 0 }, daily: [], bySource: [], _error: 'AppsFlyer API unreachable' }, null, 2));
    return note('AppsFlyer: all hosts unreachable — wrote empty file');
  }
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const parseLine = (line) => {
    const vals = []; let cur = '', q = false;
    for (const ch of line) {
      if (ch === '"') q = !q;
      else if (ch === ',' && !q) { vals.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    vals.push(cur.trim());
    const o = {}; headers.forEach((h, i) => o[h] = vals[i] || ''); return o;
  };
  const rows = lines.slice(1).map(parseLine);
  const findCol = (pats) => headers.find(h => pats.some(p => h.toLowerCase().includes(p.toLowerCase())));
  const dateCol = findCol(['date']) || 'Date';
  const installsCol = findCol(['installs']) || 'Installs';
  const sessionsCol = findCol(['sessions']) || 'Sessions';
  const uninstallsCol = findCol(['uninstalls']) || 'Uninstalls';
  const sourceCol = findCol(['media source', 'partner']) || 'Media Source';
  const byDate = {}, bySource = {};
  for (const r of rows) {
    const date = r[dateCol] || '';
    const installs = parseInt(r[installsCol]) || 0;
    const sessions = parseInt(r[sessionsCol]) || 0;
    const uninstalls = parseInt(r[uninstallsCol]) || 0;
    const source = r[sourceCol] || 'Unknown';
    if (date) {
      byDate[date] ||= { date, installs: 0, sessions: 0, uninstalls: 0 };
      byDate[date].installs += installs; byDate[date].sessions += sessions; byDate[date].uninstalls += uninstalls;
    }
    bySource[source] ||= { source, installs: 0, sessions: 0 };
    bySource[source].installs += installs; bySource[source].sessions += sessions;
  }
  const daily = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  const sourceList = Object.values(bySource).sort((a, b) => b.installs - a.installs);
  const totals = daily.reduce((a, d) => ({
    installs: a.installs + d.installs, sessions: a.sessions + d.sessions, uninstalls: a.uninstalls + d.uninstalls,
  }), { installs: 0, sessions: 0, uninstalls: 0 });
  writeFileSync(join(dataDir, 'appsflyer-stats.json'),
    JSON.stringify({ updated_at: new Date().toISOString(), period: { start, end }, totals, daily, bySource: sourceList }, null, 2));
  note(`AppsFlyer: ${daily.length} days, ${totals.installs} installs`);
}

async function sendgrid() {
  const KEY = (process.env.SENDGRID_API_KEY || '').trim();
  if (!KEY) return note('SendGrid: skipped (SENDGRID_API_KEY not set)');
  const start = day(30), end = day(0);
  const r = await fetch(`https://api.sendgrid.com/v3/stats?start_date=${start}&end_date=${end}&aggregated_by=day`,
    { headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' } });
  if (!r.ok) throw new Error(`SendGrid HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const raw = await r.json();
  const daily = raw.map(d => ({
    date: d.date,
    requests: d.stats[0]?.metrics?.requests || 0,
    delivered: d.stats[0]?.metrics?.delivered || 0,
    opens: d.stats[0]?.metrics?.opens || 0,
    unique_opens: d.stats[0]?.metrics?.unique_opens || 0,
    clicks: d.stats[0]?.metrics?.clicks || 0,
    unique_clicks: d.stats[0]?.metrics?.unique_clicks || 0,
    bounces: d.stats[0]?.metrics?.bounces || 0,
    spam_reports: d.stats[0]?.metrics?.spam_reports || 0,
    unsubscribes: d.stats[0]?.metrics?.unsubscribes || 0,
  }));
  const totals = daily.reduce((a, d) => ({
    sent: a.sent + d.requests, delivered: a.delivered + d.delivered, opens: a.opens + d.opens,
    unique_opens: a.unique_opens + d.unique_opens, clicks: a.clicks + d.clicks, unique_clicks: a.unique_clicks + d.unique_clicks,
    bounces: a.bounces + d.bounces, spam_reports: a.spam_reports + d.spam_reports, unsubscribes: a.unsubscribes + d.unsubscribes,
  }), { sent: 0, delivered: 0, opens: 0, unique_opens: 0, clicks: 0, unique_clicks: 0, bounces: 0, spam_reports: 0, unsubscribes: 0 });
  totals.open_rate = totals.delivered > 0 ? ((totals.unique_opens / totals.delivered) * 100).toFixed(1) + '%' : '0%';
  writeFileSync(join(dataDir, 'sendgrid-stats.json'),
    JSON.stringify({ updated_at: new Date().toISOString(), period: { start, end }, totals, daily }, null, 2));
  note(`SendGrid: ${daily.length} days, ${totals.delivered} delivered, ${totals.open_rate} open rate`);
}

async function recruiting() {
  const KEY = (process.env.API_KEY || '').trim();
  if (!KEY) return note('Recruiting: skipped (API_KEY not set)');
  const r = await fetch('https://operations.reputablehealth.net/api/recruiting?days=9999',
    { headers: { 'x-api-key': KEY, Accept: 'application/json' } });
  if (!r.ok) throw new Error(`Ops API HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const data = await r.json();
  data._cached_at = new Date().toISOString();
  data._source = 'claude-skill';
  writeFileSync(join(dataDir, 'recruiting-stats.json'), JSON.stringify(data, null, 2));
  note(`Recruiting: cached (${(data.onboarding?.byStudy || []).length} studies)`);
}

const tasks = { meta: metaAds, appsflyer, sendgrid, recruiting };
const only = process.argv.slice(2);
const toRun = only.length ? only.filter(n => tasks[n]) : Object.keys(tasks);
for (const name of toRun) {
  try { await tasks[name](); }
  catch (e) { note(`${name}: ERROR — ${e.message}`); }
}
console.log('\n=== refresh-stats summary ===\n' + summary.join('\n'));
