# 👋 Start here, Pankaj

This is Katie's **Recruitment Command Center** — a marketing analytics dashboard.
It's plain HTML + a thin data layer, built to drop into your setup with minimal
changes. This file is the only thing you need to read to get going; deeper docs
are linked at the bottom.

## The 10-second mental model

- The dashboards are **static HTML** (no build step). They read two things:
  1. **`data/*.json`** — cached metric feeds (included in this zip).
  2. **a recruiting API** — live data. Today it points at Katie's backend; you'll
     point it at **your database**.
- Participant data currently lives in **CSV files**. You'll load those into your
  database once, using the included script.

---

## Step 1 — See it run right now (2 min, no setup)

```bash
npx serve .          # or: python3 -m http.server 8080
```
Open **http://localhost:8080/index.html**. It renders immediately against the
included sample feeds in `data/` — so you can click around `index.html`,
`reporting.html`, `journey.html`, etc. before wiring anything up.

## Step 2 — Connect your database (the real work)

You'll need: **Node 18+**, your **Postgres database** (Supabase / Neon / RDS / local),
and **Katie's 7 participant CSVs**, which she sends you **separately** (they hold
real names + emails, so they're *not* in this zip).

**2a. Create the tables**
```bash
psql "$DATABASE_URL" -f handoff/migration/schema.sql
```
Supabase: paste `handoff/migration/schema.sql` into the SQL editor instead.
Creates `participants`, `submissions`, `leads`, `wearable_roster`.

**2b. Load Katie's data**
```bash
# Put her CSVs in this (gitignored) folder first:
#   handoff/migration/private-data/
#     master-participants.csv  all-submissions.csv  meta-leads.csv
#     oura-database.csv  whoop-database.csv  fitbit-database.csv  apple-watch-database.csv
npm install pg
export DATABASE_URL="postgresql://USER:PASS@HOST:5432/DBNAME"   # Supabase: Settings → Database → Connection string (URI)
node handoff/migration/import-data.mjs --dry-run   # check parsing — writes nothing
node handoff/migration/import-data.mjs             # load for real (safe to re-run)
```

**2c. Point the dashboard at your data**
The dashboards expect a recruiting API shaped like `docs/ops-api-requests.md`.
Stand up an endpoint that returns that JSON from your DB, then set two env vars:
```bash
API_HOST=<your api host>
API_KEY=<your key>
```
`api/recruiting.js` injects the key server-side. Also change the hardcoded
fallbacks in `api/recruiting.js` (~line 7) and `scripts/refresh-stats.mjs` (~line 196).

**2d. One page reads CSVs directly**
`segmentation.html` fetches `data/*.csv` in the browser (lines ~422–428). Either
export those CSVs from your DB into `data/` (same columns — see
`handoff/migration/templates/`), **or** add an aggregates endpoint and change those
`fetch()` calls (better — keeps PII out of the browser).

**2e. Lock it down**
- Set your own `API_KEY`. (The old key was replaced with a placeholder; Katie is
  rotating the real one — don't reuse it.)
- On Supabase with a public anon key, enable RLS on the 4 tables — the snippet is
  at the bottom of `handoff/migration/schema.sql`.

That's it. Deploy it however you host static sites (`npx vercel --prod` is how
it's deployed today; `vercel.json` already wires `/api/recruiting`).

---

## Where the detail lives

| File | What it covers |
|------|----------------|
| `handoff/README.md` | Fuller run-it / deploy / data-pipeline guide |
| `handoff/MIGRATION.md` | **Every** place tied to Katie's backend, with exact `file:line` refs |
| `handoff/migration/` | `schema.sql`, CSV templates, the `import-data.mjs` loader |
| `handoff/PACKAGE-MANIFEST.md` | Exactly what's in / out of this zip |
| `docs/ops-api-requests.md` | The recruiting-API JSON contract your endpoint should match |

## Heads up (3 things)

1. **The participant CSVs are not in this zip** — Katie sends them separately
   (they contain real names/emails). Everything's ready for them; just drop them
   into `handoff/migration/private-data/`.
2. **The old API key is a placeholder** (`YOUR_OPS_API_KEY`) in 4 files — use your own.
3. **This is the dashboard only.** Katie's LinkedIn monthly-report workflow is a
   separate, manual process and is **not** part of this package.

Questions Katie can't answer fast? `handoff/MIGRATION.md` is the source of truth.
