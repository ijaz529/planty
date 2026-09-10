# Data Access Contract: Foundation

**Feature**: `001-foundation-accounts-catalog` · **Date**: 2026-09-10

Planty has no bespoke API layer. The contract each surface programs against is
the set of tables, functions and Row Level Security policies below. This
document is the authority on who may read and write what; the pgTAP suite in
`supabase/tests/` is its executable form.

## Roles

| Role | Who |
|---|---|
| `anon` | A visitor who is not signed in |
| `authenticated` | Any signed-in account |
| *operator* | An `authenticated` account with a `staff_roles` row of `operator` |
| *technician* | An `authenticated` account with a `staff_roles` row of `technician` |
| *org owner / member* | An `authenticated` account whose `org_role(id)` is `owner` / `member` |

Operator and technician are not Postgres roles. They are predicates evaluated
inside policies through `is_operator()` and `is_technician()`.

## Policy conventions

- Policy names read as `"table: what it does"`.
- Every policy names its role explicitly with `to anon` or `to authenticated`.
- `auth.uid()` is always wrapped as `(select auth.uid())` so Postgres caches it
  once per statement instead of per row.
- Helper functions are `security definer` with `set search_path = ''`, and are
  `stable` when they only read.

---

## Access matrix

### `profiles`

| Operation | anon | authenticated | operator |
|---|---|---|---|
| select | ✗ | own row only | all rows |
| insert | ✗ | ✗ (trigger only) | ✗ |
| update | ✗ | own `display_name`, `email` | own only |
| delete | ✗ | ✗ | ✗ |

`phone` is unwritable by anyone through the API: column privileges grant update
on `display_name` and `email` alone.

### `staff_roles`

| Operation | anon | authenticated | operator |
|---|---|---|---|
| select | ✗ | own rows only | all rows |
| insert / delete | ✗ | ✗ | ✓ |

An operator may not remove their own last operator row, mirroring the
last-owner rule for organizations, so the instance always has an administrator.

### `organizations`

| Operation | anon | authenticated | org member | org owner | operator |
|---|---|---|---|---|---|
| select | ✗ | ✗ | ✓ | ✓ | ✓ |
| insert | ✗ | via `create_organization()` | — | — | ✓ |
| update | ✗ | ✗ | ✗ | ✓ | ✓ |
| delete | ✗ | ✗ | ✗ | ✓ | ✓ |

### `organization_members`

| Operation | anon | authenticated | org member | org owner | operator |
|---|---|---|---|---|---|
| select | ✗ | own rows | rows of their organizations | ✓ | ✓ |
| insert | ✗ | ✗ | ✗ | ✓ (trigger converts invites) | ✓ |
| update (role) | ✗ | ✗ | ✗ | ✓ | ✓ |
| delete | ✗ | own row (leave) | own row | ✓ | ✓ |

Blocked in every case by the last-owner trigger: any delete or role change that
would leave the organization with no owner.

### `organization_invites`

| Operation | anon | authenticated | org member | org owner | operator |
|---|---|---|---|---|---|
| select | ✗ | ✗ | ✗ | invites of their organization | ✓ |
| insert / delete | ✗ | ✗ | ✗ | ✓ | ✓ |

An invitee cannot read invites addressed to them; the row is consumed by the
sign-up trigger, not by client code.

### `service_zones`

| Operation | anon | authenticated | operator |
|---|---|---|---|
| select | active zones | active zones | all zones |
| insert / update / delete | ✗ | ✗ | ✓ |

Zones are readable while signed out so the marketing surface can state where
Planty serves.

### `sites`

| Operation | anon | authenticated | site owner | org member | operator | technician |
|---|---|---|---|---|---|---|
| select | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ (all, for routing) |
| insert | ✗ | own or their organization's | ✓ | ✓ | ✓ | ✗ |
| update | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ |
| delete | ✗ | ✗ | ✓ | owners only | ✓ | ✗ |

`access_notes` carry no separate policy: they are columns of a row that is
already restricted, which is what FR-018 asks for. Feature 004 will narrow the
technician's read to sites on an assigned visit; in this feature technicians
have no surface, and the broad read exists so 004 has something to narrow.

### `waitlist_entries`

| Operation | anon | authenticated | operator |
|---|---|---|---|
| select | ✗ | own rows | all rows |
| insert | ✗ | own rows | ✓ |
| update / delete | ✗ | ✗ | ✓ |

### `plant_species`

| Operation | anon | authenticated | operator |
|---|---|---|---|
| select | species with ≥1 published variant | same | all species |
| insert / update / delete | ✗ | ✗ | ✓ |

### `plant_variants`

| Operation | anon | authenticated | operator |
|---|---|---|---|
| select | `published = true` | `published = true` | all variants |
| insert / update / delete | ✗ | ✗ | ✓ |

Public read of published variants is what makes SC-002 possible: prices are
visible with no account.

### `plant_variant_price_history`

| Operation | anon | authenticated | operator |
|---|---|---|---|
| select | ✗ | ✗ | ✓ |
| insert | ✗ | ✗ | ✗ (trigger only) |
| update / delete | ✗ | ✗ | ✗ |

History is append-only; no role may rewrite it.

### Storage bucket `catalog`

| Operation | anon | authenticated | operator |
|---|---|---|---|
| read | ✓ | ✓ | ✓ |
| write / delete | ✗ | ✗ | ✓ |

---

## Functions

| Function | Kind | Returns | Purpose |
|---|---|---|---|
| `is_operator()` | `stable security definer` | `boolean` | Caller holds the operator role |
| `is_technician()` | `stable security definer` | `boolean` | Caller holds the technician role |
| `org_role(organization_id uuid)` | `stable security definer` | `org_role` | Caller's role in that organization, or null. Prevents RLS recursion |
| `zone_for_point(p geography)` | `stable security definer` | `uuid` | Active zone covering the point, or null |
| `variant_publish_gaps(variant_id uuid)` | `stable security definer` | `text[]` | Human-readable list of what blocks publishing |
| `create_organization(name text, billing_email text)` | `volatile security definer` | `uuid` | Creates the organization and the caller's owner membership atomically |
| `handle_new_user()` | trigger | — | Creates the profile row and converts pending invitations |

`create_organization` authorises before it writes: it requires an authenticated
caller and rejects anything else with a named exception, rather than relying on
policies alone.

## Views

| View | Readable by | Purpose |
|---|---|---|
| `sites_needing_zone_review` | operator | Sites whose stored zone is inactive or no longer covers their pin (FR-019) |

---

## Errors the interface must render

| Condition | Raised by | Message shape |
|---|---|---|
| Site pin outside every active zone | `sites` trigger | `we do not serve this location yet` — surface offers the waitlist |
| Publishing an incomplete variant | `plant_variants` trigger | `cannot publish: <gap>, <gap>` |
| Stock below allocated | table `CHECK` | `stock cannot be lower than the quantity already allocated` |
| Removing or demoting the last owner | `organization_members` trigger | `an organization must always have at least one owner` |
| Non-operator writing catalog or zones | RLS | Row not visible or write refused; surface shows a not-found page rather than confirming the area exists |

---

## What this feature deliberately does not expose

- No basket, price calculation or total. Feature 002 computes from
  `plant_variants.price_aed`.
- No subscription, payment or allocation write path.
  `plant_variants.stock_allocated` stays at its default until feature 003.
- No visit, route or technician surface. Feature 004 owns those and will
  narrow the technician read on `sites`.
- No individual physical plant assets. Feature 006 owns those.
