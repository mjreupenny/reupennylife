-- =============================================================
-- Reupenny Life Agency — Initial Database Migration
-- =============================================================

-- ── Enable UUID extension ─────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- USERS
-- Everyone who has ever attempted to log in via Google OAuth.
-- Admins are seeded below. New users start as 'pending'.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT        UNIQUE NOT NULL,
  name        TEXT        NOT NULL,
  picture     TEXT,
  role        TEXT        NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  status      TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login  TIMESTAMPTZ
);

-- Seed the two admin accounts as pre-approved
INSERT INTO public.users (email, name, role, status)
VALUES
  ('sfg.miller.reupenny@gmail.com', 'Miller Reupenny', 'admin', 'approved'),
  ('sfg.seta.reupenny@gmail.com',   'Seta Reupenny',   'admin', 'approved')
ON CONFLICT (email) DO NOTHING;

-- =============================================================
-- AGENTS
-- Roster of agents tracked by admin (separate from login users).
-- Mirrors the ManagedAgent type in the frontend.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.agents (
  id          TEXT        PRIMARY KEY,  -- e.g. 'A-001'
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  join_date   DATE        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'Pending' CHECK (status IN ('Active', 'Pending', 'Suspended')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial agent roster
INSERT INTO public.agents (id, name, email, join_date, status)
VALUES
  ('A-001', 'Jordan Mitchell', 'jordan.m@example.com', '2024-11-01', 'Active'),
  ('A-002', 'Priya Kapoor',    'priya.k@example.com',  '2024-12-15', 'Active'),
  ('A-003', 'Marcus Webb',     'marcus.w@example.com', '2025-01-08', 'Pending'),
  ('A-004', 'Tanya Rivers',    'tanya.r@example.com',  '2025-01-22', 'Pending'),
  ('A-005', 'Derek Chase',     'derek.c@example.com',  '2024-10-05', 'Active'),
  ('A-006', 'Simone Ortega',   'simone.o@example.com', '2024-09-14', 'Suspended')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- SALES
-- All sale records. Mirrors the SaleRecord type in the frontend.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.sales (
  id             TEXT        PRIMARY KEY,  -- e.g. 'S-001'
  agent_id       TEXT        NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  apv            NUMERIC     NOT NULL CHECK (apv >= 0),
  status         TEXT        NOT NULL CHECK (status IN ('Submitted', 'Placed')),
  submitted_date DATE        NOT NULL,
  placed_date    DATE,
  comm_rate      NUMERIC     NOT NULL CHECK (comm_rate >= 0 AND comm_rate <= 100),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_agent_id        ON public.sales(agent_id);
CREATE INDEX IF NOT EXISTS idx_sales_submitted_date  ON public.sales(submitted_date);
CREATE INDEX IF NOT EXISTS idx_sales_placed_date     ON public.sales(placed_date);

-- =============================================================
-- ACTIVITY
-- Daily agent activity records. Mirrors ActivityRecord type.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.activity (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id     TEXT        NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  date         DATE        NOT NULL,
  dials        INT         NOT NULL DEFAULT 0,
  contacts     INT         NOT NULL DEFAULT 0,
  booked_appts INT         NOT NULL DEFAULT 0,
  appts_run    INT         NOT NULL DEFAULT 0,
  presentations INT        NOT NULL DEFAULT 0,
  sales        INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (agent_id, date)
);

CREATE INDEX IF NOT EXISTS idx_activity_agent_id ON public.activity(agent_id);
CREATE INDEX IF NOT EXISTS idx_activity_date     ON public.activity(date);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations via the anon key (the app does
-- its own approval gate in application code). Tighten these
-- policies once Supabase Auth is fully integrated.
CREATE POLICY "allow_all_users"    ON public.users    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_agents"   ON public.agents   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_sales"    ON public.sales    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_activity" ON public.activity FOR ALL USING (true) WITH CHECK (true);
