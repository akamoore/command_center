# Package manifest

What's in the handoff zip, what was deliberately left out, and the action items
that travel with it.

## Included (full repo mirror)

Everything in the repository: all dashboards and analytics pages, the serverless
API + local proxies, the data pipeline scripts, the `data/*.json` feeds, all
GitHub workflows, the sub-apps (`trending-topic-generator`, `script-generator`,
`washout-app`), and all marketing collateral (social-post HTML + images, PDFs,
email templates) — plus this `handoff/` migration kit.

## Excluded / modified (and why)

| Item | Action | Why |
|------|--------|-----|
| `data/master-participants.csv`, `data/all-submissions.csv`, `data/meta-leads.csv`, `data/oura-database.csv`, `data/whoop-database.csv`, `data/fitbit-database.csv`, `data/apple-watch-database.csv` | **Removed** — replaced by `handoff/migration/` (schema + templates + loader) | Real participant names + emails. Migrated into the new DB separately, not shipped in files. |
| Hardcoded ops-API key in `index.html`, `journey.html`, `recruiting-chart.html`, `reporting.html` | **Replaced** with `YOUR_OPS_API_KEY` | Live credential that was shipped client-side; must be rotated. See MIGRATION step 1. |
| `.git/`, `node_modules/`, `.env`, `.env*.local`, `.vercel/` | **Excluded** | History/build artifacts/secrets — not part of a clean handoff. |

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

~206 MB unzipped / ~177 MB zipped (289 files) — **~94% is marketing images** (`*.jpg`/`*.png`, ~183 MB) and PDFs (~11 MB).
The actual dashboard code + data is only a few MB. If you only need the dashboard
application, a code-only subset is a fraction of the size — ask and I'll cut one.

## Start here

`handoff/README.md` (run it) → `handoff/MIGRATION.md` (make it yours).
