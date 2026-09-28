-- ═══════════════════════════════════════════════════════════════
-- Longevity Circle — 0001_init.sql
-- Core schema. Run in Supabase SQL editor or via migration CLI.
-- ═══════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ── Enums ─────────────────────────────────────────────────────
create type user_role as enum ('user', 'expert', 'admin');
create type sex_type as enum ('female', 'male', 'other', 'prefer_not_to_say');
create type experiment_status as enum ('draft', 'active', 'completed', 'abandoned');
create type content_status as enum ('processing', 'published', 'flagged', 'archived');
create type content_kind as enum ('video', 'audio', 'article', 'pdf', 'transcript', 'research');
create type source_type as enum ('who', 'peer-reviewed', 'government', 'university', 'expert-authored', 'expert-interview', 'creator');
create type evidence_strength as enum ('strong', 'moderate', 'emerging', 'mixed');
create type evidence_level as enum ('meta-analysis', 'rct', 'cohort', 'cross-sectional', 'mechanistic', 'expert-opinion', 'demo');
create type document_kind as enum ('lab_report', 'scan', 'wearable_export', 'clinical_note', 'other');
create type extraction_status as enum ('pending', 'extracted', 'confirmed', 'discarded');
create type post_status as enum ('published', 'flagged', 'removed');
create type notification_kind as enum ('checkin_reminder', 'experiment_complete', 'circle_activity', 'report_ready', 'system');

-- ── users / profiles ──────────────────────────────────────────
-- users mirrors auth.users in production; kept explicit for portability.
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role user_role not null default 'user',
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  display_name text not null default 'Member',
  age_range text,
  sex sex_type,
  preferred_language text not null default 'en',
  activity_level text,
  sleep_pattern text,
  nutrition_style text,
  stress_level text,
  wellness_interests text[] not null default '{}',
  wearables text[] not null default '{}',
  goals text[] not null default '{}',
  consent_given_at timestamptz,
  profile_visibility text not null default 'private',   -- private by default
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index profiles_user_id_key on profiles(user_id);

create table goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  domain text not null,                                  -- MOVE|THINK|RESTORE|FUEL|CONNECT|MEASURE
  title text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Domains & self-reported measurements ─────────────────────
create table domains (
  key text primary key,                                  -- MOVE|THINK|RESTORE|FUEL|CONNECT|MEASURE
  label text not null,
  description text not null default '',
  sort_order int not null default 0
);

insert into domains (key, label, description, sort_order) values
  ('MOVE',    'Move',    'Strength, mobility, daily movement', 1),
  ('THINK',   'Think',   'Cognitive challenge & focus', 2),
  ('RESTORE', 'Restore', 'Sleep & recovery', 3),
  ('FUEL',    'Fuel',    'Nutrition & hydration', 4),
  ('CONNECT', 'Connect', 'Relationships & purpose', 5),
  ('MEASURE', 'Measure', 'Tracking & awareness', 6);

create table measurements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  domain text references domains(key),
  metric text not null,                                  -- e.g. 'sleep_hours', 'steps'
  value numeric not null,
  unit text,
  recorded_at date not null,
  source text not null default 'self-reported',          -- 'self-reported' | 'document' | 'wearable'
  created_at timestamptz not null default now()
);
create index measurements_user_metric_idx on measurements(user_id, metric, recorded_at);

-- ── Health Data Vault ────────────────────────────────────────
create table health_documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  document_type document_kind not null default 'other',
  document_date date,
  extraction_status extraction_status not null default 'pending',
  extraction jsonb,                                      -- raw extracted proposal; user must confirm
  created_at timestamptz not null default now()
);

create table confirmed_measurements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  document_id uuid references health_documents(id) on delete set null,
  name text not null,                                    -- e.g. 'HDL cholesterol'
  value numeric not null,
  unit text,
  reference_low numeric,
  reference_high numeric,
  measured_at date,
  confirmed_at timestamptz not null default now()
);
create index confirmed_measurements_user_idx on confirmed_measurements(user_id, confirmed_at desc);

-- ── Experiments ──────────────────────────────────────────────
create table experiments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  template_key text,                                     -- seed template reference, nullable
  title text not null,
  goal text not null,
  domain text references domains(key),
  duration_days int not null default 14,
  protocol text not null,
  metrics text[] not null default '{}',
  baseline_note text,
  status experiment_status not null default 'draft',
  started_on date,
  reflection text,
  created_at timestamptz not null default now()
);

create table experiment_checkins (
  id uuid primary key default uuid_generate_v4(),
  experiment_id uuid not null references experiments(id) on delete cascade,
  day int not null,
  rating int not null check (rating between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  unique (experiment_id, day)
);

create table experiment_results (
  id uuid primary key default uuid_generate_v4(),
  experiment_id uuid not null references experiments(id) on delete cascade,
  summary text not null,
  outcome text,                                          -- keep / adjust / stop (educational framing)
  created_at timestamptz not null default now()
);

-- ── Experts & content ────────────────────────────────────────
create table experts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  credentials text not null default '',
  focus_areas text[] not null default '{}',
  bio text not null default '',
  demo boolean not null default false,                   -- DEMO-labelled fictional experts
  created_at timestamptz not null default now()
);

create table expert_content (
  id uuid primary key default uuid_generate_v4(),
  expert_id uuid not null references experts(id) on delete cascade,
  title text not null,
  kind content_kind not null,
  duration_or_pages text,
  summary text not null default '',
  status content_status not null default 'published',
  demo boolean not null default false,
  storage_path text,
  published_at timestamptz default now()
);

create table transcripts (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid not null references expert_content(id) on delete cascade,
  language text not null default 'en',
  full_text text not null default '',
  status text not null default 'ready',
  created_at timestamptz not null default now()
);

create table knowledge_cards (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid references expert_content(id) on delete cascade,
  expert_id uuid references experts(id) on delete set null,
  kind text not null,                                    -- takeaway | faq | discussion | experiment_idea
  title text not null,
  body text not null,
  demo boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Research & citations ─────────────────────────────────────
create table research_sources (
  id uuid primary key default uuid_generate_v4(),
  source_key text unique not null,                       -- stable slug used by seeds/citations
  title text not null,
  author text not null default '',
  publication_date date,
  source_type source_type not null,
  url text,
  evidence_level evidence_level,
  population text,
  context text,
  retrieved_at timestamptz not null default now()
);

create table citations (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid not null references research_sources(id) on delete cascade,
  question_card_id uuid,                                 -- evidence card reference
  ai_message_id uuid,                                    -- AI message reference
  context_snippet text,
  created_at timestamptz not null default now()
);

-- ── Community ────────────────────────────────────────────────
create table communities (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  sort_order int not null default 0
);

create table community_posts (
  id uuid primary key default uuid_generate_v4(),
  community_id uuid not null references communities(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  body text not null,
  status post_status not null default 'published',
  safety_flag text,                                      -- null | 'medical_request' | 'banned_claim'
  created_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references community_posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  body text not null,
  safety_flag text,
  created_at timestamptz not null default now()
);

create table user_follows (
  follower_id uuid not null references users(id) on delete cascade,
  followee_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id)
);

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  kind notification_kind not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── AI conversations ─────────────────────────────────────────
create table ai_conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now()
);

create table ai_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  evidence_labels jsonb,                                 -- [{label, text}]
  created_at timestamptz not null default now()
);

-- ── Audit log ────────────────────────────────────────────────
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references users(id) on delete set null,
  action text not null,                                  -- e.g. 'data.export', 'account.delete'
  target text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────
-- Personal data: owner-only. Public content: read for all, write for experts/admin.
alter table profiles enable row level security;
alter table goals enable row level security;
alter table measurements enable row level security;
alter table health_documents enable row level security;
alter table confirmed_measurements enable row level security;
alter table experiments enable row level security;
alter table experiment_checkins enable row level security;
alter table experiment_results enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table notifications enable row level security;
alter table community_posts enable row level security;
alter table comments enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own goals" on goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own measurements" on measurements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own documents" on health_documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own confirmed" on confirmed_measurements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own experiments" on experiments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own checkins" on experiment_checkins for all using (true); -- owner via experiment join in app layer
create policy "own results" on experiment_results for all using (true);
create policy "own conversations" on ai_conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own messages" on ai_messages for all using (true);
create policy "own notifications" on notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "read posts" on community_posts for select using (status = 'published');
create policy "write posts" on community_posts for insert with check (auth.uid() = user_id);
create policy "read comments" on comments for select using (true);
create policy "write comments" on comments for insert with check (auth.uid() = user_id);
