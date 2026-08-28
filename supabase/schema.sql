-- AHED | عَهْد
-- Initial standalone schema for real registrations and the men's waitlist.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_number bigint generated always as identity unique,
  gender text not null default 'woman'
    constraint profiles_gender_check check (gender in ('woman', 'man')),
  first_name text not null
    constraint profiles_first_name_length check (char_length(first_name) between 2 and 60),
  birth_date date not null
    constraint profiles_adult_only check (birth_date <= (current_date - interval '18 years')::date),
  country text not null
    constraint profiles_country_length check (char_length(country) between 2 and 80),
  city text not null
    constraint profiles_city_length check (char_length(city) between 2 and 80),
  marital_status text not null
    constraint profiles_marital_status_check check (marital_status in ('single', 'divorced', 'widowed')),
  nationality text not null
    constraint profiles_nationality_length check (char_length(nationality) between 2 and 80),
  occupation text not null
    constraint profiles_occupation_length check (char_length(occupation) between 2 and 120),
  education text not null
    constraint profiles_education_check check (education in ('secondary', 'diploma', 'bachelor', 'postgraduate')),
  bio text not null
    constraint profiles_bio_length check (char_length(bio) between 20 and 400),
  preferred_age_from smallint not null
    constraint profiles_preferred_age_from_check check (preferred_age_from between 18 and 80),
  preferred_age_to smallint not null
    constraint profiles_preferred_age_to_check check (preferred_age_to between 18 and 80),
  requested_plan text not null default 'basic'
    constraint profiles_requested_plan_check check (requested_plan in ('basic', 'pro', 'matchmaker')),
  account_status text not null default 'pending_email'
    constraint profiles_account_status_check check (
      account_status in ('pending_email', 'pending_review', 'approved', 'rejected', 'suspended')
    ),
  verification_status text not null default 'not_started'
    constraint profiles_verification_status_check check (
      verification_status in ('not_started', 'pending', 'verified', 'rejected')
    ),
  payment_status text not null default 'unpaid'
    constraint profiles_payment_status_check check (payment_status in ('unpaid', 'paid', 'refunded')),
  terms_accepted_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_preferred_age_range_check check (preferred_age_from <= preferred_age_to)
);

create table if not exists public.men_waitlist (
  id bigint generated always as identity primary key,
  first_name text not null
    constraint men_waitlist_first_name_length check (char_length(first_name) between 2 and 60),
  country text not null
    constraint men_waitlist_country_length check (char_length(country) between 2 and 80),
  email text not null
    constraint men_waitlist_email_format check (
      email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    ),
  status text not null default 'waiting'
    constraint men_waitlist_status_check check (status in ('waiting', 'invited', 'registered', 'removed')),
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists men_waitlist_email_unique_idx
  on public.men_waitlist (lower(email));
create index if not exists men_waitlist_status_created_idx
  on public.men_waitlist (status, created_at desc);
create index if not exists profiles_status_country_created_idx
  on public.profiles (account_status, country, created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create or replace function private.handle_new_ahed_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  selected_plan text := coalesce(new.raw_user_meta_data ->> 'requested_plan', 'basic');
begin
  if coalesce((metadata ->> 'terms_accepted')::boolean, false) is not true then
    raise exception 'Terms must be accepted';
  end if;

  if selected_plan not in ('basic', 'pro', 'matchmaker') then
    selected_plan := 'basic';
  end if;

  insert into public.profiles (
    user_id,
    gender,
    first_name,
    birth_date,
    country,
    city,
    marital_status,
    nationality,
    occupation,
    education,
    bio,
    preferred_age_from,
    preferred_age_to,
    requested_plan,
    account_status,
    terms_accepted_at
  ) values (
    new.id,
    'woman',
    trim(metadata ->> 'first_name'),
    (metadata ->> 'birth_date')::date,
    trim(metadata ->> 'country'),
    trim(metadata ->> 'city'),
    metadata ->> 'marital_status',
    trim(metadata ->> 'nationality'),
    trim(metadata ->> 'occupation'),
    metadata ->> 'education',
    trim(metadata ->> 'bio'),
    (metadata ->> 'preferred_age_from')::smallint,
    (metadata ->> 'preferred_age_to')::smallint,
    selected_plan,
    case when new.email_confirmed_at is null then 'pending_email' else 'pending_review' end,
    now()
  );

  return new;
end;
$$;

revoke execute on function private.handle_new_ahed_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_ahed on auth.users;
create trigger on_auth_user_created_ahed
after insert on auth.users
for each row execute function private.handle_new_ahed_user();

create or replace function private.mark_ahed_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    update public.profiles
      set account_status = 'pending_review'
      where user_id = new.id and account_status = 'pending_email';
  end if;
  return new;
end;
$$;

revoke execute on function private.mark_ahed_email_confirmed() from public, anon, authenticated;

drop trigger if exists on_auth_user_email_confirmed_ahed on auth.users;
create trigger on_auth_user_email_confirmed_ahed
after update of email_confirmed_at on auth.users
for each row execute function private.mark_ahed_email_confirmed();

alter table public.profiles enable row level security;
alter table public.men_waitlist enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists men_waitlist_insert_only on public.men_waitlist;
create policy men_waitlist_insert_only
on public.men_waitlist for insert
to anon, authenticated
with check (status = 'waiting' and terms_accepted_at is not null);

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.men_waitlist from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (
  first_name,
  birth_date,
  country,
  city,
  marital_status,
  nationality,
  occupation,
  education,
  bio,
  preferred_age_from,
  preferred_age_to
) on table public.profiles to authenticated;

grant insert (first_name, country, email)
on table public.men_waitlist to anon, authenticated;
grant usage, select on sequence public.men_waitlist_id_seq to anon, authenticated;


create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_a uuid not null references auth.users(id) on delete cascade,
  participant_b uuid not null references auth.users(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active'
    constraint conversations_status_check check (status in ('active', 'blocked', 'closed')),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_distinct_participants_check
    check (participant_a <> participant_b),
  constraint conversations_creator_is_participant_check
    check (created_by in (participant_a, participant_b))
);

create unique index if not exists conversations_active_pair_unique_idx
  on public.conversations (
    least(participant_a, participant_b),
    greatest(participant_a, participant_b)
  )
  where status = 'active';
create index if not exists conversations_participant_a_recent_idx
  on public.conversations (participant_a, last_message_at desc);
create index if not exists conversations_participant_b_recent_idx
  on public.conversations (participant_b, last_message_at desc);
create index if not exists conversations_created_by_idx
  on public.conversations (created_by);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null
    constraint messages_body_length_check check (char_length(btrim(body)) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at desc);
create index if not exists messages_unread_idx
  on public.messages (conversation_id, sender_id, created_at)
  where read_at is null;
create index if not exists messages_sender_id_idx
  on public.messages (sender_id);

create or replace function private.touch_ahed_conversation_after_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations
  set
    last_message_at = greatest(last_message_at, new.created_at),
    updated_at = now()
  where id = new.conversation_id;

  return new;
end;
$$;

revoke execute on function private.touch_ahed_conversation_after_message()
from public, anon, authenticated;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
after insert on public.messages
for each row execute function private.touch_ahed_conversation_after_message();

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists conversations_select_participant on public.conversations;
create policy conversations_select_participant
on public.conversations for select
to authenticated
using (
  (select auth.uid()) = participant_a
  or (select auth.uid()) = participant_b
);

drop policy if exists conversations_insert_participant on public.conversations;
create policy conversations_insert_participant
on public.conversations for insert
to authenticated
with check (
  (select auth.uid()) = created_by
  and (
    (select auth.uid()) = participant_a
    or (select auth.uid()) = participant_b
  )
);

drop policy if exists messages_select_participant on public.messages;
create policy messages_select_participant
on public.messages for select
to authenticated
using (
  exists (
    select 1
    from public.conversations as conversation
    where conversation.id = messages.conversation_id
      and (
        (select auth.uid()) = conversation.participant_a
        or (select auth.uid()) = conversation.participant_b
      )
  )
);

drop policy if exists messages_insert_participant on public.messages;
create policy messages_insert_participant
on public.messages for insert
to authenticated
with check (
  (select auth.uid()) = sender_id
  and exists (
    select 1
    from public.conversations as conversation
    where conversation.id = messages.conversation_id
      and conversation.status = 'active'
      and (
        (select auth.uid()) = conversation.participant_a
        or (select auth.uid()) = conversation.participant_b
      )
  )
);

drop policy if exists messages_mark_received_as_read on public.messages;
create policy messages_mark_received_as_read
on public.messages for update
to authenticated
using (
  sender_id <> (select auth.uid())
  and exists (
    select 1
    from public.conversations as conversation
    where conversation.id = messages.conversation_id
      and (
        (select auth.uid()) = conversation.participant_a
        or (select auth.uid()) = conversation.participant_b
      )
  )
)
with check (
  sender_id <> (select auth.uid())
  and exists (
    select 1
    from public.conversations as conversation
    where conversation.id = messages.conversation_id
      and (
        (select auth.uid()) = conversation.participant_a
        or (select auth.uid()) = conversation.participant_b
      )
  )
);

revoke all on table public.conversations from anon, authenticated;
revoke all on table public.messages from anon, authenticated;
grant select, insert on table public.conversations to authenticated;
grant select, insert on table public.messages to authenticated;
grant update (read_at) on table public.messages to authenticated;
grant usage, select on sequence public.messages_id_seq to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;

comment on table public.profiles is
  'Private AHED marriage profiles. Users can only read and edit their own row.';
comment on table public.men_waitlist is
  'Write-only public waitlist for men until registration opens.';
