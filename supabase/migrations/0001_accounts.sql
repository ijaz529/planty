-- Feature 001: accounts foundation (spec FR-001..FR-008)
-- Profiles, internal staff roles, and the sign-up trigger every later
-- migration builds on.

create extension if not exists moddatetime schema extensions;
create extension if not exists postgis schema extensions;

-- ── enumerated types (all four declared here so later migrations only add tables)

create type public.staff_role as enum ('operator', 'technician');
create type public.org_role as enum ('owner', 'member');
create type public.light_requirement as enum ('low', 'medium', 'bright');
create type public.size_tier as enum ('desk', 'floor', 'statement');

-- ── profiles ─────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text not null unique check (phone ~ '^\+9715\d{8}$'),
  display_name text check (char_length(display_name) <= 80),
  email text check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure extensions.moddatetime (updated_at);

-- Create the profile row when an auth user is created (phone code verified).
-- Migration 0003 replaces this function with one that also converts pending
-- organization invitations.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- auth.users stores phone without the leading '+'; profiles stores E.164.
  insert into public.profiles (id, phone)
  values (
    new.id,
    case when new.phone like '+%' then new.phone else '+' || new.phone end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── staff roles ──────────────────────────────────────────────────────

create table public.staff_roles (
  account_id uuid not null references public.profiles (id) on delete cascade,
  role public.staff_role not null,
  granted_at timestamptz not null default now(),
  primary key (account_id, role)
);

create function public.is_operator()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.staff_roles
    where account_id = auth.uid() and role = 'operator'
  );
$$;

create function public.is_technician()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.staff_roles
    where account_id = auth.uid() and role = 'technician'
  );
$$;

-- Planty must never be left without an administrator.
create function public.guard_last_operator()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'operator'
     and (select count(*) from public.staff_roles where role = 'operator') <= 1
  then
    raise exception 'there must always be at least one operator';
  end if;
  return old;
end;
$$;

create trigger staff_roles_guard_last_operator
  before delete on public.staff_roles
  for each row execute procedure public.guard_last_operator();

-- ── profiles policies ────────────────────────────────────────────────

alter table public.profiles enable row level security;

create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles: operator reads all"
  on public.profiles for select
  to authenticated
  using ((select public.is_operator()));

create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Phone is immutable for the account holder: column privileges, not a policy.
revoke update on public.profiles from authenticated;
grant update (display_name, email) on public.profiles to authenticated;

-- ── staff_roles policies ─────────────────────────────────────────────

alter table public.staff_roles enable row level security;

create policy "staff_roles: read own"
  on public.staff_roles for select
  to authenticated
  using (account_id = (select auth.uid()));

create policy "staff_roles: operator reads all"
  on public.staff_roles for select
  to authenticated
  using ((select public.is_operator()));

create policy "staff_roles: operator grants"
  on public.staff_roles for insert
  to authenticated
  with check ((select public.is_operator()));

create policy "staff_roles: operator revokes"
  on public.staff_roles for delete
  to authenticated
  using ((select public.is_operator()));
