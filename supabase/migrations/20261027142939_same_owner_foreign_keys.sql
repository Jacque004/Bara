-- Une tâche, une session ou un créneau doit appartenir au même compte
-- que la matière ou la tâche qu'il référence.

do $$
begin
  if exists (
    select 1
    from public.tasks t
    join public.subjects s on s.id = t.subject_id
    where t.user_id is distinct from s.user_id
  ) then
    raise exception 'Des tâches pointent vers la matière d''un autre compte';
  end if;

  if exists (
    select 1
    from public.study_sessions ss
    join public.tasks t on t.id = ss.task_id
    where ss.user_id is distinct from t.user_id
  ) then
    raise exception 'Des sessions pointent vers la tâche d''un autre compte';
  end if;

  if exists (
    select 1
    from public.study_plans sp
    join public.tasks t on t.id = sp.task_id
    where sp.user_id is distinct from t.user_id
  ) then
    raise exception 'Des créneaux pointent vers la tâche d''un autre compte';
  end if;
end $$;

alter table public.subjects
  add constraint subjects_id_user_key unique (id, user_id);

alter table public.tasks
  add constraint tasks_id_user_key unique (id, user_id);

alter table public.tasks
  drop constraint tasks_subject_id_fkey;

alter table public.tasks
  add constraint tasks_subject_same_owner_fkey
  foreign key (subject_id, user_id)
  references public.subjects (id, user_id)
  on delete cascade;

alter table public.study_sessions
  drop constraint study_sessions_task_id_fkey;

alter table public.study_sessions
  add constraint study_sessions_task_same_owner_fkey
  foreign key (task_id, user_id)
  references public.tasks (id, user_id)
  on delete cascade;

alter table public.study_plans
  drop constraint study_plans_task_id_fkey;

alter table public.study_plans
  add constraint study_plans_task_same_owner_fkey
  foreign key (task_id, user_id)
  references public.tasks (id, user_id)
  on delete cascade;

create index idx_tasks_subject_user on public.tasks (subject_id, user_id);
create index idx_sessions_task_user on public.study_sessions (task_id, user_id);
create index idx_plans_task_user on public.study_plans (task_id, user_id);
