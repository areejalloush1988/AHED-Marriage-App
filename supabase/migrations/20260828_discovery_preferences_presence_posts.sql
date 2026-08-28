-- AHED discovery, preferences, privacy-aware presence, marriage posts and boosts.
-- All user-owned data is protected with RLS. Public discovery only exposes
-- fields users explicitly place in the sanitized discovery table.

create table if not exists public.profile_attributes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  height_cm smallint check (height_cm between 130 and 220),
  children_status text not null default 'none'
    check (children_status in ('none', 'has_children', 'prefer_not_to_say')),
  wants_children text not null default 'open'
    check (wants_children in ('yes', 'no', 'open')),
  smoking text not null default 'never'
    check (smoking in ('never', 'occasionally', 'yes')),
  relocation text not null default 'open'
    check (relocation in ('not_possible', 'same_country', 'gulf', 'open')),
  religious_commitment text not null default 'balanced'
    check (religious_commitment in ('balanced', 'committed', 'very_committed')),
  personality_traits text[] not null default '{}',
  languages text[] not null default '{}',
  family_values text[] not null default '{}',
  hobbies text[] not null default '{}',
  lifestyle_note text check (lifestyle_note is null or char_length(lifestyle_note) <= 300),
  updated_at timestamptz not null default now()
);

comment on table public.profile_attributes is
  'Private extended attributes for an AHED member. Only the owner can access this row.';

create table if not exists public.partner_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  age_min smallint not null default 24 check (age_min between 18 and 80),
  age_max smallint not null default 38 check (age_max between 18 and 80),
  countries text[] not null default '{}',
  marital_statuses text[] not null default '{}',
  education_levels text[] not null default '{}',
  height_min smallint check (height_min between 130 and 220),
  height_max smallint check (height_max between 130 and 220),
  children_preferences text[] not null default '{}',
  smoking_preferences text[] not null default '{never}',
  relocation_preferences text[] not null default '{}',
  religious_commitment_levels text[] not null default '{}',
  languages text[] not null default '{}',
  family_values text[] not null default '{}',
  required_fields text[] not null default '{}',
  allow_near_matches boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint partner_preference_age_range check (age_min <= age_max),
  constraint partner_preference_height_range check (
    height_min is null or height_max is null or height_min <= height_max
  )
);

comment on table public.partner_preferences is
  'Private desired-partner criteria. Only the owner can access this row.';

create table if not exists public.discovery_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  gender text not null check (gender in ('woman', 'man')),
  age smallint not null check (age between 18 and 80),
  country text not null check (char_length(country) between 2 and 80),
  city text check (city is null or char_length(city) between 2 and 80),
  marital_status text not null check (marital_status in ('single', 'divorced', 'widowed')),
  education text check (education is null or education in ('secondary', 'diploma', 'bachelor', 'postgraduate')),
  occupation text check (occupation is null or char_length(occupation) <= 120),
  height_cm smallint check (height_cm between 130 and 220),
  children_status text not null default 'none'
    check (children_status in ('none', 'has_children', 'prefer_not_to_say')),
  wants_children text not null default 'open'
    check (wants_children in ('yes', 'no', 'open')),
  smoking text not null default 'never'
    check (smoking in ('never', 'occasionally', 'yes')),
  relocation text not null default 'open'
    check (relocation in ('not_possible', 'same_country', 'gulf', 'open')),
  religious_commitment text not null default 'balanced'
    check (religious_commitment in ('balanced', 'committed', 'very_committed')),
  languages text[] not null default '{}',
  family_values text[] not null default '{}',
  bio text check (bio is null or char_length(bio) between 20 and 400),
  is_visible boolean not null default false,
  show_online boolean not null default true,
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected', 'suspended')),
  verification_status text not null default 'not_started'
    check (verification_status in ('not_started', 'pending', 'verified', 'rejected')),
  moderation_note text,
  boost_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.discovery_profiles is
  'Sanitized, user-approved fields used in authenticated discovery. Private profile rows are never exposed.';

create table if not exists public.presence_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  show_online boolean not null default true,
  show_last_seen boolean not null default false,
  updated_at timestamptz not null default now()
);

comment on table public.presence_settings is
  'Owner-only privacy choices for short-lived online presence.';

create table if not exists public.presence_sessions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  visible boolean not null default true,
  heartbeat_at timestamptz not null default now()
);

comment on table public.presence_sessions is
  'Short-lived AHED presence heartbeat. Exact timestamps are never exposed to other members.';

create table if not exists public.marriage_posts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  headline text not null check (char_length(btrim(headline)) between 8 and 90),
  body text not null check (char_length(btrim(body)) between 30 and 700),
  partner_summary text not null check (char_length(btrim(partner_summary)) between 15 and 300),
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected', 'expired')),
  moderation_note text,
  boost_until timestamptz,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.marriage_posts is
  'Moderated marriage-intent posts. Contact information is not allowed and pending posts are owner-only.';

create table if not exists public.visibility_boosts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  placement text not null check (placement in ('search', 'post')),
  duration_days smallint not null check (duration_days in (1, 3, 7)),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'expired', 'cancelled')),
  starts_at timestamptz,
  ends_at timestamptz,
  payment_reference text,
  created_at timestamptz not null default now(),
  constraint visibility_boost_dates check (
    starts_at is null or ends_at is null or starts_at < ends_at
  )
);

comment on table public.visibility_boosts is
  'User boost requests. Only trusted backend/admin flows may activate a request after payment.';

create index if not exists discovery_profiles_search_idx
  on public.discovery_profiles (moderation_status, is_visible, country, age);
create index if not exists discovery_profiles_boost_idx
  on public.discovery_profiles (boost_until desc)
  where moderation_status = 'approved' and is_visible = true;
create index if not exists marriage_posts_public_idx
  on public.marriage_posts (moderation_status, expires_at desc, boost_until desc);
create index if not exists marriage_posts_user_id_idx
  on public.marriage_posts (user_id);
create index if not exists visibility_boosts_user_id_idx
  on public.visibility_boosts (user_id);
create index if not exists presence_sessions_active_idx
  on public.presence_sessions (heartbeat_at desc)
  where visible = true;

create or replace function public.ahed_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profile_attributes_set_updated_at on public.profile_attributes;
create trigger profile_attributes_set_updated_at
before update on public.profile_attributes
for each row execute function public.ahed_set_updated_at();

drop trigger if exists partner_preferences_set_updated_at on public.partner_preferences;
create trigger partner_preferences_set_updated_at
before update on public.partner_preferences
for each row execute function public.ahed_set_updated_at();

drop trigger if exists discovery_profiles_set_updated_at on public.discovery_profiles;
create trigger discovery_profiles_set_updated_at
before update on public.discovery_profiles
for each row execute function public.ahed_set_updated_at();

drop trigger if exists presence_settings_set_updated_at on public.presence_settings;
create trigger presence_settings_set_updated_at
before update on public.presence_settings
for each row execute function public.ahed_set_updated_at();

drop trigger if exists marriage_posts_set_updated_at on public.marriage_posts;
create trigger marriage_posts_set_updated_at
before update on public.marriage_posts
for each row execute function public.ahed_set_updated_at();

alter table public.profile_attributes enable row level security;
alter table public.partner_preferences enable row level security;
alter table public.discovery_profiles enable row level security;
alter table public.presence_settings enable row level security;
alter table public.presence_sessions enable row level security;
alter table public.marriage_posts enable row level security;
alter table public.visibility_boosts enable row level security;

drop policy if exists "profile attributes owner select" on public.profile_attributes;
create policy "profile attributes owner select"
on public.profile_attributes for select to authenticated
using ((select auth.uid()) = user_id);
drop policy if exists "profile attributes owner insert" on public.profile_attributes;
create policy "profile attributes owner insert"
on public.profile_attributes for insert to authenticated
with check ((select auth.uid()) = user_id);
drop policy if exists "profile attributes owner update" on public.profile_attributes;
create policy "profile attributes owner update"
on public.profile_attributes for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "partner preferences owner select" on public.partner_preferences;
create policy "partner preferences owner select"
on public.partner_preferences for select to authenticated
using ((select auth.uid()) = user_id);
drop policy if exists "partner preferences owner insert" on public.partner_preferences;
create policy "partner preferences owner insert"
on public.partner_preferences for insert to authenticated
with check ((select auth.uid()) = user_id);
drop policy if exists "partner preferences owner update" on public.partner_preferences;
create policy "partner preferences owner update"
on public.partner_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "approved discovery profiles visible to members" on public.discovery_profiles;
create policy "approved discovery profiles visible to members"
on public.discovery_profiles for select to authenticated
using (
  (is_visible = true and moderation_status = 'approved')
  or (select auth.uid()) = user_id
);
drop policy if exists "discovery profile owner insert" on public.discovery_profiles;
create policy "discovery profile owner insert"
on public.discovery_profiles for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and moderation_status = 'pending'
  and verification_status = 'not_started'
  and boost_until is null
);
drop policy if exists "pending discovery profile owner update" on public.discovery_profiles;
create policy "pending discovery profile owner update"
on public.discovery_profiles for update to authenticated
using ((select auth.uid()) = user_id and moderation_status = 'pending')
with check ((select auth.uid()) = user_id and moderation_status = 'pending');

drop policy if exists "presence settings owner select" on public.presence_settings;
create policy "presence settings owner select"
on public.presence_settings for select to authenticated
using ((select auth.uid()) = user_id);
drop policy if exists "presence settings owner insert" on public.presence_settings;
create policy "presence settings owner insert"
on public.presence_settings for insert to authenticated
with check ((select auth.uid()) = user_id);
drop policy if exists "presence settings owner update" on public.presence_settings;
create policy "presence settings owner update"
on public.presence_settings for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "presence session owner select" on public.presence_sessions;
create policy "presence session owner select"
on public.presence_sessions for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "approved marriage posts visible to members" on public.marriage_posts;
create policy "approved marriage posts visible to members"
on public.marriage_posts for select to authenticated
using (
  (moderation_status = 'approved' and expires_at > now())
  or (select auth.uid()) = user_id
);
drop policy if exists "marriage post owner insert" on public.marriage_posts;
create policy "marriage post owner insert"
on public.marriage_posts for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and moderation_status = 'pending'
  and boost_until is null
);
drop policy if exists "pending marriage post owner update" on public.marriage_posts;
create policy "pending marriage post owner update"
on public.marriage_posts for update to authenticated
using ((select auth.uid()) = user_id and moderation_status = 'pending')
with check ((select auth.uid()) = user_id and moderation_status = 'pending');

drop policy if exists "visibility boost owner select" on public.visibility_boosts;
create policy "visibility boost owner select"
on public.visibility_boosts for select to authenticated
using ((select auth.uid()) = user_id);
drop policy if exists "visibility boost owner request" on public.visibility_boosts;
create policy "visibility boost owner request"
on public.visibility_boosts for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
  and starts_at is null
  and ends_at is null
  and payment_reference is null
);

-- New Supabase projects no longer expose new tables automatically. Grant only
-- the operations and columns the browser client genuinely needs.
revoke all on public.profile_attributes from anon, authenticated;
grant select, insert, update on public.profile_attributes to authenticated;

revoke all on public.partner_preferences from anon, authenticated;
grant select, insert, update on public.partner_preferences to authenticated;

revoke all on public.discovery_profiles from anon, authenticated;
grant select on public.discovery_profiles to authenticated;
grant insert (
  user_id, display_name, gender, age, country, city, marital_status,
  education, occupation, height_cm, children_status, wants_children,
  smoking, relocation, religious_commitment, languages, family_values,
  bio, is_visible, show_online
) on public.discovery_profiles to authenticated;
grant update (
  display_name, gender, age, country, city, marital_status,
  education, occupation, height_cm, children_status, wants_children,
  smoking, relocation, religious_commitment, languages, family_values,
  bio, is_visible, show_online
) on public.discovery_profiles to authenticated;

revoke all on public.presence_settings from anon, authenticated;
grant select on public.presence_settings to authenticated;
grant insert (user_id, show_online, show_last_seen)
  on public.presence_settings to authenticated;
grant update (show_online, show_last_seen)
  on public.presence_settings to authenticated;

revoke all on public.presence_sessions from anon, authenticated;

revoke all on public.marriage_posts from anon, authenticated;
grant select on public.marriage_posts to authenticated;
grant insert (user_id, headline, body, partner_summary)
  on public.marriage_posts to authenticated;
grant update (headline, body, partner_summary)
  on public.marriage_posts to authenticated;
grant usage, select on sequence public.marriage_posts_id_seq to authenticated;

revoke all on public.visibility_boosts from anon, authenticated;
grant select on public.visibility_boosts to authenticated;
grant insert (user_id, placement, duration_days)
  on public.visibility_boosts to authenticated;
grant usage, select on sequence public.visibility_boosts_id_seq to authenticated;

-- Presence is touched through server-time RPCs, so clients cannot forge a
-- future heartbeat. The public RPC only returns member IDs that are online now;
-- it never exposes the heartbeat timestamp or a last-seen history.
create or replace function public.ahed_touch_presence(p_visible boolean default true)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  privacy_allows_online boolean;
begin
  if current_user_id is null then
    raise exception 'authentication required';
  end if;

  insert into public.presence_settings (user_id)
  values (current_user_id)
  on conflict (user_id) do nothing;

  select show_online into privacy_allows_online
  from public.presence_settings
  where user_id = current_user_id;

  insert into public.presence_sessions (user_id, visible, heartbeat_at)
  values (current_user_id, p_visible and coalesce(privacy_allows_online, true), now())
  on conflict (user_id) do update
  set visible = excluded.visible,
      heartbeat_at = now();
end;
$$;

create or replace function public.ahed_leave_presence()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null then
    delete from public.presence_sessions where user_id = auth.uid();
  end if;
end;
$$;

create or replace function public.ahed_online_member_ids()
returns table (user_id uuid)
language sql
stable
security definer
set search_path = ''
as $$
  select sessions.user_id
  from public.presence_sessions as sessions
  join public.presence_settings as settings using (user_id)
  join public.discovery_profiles as discovery using (user_id)
  where auth.uid() is not null
    and sessions.visible = true
    and sessions.heartbeat_at > now() - interval '110 seconds'
    and settings.show_online = true
    and discovery.show_online = true
    and discovery.is_visible = true
    and discovery.moderation_status = 'approved';
$$;

revoke all on function public.ahed_touch_presence(boolean) from public, anon;
revoke all on function public.ahed_leave_presence() from public, anon;
revoke all on function public.ahed_online_member_ids() from public, anon;
grant execute on function public.ahed_touch_presence(boolean) to authenticated;
grant execute on function public.ahed_leave_presence() to authenticated;
grant execute on function public.ahed_online_member_ids() to authenticated;
