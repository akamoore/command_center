---
name: command-center
description: >-
  Operate the Reputable Health Recruitment Command Center dashboard
  (repo akamoore/command_center, live at commandcenter-eight.vercel.app).
  Use this to refresh its data feeds, run a health check, deploy it, or look up
  the campaign→study and ops-API taxonomy mappings. Built to be run on a
  SCHEDULE to stand in for the GitHub Actions cron jobs, which are disabled
  while the GitHub account (akamoore) is flagged. Posts a summary to Slack.
---

# Command Center operations runbook

This skill operates the **Recruitment Command Center** dashboard. It encodes the
data pipeline, health checks, deploy process, and data mappings so any session —
including a scheduled one — can run them consistently.

## Why this skill exists

GitHub Actions is **disabled** on the `akamoore` account (the account is flagged
and ineligible for transactions — only GitHub Support can lift it). That means
the repo's daily cron workflows (`fetch-meta-ads-stats.yml`,
`fetch-recruiting-stats.yml`, `fetch-appsflyer-stats.yml`,
`fetch-sendgrid-stats.yml`) **do not run**, so the dashboard's data files go
stale and nothing auto-deploys. A scheduled Claude session running this skill is
independent of GitHub Actions, so it can do that work instead.

## Key facts (don't re-derive these)

| Thing | Value |
|-------|-------|
| Repo | `akamoore/command_center` (default branch `main`) |
| Live site | Vercel project **`command_center`** → **`commandcenter-eight.vercel.app`** |
| Do NOT use | `command-center-e6qf.vercel.app` — a stale duplicate project |
| Deploy | `npx vercel --prod` from the repo root (folder is linked to the project; Vercel team scope `akamoore`) |
| Ops API | `https://operations.reputablehealth.net/api/recruiting?days=<N>&scope=all`, header `x-api-key: <API_KEY>` |
| API_KEY source | Vercel env var `API_KEY` / GitHub secret `API_KEY` / hardcoded in `index.html` (~line 1011). **Never** allow a trailing space/newline — it breaks the proxy header. |
| Meta Ads | account `act_2045754205850315` (numeric `2045754205850315`); use the Meta Ads connector (`ads_get_ad_entities`) |
| Data files | `data/meta-ads-stats.json`, `data/appsflyer-stats.json`, `data/recruiting-stats.json`, `data/sendgrid-stats.json` |
| Slack | post summaries to **#command-center** (confirm/adjust channel before first run) |

**Network egress:** a scheduled environment must allowlist
`operations.reputablehealth.net` (and reach `commandcenter-eight.vercel.app`) for
the health check / recruiting refresh. The Meta/Slack/Supabase work goes through
connectors and doesn't need egress.

---

## Modes

Run the mode the user asks for. With no argument (e.g. a scheduled run), do the
**Daily run**: `Refresh data` → `Health check` → deploy if data changed → post a
Slack summary.

### 1. Refresh data (replaces the dead cron jobs)

This reproduces the four GitHub Actions cron workflows exactly. `scripts/refresh-stats.mjs`
is a faithful port of `fetch-{meta-ads,appsflyer,sendgrid,recruiting}-stats.yml`
and writes all four `data/*.json` files in the same format. Just run it:

```
node scripts/refresh-stats.mjs                 # all sources
node scripts/refresh-stats.mjs meta recruiting # or a subset
```

It needs these env vars (the **same values as the GitHub Actions secrets** — set
them in the scheduled environment's variables, or a local `.env`):

| File written | Env vars | Host (must be in egress allowlist) |
|---|---|---|
| `data/meta-ads-stats.json` | `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` | graph.facebook.com |
| `data/appsflyer-stats.json` | `APPSFLYER_API_TOKEN`, `APPSFLYER_APP_ID` | *.appsflyer.com |
| `data/sendgrid-stats.json` | `SENDGRID_API_KEY` | api.sendgrid.com |
| `data/recruiting-stats.json` | `API_KEY` | operations.reputablehealth.net |

A source whose tokens are missing is skipped (not an error). After it runs,
commit the changed `data/` files (`git config user.email noreply@anthropic.com &&
git config user.name Claude` first so the commit is verified) and deploy (§3).

> If `refresh-stats` surfaces a new paid Meta campaign, also wire its name into
> the mappings (§4) so its spend attributes to the right study.

### 2. Health check (alert on problems)

Check each; collect findings for the Slack report:

- **Live vs cached API:** `curl -s "https://commandcenter-eight.vercel.app/api/recruiting?days=30&scope=all"`.
  Expect JSON. If it returns `TypeError` / `FUNCTION_INVOCATION_FAILED` /
  `API_KEY not configured` → the Vercel `API_KEY` env var is missing or has a
  stray space (re-add it trimmed: `printf '<key>' | npx vercel env add API_KEY production`, then redeploy). A "CACHED API" badge on the dashboard = this is broken.
- **Stale data:** for each `data/*.json`, compare `updated_at` to now. Older than
  ~2 days ⇒ flag (the crons aren't running; run mode 1).
- **Deploy drift:** is the live deployment built from `main` HEAD? Compare
  `git rev-parse origin/main` to the latest Vercel production deployment
  (`npx vercel ls` / inspect). If behind ⇒ deploy (§3).
- **Unmapped campaigns:** list live Meta campaigns with spend (connector) and
  confirm each lowercase name is a key in `CAMPAIGN_TO_STUDY` (§4). Any missing ⇒
  flag (this is exactly how "Rehydration Recovery" was being dropped).

### 3. Deploy

From the repo root (linked to the `command_center` project):
```
npx vercel --prod
```
It aliases to `commandcenter-eight.vercel.app`. After deploy, a **hard refresh**
(Cmd/Ctrl+Shift+R) is needed to bust the cached `data/*.json`.

Gotchas:
- Deploy to the **`command_center`** project, never `command-center-e6qf`.
- If `/api/recruiting` 500s after deploy, it's almost always the `API_KEY` env
  var (missing or whitespace). The proxy now trims it, but verify.

### 4. Mapping & taxonomy reference

**Campaign → study** (for ad-spend attribution). Defined twice in `index.html`:
`CAMPAIGN_TO_STUDY` (~line 1395, used by `getEnrichedStudies`) and
`CAMPAIGN_NAME_MAP` (~line 2809, used by the Ads table). Keys are
**lowercase campaign names**. To wire up a new paid campaign you must: (a) add it
to BOTH maps, and (b) ensure its `ads` row is in `data/meta-ads-stats.json`.
Current studies of note: `'rehydration recovery' → 'Rehydration Recovery'`,
`'somato sleep study' / 'melatonin sleep study' → 'Melatonin Sleep Study (Somato)'`,
`'pain relief: proleevamax' / 'proleevamax' / 'proleeva - 2' → 'Pain Relief: ProleevaMax'`,
`'sleep peptide' → 'Peptide Supplement: Sleep & Recovery'`.

**Ops API → dashboard taxonomy** (normalized in `getEnrichedStudies`):
- **status:** `live → active`, `coming_soon → coming` (API authoritative).
- **type:** `Clinical → RCT`, `Public → PUBLIC`, `Self-Serve → PUBLIC` — applied
  only to API-only studies; the **curated local `type` wins for matched studies**
  (so retired `VEP` tags are preserved). VEP/Self-Serve are retired going forward.
- **wearable:** `oura→Oura, whoop_v2→Whoop, fitbit→Fitbit, garmin→Garmin,
  apple_health_kit→Apple Watch`; arrays joined with ` / ` (API authoritative).
- **days:** `"N days"` string → integer `N`.
- **"Recruiting" KPI** = launched (not `coming`) + not `complete` + `target > 0` +
  `onboarded < target`. (Not the literal `status === 'recruiting'`.)

---

## Slack report (always, at the end of a run)

Post one message to **#command-center** via the Slack connector summarizing:
- ✅ what was refreshed (which data files, new `updated_at`)
- 🚀 deploy result + the production URL
- ⚠️ any health-check findings (cached API, stale data, deploy drift, unmapped
  campaigns), each with the concrete fix
- 🟢 "all healthy" if nothing was wrong

Keep it short and skimmable. Link the deploy's Vercel inspect URL when relevant.

## Scheduling this skill

This skill is invoked as `/command-center`. To run it on a cadence, create a
**scheduled session / routine in Claude Code on the web** (this does NOT use
GitHub Actions, so the account flag is irrelevant) that runs `/command-center`
on your chosen interval (e.g. daily 08:00 UTC). The scheduled environment must
have: this repo, the **GitHub / Vercel / Meta Ads / Slack** connectors enabled,
the Vercel CLI logged in (or a `VERCEL_TOKEN`), `API_KEY` available, and
`operations.reputablehealth.net` in its network egress allowlist.

## Hard-won gotchas

- A **stray space in `API_KEY`** crashed the proxy with `FUNCTION_INVOCATION_FAILED`
  and silently dropped the whole dashboard to cached data ($0 spend, wrong
  Recruiting count). Always set env values trimmed.
- The live site is the **`command_center`** Vercel project, not the look-alike
  `command-center-e6qf` (stale, 2 months behind).
- `vercel link`/`vercel git connect` to GitHub is blocked while the account is
  flagged — deploy with `npx vercel --prod` instead.
- After any data/code change, **hard refresh** to clear the cached JSON.
