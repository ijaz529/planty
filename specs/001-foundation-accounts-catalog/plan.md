# Implementation Plan: Foundation — Accounts, Organizations, Zones & Plant Catalog

**Branch**: `001-foundation-accounts-catalog` | **Date**: 2026-09-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-foundation-accounts-catalog/spec.md`

## Summary

Establish the identity, tenancy, geography and supply layers every later
feature stands on: phone-code sign-in for one account that can act as a private
customer, a business member and Planty staff; organizations with owner and
member roles and invitations that survive not having an account yet; service
zones that the database enforces so an unservable address cannot become a
customer; and an operator-curated plant catalog whose published prices are
readable with no account at all.

The implementation is a single mobile-first Next.js application on Supabase.
Postgres with Row Level Security is the security boundary, and every rule the
business depends on — zone containment, publish completeness, stock sanity,
last-owner protection — is a constraint, trigger or security-definer function
in the database rather than a check in a form.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+
**Primary Dependencies**: Next.js 16 (App Router), React 19, `@supabase/supabase-js` v2, `@supabase/ssr`, Tailwind CSS v4, Zod v4, Leaflet + react-leaflet
**Storage**: Supabase Postgres with PostGIS; migrations in `supabase/migrations/`; catalog images in a Supabase Storage bucket
**Testing**: Vitest for pure functions in `src/lib`; pgTAP via `supabase test db` for RLS policies, guards and state transitions
**Target Platform**: Mobile-first responsive web (installable PWA), evergreen browsers
**Project Type**: Web application — one Next.js codebase serving customer and operator surfaces
**Performance Goals**: Sign-up under 90 seconds end to end (SC-001); public catalog interactive under 3 seconds on a mid-range phone over 4G
**Constraints**: UAE (+971) mobile numbers only; code-based sign-in only; AED and Asia/Dubai; English-first with logical CSS properties so RTL stays possible; local stack pinned to ports 553xx and the dev server to 3020 to coexist with two other Supabase projects on this machine
**Scale/Scope**: Pilot — two service zones, tens of catalog variants, low tens of business accounts; roughly 12 screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Route Density Is the Business | ✅ | Zone containment is enforced by a database trigger, not a form. An out-of-zone address cannot become a site at all — it becomes a waitlist entry. Zone service weekdays are modelled now so feature 003 can only offer days Planty already drives |
| II. B2B-First, B2C Only On An Existing Route | ✅ | Organizations, memberships and organization-owned sites are first-class in this feature. Personal sites reuse the same table and policies rather than getting their own path |
| III. Transparent Self-Serve Pricing | ✅ | `plant_variants` is readable by `anon` when published, so the full catalog and every price render with no account, no form and no contact step (SC-002). Prices are operator-editable data, never constants in code (FR-027) |
| IV. Proof of Service | ✅ N/A-forward | No visits exist yet. Nothing here blocks the visit record: sites carry the access notes and zone binding that feature 004's visits will hang from |
| V. Honest Plant Promises | ✅ | A zero-stock variant is shown as unavailable rather than hidden (FR-024), and species carry the light and pet-safety attributes that later features need to avoid promising a plant that will not survive a given site |
| VI. Supabase-Native Backend | ✅ | Postgres, Auth, Storage and RLS only; no custom backend service. Every table ships with policies. Trusted logic — zone containment, publish gaps, stock bounds, last-owner protection, invite conversion — lives in the database |
| VII. Simplicity First | ✅ | No pricing engine, no basket, no payment, no per-plant asset tracking, no route optimisation, no geocoding provider, no multi-currency. Stock is two integers; individual plants come in feature 006 when there is a real requirement |
| VIII. Spec-Driven Development | ✅ | This plan traces to FR-001 … FR-027; the coverage table in `data-model.md` maps each requirement to where it is satisfied |
| IX. Test What Matters | ✅ | pgTAP covers the RLS matrix including cross-organization isolation (SC-006), the publish guard (SC-004), zone rejection (SC-005), stock bounds and last-owner protection. Vitest covers phone normalisation (SC-007) and service-day rendering. No pricing computation exists yet to test |

**Post-Phase-1 re-check**: ✅ No violations introduced. The design added a
technician read on `sites` that is broader than feature 001 needs, justified in
`contracts/data-access.md` because no technician surface exists yet to narrow
it against; feature 004 must narrow it to sites on an assigned visit. Recorded
in Complexity Tracking below as a scheduled correction rather than an accepted
violation. Complexity Tracking otherwise empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation-accounts-catalog/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — R1..R10
├── data-model.md        # Phase 1 output — tables, functions, state transitions
├── quickstart.md        # Phase 1 output — local setup and manual verification
├── contracts/
│   └── data-access.md   # Phase 1 output — RLS matrix, functions, error contract
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (customer)/              # public and customer surfaces
│   │   ├── page.tsx             # "/" — public catalog with prices
│   │   ├── plants/[slug]/       # species detail with size variants
│   │   ├── profile/             # name, email, read-only phone
│   │   ├── sites/               # site list, add site with map pin
│   │   └── organizations/       # create organization, manage members
│   ├── (ops)/
│   │   └── ops/                 # operator console, gated by layout
│   │       ├── layout.tsx       # requireUser + is_operator, else notFound
│   │       ├── catalog/         # species and variants, publish controls
│   │       ├── zones/           # service zones and weekdays
│   │       └── waitlist/        # out-of-zone requests
│   ├── auth/                    # phone entry and code verification
│   ├── layout.tsx
│   ├── manifest.ts              # PWA
│   └── globals.css              # Tailwind v4 entry and theme tokens
├── components/
│   └── map/                     # Leaflet pin picker and zone viewer
└── lib/
    ├── supabase/{client,server}.ts
    ├── phone.ts                 # UAE normalisation to E.164
    ├── zones.ts                 # service-weekday rendering
    ├── catalog.ts               # publish-gap messages, availability labels
    ├── roles.ts                 # user context, post-sign-in destination
    └── validation.ts            # Zod schemas for every form

supabase/
├── migrations/
│   ├── 0001_accounts.sql        # profiles, staff_roles, sign-up trigger, RLS
│   ├── 0002_organizations.sql   # organizations, members, invites, guards, RLS
│   ├── 0003_zones_sites.sql     # PostGIS zones, sites, waitlist, RLS
│   └── 0004_catalog.sql         # species, variants, price history, storage, RLS
├── tests/
│   ├── 0001_accounts_rls.sql
│   ├── 0002_organizations_rls.sql
│   ├── 0003_zones_sites_rls.sql
│   └── 0004_catalog_rls.sql
├── seed.sql
└── config.toml                  # ports 553xx, test OTP numbers

tests/
└── unit/                        # Vitest: phone.test.ts, zones.test.ts, catalog.test.ts
```

**Structure Decision**: One Next.js application at the repository root with
route groups separating the two audiences that exist in this feature —
`(customer)` and `(ops)`. There is no separate backend, because Supabase is the
backend; `supabase/` holds the schema, its policies and its tests. A technician
route group is deliberately absent until feature 004 gives it something to do.
This is the simplest structure that satisfies principles VI and VII.

## Phase 0: Research → [research.md](research.md)

Ten decisions resolved, each with rationale, alternatives and the trap that
makes it easy to get wrong: sign-in method and local SMS bypass (R1), where
roles live and how RLS recursion is avoided (R2), PostGIS zone containment
(R3), map provider (R4), publish eligibility as a shared function (R5), price
history (R6), stock counting scoped to this feature (R7), invitations that
predate an account (R8), catalog image storage (R9), and the two-layer test
strategy with its fixtures (R10).

## Phase 1: Design → [data-model.md](data-model.md), [contracts/data-access.md](contracts/data-access.md), [quickstart.md](quickstart.md)

- **Data model**: eleven tables across four migrations, four enumerated types,
  seven functions, the guard triggers, the three state machines, and a table
  mapping every functional requirement to where it is satisfied.
- **Contract**: the complete RLS matrix per role per table, the function
  inventory, the operator-only view, and the errors each surface must render in
  the customer's language.
- **Quickstart**: local ports, the four test sign-ins and the fixed code, what
  the seed contains, the daily command loop, a seven-step manual verification
  walk, and the local gotchas that cost the most time.

## Complexity Tracking

> Filled only where the design knowingly departs from the simplest thing.

| Departure | Why needed now | Correction scheduled |
|---|---|---|
| Technicians can read all `sites`, which is broader than this feature requires | The technician role must exist in 001 so feature 004 has an identity to authorise against, but there is no visit table yet to scope the read to | Feature 004 narrows the policy to sites on a visit assigned to that technician, and its pgTAP suite asserts the narrower rule |

No constitutional violations. No other departures.
