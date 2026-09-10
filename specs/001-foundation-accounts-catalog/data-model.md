# Phase 1 Data Model: Foundation — Accounts, Organizations, Zones & Plant Catalog

**Feature**: `001-foundation-accounts-catalog` · **Date**: 2026-09-10

All tables live in `public`, all have Row Level Security enabled, and all
timestamps are `timestamptz`. Money is `numeric(10,2)` in AED. Geography uses
SRID 4326 with coordinates in (longitude, latitude) order.

Migrations: `0001_accounts.sql`, `0002_organizations.sql`, `0003_zones_sites.sql`,
`0004_catalog.sql`.

---

## Enumerated types

| Type | Values | Notes |
|---|---|---|
| `staff_role` | `operator`, `technician` | Internal Planty roles |
| `org_role` | `owner`, `member` | Customer-side roles within an organization |
| `light_requirement` | `low`, `medium`, `bright` | Care profile of a species |
| `size_tier` | `desk`, `floor`, `statement` | Sellable size band of a variant |

---

## 1. `profiles`

One row per person, created automatically when their auth user is created.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, references `auth.users(id)` on delete cascade |
| `phone` | `text` | not null, unique, `CHECK (phone ~ '^\+9715\d{8}$')` |
| `display_name` | `text` | `CHECK (char_length(display_name) <= 80)` |
| `email` | `text` | `CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')`, nullable |
| `created_at` | `timestamptz` | not null, default `now()` |
| `updated_at` | `timestamptz` | not null, default `now()`, maintained by `moddatetime` |

**Rules**

- Created by trigger `on_auth_user_created` → `handle_new_user()`, which also
  converts pending invitations (see §3).
- `phone` is immutable for the account holder. Enforced by column privilege:
  `revoke update on profiles from authenticated`, then
  `grant update (display_name, email) on profiles to authenticated`.
- Satisfies FR-001, FR-004, FR-005, SC-007.

---

## 2. `staff_roles`

| Column | Type | Constraints |
|---|---|---|
| `account_id` | `uuid` | references `profiles(id)` on delete cascade |
| `role` | `staff_role` | |
| `granted_at` | `timestamptz` | not null, default `now()` |
| | | PK `(account_id, role)` |

**Rules**

- Only an operator may insert or delete rows (bootstrap operator comes from
  the seed).
- Read helpers, both `security definer … set search_path = '' stable`:
  - `is_operator() → boolean`
  - `is_technician() → boolean`
- Satisfies FR-006, FR-007, FR-008.

---

## 3. `organizations`, `organization_members`, `organization_invites`

### `organizations`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | not null, `CHECK (char_length(name) between 2 and 120)` |
| `billing_email` | `text` | not null, email-shaped `CHECK` |
| `created_at` / `updated_at` | `timestamptz` | not null, default `now()` |

Duplicate names are allowed; `id` distinguishes them (spec edge case).

### `organization_members`

| Column | Type | Constraints |
|---|---|---|
| `organization_id` | `uuid` | references `organizations(id)` on delete cascade |
| `account_id` | `uuid` | references `profiles(id)` on delete cascade |
| `role` | `org_role` | not null |
| `joined_at` | `timestamptz` | not null, default `now()` |
| | | PK `(organization_id, account_id)` |

### `organization_invites`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `organization_id` | `uuid` | references `organizations(id)` on delete cascade |
| `phone` | `text` | not null, same E.164 `CHECK` as `profiles.phone` |
| `role` | `org_role` | not null, default `member` |
| `invited_by` | `uuid` | references `profiles(id)` |
| `created_at` | `timestamptz` | not null, default `now()` |
| | | unique `(organization_id, phone)` |

**Rules**

- `org_role(target_organization_id uuid) → org_role`, `security definer`,
  `stable`, returns the caller's role in that organization or null. Every
  membership-dependent policy calls it, which prevents RLS recursion (R2).
- **Last-owner protection**: `BEFORE DELETE OR UPDATE` trigger on
  `organization_members` raises when the change would leave an organization
  with zero rows of role `owner`. Satisfies FR-012, US3 scenario 6.
- **Invite conversion**: `handle_new_user()` inserts a membership for every
  `organization_invites` row matching the new profile's phone, then deletes
  those invite rows, all in the sign-up transaction. Satisfies FR-010, R8.
- Creating an organization inserts the creator as `owner` in the same
  transaction, through the `create_organization(name, billing_email)` function
  so the two writes cannot separate.
- Satisfies FR-009 … FR-013, SC-006.

---

## 4. `service_zones`, `sites`, `waitlist_entries`

### `service_zones`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | not null, unique |
| `boundary` | `geography(Polygon, 4326)` | not null |
| `service_weekdays` | `smallint[]` | not null, `CHECK` non-empty and every element between 0 (Sunday) and 6 (Saturday) |
| `active` | `boolean` | not null, default `true` |
| `created_at` / `updated_at` | `timestamptz` | not null, default `now()` |

Index: `GIST (boundary)`.

### `sites`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `owner_account_id` | `uuid` | references `profiles(id)` on delete cascade, nullable |
| `organization_id` | `uuid` | references `organizations(id)` on delete cascade, nullable |
| `label` | `text` | not null, `CHECK (char_length(label) between 2 and 80)` |
| `location` | `geography(Point, 4326)` | not null |
| `building` | `text` | not null |
| `unit` | `text` | nullable |
| `makani` | `text` | nullable, `CHECK (makani ~ '^\d{10}$')` |
| `access_notes` | `text` | nullable |
| `zone_id` | `uuid` | references `service_zones(id)`, not null |
| `created_at` / `updated_at` | `timestamptz` | not null, default `now()` |

Ownership `CHECK`: exactly one of `owner_account_id` and `organization_id` is
non-null.

### `waitlist_entries`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `account_id` | `uuid` | references `profiles(id)` on delete cascade, not null |
| `location` | `geography(Point, 4326)` | not null |
| `area_note` | `text` | nullable |
| `created_at` | `timestamptz` | not null, default `now()` |

**Rules**

- `zone_for_point(p geography) → uuid`, `security definer`, `stable`: returns
  the id of the active zone whose boundary covers `p`, else null. Uses
  `ST_Covers`, which is inclusive of the boundary itself.
- `BEFORE INSERT OR UPDATE` trigger on `sites` sets `zone_id` from
  `zone_for_point(location)` and raises a clear exception when it is null, so a
  site outside every served zone cannot exist. Satisfies FR-016, SC-005.
- **Grandfathering**: because `zone_id` is assigned at write time, later
  reshaping or deactivating a zone leaves existing sites intact. A view
  `sites_needing_zone_review` lists sites whose stored `zone_id` no longer
  covers their pin or whose zone is inactive. Satisfies FR-019, US4 scenario 6.
- `access_notes` are covered by the same row policy as the rest of the site, so
  the visibility rule in FR-018 needs no separate mechanism.
- Satisfies FR-014 … FR-019.

---

## 5. `plant_species`, `plant_variants`, `plant_variant_price_history`

### `plant_species`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `common_name` | `text` | not null |
| `botanical_name` | `text` | not null |
| `light_requirement` | `light_requirement` | not null |
| `watering_interval_days` | `smallint` | not null, `CHECK (between 1 and 60)` |
| `pet_safe` | `boolean` | not null |
| `description` | `text` | nullable |
| `created_at` / `updated_at` | `timestamptz` | not null, default `now()` |

### `plant_variants`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `species_id` | `uuid` | references `plant_species(id)` on delete cascade, not null |
| `size_tier` | `size_tier` | nullable until published |
| `height_min_cm` | `smallint` | nullable, `CHECK (> 0)` |
| `height_max_cm` | `smallint` | nullable, `CHECK (>= height_min_cm)` |
| `photo_path` | `text` | nullable — object path in the `catalog` storage bucket |
| `price_aed` | `numeric(10,2)` | nullable, `CHECK (> 0)` |
| `stock_total` | `integer` | not null, default 0, `CHECK (>= 0)` |
| `stock_allocated` | `integer` | not null, default 0, `CHECK (>= 0)` |
| `published` | `boolean` | not null, default `false` |
| `created_at` / `updated_at` | `timestamptz` | not null, default `now()` |

Table `CHECK`: `stock_allocated <= stock_total` — satisfies FR-026.
Generated column: `stock_available integer GENERATED ALWAYS AS (stock_total - stock_allocated) STORED`.
Unique `(species_id, size_tier)` where `size_tier` is not null — one variant per
size band per species.

### `plant_variant_price_history`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `variant_id` | `uuid` | references `plant_variants(id)` on delete cascade |
| `price_aed` | `numeric(10,2)` | not null |
| `changed_by` | `uuid` | references `profiles(id)`, nullable |
| `changed_at` | `timestamptz` | not null, default `now()` |

**Rules**

- `variant_publish_gaps(variant_id uuid) → text[]`, `security definer`,
  `stable`: returns human-readable missing items — a size tier, a photo, a
  price, a height range — and an empty array when complete.
- `BEFORE UPDATE` trigger blocks `published` going `false → true` while
  `variant_publish_gaps()` is non-empty, raising with the gaps listed.
  Satisfies FR-022, SC-004.
- `AFTER INSERT OR UPDATE` trigger appends to `plant_variant_price_history`
  whenever `price_aed` changes. Satisfies FR-025.
- Unpublishing is always allowed; existing rentals are unaffected (spec edge
  case).
- Satisfies FR-020 … FR-027.

---

## State transitions

**Variant publication**

```
draft ──publish (blocked unless variant_publish_gaps() is empty)──▶ published
published ──unpublish (always allowed)──▶ draft
```

**Organization membership**

```
invited (organization_invites row, no account yet)
   └─ first sign-in with that number ─▶ member | owner (organization_members)
member ──owner promotes──▶ owner
owner ──demote or remove (blocked if last owner)──▶ member | removed
```

**Site**

```
pin placed ─ inside an active zone ─▶ site created, bound to that zone
pin placed ─ outside every active zone ─▶ refused, waitlist entry offered
zone later reshaped or deactivated ─▶ site kept, listed in sites_needing_zone_review
```

---

## Entity relationships

```
auth.users 1─1 profiles
profiles 1─n staff_roles
profiles 1─n organization_members n─1 organizations
organizations 1─n organization_invites
profiles 1─n sites            (personal sites)
organizations 1─n sites       (business sites)
service_zones 1─n sites
profiles 1─n waitlist_entries
plant_species 1─n plant_variants 1─n plant_variant_price_history
```

---

## Requirement coverage

| Requirement | Where satisfied |
|---|---|
| FR-001 … FR-005 | `profiles`, sign-up trigger, column privileges |
| FR-006 … FR-008 | `staff_roles`, `is_operator()`, `is_technician()` |
| FR-009 … FR-013 | `organizations`, `organization_members`, `organization_invites`, `org_role()`, last-owner trigger |
| FR-014 … FR-019 | `service_zones`, `sites`, `waitlist_entries`, `zone_for_point()`, site trigger, `sites_needing_zone_review` |
| FR-020 … FR-027 | `plant_species`, `plant_variants`, `plant_variant_price_history`, `variant_publish_gaps()`, publish guard, stock `CHECK`, storage bucket |
| SC-004, SC-005, SC-006, SC-007 | Publish guard, site zone trigger, RLS matrix in `contracts/data-access.md`, unique `phone` |
