-- Replace callable SECURITY DEFINER presence RPCs with ordinary table access
-- constrained by RLS and column privileges. Other members can read only the
-- ID of a currently visible member; the heartbeat timestamp stays private.

drop function if exists public.ahed_set_presence_preference(boolean);
drop function if exists public.ahed_online_member_ids();
drop function if exists public.ahed_leave_presence();
drop function if exists public.ahed_touch_presence(boolean);

create or replace function public.ahed_presence_server_timestamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.heartbeat_at = now();
  return new;
end;
$$;

drop trigger if exists presence_sessions_server_timestamp on public.presence_sessions;
create trigger presence_sessions_server_timestamp
before insert or update on public.presence_sessions
for each row execute function public.ahed_presence_server_timestamp();

drop policy if exists "presence session owner select" on public.presence_sessions;
drop policy if exists "active presence visible to members" on public.presence_sessions;
create policy "active presence visible to members"
on public.presence_sessions for select to authenticated
using (
  visible = true
  and heartbeat_at > now() - interval '110 seconds'
  and exists (
    select 1
    from public.discovery_profiles as discovery
    where discovery.user_id = presence_sessions.user_id
      and discovery.is_visible = true
      and discovery.show_online = true
      and discovery.moderation_status = 'approved'
  )
);

drop policy if exists "presence session owner insert" on public.presence_sessions;
create policy "presence session owner insert"
on public.presence_sessions for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "presence session owner update" on public.presence_sessions;
create policy "presence session owner update"
on public.presence_sessions for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "presence session owner delete" on public.presence_sessions;
create policy "presence session owner delete"
on public.presence_sessions for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.presence_sessions from anon, authenticated;
grant select (user_id) on public.presence_sessions to authenticated;
grant insert (user_id, visible) on public.presence_sessions to authenticated;
grant update (user_id, visible) on public.presence_sessions to authenticated;
grant delete on public.presence_sessions to authenticated;

grant update (user_id, show_online, show_last_seen)
  on public.presence_settings to authenticated;
