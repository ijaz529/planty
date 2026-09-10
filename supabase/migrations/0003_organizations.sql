-- Feature 001 US3: business accounts (spec FR-009..FR-013)
-- Organizations, membership, and invitations that survive not having an
-- account yet. Offices are Planty's primary customer (constitution II), so
-- shared access has to exist before anything is sold to a business.

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  billing_email text not null check (billing_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_updated_at
  before update on public.organizations
  for each row execute procedure extensions.moddatetime (updated_at);

create table public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  account_id uuid not null references public.profiles (id) on delete cascade,
  role public.org_role not null,
  joined_at timestamptz not null default now(),
  primary key (organization_id, account_id)
);

create index organization_members_account on public.organization_members (account_id);

create table public.organization_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  phone text not null check (phone ~ '^\+9715\d{8}$'),
  role public.org_role not null default 'member',
  invited_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  unique (organization_id, phone)
);

create index organization_invites_phone on public.organization_invites (phone);

-- ── membership helper ────────────────────────────────────────────────
-- security definer, so a policy on organization_members can call it without
-- recursing into its own policy (research R2).

create function public.org_role(target_organization_id uuid)
returns public.org_role
language sql
security definer
set search_path = ''
stable
as $$
  select role from public.organization_members
  where organization_id = target_organization_id
    and account_id = auth.uid();
$$;

-- ── an organization always has an owner ──────────────────────────────

create function public.guard_last_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owners_left integer;
begin
  if old.role <> 'owner' then
    return old;
  end if;

  select count(*) into owners_left
  from public.organization_members
  where organization_id = old.organization_id
    and role = 'owner'
    and account_id <> old.account_id;

  if owners_left = 0 then
    raise exception 'an organization must always have at least one owner';
  end if;

  return old;
end;
$$;

create trigger organization_members_guard_last_owner
  before delete on public.organization_members
  for each row execute procedure public.guard_last_owner();

-- A demotion is the same loss as a removal, so it is guarded too.
create function public.guard_owner_demotion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owners_left integer;
begin
  if old.role = 'owner' and new.role <> 'owner' then
    select count(*) into owners_left
    from public.organization_members
    where organization_id = old.organization_id
      and role = 'owner'
      and account_id <> old.account_id;

    if owners_left = 0 then
      raise exception 'an organization must always have at least one owner';
    end if;
  end if;
  return new;
end;
$$;

create trigger organization_members_guard_demotion
  before update on public.organization_members
  for each row execute procedure public.guard_owner_demotion();

-- ── creating an organization ─────────────────────────────────────────
-- The organization and its first owner must not be able to exist separately,
-- so both writes happen in one authorised function.

create function public.create_organization(
  org_name text,
  org_billing_email text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
  caller uuid := auth.uid();
begin
  if caller is null then
    raise exception 'you must be signed in to create an organization';
  end if;

  insert into public.organizations (name, billing_email)
  values (org_name, org_billing_email)
  returning id into new_id;

  insert into public.organization_members (organization_id, account_id, role)
  values (new_id, caller, 'owner');

  return new_id;
end;
$$;

-- ── invitations honoured on first sign-in ────────────────────────────
-- Replaces the 0001 version: the same trigger now also converts any pending
-- invitation for this number, inside the sign-up transaction (research R8).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  e164 text;
begin
  -- auth.users stores phone without the leading '+'; profiles stores E.164.
  e164 := case when new.phone like '+%' then new.phone else '+' || new.phone end;

  insert into public.profiles (id, phone) values (new.id, e164);

  insert into public.organization_members (organization_id, account_id, role)
  select i.organization_id, new.id, i.role
  from public.organization_invites i
  where i.phone = e164
  on conflict (organization_id, account_id) do nothing;

  delete from public.organization_invites where phone = e164;

  return new;
end;
$$;

-- An owner invites by phone number, whether or not that person has an account.
create function public.invite_to_organization(
  target_organization_id uuid,
  invite_phone text,
  invite_role public.org_role default 'member'
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_account uuid;
begin
  if public.org_role(target_organization_id) <> 'owner'
     and not public.is_operator()
  then
    raise exception 'only an owner can invite people to this organization';
  end if;

  select id into existing_account
  from public.profiles where phone = invite_phone;

  if existing_account is not null then
    insert into public.organization_members (organization_id, account_id, role)
    values (target_organization_id, existing_account, invite_role)
    on conflict (organization_id, account_id) do update set role = excluded.role;
  else
    insert into public.organization_invites (organization_id, phone, role, invited_by)
    values (target_organization_id, invite_phone, invite_role, auth.uid())
    on conflict (organization_id, phone) do update set role = excluded.role;
  end if;
end;
$$;

-- ── organizations policies ───────────────────────────────────────────

alter table public.organizations enable row level security;

create policy "organizations: member reads"
  on public.organizations for select
  to authenticated
  using (public.org_role(id) is not null or (select public.is_operator()));

create policy "organizations: owner updates"
  on public.organizations for update
  to authenticated
  using (public.org_role(id) = 'owner' or (select public.is_operator()))
  with check (public.org_role(id) = 'owner' or (select public.is_operator()));

create policy "organizations: owner deletes"
  on public.organizations for delete
  to authenticated
  using (public.org_role(id) = 'owner' or (select public.is_operator()));

-- Insert is intentionally absent: use create_organization(), which also
-- creates the owner membership.

-- ── organization_members policies ────────────────────────────────────

alter table public.organization_members enable row level security;

create policy "members: read own organizations"
  on public.organization_members for select
  to authenticated
  using (
    account_id = (select auth.uid())
    or public.org_role(organization_id) is not null
    or (select public.is_operator())
  );

create policy "members: owner adds"
  on public.organization_members for insert
  to authenticated
  with check (
    public.org_role(organization_id) = 'owner' or (select public.is_operator())
  );

create policy "members: owner changes role"
  on public.organization_members for update
  to authenticated
  using (
    public.org_role(organization_id) = 'owner' or (select public.is_operator())
  )
  with check (
    public.org_role(organization_id) = 'owner' or (select public.is_operator())
  );

create policy "members: owner removes or member leaves"
  on public.organization_members for delete
  to authenticated
  using (
    account_id = (select auth.uid())
    or public.org_role(organization_id) = 'owner'
    or (select public.is_operator())
  );

-- ── organization_invites policies ────────────────────────────────────

alter table public.organization_invites enable row level security;

create policy "invites: owner reads"
  on public.organization_invites for select
  to authenticated
  using (
    public.org_role(organization_id) = 'owner' or (select public.is_operator())
  );

create policy "invites: owner withdraws"
  on public.organization_invites for delete
  to authenticated
  using (
    public.org_role(organization_id) = 'owner' or (select public.is_operator())
  );

-- Insert is intentionally absent: use invite_to_organization(), which
-- authorises the caller and handles the already-has-an-account case.
