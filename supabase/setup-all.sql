-- BARA — setup complet (idempotent)
-- À exécuter dans Supabase → SQL Editor → New query → Run
-- Projet attendu : celui de VITE_SUPABASE_URL (.env)

create extension if not exists "uuid-ossp";

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  title text not null,
  type text not null check (type in ('revision', 'exam', 'homework')),
  deadline date not null,
  estimated_hours int not null default 1 check (estimated_hours >= 0),
  difficulty int not null default 3 check (difficulty between 1 and 5),
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  created_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null references public.tasks (id) on delete cascade,
  date date not null default (timezone('utc', now()))::date,
  duration_minutes int not null default 0 check (duration_minutes >= 0),
  completed boolean not null default true
);

create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null references public.tasks (id) on delete cascade,
  planned_date date not null,
  duration_minutes int not null default 25 check (duration_minutes > 0),
  priority_score double precision not null default 0
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_subjects_user on public.subjects (user_id);
create index if not exists idx_tasks_user on public.tasks (user_id);
create index if not exists idx_tasks_deadline on public.tasks (user_id, deadline);
create index if not exists idx_sessions_user on public.study_sessions (user_id);
create index if not exists idx_plans_user_date on public.study_plans (user_id, planned_date);
create index if not exists idx_profiles_user on public.profiles (user_id);

alter table public.subjects enable row level security;
alter table public.tasks enable row level security;
alter table public.study_sessions enable row level security;
alter table public.study_plans enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "subjects_own" on public.subjects;
create policy "subjects_own" on public.subjects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "tasks_own" on public.tasks;
create policy "tasks_own" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "sessions_own" on public.study_sessions;
create policy "sessions_own" on public.study_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "plans_own" on public.study_plans;
create policy "plans_own" on public.study_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.tasks replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tasks'
  ) then
    alter publication supabase_realtime add table public.tasks;
  end if;
end $$;
