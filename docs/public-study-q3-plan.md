# Q3 Public Study Plan — data-backed recommendations

A standing record of the demographic analysis behind the Q3 public-study
rotation: where the participant gaps are, which formats fill them, and the
specific studies to run. Pairs with the **Public Study Playbook**
(`public-study-playbook.md`) and the live **Ecosystem & Gaps** + **Gap → Top
Studies** sections of the dashboard (`index.html`).

**Data basis:** live `/api/demographics` (per-study cohorts) + `/api/public-studies`
(completion + momentum), pulled **June 29, 2026**. Counts are **participations**
(distinct study–participant pairs; testers and internal accounts excluded; blanks
bucketed "Unknown"). Owner: Katie · Reviewer: Pankaj · Confirm targets with
Mackenzie before committing.

> The live, self-updating versions of sections 1–3 are on the dashboard. This doc
> is the snapshot + the plan that the dashboard can't hold (specs, calendar).

---

## 1. Where the gaps are today

Ecosystem baselines, as **share of *known*** (excludes "Unknown"/"Prefer not to say").

| Dimension | TODAY | GAP / PRIORITY |
|---|---|---|
| WHOOP | 8.8% | Clone Gratitude / 30-Min Reset / Dry Week (recovery-discipline themes pull Whoop) |
| Apple Watch | 2.2% | **High** — steps/movement challenges (over-index 5–7×) |
| Fitbit | 1.1% | **High** — steps + yoga |
| Garmin *(4th wearable)* | 0.8% | Endurance/discipline streaks (yoga, Wim Hof, Gratitude) |
| Oura | 87.1% | Sufficient — low priority |
| Gender (male) | 29.4% | ⚡ Energy-drink + sports only; wellness won't move it |
| Age (60+) | ~11.6%* | Gentle nature / nutrition / reading |
| Ethnicity (Hispanic) | 10.3% | Gratitude, Dry Week, Cold Shower, Power Nap |
| Ethnicity (Black) | 4.5% | 30-Min Reset, 14 Day Yoga, Box Breathing, Power Nap (small base, 74% coverage — directional) |
| *(Income — out)* | — | >$100k is ~57% of known income (affluent-skewed); not a priority dimension |

*\*56+ proxy; the API buckets at 56–65 / 66+. Income left out of the gap table per plan decision.*

**Coverage** (how much of each dimension is known): wearable 86% · gender 90% · age 90% · ethnicity **74%** · income 72%.

---

## 2. Conclusions from the cohort data

**The headline: recruit by *theme*, not by study.** The same ~6 formats recur
across gaps — pick the format type and one study fills several gaps at once.

1. **One steps/movement study covers all three mainstream wearables.** Apple
   Watch, Fitbit, and Garmin are topped by the same cluster (10K Steps, Yoga,
   Power Nap, Sunrise) at 4–8×. Highest-leverage single move.
2. **Men are a category problem, not a study problem.** Every wellness study is
   ~30% male (≈1.0–1.1×). Only energy/sports breaks out (Celsius 55%, World Cup
   43%). No wellness challenge moves the male number.
3. **Whoop barely moves through public studies** (max ~1.6×). Whoop users
   concentrate in *clinical recovery* studies (Rehydration 93, Pain Relief 90,
   Sensate 52). Bridge it with a recovery/HRV hook, or accept slow gains.
4. **Wearable gaps are an *acquisition* problem too.** Apple/Fitbit/Garmin owners
   are bring-your-own (Oura is the default). The theme converts them; Matt's
   wearable-specific ad targeting gets the study in front of them.
5. **The panel is structurally female (71/29), affluent (>$100k majority), and
   26–55 (77%).** Male, 60+, and lower-income are uphill by default — each needs a
   *dedicated* study, not just rotation.
6. **Ethnicity & 60+ have no silver bullet.** Short low-friction sleep/stress
   formats over-index modestly (1.3–2.0×); these gaps close in small increments.
7. **Pick gap-fillers that also retain.** Some over-indexers complete well, some
   leak — favor the ones that do both (see the dashboard's color-coded completion):

   | Recruits the gap **and** retains | Over-indexes but leaks |
   |---|---|
   | Nature Dose (72%), Box Breathing (77%), Seasonal Superfoods (90%), Sunrise (72%) | Yoga (46%), Wim Hof (52%), Fasting (49%), Caffeine (18–23%) |

---

## 3. Targeting map — which study pulls which gap

Top public studies by over-index (share of known · `N×` vs baseline · completion).
Bold = over-indexes **and** retains (≥55%).

| Gap | Best clones (over-index · completion) |
|---|---|
| **Apple Watch** | **Nature Dose** (4.7× · 72%) · **Hydration** (4.8× · 70%) · **10K Steps** (5.2× · 59%) · Power Nap (7.2× · 58%) |
| **Fitbit** | 14 Day Yoga (5.9× · 46%) · **10K Steps** (5.2× · 59%) |
| **Garmin** | Gratitude (6.0× · 60%) · 14 Day Yoga (7.9× · 46%) · Wim Hof (7.4× · 52%) |
| **WHOOP** | **Dry Week** (1.6× · 65%) · **Sunrise** (1.5× · 72%) · **Gratitude** (1.3× · 60%) · **30-Min Reset** (1.3× · 57%) |
| **Male** | **Celsius** (1.9× · 55% male) · World Cup (43% male) — energy/sports only |
| **Age 56+** | **Seasonal Superfoods** (1.8× · 90%) · **Nature Dose** (1.6× · 72%) |
| **Hispanic** | Power Nap (2.0× · 58%) · **Gratitude** (1.3× · 60%) · **Dry Week** (1.3× · 65%) · **Cold Shower** (12% · 64%) |
| **Black** | **Box Breathing** (1.5× · 77%) · **30-Min Reset** (1.6× · 57%) · **Power Nap** (1.9× · 58%) · 4-7-8 Ext (2.8× · 44%) |

---

## 4. Recommended Q3 studies (Study Specs)

Each is one-factor and maps to a specific gap (passes New-idea-filter checks 01,
04, 06). Six form the rotation; Strength Streak is a male backup.

### ▸ The Daily Steps Streak — *Proposed*
- **Primary goal (one factor):** Recruit net-new participants who use Apple Watch, Fitbit, or Garmin.
- **Why (gap):** All three mainstream wearables are near-zero and over-index 5–8× on steps/movement — one study closes three wearable gaps at once. *(Broadens the existing "Sleep and Steps Streak" card from Fitbit-only to all three.)*
- **Target metric:** PENDING — net-new Apple Watch + Fitbit + Garmin.
- **Budget:** Organic, broad reach; small paid top-up via wearable-specific targeting (Matt).
- **Entry:** Mainstream-wearable gap open · slot free · protocol reviewed · first-run checked.
- **Exit:** Target hit · or no new joins in 2 months · or gap closes.
- **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

### ▸ The Box Breathing Effect (relaunch) — *Proposed*
- **Primary goal (one factor):** Recruit net-new participants from under-represented ethnicities (Hispanic + Black).
- **Why (gap):** Over-indexes both (1.3× / 1.5×) **and** retains at 77% — the best diversity-pulling format on retention (Yoga leaks at 46%).
- **Target metric:** PENDING — net-new Hispanic + Black.
- **Budget:** Organic; optional small paid top-up to culturally-relevant audiences/partners.
- **Entry:** Ethnicity gap open · slot free · protocol reviewed · first-run checked.
- **Exit:** Target hit · or no new joins in 2 months · or gap closes.
- **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

### ▸ Game-Day Energy — *Proposed*
- **Primary goal (one factor):** Recruit net-new male participants.
- **Why (gap):** Men are 29% and wellness doesn't move it; energy/sports does (Celsius 55%, World Cup 43%). A 1-week energy/performance challenge timed to a sports moment.
- **Target metric:** PENDING — net-new male.
- **Budget:** **Paid** — male-targeted sports/energy placements (Matt). The gap organic won't fill.
- **Entry:** Male gap open · sponsor/brand cleared · sports moment identified · slot free · protocol reviewed.
- **Exit:** Target hit · or no new joins in 2 months · or gap closes.
- **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha
- *Filter note: TOPICAL (check 03) — keep the sports tie anchored to a real participant moment, not just a marketing date.*

### ▸ The Gratitude Effect (relaunch) — *Proposed*
- **Primary goal (one factor):** Recruit net-new participants from under-represented ethnicities (lead: Hispanic).
- **Why (gap):** Over-indexes Hispanic (1.3×), also lifts Black, Whoop, and Garmin — the best single *diversity* play, already pulling 21 joins/mo at 60% completion.
- **Target metric:** PENDING — net-new Hispanic + Black; secondary Whoop/Garmin.
- **Budget:** Organic + small paid top-up to Hispanic/Black audiences if selected.
- **Entry:** Ethnicity gap open · slot free · protocol reviewed · first-run checked.
- **Exit:** Target hit · or no new joins in 2 months · or gap closes.
- **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

### ▸ The Nature Dose (relaunch) — *Proposed*
- **Primary goal (one factor):** Recruit net-new Apple Watch users.
- **Why (gap):** Over-indexes Apple Watch (4.7×), highest momentum in the catalog (30 joins/mo) at 72% completion. Secondary: lifts 60+ (1.6×).
- **Target metric:** PENDING — net-new Apple Watch; secondary 60+.
- **Budget:** Organic + small paid top-up to Apple-ecosystem / 55+ audiences if selected.
- **Entry:** Apple Watch gap open · slot free · protocol reviewed · first-run checked.
- **Exit:** Target hit · or no new joins in 2 months · or gap closes.
- **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

### ▸ The Celsius Effect (scale) — *Proposed*
- **Primary goal (one factor):** Recruit net-new male participants.
- **Why (gap):** Runs 55% male (1.9×) at 20 joins/mo — the clear male lever.
- **Target metric:** PENDING — net-new male.
- **Budget:** **Paid** top-up — male-targeted sports/energy placements.
- **Entry:** Male gap open · sponsor/brand cleared · slot free · protocol reviewed.
- **Exit:** Target hit · or no new joins in 2 months · or gap closes.
- **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

### ▸ The Strength Streak — *Proposed (backup male option)*
- **Primary goal (one factor):** Recruit net-new male participants.
- **Why (gap):** Fitness/strength framing skews male; one concrete daily action (one set of push-ups) — avoid passive caffeine-tracking, which retains 18–23%.
- **Budget:** Paid, male-targeted. **Owner:** Katie · **Review:** Mackenzie · **QA:** Nisha

---

## 5. Q3 rotation calendar

6 studies · ~2 per month (at cap) · every gap covered, male & ethnicity twice ·
paid concentrated only on male (the gap organic can't reach).

| Month | Study | Fills | Spend |
|---|---|---|---|
| **July** | The Daily Steps Streak | Apple Watch + Fitbit + Garmin | Organic |
| | The Celsius Effect *(scale)* | **Male** | **Paid** ~$375 |
| **August** | The Box Breathing Effect *(relaunch)* | Hispanic + Black | Organic |
| | The Nature Dose *(relaunch)* | 60+ + Apple Watch | Organic |
| **September** | The Gratitude Effect *(relaunch)* | Hispanic/Black + Whoop/Garmin | Organic |
| | Game-Day Energy | **Male** | **Paid** ~$375 |

Budget: ~$750/quarter, all paid on the two male studies; everything else organic
("organic carries the targets, paid is a top-up").

---

## 6. Forward-looking recruitment pipeline

Engage proactively (don't run ads at the last minute). Confirm dates with
Pankaj/Mackenzie.

| STUDY | WEARABLE NEEDED | DEMOGRAPHIC NEEDED | START ENGAGING BY |
|---|---|---|---|
| The Daily Steps Streak | Apple Watch, Fitbit, Garmin | — | late June |
| The Celsius Effect *(scale)* | — | Male | early July |
| The Box Breathing Effect *(relaunch)* | — | Hispanic, Black | mid-July |
| The Nature Dose *(relaunch)* | Apple Watch | 60+ | early Aug |
| The Gratitude Effect *(relaunch)* | Whoop, Garmin | Hispanic, Black | late Aug |
| Game-Day Energy | — | Male | ~3 weeks before the sports moment |

---

## Caveats

- **Participations, not distinct people.** A person counts once per study; shares
  are robust but absolute head-counts need the cohort de-dup (a standing plan
  dependency). Use the **% shares** as your TODAY values.
- **Ethnicity coverage is only 74%** — Hispanic/Black signals are the noisiest.
- **"60+" is a proxy** (56+); the API buckets at 56–65 / 66+. A true 60+ cut needs
  finer bucketing from Manpreet.
- **Small-N over-indexers:** the biggest `N×` sit on tiny samples — use them to
  choose the theme, then drive volume with momentum + completion.
