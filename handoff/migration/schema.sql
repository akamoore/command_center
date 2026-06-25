-- ============================================================================
-- Command Center — database schema for the participant/lead/wearable data
-- ============================================================================
-- This replaces the flat CSV "databases" that currently live in `data/*.csv`.
-- Standard PostgreSQL DDL — works as-is on Supabase, RDS, Neon, or local Postgres.
--
-- Run once against the NEW database:
--     psql "$DATABASE_URL" -f handoff/migration/schema.sql
-- (Supabase: paste into the SQL editor, or `supabase db push` with this as a migration.)
--
-- Then load data with: node handoff/migration/import-data.mjs   (see that file).
--
-- SOURCE FILES (NOT shipped in this package — they contain real names/emails):
--   data/master-participants.csv   -> participants
--   data/all-submissions.csv       -> submissions
--   data/meta-leads.csv            -> leads
--   data/oura-database.csv     \
--   data/whoop-database.csv     }  -> wearable_roster   (one row per person+device)
--   data/fitbit-database.csv    /     device column distinguishes the source file
--   data/apple-watch-database.csv /
-- ============================================================================

-- ---------------------------------------------------------------------------
-- participants  (from master-participants.csv — the master roster, ~4,800 rows)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participants (
  email                    TEXT PRIMARY KEY,           -- natural key; lowercased on import
  name                     TEXT,
  user_id                  TEXT,
  gender                   TEXT,
  active                   BOOLEAN,
  compliance_experiment    TEXT,
  last_study_interacted    TEXT,
  last_completed_date      DATE,
  last_withdrawal_date     DATE,
  reason                   TEXT,
  last_withdrawn_study_name TEXT,
  imported_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- submissions  (from all-submissions.csv — study sign-up submissions, ~2,900 rows)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  external_id   TEXT,            -- the "ID" column from the CSV
  wearable      TEXT,
  study         TEXT,
  name          TEXT,
  email         TEXT,
  gender        TEXT,
  location      TEXT,            -- city/region — keep coarse; do not store street/ZIP
  eligible      TEXT,
  answers       TEXT,            -- free-text answers blob; switch to JSONB if you parse it
  submitted_at  DATE,            -- the "Date" column
  imported_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS submissions_email_idx ON submissions (email);
CREATE INDEX IF NOT EXISTS submissions_study_idx ON submissions (study);

-- ---------------------------------------------------------------------------
-- leads  (from meta-leads.csv — paid-acquisition leads, ~290 rows)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  email        TEXT PRIMARY KEY,
  full_name    TEXT,
  imported_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- wearable_roster  (unifies the four *-database.csv files into one table)
--   oura-database.csv         -> device = 'oura'        (has name + gender)
--   whoop-database.csv        -> device = 'whoop'       (email only)
--   fitbit-database.csv       -> device = 'fitbit'      (email only)
--   apple-watch-database.csv  -> device = 'apple_watch' (email only)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wearable_roster (
  email        TEXT NOT NULL,
  device       TEXT NOT NULL,    -- oura | whoop | fitbit | apple_watch
  name         TEXT,
  gender       TEXT,
  imported_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (email, device)
);
CREATE INDEX IF NOT EXISTS wearable_roster_device_idx ON wearable_roster (device);

-- ============================================================================
-- PRIVACY NOTE (Supabase / any hosted Postgres)
-- These tables hold real participant names + emails. If the API that serves the
-- dashboard runs with the anon/publishable key, ENABLE ROW LEVEL SECURITY and
-- grant access only to your service role — never expose these tables to the
-- browser directly. The dashboards should read AGGREGATES via your API, not
-- raw rows. (See Reputable's privacy rules in CLAUDE.md §11.)
--
--   ALTER TABLE participants    ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE submissions     ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE leads           ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE wearable_roster ENABLE ROW LEVEL SECURITY;
-- (No policies = no access except the service role. Add policies as needed.)
-- ============================================================================
