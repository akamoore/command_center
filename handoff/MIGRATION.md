# Migration guide — repointing Command Center to a new database & account

Everything in this codebase that's wired to the **original owner's** backend,
accounts, or local data — and exactly what to change. File/line references are
from the package as shipped.

> **Do step 1 before anything else** — it's a live credential.

---

## Step 1 — Rotate the leaked operations-API key 🔴

The operations-API key was **hardcoded in the client-side HTML** (shipped to every
browser) and committed to git history. In this package it has been replaced with
the placeholder `YOUR_OPS_API_KEY`, but the real key must be **rotated** on the
operations backend — treat it as compromised.

Occurrences (now placeholders — wire each to *your* key, ideally via the proxy so
the key never ships to the browser):

| File | Line | Was |
|------|------|-----|
| `index.html` | ~1002 | `const API_KEY = '…'` |
| `journey.html` | ~107 | `const API_KEY = '…'` |
| `recruiting-chart.html` | ~126 | `const API_KEY = '…'` |
| `reporting.html` | ~2023 | `var API_KEY = 'colleague:…'` |

**Recommended:** delete the inline keys entirely and always call through the
`/api/recruiting` proxy (`api/recruiting.js`), which injects the key from the
`API_KEY` env var server-side. Each page already supports a proxy via
`?proxy=<url>` / `PROXY_BASE`.

---

## Step 2 — Stand up your database and load the participant data

The participant/lead/wearable rosters currently live as flat CSVs in `data/`.
Those CSVs are **not included** in this package (they hold real names + emails);
the owner sends them to you separately. To migrate:

```bash
# 1. create the tables in your DB
psql "$DATABASE_URL" -f handoff/migration/schema.sql      # or paste into Supabase SQL editor

# 2. drop the owner's real CSVs into handoff/migration/private-data/ (gitignored)
# 3. load them
cd <repo root>
npm install pg
export DATABASE_URL="postgres://…"      # Supabase: Settings -> Database -> URI
node handoff/migration/import-data.mjs --dry-run   # verify parsing
node handoff/migration/import-data.mjs             # write to DB
```

`handoff/migration/`:
- `schema.sql` — tables `participants`, `submissions`, `leads`, `wearable_roster` (+ a privacy/RLS note)
- `templates/` — header-only CSVs showing the exact columns each source file must have
- `import-data.mjs` — idempotent loader (UPSERT), Supabase-compatible (it's just Postgres)

CSV → table map:

| Source CSV (sent separately) | Table | Rows (approx) |
|------------------------------|-------|---------------|
| `master-participants.csv` | `participants` | 4,800 |
| `all-submissions.csv` | `submissions` | 2,900 |
| `meta-leads.csv` | `leads` | 290 |
| `oura/whoop/fitbit/apple-watch-database.csv` | `wearable_roster` (one row per person+device) | 1,900 |

---

## Step 3 — Repoint the operations API

Today every live call goes to `https://operations.reputablehealth.net/api/recruiting`
(header `x-api-key`). Repoint it to your DB-backed endpoint.

| Where | What to change |
|-------|----------------|
| `api/recruiting.js` | Reads `API_HOST` + `API_KEY` from env — just set them. Default host is hardcoded as a fallback (line ~7); change the fallback or always set `API_HOST`. |
| `api-proxy/server.js` | Same `API_HOST`/`API_KEY` env vars (lines ~9–10). |
| `scripts/refresh-stats.mjs` | `recruiting()` has the ops URL hardcoded (line ~196) — change to your host. |
| `index.html`, `journey.html`, `recruiting-chart.html`, `reporting.html` | `DIRECT_API` constant + the inline `API_KEY` (step 1). Prefer the proxy. |

Your endpoint should return the JSON shape the dashboard expects — documented in
`docs/ops-api-requests.md` (study list, `onboarding.byStudy[]`, `funnel`, `metaAds`,
etc.). That file is the de-facto API contract; build your endpoint to match it.

---

## Step 4 — Repoint the CSV-backed page (`segmentation.html`)

`segmentation.html` is the **only** dashboard that reads the participant CSVs
directly, client-side (lines ~422–428):

```js
fetch('data/master-participants.csv'), fetch('data/meta-leads.csv'),
fetch('data/oura-database.csv'), fetch('data/whoop-database.csv'),
fetch('data/apple-watch-database.csv'), fetch('data/fitbit-database.csv'),
fetch('data/all-submissions.csv')
```

Since those CSVs aren't shipped, pick one:
- **(a)** Export the same CSVs from your DB into `data/` (keep the same columns — see `handoff/migration/templates/`). Lowest-effort; `segmentation.html` works unchanged.
- **(b)** Add an endpoint that returns the aggregates and change these `fetch()` calls to hit it. **Preferred** — keeps raw PII out of the browser (see the privacy note in `schema.sql`).

The JSON feeds (`recruiting-stats.json`, `meta-ads-stats.json`, `appsflyer-stats.json`,
`sendgrid-stats.json`) read by `index.html` / `journey.html` / `recruiting-chart.html`
are regenerable via `scripts/refresh-stats.mjs` — no DB change needed, just your tokens (step 5).

---

## Step 5 — External accounts & tokens

| Thing | Current value | Where | Change to |
|-------|---------------|-------|-----------|
| Meta Ads account | `act_2045754205850315` | `fetch-chart-data.mjs` ~23, `scripts/refresh-stats.mjs` (env), workflows | Your ad account + `META_ACCESS_TOKEN` |
| AppsFlyer app | `id6451213618` | `fetch-chart-data.mjs` ~25, `scripts/refresh-stats.mjs` (env) | Your app id + `APPSFLYER_API_TOKEN` |
| SendGrid | env `SENDGRID_API_KEY`; sender `community@reputable.health` | `email-proxy/.env.example`, workflows | Your key + verified sender |
| Anthropic | env `ANTHROPIC_API_KEY` / `VITE_ANTHROPIC_API_KEY` | sub-apps | Your key |

All tokens belong in `.env` / your host's secrets — see `handoff/.env.example`.

## Step 6 — Hosting & automation

| Original | Repoint to |
|----------|-----------|
| Vercel project `command_center` → `commandcenter-eight.vercel.app` (team `akamoore`) | Your Vercel project / static host |
| GitHub `akamoore/command_center` (Actions **disabled** — account flagged) | Your repo; re-enable the `.github/workflows/` crons |
| Slack `#command-center` (deploy + daily summary) | Your channel / webhook (`SLACK_WEBHOOK_URL`) |
| `.claude/skills/command-center/SKILL.md` | An operations runbook full of the owner's URLs/keys — update or drop it |

## Hand-maintained data in `index.html` (not from the API)

`index.html` carries a hardcoded **`STUDIES` array** (~24 studies) and two
**`CAMPAIGN_TO_STUDY` / `CAMPAIGN_NAME_MAP`** lookups (~lines 1395 & 2809) used for
ad-spend attribution. These are edited by hand today. If your new API returns full
study + campaign data (`docs/ops-api-requests.md` §1) you can shrink or retire
them; otherwise port the arrays and keep maintaining them.

---

## Manual data step (handle last — not solved in this handoff)

You flagged a manual step where new **LinkedIn followers** are copied into a
markdown file the dashboard reads. **Heads-up:** that file does **not exist
anywhere in this codebase** (not in any branch or git history) — the only
LinkedIn references are content-prompt text in `playbook.html`. So that file is
either local-only on the owner's machine or lives in the *target* dashboard
you're merging into. Nothing to migrate here until we locate it.

For completeness, the codebase **does** have one documented manual feed: the
**Public Studies tab** is powered by a manual participant export ("Manpreet's
May 15 2026 export"), described in `docs/ops-api-requests.md` §6. Same pattern —
a hand-maintained snapshot that goes stale. Leave both as-is for now; we'll wire
up the manual feed(s) as the final step once the rest is on your database.

---

## Quick checklist

- [ ] Rotate the ops-API key; remove inline keys / route through the proxy
- [ ] `schema.sql` applied to your DB; CSVs loaded via `import-data.mjs`
- [ ] `API_HOST` / `API_KEY` set; `scripts/refresh-stats.mjs` recruiting URL updated
- [ ] `segmentation.html` data source repointed (export CSVs or new endpoint)
- [ ] Meta / AppsFlyer / SendGrid / Anthropic tokens swapped to your accounts
- [ ] Deployed to your host; `.github/workflows/` crons re-enabled
- [ ] Manual feed(s) located and wired up — **last**
