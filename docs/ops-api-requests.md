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
launch dates must be typed into the code by hand. Please include every study,
each with a complete, clean object:

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

## 6. Real-time feed for the **Public Studies Analytics** tab  ⭐

The dashboard's **Public Studies** tab is currently powered by a **manual
participant export** ("Manpreet's May 15, 2026 export · all-time public-challenge
dataset") — so it's a static snapshot that goes stale (it's already a month old).
We'd like an API / feed so these numbers update in **real time**, replacing the
manual upload.

Per **public study / challenge**, we use:

```jsonc
{
  "id": 492,
  "name": "The 4-7-8 Effect",
  "category": "Sleep",          // grouping (Sleep, Energy, etc.)
  "participants": 180,
  "new": 36,
  "returning": 144,
  "completed": 105,
  "completionRate": 58.33,      // %
  "avgDaysTagged": 4.2,
  "avgDaysMissed": 0.6
}
```

From which the tab derives the headline cards: **total participants**,
**studies completed** (of total), **avg completion rate** (study-weighted), and
**new vs returning** split — plus the per-study completion-rate chart.

Requests:
- A **real-time endpoint** (or include public challenges in the existing
  recruiting feed, clearly flagged as public) returning the per-study object above.
- **Any additional demographic breakdowns** you can expose for public-challenge
  participants — e.g. age range, gender, location/region — would be valuable here;
  the current manual export doesn't include them.
- Match these field names where practical so the data drops straight into the
  existing Public Studies tab with minimal rework.

---

### Why it matters

Items **#1 and #2** are the big wins: once the API returns every study (public
included) with a real `launchDate`, accurate `status`, and a numeric `days`, the
dashboard stops needing manual edits to the hardcoded `STUDIES` array in
`index.html` — which is the source of the staleness we keep running into.
