# Package manifest

What's in the handoff zip, what was deliberately left out, and the action items
that travel with it.

## Included — Command Center dashboard only

The Recruitment Command Center and its analytics pages, plus everything needed to
run them: the serverless API (`api/`) + local CORS proxy (`api-proxy/`), the data
pipeline (`scripts/refresh-stats.mjs`, `fetch-chart-data.mjs`), the `data/*.json`
feeds, the dashboard GitHub workflows, the brand/ops docs (`CLAUDE.md`,
`docs/ops-api-requests.md`, `.claude/skills/command-center/`), and this `handoff/`
migration kit. See `README.md` for the page-by-page list.

## Excluded / modified (and why)

| Item | Action | Why |
|------|--------|-----|
| `data/master-participants.csv`, `data/all-submissions.csv`, `data/meta-leads.csv`, `data/oura-database.csv`, `data/whoop-database.csv`, `data/fitbit-database.csv`, `data/apple-watch-database.csv` | **Removed** — replaced by `handoff/migration/` (schema + templates + loader) | Real participant names + emails. Migrated into the new DB separately, not shipped in files. |
| Hardcoded ops-API key in `index.html`, `journey.html`, `recruiting-chart.html`, `reporting.html` | **Replaced** with `YOUR_OPS_API_KEY` | Live credential that was shipped client-side; must be rotated. See MIGRATION step 1. |
| `.git/`, `node_modules/`, `.env`, `.env*.local`, `.vercel/` | **Excluded** | History/build artifacts/secrets — not part of a clean handoff. |
| Marketing collateral: ~80 social-post/story/carousel HTML + their `*.jpg`/`*.png`, the 2 PDFs, `images/`, report/case-study/poll pages, `weekly-email-template*.html` | **Excluded** | Brand content, not the dashboard. (This is ~94% of the original repo size.) |
| Sub-apps: `trending-topic-generator/`, `script-generator/`, `washout-app/`, and `email-proxy/` | **Excluded** | Standalone tools, not part of the Command Center dashboard. |
| Collateral generators: `generate-pdf.mjs`, `generate-retreat-report-pdf.mjs`, `screenshot*.mjs`, and `.github/workflows/generate-topics-cron.yml` | **Excluded** | Only used to produce the excluded collateral / sub-app content. |
| Internal decks: `playbook.html`, `speaker-notes.html`, `team-briefing.html` | **Excluded** | Not analytics dashboards. Easy to add back if you want them. |

The `data/*.json` feeds (meta-ads, appsflyer, sendgrid, recruiting) **are**
included — they're aggregate/cached and regenerable via `scripts/refresh-stats.mjs`,
and contain no individual PII.

## Action items that ship with this package

1. **Rotate** the ops-API key (compromised — was client-side + in history).
2. Apply `handoff/migration/schema.sql`; load the separately-sent CSVs via `handoff/migration/import-data.mjs`.
3. Set env vars from `handoff/.env.example`; repoint `API_HOST`/`API_KEY` and external accounts (Meta/AppsFlyer/SendGrid/Anthropic).
4. Repoint `segmentation.html`'s CSV reads (MIGRATION step 4).
5. Locate + wire the manual feed(s) **last** (MIGRATION → "Manual data step").

## Size

~1.4 MB unzipped (52 files) — just the dashboard app, data feeds, and docs. The
repo's marketing images, PDFs, and sub-apps (~205 MB) are excluded from this
Command-Center-only package.

## Start here

`handoff/README.md` (run it) → `handoff/MIGRATION.md` (make it yours).
