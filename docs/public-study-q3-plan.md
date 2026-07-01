# Q3 Public Study Plan — wearable-first

**One primary factor: the wearable.** The old plan chased many demographic dimensions
at once (male, 56+, Hispanic, …) and treated each as a target. We've simplified: **the
only numbers anyone is held to are per-wearable headcounts.** Demographics fall out of
each wearable's own internal mix — they're **projected outcomes, not targets**.

**Data basis:** current counts are the **live wearable cross-tab**
(`/api/demographics?groupBy=wearable`), pulled **July 1, 2026**. Counts are
*participations* (study-participant pairs — a person in two WHOOP studies counts twice),
same basis as the dashboard's **Wearable-first mix** view, which shows these **live and is
the source of truth**. Treat the numbers here as a dated snapshot.
Owner: Katie · Reviewer: Pankaj · Confirm targets with Mackenzie.

> **Live-count check vs. your working figures:** WHOOP live **449** (you said ~441–449 ✓) ·
> Apple Watch live **114** (you said ~114 ✓) · Fitbit live **57** (you said ~56 ✓).
> **No material difference** — the live feed matches. If a later pull diverges, the live
> view wins and this snapshot gets re-stamped.

---

## 1. Primary targets — per-wearable headcount *(the only held-to numbers)*

| Wearable | Current *(live)* | Q3 target | Stretch | Notes |
|---|---|---|---|---|
| **WHOOP** | **449** | **1,000** | — | The priority build (+551). Small pool — don't deplete it for WHOOP clinicals. |
| **Apple Watch** | **114** | **500** | **1,000** | Base +386, stretch +886. Recruits easier than WHOOP (steps/movement over-index). |
| **Fitbit** | **57** | *optional* | — | Support **only** if we commit to clearing the floor (below). |
| **Oura** | **4,480** | maintain | — | Already ~75% of the base — dominant, sufficient. |
| **Garmin** | **42** | *monitor* | — | Below floor; rides the steps studies, no dedicated push. |

**The ≥500-or-10% floor.** Any wearable we *support* should reach **≥ ~500 people, ≈10% of
the ecosystem** (base ≈ **5,950 participations** / **2,892 distinct**; 10% ≈ 500–600). Below
that there isn't enough of that population to run anything meaningful. Today only **WHOOP**
and **Apple Watch** clear (or target past) the floor; **Fitbit (57)** and **Garmin (42)** do
not — so they're "support only if we fund them to 500," otherwise they ride along.

---

## 2. Demographics are **projected outcomes**, not targets

No one is measured on the male / 56+ / Hispanic / Black numbers anymore. They're a
**consequence** of hitting the wearable targets, read live from each wearable's real
internal mix.

**How to read them (live):** open the dashboard's **Wearable-first mix** view (Ecosystem &
Gaps) and set the **projection** to:
- **+551 to WHOOP** (449 → 1,000)
- **+386 to Apple Watch** (114 → 500), or **+886** for the 1,000 stretch

The view holds that wearable's **current internal gender / age / ethnicity %s** and shows
**current vs. projected counts side by side** — e.g. *"WHOOP is X% male, so +551 WHOOP adds
~Y net-new men."* Those figures come straight from the wearable cross-section
(`groupBy=wearable,<dim>`), **never estimated or smoothed**, and update as the feed does.

> This replaces the old §1/§8 demographic gap tables (male +175, 56+ +50, Hispanic +60, …).
> Those were **targets**; they're now **derived** and live in the view, so they're not
> restated here as commitments.

---

## 3. How to hit each wearable target

**Apple Watch → 500 (base).** The tractable build — steps/movement formats over-index Apple
Watch heavily.
- **The Daily Steps Streak** *(proposed)* — steps challenge; pulls Apple Watch + Fitbit + Garmin at once.
- **The Nature Dose** *(relaunch)* — over-indexes Apple Watch (4.7×), top momentum (~30 joins/mo, 72% completion).
- Organic-led + small paid top-up to the Apple ecosystem (Matt).

**WHOOP → 1,000 (priority, hardest).** ⚠️ **WHOOP barely moves through public studies** (best
public lift ~1.6×). Hitting 1,000 (+551) almost certainly needs **paid / partner / clinical
cross-over**, not public challenges alone — flag this as the plan's main risk.
- Public bridge: **The Gratitude Effect** *(relaunch)* lifts WHOOP + Garmin as a side effect (already ~21 joins/mo, 60% completion).
- Real lever: WHOOP-targeted paid + partner recruitment. Confirm approach with Pankaj/Matt.

**Fitbit / Garmin — ride-along only.** The Daily Steps Streak reaches both. No dedicated
spend unless we decide to fund one to the 500 floor.

---

## 4. Study specs (the plan the dashboard can't hold)

Each is one-factor, tagged by the **wearable** it builds (demographic effects are secondary/derived).

### ▸ The Daily Steps Streak — *Proposed* — **builds: Apple Watch + Fitbit + Garmin**
- **Why:** all three mainstream wearables over-index 5–8× on steps/movement — one study, three wearables.
- **Budget:** organic, broad reach + small paid via wearable-specific targeting (Matt).
- **Exit:** target hit · or no new joins in 2 months. **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

### ▸ The Nature Dose (relaunch) — *Proposed* — **builds: Apple Watch**
- **Why:** over-indexes Apple Watch (4.7×), highest momentum in the catalog (~30 joins/mo, 72% completion).
- **Budget:** organic + small paid to the Apple ecosystem. **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

### ▸ The Gratitude Effect (relaunch) — *Proposed* — **builds: WHOOP + Garmin (bridge)**
- **Why:** best public-study WHOOP/Garmin lift; already ~21 joins/mo at 60% completion. Diversity lift is a bonus, not the goal.
- **Budget:** organic + small paid top-up. **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

### ▸ Energy / sports formats (Celsius scale · Game-Day Energy) — *optional*
- **Under the wearable-first model these are no longer primary** — "male" is a derived
  outcome, not a target. Run them only if they also lift a supported wearable, or purely as
  a projected-mix shift. Keep the specs on file (they were the male levers) but they don't
  drive the Q3 build.

---

## 5. Q3 rotation calendar (wearable-first)

~2 studies/month at cap, weighted to the **Apple Watch** build (tractable) with the **WHOOP**
lever running in parallel via paid/partner.

| Month | Study | Builds | Paid |
|---|---|---|---|
| **July** | The Daily Steps Streak | Apple Watch + Fitbit + Garmin | Organic + **~$400** (wearable targeting) |
| | WHOOP paid/partner push | **WHOOP** | **~$350** (WHOOP-targeted) |
| **August** | The Nature Dose *(relaunch)* | Apple Watch | Organic + **~$300** (Apple) |
| | WHOOP paid/partner push | **WHOOP** | **~$350** |
| **September** | The Gratitude Effect *(relaunch)* | WHOOP + Garmin bridge | Organic + **~$200** |
| | Apple Watch stretch push *(if base hit)* | Apple Watch → 1,000 | **~$250** (Apple) |

---

## 6. Budget — wearable-first (~$2,250 / quarter · $750 / month)

Reallocated from the old demographic split to the wearable build. *Organic carries the
targets; paid is a top-up.* Per-line spend is **proposed — confirm with Pankaj.**

| Build | ~Quarter | Why |
|---|---|---|
| **WHOOP → 1,000** | **~$1,050** | The hard one; public studies barely move it, so paid/partner does the work. |
| **Apple Watch → 500 (+stretch)** | **~$800** | Steps/movement studies are organic-led; paid tops up + funds the stretch. |
| **Fitbit / Garmin ride-along** | **~$400** | Shared steps-study targeting; no dedicated push unless we fund to floor. |
| Oura | **$0** | Already dominant. |

---

## Caveats

- **Count basis:** wearable counts are *participations* (study-participant pairs), not
  distinct people — a distinct-person wearable count would need a different API cut. Targets
  are in the same unit; confirm that's the unit you want to be held to.
- **WHOOP is the risk.** +551 WHOOP through public studies alone is not realistic (best lift
  ~1.6×). The target assumes a paid/partner/clinical-crossover lever — decide that lever before committing.
- **Projected demographics are live, not in this doc.** They're in the Wearable-first mix
  view so they can't go stale; this doc intentionally doesn't restate them as numbers.
- **Floor is a policy, not a measurement yet** — confirm the 10% base (participations vs.
  distinct) you want the floor computed against.

Owner: Katie · Reviewer: Pankaj · Working draft — confirm wearable targets + budget before committing.
