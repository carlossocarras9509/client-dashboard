-- Client Dashboard: username + actor-aware audit upgrade
-- Run this entire file once in Supabase > SQL Editor.
-- Safe to run after the previous activity upgrade.

alter table public.profiles add column if not exists username text;
alter table public.activity_logs add column if not exists actor_id uuid references auth.users(id) on delete set null;

-- Generate readable, unique usernames for accounts that already exist.
do $$
declare
  r record;
  base_name text;
  candidate text;
  suffix integer;
begin
  for r in
    select p.id, coalesce(p.email, u.email, '') as email
    from public.profiles p
    left join auth.users u on u.id = p.id
    where p.username is null or btrim(p.username) = ''
    order by p.created_at, p.id
  loop
    base_name := lower(regexp_replace(split_part(r.email, '@', 1), '[^a-zA-Z0-9._-]', '', 'g'));
    if length(base_name) < 3 then
      base_name := 'user-' || substring(replace(r.id::text, '-', '') from 1 for 8);
    end if;
    base_name := left(base_name, 30);
    candidate := base_name;
    suffix := 1;

    while exists(select 1 from public.profiles where lower(username) = lower(candidate) and id <> r.id) loop
      suffix := suffix + 1;
      candidate := left(base_name, greatest(3, 30 - length(suffix::text) - 1)) || '-' || suffix::text;
    end loop;

    update public.profiles set username = candidate, updated_at = now() where id = r.id;
  end loop;
end $$;

update public.profiles set username = lower(username) where username is not null;

alter table public.profiles alter column username set not null;

drop index if exists public.profiles_username_unique_idx;
create unique index profiles_username_unique_idx on public.profiles (lower(username));

alter table public.profiles drop constraint if exists profiles_username_format_check;
alter table public.profiles add constraint profiles_username_format_check
  check (username ~ '^[a-z0-9._-]{3,30}$');

-- Existing self-generated activity receives the user as actor when possible.
update public.activity_logs
set actor_id = user_id
where actor_id is null
  and action in ('account_created','email_confirmed','signed_in','signed_out','profile_updated','password_changed','password_reset_completed');

-- New accounts receive a profile with a unique username from signup metadata.
-- If metadata is absent, the email prefix is used as the default.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_username text;
begin
  requested_username := lower(regexp_replace(
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(coalesce(new.email, ''), '@', 1)),
    '[^a-zA-Z0-9._-]', '', 'g'
  ));

  if length(requested_username) < 3 or length(requested_username) > 30 then
    raise exception 'invalid_username';
  end if;

  insert into public.profiles (id, email, username, full_name, role)
  values (
    new.id,
    new.email,
    requested_username,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'client'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case
      when public.profiles.full_name is null or public.profiles.full_name = '' then excluded.full_name
      else public.profiles.full_name
    end,
    username = case
      when public.profiles.username is null or public.profiles.username = '' then excluded.username
      else public.profiles.username
    end,
    updated_at = now();

  if tg_op = 'INSERT' then
    insert into public.activity_logs (user_id, actor_id, action, details)
    values (new.id, new.id, 'account_created', 'Account registered');
  end if;

  return new;
exception
  when unique_violation then
    raise exception 'username_taken';
end;
$$;

create or replace function public.log_email_confirmation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    insert into public.activity_logs (user_id, actor_id, action, details)
    values (new.id, new.id, 'email_confirmed', 'Email address confirmed');
  end if;
  return new;
end;
$$;

-- Recreate policies so administrators can write audit events for users they manage.
drop policy if exists "Admins can insert activity" on public.activity_logs;
create policy "Admins can insert activity"
on public.activity_logs
for insert
to authenticated
with check (public.is_admin());

grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.activity_logs to authenticated;
grant usage, select on sequence public.activity_logs_id_seq to authenticated;
