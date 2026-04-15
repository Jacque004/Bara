-- Realtime sur `tasks` : filtres côté client (user_id=eq....) nécessitent replica identity FULL
alter table public.tasks replica identity full;

-- Ajouter la table à la publication Realtime (idempotent)
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
