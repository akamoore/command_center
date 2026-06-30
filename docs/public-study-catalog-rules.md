# Public Study Catalog — operating rules

Written-down rules for how the public-study catalog is sized, rotated, and pruned,
so keep/kill decisions follow a policy rather than a gut call (per Pankaj). Pairs
with the dashboard's join-rate view (once built) and the `public-study-q3-plan.md`.

**Status:** working draft. The live-study target number is **set by the data once the
7-/30-day join-rate view exists** — not guessed. Numbers below the join-rate view
depends on are flagged pending the data-integrity fixes (see `ops-api-requests.md`).

---

## 1. How many studies are live at once

- **Today:** ~14–15 live public studies.
- **Direction:** **fewer.** A smaller catalog creates scarcity and a sense of newness;
  a sprawling one dilutes attention and makes everything look stale.
- **Candidate targets discussed:** 3 · 5 · 10. **Don't lock a number yet** — let the
  join-rate data set it once the velocity view is live. Interim guidance: lean toward
  fewer, retire the clearly-dead ones first.

## 2. Rotation cadence

- **Recycle the catalog roughly every 3 months:** add a few new studies, retire a few,
  cycle them through.
- **Exception:** a study that's clearly *hot* (strong, sustained join rate) stays — don't
  retire a winner on a calendar.

## 3. Keep-or-kill metric — **interest**

The single signal for whether a study stays or goes is **recent join rate** — *people
starting the study, not finishing it.*

- Measured on a **7-day and 30-day** window (plus last-join date).
- **Collapse → retire:** if interest dries up (e.g. ~1 join over a week or two), pull it.
- **Current reads (pending the count fix):**
  - **Monster** — retire candidate (no one joining).
  - **Celsius, Ghost** — keepers (still pulling joins).

## 4. Compliance is **secondary** — it's *our* problem, not a kill trigger

- **Completion ≠ compliance ≠ interest.** Define each explicitly on the dashboard:
  - **Interest** — recent join rate (the keep/kill lever).
  - **Completion** — % of joiners who finish the study.
  - **Compliance** — % adhering to the protocol (logging / wearing) *during* the study.
- **High interest + low compliance does NOT retire a study.** It flags a **study-design
  or nudging problem for us to fix** (onboarding, reminders, protocol friction).
- So compliance is the lever that **flags a study for redesign**, never the lever that
  **retires** it. Only interest retires.

---

## Decision log / open items

- **Lock the live-study target** (3 / 5 / 10 / other) once the join-rate view exists — data sets it.
- **Define & wire compliance as a real %** across all studies, and confirm it is *excluded*
  from the retire decision and *included* only as a redesign flag.
- Confirm the join-rate window definitions and last-join-date source with Manpreet.

Owner: Katie · Reviewer: Pankaj · Working draft — numbers confirmed before commit.
