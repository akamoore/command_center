# Recruitment Command Center — Developer Handoff

This document is the complete technical reference for the **Recruitment Command Center** dashboard so a developer can run, modify, and extend it. The dashboard itself is a single self-contained file: **`index.html`** at the repo root (~5,800 lines, no build step).

---

## 1. What it is

A dark-mode operations dashboard for Reputable Health's participant recruiting. It shows:

- **Command Center tab** — KPIs, ad spend & performance, daily recruiting chart (spend / joined / enrolled), Meta Ads breakdown table, KPI trends & quarterly review, recruiting funnel, study-by-study breakdown table, study type & manual-queue analysis, email/newsletter stats, community stats, ecosystem & gaps (demographics), population representativeness, LTV & financial, data source health, and a quarterly-target editor.
- **Public Studies tab** — analytics for the free in-app public studies/challenges: completion, gender, age, region, and wearable breakdowns.

Everything renders client-side with vanilla JS + **Chart.js v4** (loaded from the jsDelivr CDN — the only external dependency).

## 2. Quick start

```bash
git clone https://github.com/akamoore/command_center.git
cd command_center
# Option A — just open it (uses live API or cached data/ JSON):
open index.html            # or serve statically: python3 -m http.server 8080

# Option B — run the local CORS proxy so API calls don't hit CORS issues:
cd api-proxy
cp ../.env.example .env    # fill in API_KEY
npm install && npm start   # starts on http://localhost:3001
# then open: index.html?proxy=http://localhost:3001
```

No build step, no framework, no bundler. Edit `index.html`, refresh the browser.

## 3. Files that make up the Command Center

| Path | Role |
|------|------|
| `index.html` | The entire dashboard — markup, CSS, and all JS inline |
| `dashboard-guide.html` | Human-readable guide explaining how to read the dashboard |
| `reporting.html` | Companion reporting dashboard (cost tracking, YoY) — same API pattern |
| `recruiting-chart.html` | Standalone embeddable version of the recruiting chart |
| `api/recruiting.js`, `api/public-studies.js`, `api/demographics.js` | Vercel serverless proxy functions (keep the API key server-side) |
| `vercel.json` | Rewrites for the three `/api/*` routes |
| `api-proxy/server.js` | Express CORS proxy for local dev (port 3001) |
| `data/*.json` | Cached stats committed by cron jobs — the offline fallback |
| `scripts/refresh-stats.mjs` | One script that refreshes all four `data/*.json` files locally |
| `.github/workflows/fetch-*.yml` | Daily cron jobs that refresh `data/*.json` |
| `.github/workflows/deploy.yml` | GitHub Pages deploy on push to `main` |
| `.github/workflows/deploy-vercel.yml` | Vercel deploy (serves the `/api/*` functions) |
| `.env.example` | Template for local secrets |

## 4. Architecture & data flow

```
                    ┌─────────────────────────────────────────────┐
                    │                index.html                   │
                    └─────────────────────────────────────────────┘
                                        │
              1️⃣ try same-origin Vercel proxy   /api/recruiting, /api/public-studies, /api/demographics
                                        │  (no CORS, key stays server-side)
                                        ▼ on failure
              2️⃣ try direct upstream API        https://operations.reputablehealth.net/api/*
                                        │  (x-api-key header, or ?proxy=http://localhost:3001)
                                        ▼ on failure
              3️⃣ fall back to cached JSON       ./data/recruiting-stats.json etc.
                                                (flagged with `_fromCache: true`)
```

The fetch logic lives in the `api` object inside `index.html` (search for `fetchRecruiting`, `fetchPublicStudies`, `fetchDemographics`, around line 1290). Each method tries the three tiers in order and logs a `console.warn` on each fallback. The "Data Source Health" section at the bottom of the dashboard reports which tier is live.

### Config constants (top of the script, ~line 1090)

```js
const IS_VERCEL   = window.location.hostname.includes('vercel.app');
const PROXY_BASE  = new URLSearchParams(location.search).get('proxy') || '';
const DIRECT_API  = 'https://operations.reputablehealth.net/api/recruiting';
const API_BASE    = IS_VERCEL ? '/api/recruiting' : (PROXY_BASE ? `${PROXY_BASE}/api/recruiting` : DIRECT_API);
const API_KEY     = '<operations API key — currently hardcoded here>';
```

> ⚠️ **Security note:** the operations API key is hardcoded in `index.html` (line ~1097), so it ships to every browser that loads the page. The Vercel proxy path exists specifically to avoid this (it reads `API_KEY` from server env). Recommended follow-up: remove the hardcoded key, make the Vercel/local proxy the only live path, and rotate the key.

## 5. Data sources

| Source | Feeds | Live path | Cached fallback |
|--------|-------|-----------|-----------------|
| Operations API | Funnel, studies, spend, onboarding, ManyChat subscriber counts | `/api/recruiting?days=N&scope=all` | `data/recruiting-stats.json` |
| Operations API | Public studies analytics | `/api/public-studies` | — |
| Operations API | Ecosystem demographics | `/api/demographics` | — |
| Meta Ads (Graph API) | Daily spend, clicks, impressions, CPC + per-ad breakdown | via cron only | `data/meta-ads-stats.json` |
| AppsFlyer | Daily app installs by source | via cron only | `data/appsflyer-stats.json` |
| SendGrid | Newsletter sends / opens / clicks / bounces | via cron only | `data/sendgrid-stats.json` |

### Cached JSON shapes

```jsonc
// data/meta-ads-stats.json
{ "updated_at": "...", "period": "...", "daily": [{ "date", "spend", "clicks", "impressions", "cpc" }], "ads": [] }

// data/appsflyer-stats.json
{ "updated_at": "...", "period": "...", "daily": [{ "date", "installs" }], "bySource": [] }

// data/sendgrid-stats.json
{ "updated_at": "...", "daily": [{ "date", "requests", "delivered", "opens", "clicks", "bounces" }], "totals": {} }
```

The `data/` directory also holds CSV exports (wearable databases, participant/lead exports) used by other pages — treat these as sensitive; they are not needed by `index.html`.

## 6. Inside index.html

### 6.1 Study data — the `STUDIES` array (~line 1143)

The canonical per-study record. Currently ~48 entries covering sponsored studies (RCT / RWE / VEP) and free in-app `PUBLIC` studies. Schema:

| Field | Type | Meaning |
|-------|------|---------|
| `id` | number | Stable ID (matches ops API where possible; some are local-only) |
| `name` | string | Display name — also used to match API records by fuzzy name match |
| `type` | `'RCT' \| 'RWE' \| 'VEP' \| 'PUBLIC'` | Study type; drives badges, CPO-by-type, filtering |
| `spend` | number | Total ad spend ($) |
| `leads` / `joined` / `onboarded` | number\|null | Funnel counts (null = unknown) |
| `target` | number | Recruitment target |
| `wearable` | string\|null | Device(s) — e.g. `'Oura'`, `'WHOOP'`, `'Oura / Fitbit / WHOOP'` |
| `days` | number\|null | Days to recruit |
| `launchDate` / `endDate` | string\|null | Human-readable dates |
| `launchYear` | number\|null | Used for year filtering |
| `crossYear` | bool | Launched one year, completed the next |
| `manualQueue` | bool | Has a manual onboarding step (also derived from `complexity_factors`) |
| `status` | `'complete' \| 'active' \| 'recruiting' \| 'coming'` | Lifecycle state |
| `outlier` / `outlier_reason` | bool / string | Excluded from KPI averages, with the reason shown in tooltips |
| `notes` | string | Free text shown in the table |
| `size_category` | `'pilot' \| 'medium' \| 'large'` | Used for days-to-recruit complexity split |
| `complexity_factors` | string[] | e.g. `'non_oura_wearable'`, `'pre_study_lab_work'`, `'screening_call'`, `'external_survey'` |
| `recruitment_source` | `'paid' \| 'organic_community' \| 'partner_recruited'` | Drives paid-vs-organic CPO splits |
| `inStudy`, `complianceN`, `complianceD` | number | PUBLIC studies only — compliance numerator/denominator |

Supporting config near the top of the script:

- `STUDY_OVERRIDES` — name-keyed manual overrides (e.g. force `manualStep`, category).
- `QUARTERLY_TARGETS` / `TARGET_HISTORY` / `ANNUAL_TARGETS` — KPI targets per quarter/year; the "Set Quarterly Targets" UI section reads and displays these.
- `MANUAL_STEP_FACTORS` — the complexity factors that mark a study as having a manual queue.

### 6.2 API enrichment

`getEnrichedStudies()` (~line 1600) merges the local `STUDIES` array with the live API's per-study data: it normalizes wearable names, parses recruitment-day counts, maps API statuses (`live → active`, `coming_soon → coming`) and types (`Clinical → RCT`, `Public/Self-Serve → PUBLIC`), matches API records to local records by name, and appends API-only studies not in the local list. The merged result is cached in `enrichedStudiesCache` and read everywhere via `getStudies()`. Test/internal studies are filtered by `isTestInternalStudy()` / `isExcludedStudyName()`.

### 6.3 View state & filtering

Two globals drive nearly every render:

```js
let selectedDays = 30;      // 30 / 60 / 90 / Infinity ("all")
let selectedYear = 'all';   // 'all' | 2025 | 2026
```

Windowing helpers: `getStudiesInWindow(days)`, `getWindowedSpend(study, days)`, `getWindowedMetric(study, metric, days)`. Every `render*()` function re-filters by both.

### 6.4 KPI engine

`computeAllKPIs(studies)` (~line 1863) composes:

- `calcBlendedCPO` / `calcPaidCPO` / `calcCPOByType` — cost per onboarded participant (blended, paid-only, by RCT/RWE/VEP). Outlier studies are excluded.
- `calcAvgDaysToRecruit` — optionally split by complexity (`size_category` + `complexity_factors`).
- `calcParticipantsOnboarded`, `calcCompletionRate`, `calcProjectedCost`.
- Quarter helpers: `getQuarterKey`, `getQuarterDates`, `getStudiesForQuarter`, `getTargetsForQuarter`.

`renderKPITracking()` renders actual-vs-target progress bars against `QUARTERLY_TARGETS`.

### 6.5 Charts (Chart.js v4)

| Canvas ID | Chart | Data source |
|-----------|-------|-------------|
| `#chart-recruiting` | Line, dual Y-axes (spend $ left, participants right): daily spend, joined, enrolled | `getDailyRecruitingData()` — API daily merged with study-level fallbacks |
| `#chart-spend` | Bar + line combo: ad spend & clicks | `data/meta-ads-stats.json` or API `metaAds.daily`; falls back to per-study bars |
| `#chart-installs` | Bar: daily app installs | `data/appsflyer-stats.json` or API `appsflyer.daily`; falls back to per-study joined/onboarded |
| `#chart-email` | Line: email opens & clicks | `data/sendgrid-stats.json` or API `newsletter.daily` |
| `#chart-cpo-trend` | CPO over time (quarterly review) | computed from studies |
| `#chart-participants-trend` | Cumulative participants onboarded | computed from studies |
| `#ps-chart-completion`, `#ps-chart-gender`, `#ps-chart-age`, `#ps-chart-geo`, `#ps-chart-wearables` | Public Studies tab breakdowns | `/api/public-studies` + `/api/demographics` |

Notes:
- Global tooltip/interaction styling is applied once (~line 2429) so all charts match.
- `#chart-recruiting` uses an **external HTML tooltip** (`externalTooltipHandler`, ~line 2651) so the tooltip isn't clipped by the canvas.
- `destroyCharts()` tears down all Chart instances before re-render (called on every filter change).
- All charts respect `selectedDays` / `selectedYear`.

### 6.6 Tables

- **Study-by-Study Breakdown** — `renderStudiesTable()` with sortable `COLUMNS` (~line 2868), status/type badges (`statusBadge`, `typeBadge`), CPO per row (`getCPO`), outlier flags, and filter chips (type, status, year).
- **Meta Ads Breakdown** — `ADS_COLUMNS` (~line 3132) with campaign/ad name normalization maps (`CAMPAIGN_NAME_MAP`, `AD_NAME_MAP`).

### 6.7 Styling

All CSS is inline in `<head>` and follows the Reputable brand system (see `CLAUDE.md`): `#0a0a0a` background with grid overlay, lime `#C8E64A` accents, cards at `rgba(255,255,255,0.03)` with `rgba(255,255,255,0.08)` borders, pill badges, radius tokens 12/16/24/100px. CSS variables are defined on `:root` at the top of the file.

## 7. Server-side pieces

### 7.1 Vercel serverless functions (`api/`)

Three small Node functions (`recruiting.js`, `public-studies.js`, `demographics.js`) that forward requests to `operations.reputablehealth.net` with the `x-api-key` header read from the **`API_KEY` env var** (never sent to the browser). They defensively parse query params (`req.query` isn't guaranteed across runtimes) and trim env values (a stray newline in the key produces `FUNCTION_INVOCATION_FAILED`). `vercel.json` declares the three rewrites.

Vercel env vars needed: `API_KEY`, optional `API_HOST`.

### 7.2 Local Express proxy (`api-proxy/`)

For local dev. `server.js` serves the same `/api/*` routes on port 3001 with a CORS allowlist (`ALLOWED_ORIGINS` env, defaults include localhost:3000/8080 and 127.0.0.1:5500). Configure via `.env` (`API_KEY`, `API_HOST`, `SENDGRID_API_KEY`). Point the dashboard at it with `?proxy=http://localhost:3001`.

## 8. Data refresh

Four GitHub Actions crons refresh the cached JSON daily and commit to `data/`:

| Workflow | Output |
|----------|--------|
| `fetch-meta-ads-stats.yml` | `data/meta-ads-stats.json` |
| `fetch-appsflyer-stats.yml` | `data/appsflyer-stats.json` |
| `fetch-sendgrid-stats.yml` | `data/sendgrid-stats.json` |
| `fetch-recruiting-stats.yml` | `data/recruiting-stats.json` |

`scripts/refresh-stats.mjs` is a faithful local port of all four — run `node scripts/refresh-stats.mjs` with the same env vars (`META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `APPSFLYER_API_TOKEN`, `APPSFLYER_APP_ID`, `SENDGRID_API_KEY`, `API_KEY`); sources with missing tokens are skipped. There is also an older `fetch-chart-data.mjs` at the root (Meta + AppsFlyer only).

## 9. Environment variables / secrets

| Variable | Where | Purpose |
|----------|-------|---------|
| `API_KEY` | GitHub secret, Vercel env, `api-proxy/.env` | Operations API auth |
| `SENDGRID_API_KEY` | GitHub secret / `.env` | Email stats |
| `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` | GitHub secret / `.env` | Meta Ads Graph API |
| `APPSFLYER_API_TOKEN`, `APPSFLYER_APP_ID` | GitHub secret / `.env` | AppsFlyer Pull API |
| `SLACK_WEBHOOK_URL` | GitHub secret | Deploy notifications |
| `ANTHROPIC_API_KEY`, `VITE_ANTHROPIC_API_KEY` | GitHub secret | Sub-apps only (topic/script generators), not the dashboard |

`.env` files are gitignored; `.env.example` is the template.

## 10. Deployment

- **GitHub Pages** — `deploy.yml` runs on push to `main`: builds the Vite sub-apps, copies all HTML/images/`data/` into `_site/`, deploys via `actions/deploy-pages`, notifies Slack. The Pages deployment is static only — no `/api/*` there, so it uses direct API → cached-JSON fallback.
- **Vercel** — `deploy-vercel.yml` deploys the same site *plus* the `api/` functions, which is the preferred host since the API key stays server-side (`IS_VERCEL` detection makes the dashboard use same-origin `/api/*` automatically).
- **PR previews** — `pr-preview.yml`.

## 11. Known caveats & gotchas

1. **Hardcoded API key in `index.html`** — see the security note in §4. Rotate + move server-side when convenient.
2. **`STUDIES` is manually maintained** — completed-study data is snapshotted by hand; the API enriches live studies. When a study finishes, its final numbers should be baked into the array.
3. **Outliers** — studies flagged `outlier: true` are excluded from KPI averages (e.g. Melatonin/Somato lost ~150 participants to a baseline bug). Don't "fix" the averages by removing the flag.
4. **PUBLIC studies** are free in-app challenges: `spend: 0`, no leads, and they carry `inStudy`/`compliance*` fields the sponsored studies don't have.
5. **Name-based matching** — API records join to local `STUDIES` by fuzzy name match in `getEnrichedStudies()`. Renaming a study in either system can silently break the join; `STUDY_OVERRIDES` and the type/status maps handle known mismatches (e.g. id 553 is curated as RWE even though the ops API reports RCT).
6. **Chart fallback modes** — `#chart-spend` and `#chart-installs` switch from daily time series to per-study bars when the daily data files are empty; their `<h3>` titles update to match.
7. **Some IDs are non-sequential** (e.g. 553) and some are local-only placeholders for upcoming studies — don't renumber.
8. **`data/*.csv` files may contain participant-level data** — keep them out of any public sharing.

## 12. Where to look first (orientation for a new developer)

1. Read `dashboard-guide.html` in a browser — explains what every section means.
2. In `index.html`, search for these anchors in order: `CONFIG & API` → `STUDIES = [` → `fetchRecruiting` → `getEnrichedStudies` → `computeAllKPIs` → `renderCharts` → `renderStudiesTable`.
3. The render cycle: the bootstrap block (~line 5084) fetches all sources with `Promise.allSettled` → caches results → calls `renderAll()` (which runs every `render*()` function) → filter buttons mutate `selectedDays`/`selectedYear` and call `renderAll()` again. The Public Studies tab lazy-renders via `psRenderAll()` on first switch.
