-- ═══════════════════════════════════════════════════════════════════════════
-- NExUS — Migration 002: Fix Persistence
-- Run this in Supabase SQL Editor if users are losing data on page reload.
-- Safe to run even if Migration 001 was already applied.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Re-create the new-user trigger (idempotent) ──────────────────────────
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

-- ── Ensure all RLS policies exist (drop+recreate safely) ─────────────────
alter table public.profiles          enable row level security;
alter table public.brands            enable row level security;
alter table public.tasks             enable row level security;
alter table public.calendar_events   enable row level security;
alter table public.smart_schedules   enable row level security;
alter table public.library_files     enable row level security;
alter table public.groups            enable row level security;
alter table public.goals             enable row level security;
alter table public.analytics_entries enable row level security;

-- profiles
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- brands
drop policy if exists "brands_all" on public.brands;
create policy "brands_all" on public.brands for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- tasks
drop policy if exists "tasks_all" on public.tasks;
create policy "tasks_all" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- calendar_events
drop policy if exists "events_all" on public.calendar_events;
create policy "events_all" on public.calendar_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- smart_schedules
drop policy if exists "schedules_all" on public.smart_schedules;
create policy "schedules_all" on public.smart_schedules for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- library_files
drop policy if exists "files_all" on public.library_files;
create policy "files_all" on public.library_files for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- groups
drop policy if exists "groups_all" on public.groups;
create policy "groups_all" on public.groups for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- goals
drop policy if exists "goals_all" on public.goals;
create policy "goals_all" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- analytics_entries
drop policy if exists "analytics_all" on public.analytics_entries;
create policy "analytics_all" on public.analytics_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Backfill: create profile rows for any users who don't have one yet ────
insert into public.profiles (id, name, email)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'name', ''),
  coalesce(u.email, '')
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);
