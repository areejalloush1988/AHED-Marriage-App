alter table public.messages
  add column if not exists edited_at timestamptz;

comment on column public.messages.edited_at is
  'Server timestamp of the most recent sender edit. Text messages may be edited for 15 minutes.';

alter table public.messages
  drop constraint if exists messages_edited_at_after_create_check;

alter table public.messages
  add constraint messages_edited_at_after_create_check
  check (edited_at is null or edited_at >= created_at);

grant update (body, edited_at) on public.messages to authenticated;

create or replace function private.ahed_protect_message_receipts()
returns trigger
language plpgsql
set search_path = ''
as $function$
declare
  actor uuid := (select auth.uid());
  deleting_for_everyone boolean :=
    old.deleted_at is null and new.deleted_at is not null;
  editing_text boolean := new.body is distinct from old.body;
  receipt_time timestamptz := clock_timestamp();
begin
  if deleting_for_everyone then
    if actor is distinct from old.sender_id then
      raise exception 'Only the sender can delete a message for everyone';
    end if;

    if new.id <> old.id
       or new.conversation_id <> old.conversation_id
       or new.sender_id <> old.sender_id
       or new.created_at <> old.created_at
       or new.delivered_at is distinct from old.delivered_at
       or new.read_at is distinct from old.read_at
       or new.edited_at is distinct from old.edited_at
       or new.deleted_by is distinct from old.sender_id
       or new.body <> 'تم حذف هذه الرسالة'
       or new.message_type <> 'text'
       or new.attachment_path is not null
       or new.attachment_name is not null
       or new.attachment_mime is not null
       or new.attachment_size_bytes is not null
       or new.audio_duration_seconds is not null then
      raise exception 'Invalid message deletion';
    end if;

    new.deleted_at := receipt_time;
    return new;
  end if;

  if new.deleted_at is distinct from old.deleted_at
     or new.deleted_by is distinct from old.deleted_by then
    raise exception 'Deleted message state cannot be changed';
  end if;

  if editing_text then
    if actor is distinct from old.sender_id then
      raise exception 'Only the sender can edit a message';
    end if;

    if old.deleted_at is not null
       or old.message_type <> 'text'
       or new.message_type <> 'text' then
      raise exception 'Only active text messages can be edited';
    end if;

    if receipt_time > old.created_at + interval '15 minutes' then
      raise exception 'Messages can only be edited within 15 minutes';
    end if;

    if char_length(btrim(new.body)) = 0 or char_length(new.body) > 2000 then
      raise exception 'Message body must contain between 1 and 2000 characters';
    end if;

    if new.id <> old.id
       or new.conversation_id <> old.conversation_id
       or new.sender_id <> old.sender_id
       or new.created_at <> old.created_at
       or new.delivered_at is distinct from old.delivered_at
       or new.read_at is distinct from old.read_at
       or new.attachment_path is distinct from old.attachment_path
       or new.attachment_name is distinct from old.attachment_name
       or new.attachment_mime is distinct from old.attachment_mime
       or new.attachment_size_bytes is distinct from old.attachment_size_bytes
       or new.audio_duration_seconds is distinct from old.audio_duration_seconds
       or new.edited_at is distinct from old.edited_at then
      raise exception 'Invalid message edit';
    end if;

    new.edited_at := receipt_time;
    return new;
  end if;

  if new.edited_at is distinct from old.edited_at then
    raise exception 'Message edit timestamp cannot be changed directly';
  end if;

  if new.id <> old.id
     or new.conversation_id <> old.conversation_id
     or new.sender_id <> old.sender_id
     or new.body <> old.body
     or new.created_at <> old.created_at
     or new.message_type <> old.message_type
     or new.attachment_path is distinct from old.attachment_path
     or new.attachment_name is distinct from old.attachment_name
     or new.attachment_mime is distinct from old.attachment_mime
     or new.attachment_size_bytes is distinct from old.attachment_size_bytes
     or new.audio_duration_seconds is distinct from old.audio_duration_seconds then
    raise exception 'Only delivery and read receipts can be updated';
  end if;

  if actor is null or actor = old.sender_id then
    raise exception 'Only the recipient can update message receipts';
  end if;

  if old.delivered_at is not null
     and new.delivered_at is distinct from old.delivered_at then
    raise exception 'Delivery receipt cannot be changed';
  end if;

  if old.read_at is not null
     and new.read_at is distinct from old.read_at then
    raise exception 'Read receipt cannot be changed';
  end if;

  if old.delivered_at is null and new.delivered_at is not null then
    new.delivered_at := receipt_time;
  end if;

  if old.read_at is null and new.read_at is not null then
    new.read_at := receipt_time;
    if old.delivered_at is null then
      new.delivered_at := receipt_time;
    end if;
  end if;

  return new;
end;
$function$;

comment on function private.ahed_protect_message_receipts() is
  'Protects immutable message fields, sender edits/deletes, and recipient-only receipts.';

revoke all on function private.ahed_protect_message_receipts() from public;

drop policy if exists messages_participant_update on public.messages;

create policy messages_participant_update
on public.messages
for update
to authenticated
using (
  exists (
    select 1
    from public.conversations conversation
    where conversation.id = messages.conversation_id
      and (
        (select auth.uid()) = conversation.participant_a
        or (select auth.uid()) = conversation.participant_b
      )
  )
  and (
    sender_id <> (select auth.uid())
    or (
      sender_id = (select auth.uid())
      and deleted_at is null
    )
  )
)
with check (
  exists (
    select 1
    from public.conversations conversation
    where conversation.id = messages.conversation_id
      and (
        (select auth.uid()) = conversation.participant_a
        or (select auth.uid()) = conversation.participant_b
      )
  )
  and (
    sender_id <> (select auth.uid())
    or (
      sender_id = (select auth.uid())
      and (
        (deleted_at is null and deleted_by is null)
        or (deleted_at is not null and deleted_by = sender_id)
      )
    )
  )
);

drop policy if exists ahed_chat_participants_receive on realtime.messages;
drop policy if exists ahed_chat_participants_send on realtime.messages;

create policy ahed_chat_participants_receive
on realtime.messages
for select
to authenticated
using (
  extension = 'broadcast'
  and exists (
    select 1
    from public.conversations conversation
    where realtime.topic() = 'ahed-chat:' || conversation.id::text
      and conversation.status = 'active'
      and (
        (select auth.uid()) = conversation.participant_a
        or (select auth.uid()) = conversation.participant_b
      )
  )
);

create policy ahed_chat_participants_send
on realtime.messages
for insert
to authenticated
with check (
  extension = 'broadcast'
  and exists (
    select 1
    from public.conversations conversation
    where realtime.topic() = 'ahed-chat:' || conversation.id::text
      and conversation.status = 'active'
      and (
        (select auth.uid()) = conversation.participant_a
        or (select auth.uid()) = conversation.participant_b
      )
  )
);
