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

| Dimension | TODAY (share) | Q3 TARGET (net-new) | GAP / PRIORITY |
|---|---|---|---|
| WHOOP | 8.8% | +20 *(bridge)* | Clone Gratitude / 30-Min Reset / Dry Week (recovery-discipline themes pull Whoop) |
| Apple Watch | 2.2% | **+50** | **High** — steps/movement challenges (over-index 5–7×) |
| Fitbit | 1.1% | **+25** | **High** — steps + yoga |
| Garmin *(4th wearable)* | 0.8% | **+20** | Endurance/discipline streaks (yoga, Wim Hof, Gratitude) |
| Oura | 87.1% | maintain | Sufficient — low priority |
| Gender (male) | 29.4% | **+175** | ⚡ Energy-drink + sports only; wellness won't move it |
| Age (60+) | ~11.6%* | **+50** | Gentle nature / nutrition / reading |
| Ethnicity (Hispanic) | 10.3% | **+60** | Gratitude, Dry Week, Cold Shower, Power Nap |
| Ethnicity (Black) | 4.5% | **+45** | 30-Min Reset, 14 Day Yoga, Box Breathing, Power Nap (small base, 74% coverage — directional) |
| *(Income — out)* | — | — | >$100k is ~57% of known income (affluent-skewed); not a priority dimension |

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
paid weighted to male, with wearable / ethnicity / 60+ top-ups (per §8).

| Month | Study | Fills | Spend (paid) |
|---|---|---|---|
| **July** | The Daily Steps Streak | Apple Watch + Fitbit + Garmin | Organic + **~$550** (wearable targeting) |
| | The Celsius Effect *(scale)* | **Male** | **~$500** (male) |
| **August** | The Box Breathing Effect *(relaunch)* | Hispanic + Black | Organic + **~$200** (distribution) |
| | The Nature Dose *(relaunch)* | 60+ + Apple Watch | Organic + **~$300** (60+ & Apple) |
| **September** | The Gratitude Effect *(relaunch)* | Hispanic/Black + Whoop/Garmin | Organic + **~$200** (distribution) |
| | Game-Day Energy | **Male** | **~$500** (male) |

Budget: **~$2,250/quarter** ($750/month) split per §8 — male ~$1,000 · wearables ~$650 ·
ethnicity ~$400 · 60+ ~$200 · Whoop $0. Organic carries the rest ("organic carries the
targets, paid is a top-up"). Per-study spend is **proposed** — confirm with Pankaj.

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

## 7. New study concepts (idea bank — net-new, not repeats)

Beyond the six-study rotation (§4), these are **all-new** concepts (no relaunches) for the
cohorts we're short on. Each rides a proven theme→cohort pattern (§3) and the playbook's
winning mold: 7-day, one concrete daily action, sensory feedback, low friction.

**Shared spec defaults** (apply to every card below): Status `Proposed` · **Owner** Katie ·
**Review** Mackenzie (protocol) · **QA** Nisha (one pass) · **Entry** target gap open, slot
free under the cap, protocol reviewed, first-run checked · **Exit** target hit, or no new
joins in 2 months, or the gap closes. Per-study specifics follow.

### Mainstream wearables — Apple Watch · Fitbit · Garmin

**▸ The Zone-2 Week** ⭐ *(also hits Whoop/recovery)*
- *Daily action:* keep heart rate in "zone 2" for 20 minutes.
- *Primary goal (one factor):* recruit net-new Apple Watch / Fitbit / Garmin users.
- *Target metric:* PENDING — net-new mainstream-wearable participants.
- *Budget:* organic + wearable-targeted paid top-up (Matt).
- *Why it wins:* every mainstream tracker shows HR zones, so it speaks directly to device owners — and the HR/recovery framing crosses into the Whoop crowd.

**▸ The After-Dinner Walk**
- *Daily action:* a 10-minute walk after your largest meal.
- *Primary goal (one factor):* recruit net-new step-tracker users (Apple Watch / Fitbit / Garmin).
- *Target metric:* PENDING — net-new mainstream-wearable participants.
- *Budget:* organic.
- *Why it wins:* movement + a visible glucose/digestion payoff; gentle, so it should retain well.

**▸ The Movement Snack**
- *Daily action:* three 2-minute movement bursts a day.
- *Primary goal (one factor):* recruit net-new step-tracker users.
- *Target metric:* PENDING — net-new mainstream-wearable participants.
- *Budget:* organic.
- *Why it wins:* the lowest-friction movement format; novel, beginner-friendly framing.

### Male — energy · strength · recovery

**▸ The Creatine Effect** ⭐ *(sponsor-friendly)*
- *Daily action:* daily creatine + tracking.
- *Primary goal (one factor):* recruit net-new male participants.
- *Target metric:* PENDING — net-new male.
- *Budget:* **paid**, male-targeted — and a supplement brand could sponsor it.
- *Why it wins:* the strength-supplement crowd skews male; doubles as a sponsored-study lead.

**▸ The Cold Plunge Challenge**
- *Daily action:* a daily cold plunge / cold immersion.
- *Primary goal (one factor):* recruit net-new male participants.
- *Target metric:* PENDING — net-new male.
- *Budget:* paid, male-targeted.
- *Why it wins:* an intense, performance-framed cousin of Cold Shower; plunge culture skews male/biohacker + recovery. *(Expect Wim-Hof-like retention — pulls the cohort, leaks a bit more.)*

**▸ The Protein Challenge** *(sponsor-friendly)*
- *Daily action:* hit a daily protein target.
- *Primary goal (one factor):* recruit net-new male participants.
- *Target metric:* PENDING — net-new male.
- *Budget:* paid, male-targeted; a protein brand could sponsor.
- *Why it wins:* strength/nutrition framing pulls men; concrete and measurable.

### Age 60+ — gentle · restorative · longevity

**▸ The Balance Challenge** ⭐
- *Daily action:* a daily balance practice (e.g., 60 seconds on one leg).
- *Primary goal (one factor):* recruit net-new participants aged 60+.
- *Target metric:* PENDING — net-new 60+.
- *Budget:* organic + 55+-targeted top-up.
- *Why it wins:* balance / fall-prevention is squarely a 60+ concern, novel, and measurable — something older adults actually want to work on.

**▸ The Joint Mobility Week**
- *Daily action:* one gentle mobility / stretch flow a day.
- *Primary goal (one factor):* recruit net-new 60+.
- *Target metric:* PENDING — net-new 60+.
- *Budget:* organic.
- *Why it wins:* no skill barrier, restorative; matches the gentle formats 60+ already over-index on.

**▸ The Fiber Effect** *(sponsor-friendly)*
- *Daily action:* hit a daily fiber target.
- *Primary goal (one factor):* recruit net-new 60+.
- *Target metric:* PENDING — net-new 60+.
- *Budget:* organic; a gut-health / nutrition brand could sponsor.
- *Why it wins:* gut-health resonates with older adults; nutrition theme (Seasonal Superfoods pulled 60+ at 90% completion).

### Hispanic & Black — short · low-friction · high-retention

**▸ The Physiological Sigh** ⭐
- *Daily action:* two daily rounds of the double-inhale / long-exhale breath.
- *Primary goal (one factor):* recruit net-new participants from under-represented ethnicities (Hispanic + Black).
- *Target metric:* PENDING — net-new Hispanic + Black.
- *Budget:* organic + culturally-relevant distribution / partners.
- *Why it wins:* distinct from Box Breathing / 4-7-8 and riding real buzz; breathwork over-indexes both groups and retains well.

**▸ The Screen Curfew**
- *Daily action:* no screens for 30 minutes before bed.
- *Primary goal (one factor):* recruit net-new Hispanic + Black participants.
- *Target metric:* PENDING — net-new Hispanic + Black.
- *Budget:* organic + culturally-relevant distribution.
- *Why it wins:* sleep-hygiene, zero-cost, low-friction — the accessible profile that over-indexes here.

**▸ The 5-Minute Reset**
- *Daily action:* one 5-minute midday calm break.
- *Primary goal (one factor):* recruit net-new Hispanic + Black participants.
- *Target metric:* PENDING — net-new Hispanic + Black.
- *Budget:* organic + culturally-relevant distribution.
- *Why it wins:* even lower-friction than the 30-Minute Reset; the shorter the ask, the better these cohorts convert.

### Whoop bridge — recovery

**▸ The HRV Week** ⭐
- *Daily action:* a daily recovery practice, tracked by HRV.
- *Primary goal (one factor):* recruit net-new Whoop users.
- *Target metric:* PENDING — net-new Whoop.
- *Budget:* organic + Whoop-targeted top-up.
- *Why it wins:* Whoop users concentrate in clinical recovery studies — an HRV/recovery-framed public study is the bridge that pulls them into public challenges.

---

**Sponsor crossover:** Creatine, Protein, and Fiber (and any Magnesium-type) studies could
each attract a supplement sponsor — net-new public challenges that double as sponsored-study
leads. Worth flagging to Pankaj.

**Distribution note (ethnicity):** the *format* earns the over-index; *reaching* those
participants is a distribution job (culturally-relevant channels and partners), not the study
content itself.

---

## 8. Cohort priority, ad budget & Q3 targets

**Guiding principle:** *ad ROI is highest where organic can't reach the cohort.* Spend paid
dollars on gaps with no free alternative; let organic carry the gaps where a proven format
already over-indexes.

**Budget basis:** ~**$750/month** (confirmed cadence) ≈ **$2,250 for Q3**, ads on select
studies only, allocation tied to each study's target demographic. **Cost anchor (real):**
Meta CPC **$0.29** · CPM **$8.71** · CTR **3.0%** · blended cost-per-onboard **$5.02**;
**targeted-audience CAC planned at ~$10–15/participant** (2–3× blended, for narrow audiences
— validate against live cost-per-result once campaigns run).

### Priority — target first → last

| Tier | Cohort | Today | Organic reach? | Why this priority |
|---|---|---|---|---|
| **1 — first** | Mainstream wearables (Apple Watch · Fitbit · Garmin) | 0.8–2.2% | ✅ strong (5–8× on steps) | Highest-leverage win — one steps study closes all three. Organic-led + precise paid. |
| **1 — first** | Male | 29% | ❌ no (wellness flat ~30%) | Highest-ROI paid target — energy/sports is the only lever and it needs paid. |
| **2 — second** | Black | 4.5% | ◐ modest (1.5–2×, retains) | Most severe ethnicity gap; organic breathwork/stress + distribution. |
| **2 — second** | 60+ | ~11.6% | ◐ modest (gentle formats) | Slow-burn; organic gentle/nature formats, opportunistic paid. |
| **3 — third** | Hispanic | 10.3% | ✅ formats over-index | Organic-led + culturally-relevant distribution. |
| **Hold** | Whoop | 8.8% | ✗ barely (clinical-bound) | Bridge experiment (HRV Week) only — **$0 ad spend.** |

### Ad budget allocation (~$2,250 / quarter)

| Cohort | Ad spend | % | ROI rationale |
|---|---|---|---|
| **Male** | **~$1,000** | 44% | Only gap paid *uniquely* unlocks. Split Celsius + Game-Day/Creatine. |
| **Mainstream wearables** | **~$650** | 29% | Precise device/interest targeting (Matt) — efficient; accelerates the organic steps study. |
| **Black + Hispanic** | **~$400** | 18% | Culturally-relevant distribution top-up to amplify the organic breathwork/stress studies. |
| **60+** | **~$200** | 9% | Top-up only if Nature Dose / Balance stalls; otherwise organic carries it. |
| **Whoop** | **$0** | 0% | No public ROI. |

### Q3 net-new targets per cohort

Net-new participants to recruit into public studies this quarter. **Stretch targets — validate
after month 1** against actual cost-per-result and run rates.

| Cohort | Today | Q3 target (net-new) | ≈ via paid | ≈ via organic |
|---|---|---|---|---|
| **Apple Watch** | 113 | **+50** | ~30 | ~20 |
| **Fitbit** | 56 | **+25** | ~17 | ~8 |
| **Garmin** | 42 | **+20** | ~13 | ~7 |
| **Male** | 1,568 | **+175** | ~65 | ~110 |
| **Black** | 196 | **+45** | ~20 | ~25 |
| **Hispanic** | 446 | **+60** | ~13 | ~47 |
| **Age 60+** | 618 | **+50** | ~17 | ~33 |
| **Whoop** *(bridge)* | 449 | **+20** | 0 | ~20 |

~$2,250 buys roughly **175–250 paid-acquired participants** (at $9–13 effective CAC); organic
carries the rest. Targets overlap (one person can be male *and* Apple Watch *and* Hispanic), so
they don't sum to total headcount.

**The one-liner:** paid chases male (+ precise wearable targeting); organic carries 60+ and
ethnicity — consistent with "organic carries the targets, paid is a top-up."

> Spend figures are **proposed** — confirm the $750/month read and the split with Pankaj before
> committing (your plan's "two decisions to settle").

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
