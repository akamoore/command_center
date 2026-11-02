# Recruiting API Documentation

Programmatic access to Reputable Health's recruiting funnel data.

## Authentication

All requests must include your API key in the `x-api-key` header:

```bash
curl -H "x-api-key: YOUR_API_KEY" https://operations.reputablehealth.net/api/recruiting
```

If the key is missing or invalid, you'll receive a `401 Unauthorized` response.

## Rate Limits

- **60 requests per minute** per API key
- Rate limit headers are included in every response:
  - `X-RateLimit-Remaining` — requests left in the current window
  - `X-RateLimit-Reset` — seconds until the window resets
- If exceeded, you'll receive `429 Too Many Requests` with a `Retry-After` header (in seconds)

---

## Endpoints

### GET `/api/recruiting`

Returns aggregated recruiting funnel data from Meta Ads, SendGrid, AppsFlyer, Manychat, Google Analytics, and internal onboarding stats.

#### Query Parameters

| Parameter | Type                  | Default      | Description                                                                                                          |
| --------- | --------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `days`    | number                | `30`         | Number of days to look back. Any value that is not a positive integer (missing, `NaN`, `Infinity`, `0`) is treated as `30`. |
| `scope`   | `"clinical"` \| `"all"` | `"clinical"` | `clinical` (default) returns only live clinical/products studies — preserves existing mobile-app behavior. `all` returns every study of type `Clinical`/`Products`/`Public`/`Self-Serve` with status `live`/`coming_soon`/`completed` — **including `visible=false` public/community studies** (Red Bull, Celsius, Monster, Ghost, etc.), so the Recruiting Command Center can render the full lifecycle. The filter is by study **type**, not `visible`, which is why the hidden public studies now appear. |

#### Example Request

```bash
curl -H "x-api-key: YOUR_API_KEY" "https://your-domain.com/api/recruiting?days=30"
```

#### Response Schema

```json
{
  "summary": {
    "totalSpend": { "yesterday": 150.25, "week": 1050.75, "month": 4200.0 },
    "totalClicks": { "yesterday": 320, "week": 2240, "month": 9600 },
    "totalInstalls": { "yesterday": 12, "week": 85, "month": 340 },
    "costPerInstall": { "yesterday": 12.52, "week": 12.36, "month": 12.35 },
    "totalOnboarded": { "yesterday": 5, "week": 35, "month": 140 },
    "costPerOnboard": { "yesterday": 30.05, "week": 30.02, "month": 30.0 },
    "subscriberCount": 2450
  },

  "metaAds": {
    "daily": [
      {
        "date": "2026-03-11",
        "impressions": 5200,
        "clicks": 320,
        "spend": 150.25,
        "cpc": 0.47,
        "cpm": 28.89,
        "ctr": 6.15,
        "reach": 4100,
        "frequency": 1.27
      }
    ],
    "ads": [
      {
        "campaignName": "Study ABC - March",
        "adName": "Ad Variant 1",
        "impressions": 2600,
        "clicks": 160,
        "spend": 75.0,
        "ctr": 6.15,
        "cpm": 28.85,
        "cpc": 0.47,
        "reach": 2050
      }
    ],
    "totals": { "impressions": 156000, "clicks": 9600, "spend": 4200.0 }
  },

  "newsletter": {
    "daily": [
      {
        "date": "2026-03-11",
        "sent": 500,
        "delivered": 485,
        "opens": 145,
        "clicks": 32,
        "bounces": 15,
        "unsubscribes": 2
      }
    ],
    "totals": {
      "sent": 15000,
      "delivered": 14550,
      "opens": 4350,
      "clicks": 960,
      "bounces": 450
    }
  },

  "manychat": {
    "totalSubscribers": 2450
  },

  "appsflyer": {
    "daily": [{ "date": "2026-03-11", "installs": 12 }],
    "bySource": [
      { "source": "Facebook Ads", "installs": 250 },
      { "source": "Organic", "installs": 90 }
    ],
    "total": 340,
    "rateLimited": false
  },

  "analytics": {
    "sessions": 5400,
    "users": 3200,
    "pageViews": 12000
  },

  "funnel": {
    "adImpressions": 156000,
    "adClicks": 9600,
    "emailsSent": 15000,
    "emailOpens": 4350,
    "appInstalls": 340,
    "adInstalls": 250,
    "onboarded": 140
  },

  "onboarding": {
    "yesterday": 5,
    "week": 35,
    "month": 140,
    "byStudy": [
      {
        "experimentId": 546,
        "experimentTitle": "Paraxanthine & ACV",
        "count": 103,
        "status": "live",
        "statusEffective": "live",
        "catalogActive": true,
        "type": "Clinical",
        "target": 105,
        "joined": 188,
        "leads": 74,
        "launchDate": "2026-05-12",
        "endDate": "2026-05-20",
        "wearable": ["oura"],
        "days": 12
      }
    ]
  },

  "campaignStudyMap": [
    {
      "campaignName": "Sleep Study - March",
      "experimentId": 42,
      "studyName": "Sleep Study",
      "studyType": "Clinical",
      "joins": 120,
      "onboarded": 80,
      "status": "live",
      "statusEffective": "completed",
      "catalogActive": true,
      "target": 100,
      "type": "Clinical",
      "launchDate": "2026-02-15",
      "endDate": "2026-05-18",
      "wearable": ["oura", "whoop_v2"],
      "days": 30
    }
  ],

  "status": {
    "metaAds": "success",
    "manychat": "success",
    "sendgrid": "success",
    "appsflyer": "success",
    "analytics": "not_configured"
  }
}
```

#### Response Fields

**`summary`** — Period-aggregated KPIs (yesterday, last 7 days, last 30 days):

- `totalSpend` — Total ad spend (USD)
- `totalClicks` — Total ad clicks
- `totalInstalls` — App installs (from AppsFlyer)
- `costPerInstall` — Spend / Installs
- `totalOnboarded` — Users who completed all 6 onboarding steps
- `costPerOnboard` — Spend / Onboarded
- `subscriberCount` — Manychat messenger subscribers

**`metaAds`** — Facebook/Instagram ad performance:

- `daily` — Per-day metrics (impressions, clicks, spend, CPC, CPM, CTR, reach, frequency)
- `ads` — Per-ad breakdown (campaign name, ad name, metrics)
- `totals` — Aggregate totals for the period

**`newsletter`** — SendGrid email marketing:

- `daily` — Per-day email metrics
- `totals` — Aggregate totals

**`manychat`** — Messenger bot subscribers

**`appsflyer`** — App install attribution:

- `daily` — Installs per day
- `bySource` — Installs broken down by marketing source
- `total` — Total installs in period
- `rateLimited` — `true` if AppsFlyer API rate limit was hit (data may be cached)

**`analytics`** — Google Analytics 4 (sessions, users, page views)

**`funnel`** — Full recruiting funnel from ad impression to onboarding:

- `adImpressions` → `adClicks` → `emailsSent` → `emailOpens` → `appInstalls` → `onboarded`
- `adInstalls` — Installs attributed to Facebook ads specifically

**`onboarding`** — Onboarding completions by period and by study.

`onboarding.byStudy[]` carries enough study metadata that consumers should not hardcode it:

- `experimentId` / `experimentTitle` — study identity
- `count` — users onboarded in the last `days` window
- `joined` — users who joined (created `experiment_compliance`) in the same window
- `leads` — current waitlist size (from `study_waitlist`, all-time)
- `status` — **raw** DB study status: `live`, `coming_soon`, `completed`. May be stale (a finished study can still read `live`).
- `statusEffective` — accurate lifecycle status. Equals `status`, except a `live` study with participants but **zero currently-active members and ≥1 completion** is reported as `completed` (the stale-`live` fix). Prefer this field over `status` for "is it still recruiting" logic.
- `catalogActive` — whether the study is currently shown in the app catalog. Mirrors `"Experiment Designs".visible` (the flag the app toggles to add/remove a study from the catalog), so it updates automatically — no manual list to maintain. Closes the gap `statusEffective` can't: a study pulled from the catalog while still `live` reports `catalogActive: false` even though `status`/`statusEffective` stay `live`. **Orthogonal to status** — a study can be `live` but off-catalog, or `completed` but still visible; use `statusEffective` for lifecycle and `catalogActive` for "is it still offered in the app." (Note: because it tracks `visible`, brand/partner challenges that are intentionally not in the public catalog — Red Bull, Monster, Ghost, Celsius, etc. — also report `catalogActive: false`.)
- `type` — DB study type, raw value (`Clinical`, `Products`, `Public`, `Self-Serve`, etc.)
- `target` — enrollment target (from `Experiment Codes.participant_limit` with fallback to `Experiment Designs.participant_number`)
- `launchDate` — earliest non-tester `experiment_compliance.created_at` for the study (first participant join, lifetime). No curated catalog-added date exists in the source DB, so this is the launch signal; `null` only for studies nobody has joined yet.
- `endDate` — `null` for `live` / `coming_soon` studies (still recruiting). For `completed` studies, the latest non-tester `experiment_compliance.created_at` (i.e. when the last person joined before the study ended).
- `wearable` — array of wearable IDs (e.g. `["oura", "whoop_v2"]`)
- `days` — study duration as a clean **integer** day count (e.g. `7`, `30`), parsed from the raw `Experiment Designs.duration` text. `null` when unknown/unparseable. *(Changed from the old `"7 days"` string form.)*

With `scope=clinical` (default), only the 2 live clinical/products studies appear. With `scope=all`, every study of type `Clinical`/`Products`/`Public`/`Self-Serve` (status `live`/`coming_soon`/`completed`) appears — **including `visible=false` public/community studies** — with `count`/`joined` as `0` for studies with no onboarding in the window.

**`campaignStudyMap`** — Auto-matched ad campaigns to studies (by name substring match):

- `joins` — Users who joined the study in the period
- `onboarded` — Users who fully onboarded
- `status`, `statusEffective`, `catalogActive`, `target`, `type`, `launchDate`, `endDate`, `wearable`, `days` — same semantics as `onboarding.byStudy[]` above; `null` / `[]` when the campaign couldn't be matched to a study (`catalogActive` is `null` in that case).

**`status`** — Health of each data source:

- `"success"` — Data fetched successfully
- `"failed"` — API call failed (that section will be `null`)
- `"rate_limited"` — AppsFlyer-specific; cached data may be served
- `"not_configured"` — GA4 property ID not set

---

### GET `/api/public-studies`

Real-time feed for the **Public Studies Analytics** tab — one object per public challenge plus a summary for the headline cards. Replaces the manual all-time participant export. No query params; returns all public studies (`type = 'Public'`, status `live`/`coming_soon`/`completed`).

#### Response Schema

```json
{
  "summary": {
    "totalStudies": 18,
    "studiesCompleted": 7,
    "totalParticipants": 2840,
    "newParticipants": 1610,
    "returningParticipants": 1230,
    "avgCompletionRate": 54.2
  },
  "studies": [
    {
      "id": 492,
      "name": "The 4-7-8 Effect",
      "category": "Sleep",
      "status": "live",
      "statusEffective": "live",
      "catalogActive": true,
      "type": "Public",
      "target": 200,
      "participants": 180,
      "new": 36,
      "returning": 144,
      "completed": 105,
      "completionRate": 58.33,
      "avgDaysTagged": 4.2,
      "avgDaysMissed": 0.6,
      "launchDate": "2026-03-01",
      "days": 7,
      "wearable": ["oura"],
      "runRate30d": 22,
      "joinsByMonth": [
        { "month": "2026-03", "joins": 80, "onboarded": 61 },
        { "month": "2026-04", "joins": 64, "onboarded": 49 }
      ],
      "demographics": {
        "ageRange": { "25-34": 70, "35-44": 60, "18-24": 40, "Unknown": 10 },
        "gender": { "Female": 110, "Male": 65, "Unknown": 5 },
        "region": { "United States": 150, "Canada": 20, "Unknown": 10 }
      }
    }
  ],
  "meta": { "count": 18, "demographicsAvailable": true }
}
```

#### Field Semantics

| Field | Meaning |
| ----- | ------- |
| `participants` | Lifetime distinct non-tester participants |
| `new` / `returning` | `new` = this is the participant's first-ever study; `returning` = they joined an earlier study first. Sums to `participants`. |
| `completed` | Distinct participants with `completed = true` (lifetime) |
| `completionRate` | `completed / participants` as a percentage (2 dp) |
| `avgDaysTagged` / `avgDaysMissed` | Mean across participants (non-taggers counted as 0) |
| `launchDate` | First participant join (no curated catalog-added date exists in the DB) |
| `days` | Study duration as a clean integer; `null` when unknown |
| `runRate30d` | Joins in the last 30 days (momentum signal) |
| `joinsByMonth` | Lifetime monthly series of `joins` + `onboarded` (`YYYY-MM`), powers pace/trend |
| `statusEffective` | Stale-`live`-corrected lifecycle (see `/api/recruiting`) |
| `catalogActive` | Whether the study is shown in the app catalog — mirrors `"Experiment Designs".visible`, so it updates automatically with no manual list. Closes the "removed-but-still-`live`" gap `statusEffective` can't catch; orthogonal to status. Brand/partner challenges not in the public catalog (Red Bull, Monster, etc.) also report `false`. See `/api/recruiting` for full semantics. |
| `demographics` | Per-study distinct-participant counts by `ageRange`, `gender`, and `region` (from `users_info.age_range` / `gender` / `country`). Participants with no/blank value bucket as `"Unknown"`. `region` is country-grain (no finer location exists in the source). |

The headline cards (total participants, studies completed of total, study-weighted avg completion rate, new-vs-returning) come straight off `summary`; the per-study completion-rate chart off `studies[]`.

---

### GET `/api/surveys`

Per-question survey response data, joined to the survey and question definitions. One row per `(user, question)`. Sourced from the `surveys` / `survey_questions` / `survey_answers` schema.

#### Query Parameters

| Parameter      | Type   | Default | Description                                                        |
| -------------- | ------ | ------- | ------------------------------------------------------------------ |
| `experimentId` | number | —       | Filter to one study                                                |
| `userId`       | number | —       | Filter to one participant                                          |
| `surveyId`     | number | —       | Filter to one survey                                               |
| `limit`        | number | `1000`  | Max rows returned. Clamped to `[1, 10000]`.                        |

At least one filter is recommended — without filters, the endpoint returns the most recent `limit` answers globally.

#### Example

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://operations.reputablehealth.net/api/surveys?experimentId=546&limit=500"
```

#### Response

```json
{
  "answers": [
    {
      "answerId": 190473,
      "surveyId": 88,
      "surveyTitle": "Eligibility Survey",
      "surveyDay": null,
      "required": true,
      "questionId": 421,
      "questionText": "Are you between the ages of 21 and 70 years old?",
      "questionType": "multiple_choice",
      "questionOrder": 1,
      "userId": 5640,
      "answer": "Yes",
      "skipped": false,
      "answeredAt": "2026-05-20 13:30:36.991+00",
      "experimentId": 546
    }
  ],
  "meta": { "experimentId": 546, "userId": null, "surveyId": null, "count": 1, "limit": 500 }
}
```

`answer` is the raw JSONB value (string, number, object, or array depending on `questionType`). `skipped: true` rows still appear so consumers can compute completion rates.

For *which surveys exist for a study* (definitions, not responses), use `/api/studies/:id/surveys?meta=true`.

---

### GET `/api/demographics`

De-identified, self-serve participant demographics for cohort analysis and demographic
gap-spotting (e.g. *"do we have enough Fitbit males?"*). Returns **aggregate counts only** —
no names, emails, phone numbers, or user IDs. Covers the full active ecosystem (Public +
Clinical + Products by default), broken down study by study, with an optional cross-tab
mode for pivoting across dimensions.

The base unit is a **participation**: one distinct `(study, participant)` pair. Someone
enrolled in three studies counts once per study. Demographics (age/gender/ethnicity/income)
come from `users_info`; **wearable is study-specific** (`experiment_compliance.userWearable`),
so the same person can appear as Oura in one study and Fitbit in another — the right grain
for per-study gaps. Testers and `@reputable.health` internal accounts are excluded. Missing
or blank values bucket as `"Unknown"`, so every dimension's buckets sum back to the
participation total.

#### Query Parameters

| Parameter      | Type   | Default                     | Description                                                                                                                                                                                 |
| -------------- | ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`         | string | `public,clinical,products`  | Comma-separated study types in scope. Also valid: `self-serve`, `elite`. Invalid values → `400`.                                                                                            |
| `experimentId` | string | —                           | Comma-separated study IDs to restrict to (e.g. `42,546`).                                                                                                                                   |
| `groupBy`      | string | —                           | Comma-separated cross-tab dimensions. Valid: `study`, `age`, `gender`, `ethnicity`, `wearable`, `income`. When present, the response adds a `crossTab` block of pivotable cells. Invalid values → `400`. |
| `minCount`     | number | `1`                         | Cross-tab small-cell suppression: cells with fewer than `minCount` participations are dropped (counted in `suppressedCells` / `suppressedParticipations`). Use to avoid surfacing tiny re-identifiable cells. |

#### Example Requests

```bash
# Per-study marginals across the full ecosystem
curl -H "x-api-key: YOUR_API_KEY" "https://operations.reputablehealth.net/api/demographics"

# Headline cross-tab: wearable × gender across all studies ("Fitbit males?")
curl -H "x-api-key: YOUR_API_KEY" \
  "https://operations.reputablehealth.net/api/demographics?groupBy=wearable,gender"

# Per-study cross-tab, clinical only, suppressing cells under 5
curl -H "x-api-key: YOUR_API_KEY" \
  "https://operations.reputablehealth.net/api/demographics?type=clinical&groupBy=study,wearable,gender&minCount=5"
```

#### Response Schema

```json
{
  "summary": {
    "totalStudies": 55,
    "totalParticipations": 5936,
    "distinctParticipants": 2891
  },
  "funnel": {
    "registered": 5970,
    "joinedAnyStudy": 3883,
    "registeredNeverJoined": 2087,
    "joinedInScope": 2892,
    "onboarded": 1252,
    "joinedNeverOnboarded": 1640
  },
  "studies": [
    {
      "id": 488,
      "name": "Melatonin Sleep Study",
      "type": "Clinical",
      "participants": 790,
      "age": { "26-35": 240, "36-45": 180, "Unknown": 90 },
      "gender": { "Female": 520, "Male": 250, "Unknown": 20 },
      "ethnicity": { "Caucasian or White": 410, "Asian or Pacific Islander": 70, "Unknown": 210 },
      "wearable": { "oura": 654, "Unknown": 136 },
      "income": { "Greater than $100,000": 300, "$50,000-$100,000": 180, "Unknown": 240 }
    }
  ],
  "ecosystem": {
    "participants": 5936,
    "age": { "26-35": 1800, "Unknown": 600 },
    "gender": { "Female": 3764, "Male": 1565, "Unknown": 604, "Prefer not to say": 2, "Other": 1 },
    "ethnicity": { "Caucasian or White": 2100, "Unknown": 1568 },
    "wearable": { "oura": 4900, "whoop_v2": 591, "fitbit": 56, "Unknown": 813 },
    "income": { "Greater than $100,000": 1500, "Unknown": 1680 }
  },
  "coverage": {
    "participations": 5936,
    "age": 0.898,
    "gender": 0.898,
    "ethnicity": 0.736,
    "wearable": 0.863,
    "income": 0.717
  },
  "crossTab": {
    "groupBy": ["wearable", "gender"],
    "cells": [
      { "keys": { "wearable": "oura", "gender": "Female" }, "count": 3034 },
      { "keys": { "wearable": "fitbit", "gender": "Male" }, "count": 9 }
    ],
    "minCount": 1,
    "suppressedCells": 0,
    "suppressedParticipations": 0
  },
  "meta": {
    "types": ["public", "clinical", "products"],
    "experimentIds": null,
    "generatedFrom": "distinct (study, participant) pairs; testers and @reputable.health internal accounts excluded; blank values bucketed as \"Unknown\""
  }
}
```

#### Field Semantics

| Field | Meaning |
| ----- | ------- |
| `summary.totalParticipations` | Sum of per-study participations. A person in N in-scope studies counts N times. |
| `summary.distinctParticipants` | Distinct people across all in-scope studies (de-duplicated). |
| `funnel` | Ecosystem participation ladder around `distinctParticipants`, exposing the top-of-funnel drop-off. **Always computed at the fixed default scope** (`public`/`clinical`/`products`, status `live`/`coming_soon`/`completed`) and **not affected by the request's `type`/`experimentId`/`groupBy` filters**, so it stays comparable across calls. Each rung is a strict superset of the next: `registered` ≥ `joinedAnyStudy` ≥ `joinedInScope` ≥ `onboarded`. |
| `funnel.registered` | Distinct non-tester (`users.tester_tier >= 1`), non-internal accounts — everyone who signed up. |
| `funnel.joinedAnyStudy` | Of `registered`, those who joined ≥1 study of **any** type/status as a real (non-tester) participant. |
| `funnel.registeredNeverJoined` | `registered − joinedAnyStudy` — signed up but never joined a study. The population **not** counted in `distinctParticipants`. |
| `funnel.joinedInScope` | Distinct people who joined ≥1 **in-scope** study. Equals `summary.distinctParticipants` at the default scope. |
| `funnel.onboarded` | Of `joinedInScope`, those who completed all 6 onboarding steps. |
| `funnel.joinedNeverOnboarded` | `joinedInScope − onboarded` — joined an in-scope study but never finished onboarding. **Already inside** `distinctParticipants` (this is a subset, not an exclusion). |
| `studies[]` | One object per in-scope study with a participant, each carrying five marginal distributions (`age`, `gender`, `ethnicity`, `wearable`, `income`). Each distribution maps a bucket label → distinct-participation count and sums to `participants`. |
| `ecosystem` | The same five distributions rolled up across all in-scope studies. |
| `coverage` | Per-dimension fill rate (fraction `0–1` of participations with a non-`"Unknown"` value). Ethnicity and income are the least-populated — weight conclusions accordingly. |
| `crossTab` | **Only present when `groupBy` is supplied.** `cells[]` is one cell per distinct combination of the requested dimensions; `keys` carries one entry per dimension (`study` resolves to the study name). Pivot these yourself for arbitrary cohort slices. |
| `meta.types` / `meta.experimentIds` | Echo of the scope actually applied. |

> **De-identification note:** This endpoint never emits identifiers, only counts. For finer-grained cohorts the cells can still get small — use `minCount` to suppress cells below a chosen k-anonymity threshold; the suppressed totals are reported so denominators still reconcile.

---

### GET `/api/wearable-cohorts`

Unique-user counts by wearable (Apple Watch, Oura, Whoop). Separates **study joins** from
**distinct people**, then follows those people through the funnel: onboarded, started,
in progress, completed, withdrawn, and still sending wearable data. Every count is also
split into users who only joined public studies, only joined clinical studies, or both.
Aggregate counts only, no identifiers.

The wearable is study-specific (`experiment_compliance.userWearable`, set when the
participant connects a device). Someone on Oura in one study and Whoop in another counts
once under each wearable and once in `total`, so `total.all.uniqueUsers` is less than the
sum of the three wearables.

Excluded everywhere: deleted accounts, `@reputable.health` staff, `+` test emails,
testers flagged in any study, and anyone who joined the internal test study (221).

> **Requires** the `is_test_email` column on `users_info_ops`. Re-run
> `scripts/users-info-least-privilege.sql` with admin credentials before deploying;
> without it every request returns `500`.

#### Query Parameters

| Parameter    | Type   | Default | Description                                                                 |
| ------------ | ------ | ------- | --------------------------------------------------------------------------- |
| `activeDays` | number | `7`     | Window for `activeConnection`, `1` to `90`. Anything else returns `400`.    |

#### Example Request

```bash
curl -H "x-api-key: YOUR_API_KEY" "https://operations.reputablehealth.net/api/wearable-cohorts?activeDays=7"
```

#### Response Schema

Values below are illustrative.

```json
{
  "wearables": [
    {
      "wearable": "apple_watch",
      "label": "Apple Watch",
      "sources": ["apple_health_kit"],
      "all": {
        "studyJoins": 237,
        "uniqueUsers": 147,
        "onboarded": 78,
        "startedStudy": 68,
        "joinedNeverStarted": 79,
        "inProgress": 12,
        "completers": 42,
        "completionPending": 1,
        "withdrawn": 30,
        "activeConnection": 20
      },
      "publicOnly": { "studyJoins": 237, "uniqueUsers": 147, "...": "same fields" },
      "clinicalOnly": { "studyJoins": 0, "uniqueUsers": 0, "...": "same fields" },
      "both": { "studyJoins": 0, "uniqueUsers": 0, "...": "same fields" }
    }
  ],
  "total": { "all": { "...": "same fields" }, "publicOnly": {}, "clinicalOnly": {}, "both": {} },
  "definitions": { "uniqueUsers": "One distinct person, counted once however many studies they joined.", "...": "one entry per field" },
  "meta": { "activeDays": 7, "generatedAt": "2026-10-26T18:00:00.000Z" }
}
```

#### Field Definitions

All counts except `studyJoins` are distinct people. The same text ships in the response's
`definitions` block.

| Field | Meaning |
| ----- | ------- |
| `studyJoins` | One person joining one study. A person in three studies counts three times. |
| `uniqueUsers` | One distinct person, counted once however many studies they joined. |
| `onboarded` | Finished onboarding in at least one study: device connected, phone verified (skipped for public studies), consent signed, baseline survey and application form done, shipping added where the study ships product. Anyone who started or completed a study counts too. |
| `startedStudy` | Began at least one study (first day of data recorded, or completed). |
| `joinedNeverStarted` | `uniqueUsers − startedStudy`. Joined but never began any study, whether they stopped during onboarding or after it. |
| `inProgress` | Currently in a started study that is active, not completed and not withdrawn. |
| `completers` | At least one study marked complete on the platform (`experiment_compliance.completed`). |
| `completionPending` | Awaiting completion review on at least one study and not yet complete on it. Not included in `completers`. |
| `withdrawn` | A live withdrawal on at least one study. Re-invited participants are not counted. |
| `activeConnection` | Wearable data received within the last `activeDays` days on at least one study. |
| `publicOnly` / `clinicalOnly` / `both` | Split by the study types joined on that wearable. "Clinical" is every non-Public type (Clinical, Products, Self-Serve). The three buckets add up to `all`. |

Waitlist sign-ups are not joins and are not counted: they live in `study_waitlist`, and
joining a study removes the waitlist entry. A participant whose onboarding expired and who
went back to the waitlist keeps their join.

---

### GET `/api/participants/profiles`

Per-user wearables, demographics, ID verification, study history and latest profile
answers, for targeting inside the existing base (*"men reporting sleep issues who own a Whoop"*) before any ad spend.
Keyed on `userId`. It returns **no direct identifiers**: no name, email, phone, date of
birth or address, and free-text answers are left out because they can contain any of those.

This is **person-scoped**: when `PERSON_DATA_KEY_NAMES` is set, only the keys it names can
call it (see `src/lib/api-key.ts`). It uses the same exclusions as `/api/wearable-cohorts`
and needs the `is_test_email` and `marital_status` view columns
(`scripts/users-info-least-privilege.sql`).

#### Query Parameters

| Parameter    | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| `wearable`   | string  | none    | Comma-separated. Only users who ever connected one of these: `apple_watch`, `oura`, `whoop`, `fitbit`, `garmin`. |
| `activeOnly` | boolean | `false` | Only users whose wearable sent data within `activeDays` (any wearable, or the ones in `wearable`). |
| `activeDays` | number  | `7`     | Window for `activeNow` and `activeOnly`, `1` to `90`. |
| `limit`      | number  | `500`   | Users per page, `1` to `1000`. |
| `cursor`     | number  | `0`     | Return users after this `userId`. Pass `page.nextCursor` to get the next page. |

Invalid values return `400`.

#### Example Request

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://operations.reputablehealth.net/api/participants/profiles?wearable=whoop&activeOnly=true&limit=500"
```

#### Response Schema

Values below are illustrative.

```json
{
  "users": [
    {
      "userId": 1042,
      "demographics": {
        "ageRange": "35-44",
        "gender": "Male",
        "country": "United States",
        "ethnicity": null,
        "householdIncome": null,
        "maritalStatus": "Married"
      },
      "identity": { "verified": true, "status": "approved" },
      "participation": { "studies": 2, "public": true, "clinical": true },
      "studies": [
        {
          "experimentId": 603,
          "title": "Sleep Study",
          "group": "public",
          "wearable": "whoop",
          "joinedAt": "2026-05-02T14:00:00Z",
          "state": "completed",
          "onboarded": true,
          "completionPending": false
        }
      ],
      "wearables": [
        {
          "wearable": "whoop",
          "label": "Whoop",
          "sources": ["whoop_v2"],
          "studies": 2,
          "activeNow": true,
          "lastDataAt": "2026-10-25T09:12:00Z"
        }
      ],
      "profileAnswers": [
        { "questionId": 12, "subject": null, "answer": "often", "answeredAt": "2026-09-14T08:00:00Z" }
      ]
    }
  ],
  "questions": {
    "12": {
      "id": 12,
      "key": "sleep_trouble",
      "text": "How often do you have trouble sleeping?",
      "type": "MULTIPLE_CHOICE",
      "lifecycle": "LIVE",
      "category": "Sleep",
      "categorySlug": "sleep",
      "sensitiveCategory": false,
      "choices": [{ "key": "often", "label": "Often" }]
    }
  },
  "page": { "limit": 500, "returned": 500, "nextCursor": 1042 },
  "meta": {
    "activeDays": 7,
    "wearables": ["whoop"],
    "activeOnly": true,
    "excluded": "Deleted accounts, @reputable.health staff, ...",
    "notes": ["..."],
    "generatedAt": "2026-10-26T18:00:00.000Z"
  }
}
```

#### Field Definitions

| Field | Meaning |
| ----- | ------- |
| `demographics` | Self-reported, from `users_info`. Blank values are `null`. Ethnicity and income are filled for well under half of users. |
| `identity.verified` | `true` when Persona approved the ID check and the approval has not expired. |
| `identity.status` | Effective Persona status: `not_started`, `pending`, `approved`, `declined`, `requires_review` or `expired` (an approval past its expiry). |
| `participation` | Number of studies joined, and whether any were Public (`public`) or non-Public (`clinical`: Clinical, Products, Self-Serve). |
| `studies[]` | One entry per study joined, oldest first. `wearable` is the device connected for that study, or `null`. |
| `studies[].state` | The most advanced state that applies: `completed` (marked complete), `withdrawn` (live withdrawal; re-invited participants are not withdrawn), `in_progress` (started and still active), `stopped` (started, no longer active, neither completed nor withdrawn), `not_started` (joined, never began). |
| `studies[].onboarded` / `completionPending` | Finished onboarding for that study; awaiting completion review and not yet complete. Same rules as `/api/wearable-cohorts`. |
| `wearables[]` | One entry per wearable the user connected in at least one study. `studies` counts the studies joined with it. `activeNow` means data arrived within `activeDays`; `lastDataAt` is the latest arrival. A wearable with `activeNow: false` is no longer active. |
| `wearables[].sources` | The raw values behind the entry. Apple Watch is recorded as `apple_health_kit` (Apple Health), so it can include iPhone-only users. Whoop combines `whoop` and `whoop_v2`. |
| `profileAnswers[]` | The latest answer per question, and per `subject` for questions asked about each item (a supplement, a medication). Older answers stay in the database but are not returned. |
| `profileAnswers[].answer` | As stored: a choice key, an array of keys or names, or a number. Map keys to labels with `questions[questionId].choices`. A choice question that allows own text can hold the participant's own words in place of a key. |
| `questions` | Every question referenced on this page, keyed by `questionId`. `sensitiveCategory` marks categories holding medical details (Medications, Body and Health). |
| `page.nextCursor` | The `userId` to pass as `cursor` for the next page, or `null` on the last page. |

---

### POST `/api/study-membership`

Machine-to-machine membership check for the recruitment email sequence. Given a
participant email and a study code, it answers a single boolean: does this person
have a join record for that study? A `true` means the recruitment side should
suppress its "come join" reminder emails for that person.

The endpoint never returns PII, never echoes the email, and never reveals whether
an email belongs to a Reputable user at all (an unknown email and a known
not-joined email both return `joined: false`).

**Auth:** requires a key named `recruitment` in `API_KEYS`. That key is scoped to
this endpoint only; it returns `403` on every other route. (The lookup is a pure
read, executed under the dashboard's read-only database user.)

**Request**

```bash
curl -X POST https://operations.reputablehealth.net/api/study-membership \
  -H "x-api-key: YOUR_RECRUITMENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"participant@example.com","studyCode":"O36U"}'
```

| Field       | Type   | Notes                                    |
| ----------- | ------ | ---------------------------------------- |
| `email`     | string | Participant email. Case/whitespace-insensitive. |
| `studyCode` | string | 4-character participant code, e.g. `O36U`. |

**Definition of "joined":** the email has an `experiment_compliance` record for
the study (any state: active, completed, or in-progress). The record is created
server-side when the participant starts the study.

**Responses**

| Status | Body                                          | Meaning                                             |
| ------ | --------------------------------------------- | --------------------------------------------------- |
| `200`  | `{ "joined": true,  "studyCode": "O36U" }`    | Has a join record → suppress reminders              |
| `200`  | `{ "joined": false, "studyCode": "O36U" }`    | No join record (or email unknown) → keep sending    |
| `400`  | `{ "error": "Invalid studyCode" }` / `Invalid email` / `Malformed JSON` | Bad input |
| `401`  | `{ "error": "Missing API key" }` / `Invalid API key` | Missing or incorrect key                     |
| `403`  | `{ "error": "Key not authorized for this endpoint" }` | Valid key, but not permitted on this route  |
| `429`  | `{ "error": "Rate limit exceeded. Try again later." }` | Over 60 requests/minute; honor `Retry-After` |
| `503`  | `{ "error": "Temporarily unavailable, retry later" }`  | Transient DB issue; honor `Retry-After` and back off |

**Retry contract:** the lookup is idempotent, so retries are always safe. On
`429` honor `Retry-After`; on `503`/`5xx`/network error use exponential backoff
(roughly 5 attempts over 24h).

---

## Error Responses

| Status | Body                                                   | Meaning                                             |
| ------ | ------------------------------------------------------ | --------------------------------------------------- |
| `400`  | `{ "error": "Invalid groupBy dimension(s): ..." }`     | Invalid `type`, `groupBy`, or `experimentId` param (see `/api/demographics`) |
| `401`  | `{ "error": "Invalid API key" }`                       | Missing or incorrect `x-api-key` header             |
| `429`  | `{ "error": "Rate limit exceeded. Try again later." }` | Over 60 requests/minute; check `Retry-After` header |
| `500`  | `{ "error": "Failed to fetch recruiting data" }`       | Server-side error (check logs)                      |

---

## Quick Start

```bash
# Fetch last 30 days of recruiting data
curl -H "x-api-key: YOUR_API_KEY" https://your-domain.com/api/recruiting

# Fetch last 7 days only
curl -H "x-api-key: YOUR_API_KEY" "https://your-domain.com/api/recruiting?days=7"

# Python example
import requests

response = requests.get(
    "https://your-domain.com/api/recruiting",
    headers={"x-api-key": "YOUR_API_KEY"},
    params={"days": 30}
)
data = response.json()
print(f"Total spend this month: ${data['summary']['totalSpend']['month']:.2f}")
print(f"Cost per onboard: ${data['summary']['costPerOnboard']['month']:.2f}")
```
