-- ═══════════════════════════════════════════════════════════════════════════
-- NExUS — Initial Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════════

-- ── PROFILES ────────────────────────────────────────────────────────────────
-- Extends auth.users. Created automatically via trigger on signup.
create table if not exists public.profiles (
  id                   uuid references auth.users(id) on delete cascade primary key,
  name                 text not null default '',
  email                text not null default '',
  current_brand_id     uuid,
  onboarding_complete  boolean not null default false,
  remember_last_brand  boolean not null default false,
  has_seen_brand_intro boolean not null default false,
  mi_dia_state         jsonb not null default '{"energyLevel":null,"mainPriority":null,"focusedTasks":[]}',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ── BRANDS ──────────────────────────────────────────────────────────────────
create table if not exists public.brands (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users(id) on delete cascade not null,
  name               text not null default '',
  logo               text not null default '🏢',
  description        text not null default '',
  industry           text not null default '',
  website            text not null default '',
  social_media_links jsonb not null default '{}',
  visual_identity    jsonb not null default '{}',
  strategic_info     jsonb not null default '{}',
  personality        jsonb not null default '{}',
  knowledge_base     jsonb not null default '[]',
  important_links    jsonb not null default '[]',
  created_at         timestamptz not null default now()
);

-- ── TASKS ───────────────────────────────────────────────────────────────────
create table if not exists public.tasks (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  brand_id       uuid references public.brands(id) on delete cascade not null,
  title          text not null default '',
  description    text,
  priority       text not null default 'medium',
  status         text not null default 'pending',
  due_date       text,
  scheduled_time text,
  energy_level   text,
  tags           text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── CALENDAR EVENTS ─────────────────────────────────────────────────────────
create table if not exists public.calendar_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  brand_id   uuid references public.brands(id) on delete cascade not null,
  title      text not null default '',
  start_time text not null default '',
  end_time   text not null default '',
  date       text not null default '',
  type       text not null default 'scheduled',
  task_ids   text[] not null default '{}',
  color      text,
  created_at timestamptz not null default now()
);

-- ── SMART SCHEDULES ─────────────────────────────────────────────────────────
create table if not exists public.smart_schedules (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null,
  brand_id         uuid references public.brands(id) on delete cascade not null,
  date             text not null,
  day_start_time   text not null default '08:00',
  main_goal        text not null default '',
  energy_level     text not null default 'happy',
  will_record      boolean not null default false,
  mandatory_tasks  text[] not null default '{}',
  generated_blocks jsonb not null default '[]',
  created_at       timestamptz not null default now(),
  unique(brand_id, date)
);

-- ── LIBRARY FILES ───────────────────────────────────────────────────────────
create table if not exists public.library_files (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  brand_id    uuid references public.brands(id) on delete cascade not null,
  name        text not null default '',
  description text,
  type        text not null default 'url',
  url         text,
  file_path   text,
  file_size   bigint,
  mime_type   text,
  thumbnail   text,
  tags        text[] not null default '{}',
  favorite    boolean not null default false,
  priority    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── GROUPS ──────────────────────────────────────────────────────────────────
create table if not exists public.groups (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  brand_id    uuid references public.brands(id) on delete cascade not null,
  name        text not null default '',
  type        text not null default 'custom',
  week_number integer,
  days        jsonb not null default '[]',
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── GOALS ───────────────────────────────────────────────────────────────────
create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  brand_id    uuid references public.brands(id) on delete cascade not null,
  title       text not null default '',
  description text,
  category    text not null default 'other',
  priority    text not null default 'medium',
  status      text not null default 'active',
  target_date text,
  progress    integer not null default 0,
  milestones  jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── ANALYTICS ENTRIES ───────────────────────────────────────────────────────
create table if not exists public.analytics_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  brand_id     uuid references public.brands(id) on delete cascade not null,
  title        text not null default '',
  platform     text not null default 'instagram',
  content_type text not null default 'video',
  file_url     text,
  file_path    text,
  metrics      jsonb not null default '{}',
  ai_score     integer,
  ai_insights  text[],
  captured_at  text not null default '',
  created_at   timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles          enable row level security;
alter table public.brands            enable row level security;
alter table public.tasks             enable row level security;
alter table public.calendar_events   enable row level security;
alter table public.smart_schedules   enable row level security;
alter table public.library_files     enable row level security;
alter table public.groups            enable row level security;
alter table public.goals             enable row level security;
alter table public.analytics_entries enable row level security;

-- profiles: own row only
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- all other tables: user_id = auth.uid()
create policy "brands_all"    on public.brands            for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_all"     on public.tasks             for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "events_all"    on public.calendar_events   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "schedules_all" on public.smart_schedules   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "files_all"     on public.library_files     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "groups_all"    on public.groups            for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_all"     on public.goals             for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "analytics_all" on public.analytics_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGER: auto-create profile on signup
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- Run these separately if the SQL Editor doesn't support storage commands,
-- or create them manually in Storage → New Bucket.
-- ═══════════════════════════════════════════════════════════════════════════

-- insert into storage.buckets (id, name, public) values ('library-files',    'library-files',    false);
-- insert into storage.buckets (id, name, public) values ('analytics-media',  'analytics-media',  false);

-- Storage RLS (run after creating buckets):
-- create policy "library_files_owner" on storage.objects for all using (auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "analytics_media_owner" on storage.objects for all using (auth.uid()::text = (storage.foldername(name))[1]);
