-- Run this in your Supabase SQL editor to create the annual_plans table

CREATE TABLE IF NOT EXISTS annual_plans (
  id                       BIGSERIAL PRIMARY KEY,
  user_id                  UUID NOT NULL,
  year                     INTEGER NOT NULL,
  hubannoo_uummuu_target   INTEGER NOT NULL DEFAULT 0,
  horannaa_misensaa_target INTEGER NOT NULL DEFAULT 0,
  buusi_jirataa_target     INTEGER NOT NULL DEFAULT 0,
  buusi_daldalaa_target    INTEGER NOT NULL DEFAULT 0,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One plan per user per year — enforces the lock
  UNIQUE (user_id, year)
);

-- Disable update and delete so the plan stays locked
-- (Row Level Security approach)
ALTER TABLE annual_plans ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to INSERT their own plan
CREATE POLICY "insert_own_plan" ON annual_plans
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to SELECT their own plan
CREATE POLICY "select_own_plan" ON annual_plans
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- NO update/delete policies = plan is permanently locked after insert
