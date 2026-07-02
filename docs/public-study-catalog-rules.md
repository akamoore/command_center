# Public Study Catalog — operating rules

How we size, rotate, and prune the public-study catalog, so keep/kill is a **policy, not
a gut call**. Share with the team. The live signals behind these rules are on the
dashboard's **Interest & join-rate** view (Public Studies tab).

---

## 1. How many studies run at once — **TBD**

- **Today:** ~14–15 live public studies.
- **Direction:** **fewer.** A smaller, rotating set creates **scarcity and newness**; a
  sprawling catalog dilutes attention and makes everything look stale.
- **Exact number is TBD** — set by the **join-rate data**, not guessed. Locked once we've
  watched velocity for a cycle. Interim: lean fewer, retire the clearly-dead ones first.

## 2. Rotation cadence — ~every 3 months

- Roughly **every 3 months**, retire a few and add a few — cycle the catalog.
- **Exception:** a study **clearly performing** (strong, sustained join rate) stays. Don't
  retire a winner on a calendar.

## 3. Keep or kill = **interest** (join rate)

- The **one** signal that retires a study is **interest = joins** (people *starting* it) —
  never completion or compliance.
- **Retire criteria (rigorous):** a study is flagged to retire only when it is **mature *and*
  losing momentum** — it has been on the catalog **≥ 3 months** *and* its monthly joins are
  **continuously declining** (non-increasing across the last **3 completed months**, with a
  real net drop). A brand-new study, or one with a single off month, is **not** flagged.
- The **current (partial) month is excluded** so a mid-month dip can't trigger a retire.
- Completion and compliance do **not** retire a study — only interest (joins) does.
- Both thresholds are tunable in code (`RETIRE_MIN_CATALOG_DAYS`, `RETIRE_DECLINE_MONTHS`).

## 4. Compliance is a **separate, secondary** signal — our problem to fix

Three different things, don't conflate them:

- **Interest** — recent join rate → the keep/kill lever (§3).
- **Completion** — % of joiners who finish the study.
- **Compliance** — % adhering to the protocol (logging / wearing) **during** the study.

**Low compliance never retires a study.** High interest + low compliance means the problem
is **ours to fix** — study design, difficulty, or nudging (onboarding, reminders, protocol
friction) → **redesign, not removal.**

---

**Open item:** lock the §1 live-study number once the join-rate view has a full cycle of
data behind it. Everything else above is agreed.

Owner: Katie · Reviewer: Pankaj
