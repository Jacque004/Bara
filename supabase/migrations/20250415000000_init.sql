-- BARA — schéma initial + RLS
-- Exécuter dans Supabase SQL Editor ou via CLI

create extension if not exists "uuid-ossp";

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  created_at timestamptz not null default now()
);

create table public.tasks (
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

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null references public.tasks (id) on delete cascade,
  date date not null default (timezone('utc', now()))::date,
  duration_minutes int not null default 0 check (duration_minutes >= 0),
  completed boolean not null default true
);

create table public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null references public.tasks (id) on delete cascade,
  planned_date date not null,
  duration_minutes int not null default 25 check (duration_minutes > 0),
  priority_score double precision not null default 0
);

create index idx_subjects_user on public.subjects (user_id);
create index idx_tasks_user on public.tasks (user_id);
create index idx_tasks_deadline on public.tasks (user_id, deadline);
create index idx_sessions_user on public.study_sessions (user_id);
create index idx_plans_user_date on public.study_plans (user_id, planned_date);

alter table public.subjects enable row level security;
alter table public.tasks enable row level security;
alter table public.study_sessions enable row level security;
alter table public.study_plans enable row level security;

create policy "subjects_own" on public.subjects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tasks_own" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sessions_own" on public.study_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "plans_own" on public.study_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
