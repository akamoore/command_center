# Command Center — handoff package

This is the **Reputable Health Recruitment Command Center**: a set of static
HTML dashboards plus a thin serverless data layer. It's designed to drop into an
existing dashboard setup with minimal changes — the front-end is plain HTML/JS
(Chart.js via CDN), so there's no build step for the dashboards themselves.

> **Read [`MIGRATION.md`](./MIGRATION.md) first if you're repointing this to your
> own database/account.** It lists every place wired to the original owner's
> backend, with exact file/line references. This README is the "get it running"
> guide; MIGRATION is the "make it yours" guide.

---

## What's in here

| Area | Files | Notes |
|------|-------|-------|
| **Main dashboards** | `index.html` (Recruitment Command Center), `reporting.html`, `dashboard-guide.html` | Live KPIs, funnel, study table, spend |
| **Analytics pages** | `segmentation.html`, `journey.html`, `recruiting-chart.html`, `nurture.html`, `lifecycle.html`, `attribution.html`, `ltv-tracker.html`, `sequences.html`, `participant-*.html`, `lifecycle-engagement.html` | Mostly self-contained; a few read from `data/` (see MIGRATION §4) |
| **Serverless API** | `api/recruiting.js` + `vercel.json` | Proxy that adds the API key server-side and calls the operations API |
| **Local proxies** | `api-proxy/`, `email-proxy/` | Express servers for local dev / SendGrid sending |
| **Data pipeline** | `scripts/refresh-stats.mjs`, `fetch-chart-data.mjs` | Regenerate the `data/*.json` feeds from Meta / AppsFlyer / SendGrid / ops API |
| **Data feeds** | `data/*.json` | Cached, regenerable. (The `data/*.csv` participant tables are **migrated separately** — see MIGRATION.) |
| **Automation** | `.github/workflows/` | Deploy + 4 daily fetch crons |
| **Sub-apps** | `trending-topic-generator/`, `script-generator/`, `washout-app/` | Independent tools (Vite/React + static); own deps + Anthropic keys |
| **Brand + content** | social-post HTML + images, PDFs, `weekly-email-template*.html`, `CLAUDE.md` | Marketing collateral and brand guidelines |
| **Migration kit** | `handoff/` (this folder) | Schema, CSV templates, import script, env reference |

---

## Prerequisites

- **Node 18+** (for the proxies, fetch scripts, and the import script)
- **A Postgres database** for the participant data (Supabase, Neon, RDS, or local) — see MIGRATION
- **Vercel** account if you deploy the way it's deployed today (any static host works)

## Quick start (local)

The dashboards are static. The fastest way to see them:

```bash
# 1. clone / unzip, then from the repo root:
cp handoff/.env.example .env          # fill in your values (see MIGRATION.md)

# 2. serve the folder (any static server works)
npx serve .            # or: python3 -m http.server 8080

# 3. open http://localhost:8080/index.html
```

Out of the box the dashboards call a `/api/recruiting` endpoint. For local dev,
run the included proxy and point the page at it:

```bash
cd api-proxy && npm install && cp .env.example .env   # set API_KEY + API_HOST
npm start                                             # serves http://localhost:3001
# then open: http://localhost:8080/index.html?proxy=http://localhost:3001
```

## Deploy (as configured today)

```bash
npm install          # root (puppeteer-core, used only for PDF/screenshot scripts)
npx vercel --prod    # deploys static files + api/recruiting.js serverless function
```

Set the env vars (`API_KEY`, `API_HOST`, etc.) in your host's dashboard.
`vercel.json` rewrites `/api/recruiting` to the serverless function in `api/`.

## The data pipeline (how the numbers stay fresh)

`data/*.json` are cached snapshots. Regenerate them with:

```bash
node scripts/refresh-stats.mjs                 # all sources
node scripts/refresh-stats.mjs appsflyer sendgrid recruiting
```

Each source is skipped if its token isn't set. The same logic runs daily via
`.github/workflows/fetch-*.yml`. Commit the updated `data/*.json` to refresh the
deployed dashboards. (Meta Ads can also be pulled via a connector — see
`.claude/skills/command-center/SKILL.md`.)

## Known manual step (handle last)

One feed is maintained by hand and is intentionally **not** automated in this
handoff — see **MIGRATION.md → "Manual data step"**. Leave it as-is for now.
