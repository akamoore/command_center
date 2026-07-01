# Operations API — requests for the dev team

Wishlist for the **`operations.reputablehealth.net/api/recruiting`** endpoint
(consumed by the Recruitment Command Center dashboard). The theme: today the
dashboard falls back to hand-maintained records in `index.html` whenever the API
doesn't supply something, which means data goes stale. Each item below removes a
manual-maintenance gap.

Endpoint in use: `GET /api/recruiting?days=<N>&scope=all` (header `x-api-key`).

---

## Priority checklist

| # | Ask | Priority | Status |
|---|-----|----------|--------|
| **6** | **`GET /api/public-studies` feed** — the Public Studies Analytics tab is stuck on a stale May-15 snapshot; the route currently **307-redirects to `/login`** (our `x-api-key` isn't honored there). | 🔴 High | Open |
| **8** | **Study health score + tier in `/api/recruiting`** — expose the On Track / At Risk / Critical score you already compute, per study. | 🔴 High | Open |
| **9** | **Off-catalog studies still report `status: "live"`** — retired challenges leak into the dashboard. | 🟡 Medium | Open |
| **1** | **`launchDate: null` on some live studies** (e.g. The Monster Effect). | 🟡 Medium | Mostly done |
| **10** | **Public studies showing end dates** — evergreen challenges shouldn't have one. | 🟡 Medium | Open |
| **2** | **`status` should reflect completion** when a study ends. | 🟡 Medium | Partly done |
| **7** | **Participant-level study history** — unlocks the real public→sponsored funnel. | 🟢 Bigger lift | Open |
| **3** | **Per-source attribution** for the acquisition funnel. | 🟢 Bigger lift | Open |
| **4** | **Populate `funnel` + `metaAds`** in the response. | 🟢 Verify | Open |
| **5** | **Consistent enums** (status / type). | 🟢 Nice-to-have | Open |

**✅ Already shipped — thank you:** public/community studies now returned (#1) · numeric `days` (#2) · the at-risk/critical health-score breakdown (captured in #8).

Full detail for each item below. ↓

---

## 1. Return **every** study in `onboarding.byStudy[]` — including PUBLIC/community studies  ✅ largely shipped

**Status (Jun 2026): done for most studies — thank you.** The live
`/api/recruiting` feed now returns public/community studies: The Red Bull,
Celsius, Monster, and Ghost Effects all come back in `onboarding.byStudy[]` with
real `joined` / `leads` / `target` / `count` / `completed` and (mostly) an ISO
`launchDate`. The dashboard now reads this live feed for the *Community / Public
Studies* table — those rows previously looked blank only because the dashboard was
still using hand-typed values, which is now fixed on our side.

Remaining gaps:
- **`launchDate` is still `null` for some live studies** (e.g. *The Monster
  Effect*, experimentId 542) — please set it whenever a study goes live.
- Keep including **every** study going forward. The dashboard matches API entries
  to curated rows by **`experimentTitle`** (case-insensitive substring), so titles
  must line up with the on-screen name (e.g. "The Red Bull Effect"). For reference,
  the per-study object shape we rely on:

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

- ✅ **`days` is now a number** (e.g. `7`, `28`, `90`) — resolved, thank you.
  *(It previously came back as a string like `"1 days"`.)*
- **Make `status` reflect completion when a study ends.** Many finished studies
  now correctly return `completed` (e.g. the Enhanced Brew RCT) ✅ — but a few
  long-finished ones still report `live`, which counts them as actively
  recruiting. The dashboard guards this with a curated override; fixing it at the
  source would let us drop that workaround.

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
**static May 15, 2026 manual export** that is now badly stale.

**Current behavior:** `GET /api/public-studies` with our `x-api-key` returns
**`HTTP 307 → /login`** — the same key works on `/api/recruiting`, so it isn't an
auth-key problem; the route just isn't exposed as a data API yet. We need it to
return the payload below.

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

## 7. Participant-level study history — to make the Public → Sponsored funnel real

The dashboard's **Public → Sponsored Pipeline** panel can only show **aggregate
counts** today (public-challenge joins next to onboards in sponsored studies that
launched later). It **cannot confirm crossover** — i.e. whether the *same* people
who did free public challenges later enrolled in sponsored (RCT/RWE) studies —
because the API exposes no per-participant study history.

Request: expose, per participant (an anonymized/hashed ID is fine), **the studies
they've joined / onboarded / completed, with dates** — e.g.

```jsonc
{
  "participantId": "p_8f3a…",
  "studies": [
    { "experimentId": 527, "joinedAt": "2026-03-02", "onboarded": true, "completed": false },
    { "experimentId": 549, "joinedAt": "2026-06-04", "onboarded": true, "completed": false }
  ]
}
```

With that, the dashboard can compute the **real** funnel: the % of public-challenge
participants who went on to enroll in a sponsored study — the actual answer to "do
public studies feed paid recruitment?" (Related to #3, but that item is acquisition
*source*; this is study *history*.)

## 8. Expose the study **health score + tier** in `/api/recruiting`

The ops dashboard already classifies each study **On Track / At Risk / Critical**
from a 0–1 health score (pace to 80% of target). Please include that per study in
the `onboarding.byStudy[]` objects — both the raw **score** and the **tier** — so
the Command Center can display the same labels. Today we show an interim estimate
(recent joins + lifetime completions) because the score isn't in the API; once
it's exposed we swap to the real one. Suggested fields:

```jsonc
{ "experimentId": 549, "healthScore": 0.62, "healthTier": "at_risk" }
```

> Note: there's already a separate field named `at_risk` (a count of active,
> non-compliant participants). Please use a distinct name like **`healthTier`** for
> the study-level On Track / At Risk / Critical label to avoid the collision.

## 9. Mark **off-catalog** studies — they still report `status: "live"`

Studies switched off the participant catalog months ago still come back as
`status: "live"` (e.g. *Track Your Travel*, *Caffeine Effect*, *Caffeine Effect
(W)*, *7 Day Yoga Challenge*, and the original *The 4-7-8 Effect*). They have no
recent activity, but the dashboard can't tell they're retired, so we're
**hard-coding them hidden** for now. Please expose catalog state — e.g.
`status: "retired"` or `catalogActive: false` — so we can drop the manual hide-list.

**Update (Jul 2026):** the dashboard now runs every status decision through one
canonical `catalogStatus()` resolver (single source of truth) that feeds the study
list's new **Status** column plus the health score, watch list, and run-rate views.
It reads a per-study lifecycle status — `live` / `complete` / `retired` (or
`catalogActive: false`) / `coming_soon` — **from the API where present**, falls back
to the curated off-catalog list, and otherwise labels the study **`Unknown`** rather
than guessing it live. So the highest-value fix here is a reliable per-study
**catalog status** on both `/api/recruiting` and `/api/public-studies`: it makes the
Status column fully automatic and lets us delete the hand-maintained hide-list.

## 10. Public studies shouldn't carry **end dates**

Evergreen public / community challenges are open-ended, but some come back with an
`endDate`. Please clear `endDate` for public challenges (keep it for time-boxed
sponsored studies). Heads-up: if the at-risk/critical score factors in "days
remaining," stray end dates may also be **skewing those studies' health tier**.

---

### Why it matters

Every gap here is a place the dashboard either goes stale or falls back to
hand-maintained values. The two highest-leverage items now are **#6** (the
public-studies feed — it revives a whole dead tab) and **#8** (the health score —
so the dashboard can show your real On Track / At Risk / Critical labels). The rest
remove manual-maintenance gaps so the dashboard stops needing hand-edits to the
hardcoded `STUDIES` array in `index.html`.
