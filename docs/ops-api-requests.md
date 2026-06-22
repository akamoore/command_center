# Operations API — requests for the dev team

Wishlist for the **`operations.reputablehealth.net/api/recruiting`** endpoint
(consumed by the Recruitment Command Center dashboard). The theme: today the
dashboard falls back to hand-maintained records in `index.html` whenever the API
doesn't supply something, which means data goes stale. Each item below removes a
manual-maintenance gap.

Endpoint in use: `GET /api/recruiting?days=<N>&scope=all` (header `x-api-key`).

---

## 1. Return **every** study in `onboarding.byStudy[]` — including PUBLIC/community studies  ⭐ highest impact

Public / community studies (e.g. The Red Bull / Celsius / Monster / Ghost
Effect) currently aren't returned at all, so they have **no live data** and their
launch dates must be typed into the code by hand. **Visible symptom:** on the
dashboard's *Community / Public Studies* table, those four energy-drink studies
(launched Jun 3, 2026 — after the last manual data pull) show "—" for Recruited /
In Study / Completed / Compliance, because nothing in the API supplies their
numbers. Please include every study, each with a complete, clean object. The
dashboard matches API entries to its rows by **`experimentTitle`** (case-insensitive
substring), so the title must line up with the on-screen name (e.g. "The Red Bull
Effect"):

```jsonc
{
  "experimentId": 549,
  "experimentTitle": "Rehydration Recovery",
  "type": "Clinical",          // study design/track
  "status": "live",            // accurate lifecycle (see #2)
  "launchDate": "2026-06-03",  // real ISO date  ← this is what's missing for public studies
  "endDate": null,             // ISO date once it ends
  "target": 70,
  "leads": 100,
  "joined": 135,
  "count": 69,                 // onboarded
  "completed": 23,
  "wearable": ["whoop_v2"],
  "days": 24                   // clean integer (see #2)
}
```

## 2. Fix two data-quality bugs

- **`days` is a string** like `"1 days"` (and appeared to be an unset placeholder
  on experiment 549). Please return a real **number** (or omit if unknown).
- **Finished studies still report `status: "live"`** — e.g. *Quantum Upgrade:
  Cognitive Performance*, which has ended, still comes back as live, so it gets
  counted as actively recruiting. `status` should reflect completion
  (`complete`/`closed`) when a study ends.

## 3. Per-source attribution for the acquisition funnel

The dashboard's **Journey** funnel is `Lead → App download → Joined → Onboarded →
Completed`. Today only **app downloads** can be split by source (via AppsFlyer);
joins/onboards/completions come back **in aggregate only**. To show a true
source-level funnel (Meta / Organic / Instagram → … → Completed), please **stamp
each participant / join with its acquisition source** and expose it in the API.

## 4. Populate `funnel` and `metaAds` in the response

In cached responses these came back as zeros/empty
(`funnel: {adImpressions:0, adClicks:0, appInstalls:0, onboarded:6, …}`). Please
confirm the live API returns real `funnel` (impressions → clicks → installs →
onboarded) and `metaAds` data.

## 5. (Nice-to-have) Consistent enums

The dashboard normalizes these client-side, so this is optional cleanup:
- `status`: API uses `live` / `coming_soon`; dashboard uses `active` / `coming` / `complete` / `recruiting`.
- `type`: API uses `Clinical` / `Public` / `Self-Serve`; dashboard uses `RCT` / `RWE` / `VEP` / `PUBLIC`.

## 6. Real-time feed for the **Public Studies Analytics** tab  ⭐  (endpoint: `GET /api/public-studies`)

**Status — the dashboard side is already built and live.** It calls
`GET /api/public-studies` (same `x-api-key`, no query params) on every visit and
will switch to real-time data **automatically** the moment the endpoint returns
it — no further dashboard changes needed. Until then the tab falls back to a
**static May 15, 2026 manual export** that is now badly stale. We just need the
endpoint to return the payload below.

**Exact response shape the tab consumes** — match these field names and it drops
straight in with zero rework:

```jsonc
{
  "summary": {                      // optional — the tab recomputes from studies[] if omitted
    "totalStudies": 21,
    "studiesCompleted": 18,         // # of studies with completionRate > 0
    "totalParticipants": 1510,
    "newParticipants": 300,
    "returningParticipants": 1210,
    "avgCompletionRate": 55.4       // %, mean across studies with completions
  },
  "studies": [                      // REQUIRED — one object per public challenge
    {
      // ── Core (minimum viable — powers the KPI cards + completion-rate chart) ──
      "id": 492,
      "name": "The 4-7-8 Effect",
      "category": "Sleep",          // Sleep | Recovery | Stress | FitnessAndActivity
      "participants": 180,
      "new": 36,
      "returning": 144,
      "completed": 105,
      "completionRate": 58.33,      // %
      "avgDaysTagged": 4.2,
      "avgDaysMissed": 0.6,

      // ── Health view (the static snapshot has none of this) ──
      "status": "live",             // live | complete | closed
      "launchDate": "2026-02-10",   // ISO date — powers "time on catalog"
      "days": 130,                  // integer days on catalog
      "runRate30d": 22,             // joins in the last 30 days — momentum flag
      "joinsByMonth": [             // monthly time series — powers pace / trend
        { "month": "2026-04", "joins": 42, "onboarded": 30 }
      ],

      // ── Distribution charts ──
      "wearable": ["oura"],         // codes: oura, whoop_v2, fitbit, garmin, apple_health_kit
      "demographics": {             // PER STUDY (the old export was aggregate-only)
        "gender":   { "Female": 130, "Male": 45, "Unknown": 5 },
        "ageRange": { "26–35": 60, "36–45": 70, "46–55": 40 },
        "region":   { "West": 80, "Northeast": 50, "South": 30, "Midwest": 20 }
      }
    }
  ]
}
```

Notes:
- The tab **rolls the per-study `demographics` up** into the aggregate Gender /
  Age / Region charts, so demographics must be supplied **per study**, not as a
  single top-level total. **`region`** replaces the old export's "ethnicity"
  breakdown.
- **Ship incrementally if that's easier:** the **core block alone** ends the
  staleness and makes the tab self-updating. `status` + `launchDate` + `days` +
  `runRate30d` + `joinsByMonth` then light up the per-study health/momentum view;
  `demographics` + `wearable` light up the distribution charts.

---

### Why it matters

Items **#1 and #2** are the big wins: once the API returns every study (public
included) with a real `launchDate`, accurate `status`, and a numeric `days`, the
dashboard stops needing manual edits to the hardcoded `STUDIES` array in
`index.html` — which is the source of the staleness we keep running into.
