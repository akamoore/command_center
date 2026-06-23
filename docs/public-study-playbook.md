# Public Study Playbook

A data-driven guide for designing the next batch of **free public challenges**,
based on what's actually retaining participants and pulling joins. Use it when
planning new community studies.

**Data basis:** completion rates from the **May 15, 2026 participant export**;
recent-join momentum from the live `/api/recruiting` feed (30-day window). Format
retention is fairly stable, so these patterns hold up well — re-rank with the live
health score once it's exposed (see `ops-api-requests.md` #8).

---

## The winning formula

The challenges that both **retain participants** (high completion %) and **keep
pulling joins** share one profile:

- **7 days.** Short beats long — 14-day and "Extended" versions retain worse.
- **One simple, concrete daily action.** "Take a cold shower," "count one breath
  cycle," "get morning light," "drink a glass of water," "read one page."
- **Sensory or visible feedback.** The participant can feel or see that they did it.
- **Recovery / Stress / Sleep themes.** These convert best.
- **Beginner-friendly, low friction.** No skill barrier, no restriction that's hard
  to sustain.

> **Active beats passive · simple beats effortful · short beats long.**

---

## What's working (keep / clone these)

| Challenge | Completion | Recent joins (30d) | Theme |
|---|---|---|---|
| Seasonal Superfoods | 85% | 4 | Recovery |
| The Cold Shower Effect | 80% | 11 | Recovery |
| The Box Breathing Effect | 75% | — | Stress |
| The Nature Dose | 72% | 24 | Stress |
| The Sunrise Effect | 65% | 17 | Sleep |
| The Hydration Effect | 63% | 14 | Recovery |
| The Reading Ritual | 59% | 25 | Sleep |
| The Dry Week Effect | 59% | 12 | Sleep |
| The Gratitude Effect | 58% | 11 | Sleep |

- **Highest-confidence winners** (high completion *and* high volume): Nature Dose,
  Reading Ritual, Sunrise Effect, Hydration Effect.
- **Promising but smaller sample:** Cold Shower, Seasonal Superfoods, Box Breathing.

---

## What's lagging (don't relaunch without a reason)

| Challenge | Completion | Why |
|---|---|---|
| Caffeine Effect | 18% | Passive / observational — nothing to *do* |
| Caffeine Effect (W) | 21% | Same, and a near-duplicate |
| The Fasting Reset | 46% | Effortful / restrictive |
| 7 Day Wim Hof | 45% | Skill-heavy |
| 7 Day Yoga | 45% | Skill-heavy |

Avoid passive-tracking and effortful/skill-heavy formats unless a sponsor
specifically requests one.

---

## Recommended next challenges

All built in the proven mold — 7-day, single action, sensory, Recovery/Stress/Sleep:

| Theme (proven winner) | New ideas |
|---|---|
| Breathwork (Box Breathing, 75%) | The Physiological Sigh · Morning Breath Reset |
| Cold / contrast (Cold Shower, 80%) | The Contrast Shower Week · Cold Plunge Challenge |
| Light & nature (Nature Dose 72%, Sunrise 65%) | The Daily Sunlight Walk · The Green Hour |
| Hydration & nutrition (Hydration 63%, Seasonal Superfoods 85%) | The Electrolyte Week · Protein-First Mornings · The Fiber Effect |
| Sleep hygiene (Sunrise, Reading) | The Screen Curfew · The Cool-Room Effect · Consistent Bedtime |
| Micro-movement (10K Steps, 53%) | The After-Dinner Walk · The Hourly Stand |

---

## Design checklist for a new public challenge

- [ ] 7-day duration
- [ ] One concrete daily action (state it in a single sentence)
- [ ] A sensory or measurable "did it" signal
- [ ] Recovery, Stress, or Sleep theme
- [ ] No skill barrier or hard-to-sustain restriction
- [ ] Distinct from existing challenges (no near-duplicates)
- [ ] Name lines up with the on-screen title for clean API matching
