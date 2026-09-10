---
description: "Task list for feature 001 — Foundation: Accounts, Organizations, Zones & Plant Catalog"
---

# Tasks: Foundation — Accounts, Organizations, Zones & Plant Catalog

**Input**: Design documents from `/specs/001-foundation-accounts-catalog/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/data-access.md, quickstart.md

**Tests**: Included. Constitution principle IX names access control and state
transitions as trust-critical, and this feature is almost entirely those.
pgTAP covers what the database enforces; Vitest covers the pure functions the
interface depends on.

**Organization**: Grouped by user story so each is independently testable.
Migrations are numbered in story order — `0001` foundation, `0002` catalog
(US2), `0003` organizations (US3), `0004` zones and sites (US4).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 … US4, matching the user stories in spec.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: A running Next.js app and a local Supabase stack that does not
collide with the two other projects on this machine.

- [ ] T001 Scaffold Next.js 16 with TypeScript, Tailwind v4, ESLint, App Router and `src/` into the repository root, preserving existing `docs/` and `specs/`; add `package.json` scripts `dev`, `build`, `start`, `lint`, `test`
- [ ] T002 Run `supabase init`, then set `project_id = "planty"` and the 553xx ports in `supabase/config.toml` per quickstart.md (api 55321, db 55322, shadow 55320, pooler 55329, studio 55323, inbucket 55324, analytics 55327), and `[auth] site_url = "http://127.0.0.1:3020"`
- [ ] T003 Add the four local test numbers to `[auth.sms.test_otp]` in `supabase/config.toml` as bare digits (971500000001–971500000004 → `123456`) and enable `[auth.sms.twilio]` with dummy credentials so local sign-in works without SMS
- [ ] T004 [P] Configure Vitest in `vitest.config.ts` with `include: ["tests/unit/**/*.test.ts"]`
- [ ] T005 [P] Add `.env.example` (force-added past the `.env*` ignore) with `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321` and an empty `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `.claude/launch.json` running `npm run dev` on port 3020

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema foundation, identity plumbing and app shell that every
user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Migration `supabase/migrations/0001_accounts.sql`: enable `moddatetime` and `postgis`; create enums `staff_role`, `org_role`, `light_requirement`, `size_tier`; create `profiles` and `staff_roles` per data-model.md §1–§2; `handle_new_user()` trigger on `auth.users` bridging the no-plus phone to E.164; `is_operator()` and `is_technician()` helpers; RLS policies and the column-privilege grant that makes `phone` immutable
- [ ] T007 [P] Implement `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` with `@supabase/ssr`, including `requireUser()` that redirects to `/auth`
- [ ] T008 [P] Implement UAE phone normalisation in `src/lib/phone.ts` — `normalizeUaePhone(input)` returning a discriminated union, accepting `05x`, `5x`, `9715x`, `+9715x` and `009715x` with spaces, dashes and brackets, rejecting landlines and non-UAE numbers with a readable reason
- [ ] T009 [P] Unit tests in `tests/unit/phone.test.ts` covering every accepted format resolving to one E.164 value and every rejection case named in spec.md Edge Cases
- [ ] T010 Auth session middleware in `src/middleware.ts` refreshing the Supabase session and redirecting unauthenticated users away from `/profile`, `/sites`, `/organizations` and `/ops`
- [ ] T011 App shell: `src/app/layout.tsx` with metadata and mobile viewport, `src/app/globals.css` with the Tailwind v4 entry and `@theme inline` tokens, and `src/app/manifest.ts` for the PWA
- [ ] T012 pgTAP tests `supabase/tests/0001_accounts_rls.sql`: anon reads no profiles; a user reads only their own; a user can change `display_name` but not `phone`; an operator reads all; a non-operator cannot insert `staff_roles`
- [ ] T013 Base seed in `supabase/seed.sql`: the four accounts of quickstart.md inserted into `auth.users` with fixed UUIDs, phone without the leading `+`, and all eight GoTrue token columns set to `''`; display names; operator and technician rows in `staff_roles`

**Checkpoint**: `supabase db reset` is clean, `npm run test` and `supabase test db` are green.

---

## Phase 3: User Story 1 — A person creates an account and signs in (Priority: P1) 🎯 MVP

**Goal**: Phone-code sign-in producing one account per human, with an editable profile.

**Independent Test**: Sign up as `050 000 0001` with code `123456`, set a name, sign out, sign back in as `+971500000001`, and see the same account with the name intact (spec US1 scenarios 1–5).

- [ ] T014 [US1] Phone entry screen in `src/app/auth/page.tsx`: normalises through `normalizeUaePhone`, shows inline rejection reasons, calls `signInWithOtp`, and renders the rate-limit case as a wait-and-retry message
- [ ] T015 [US1] Code entry in `src/app/auth/verify/page.tsx`: six-digit input wrapped in `<Suspense>` because it reads search params, `verifyOtp`, distinct messages for wrong and expired codes, resend with a visible cooldown
- [ ] T016 [US1] Context resolution in `src/lib/roles.ts`: `getUserContext()` reading staff roles and organization memberships at request time, and `postSignInPath()` sending operators to `/ops` and everyone else to `/`
- [ ] T017 [US1] Profile screen in `src/app/(customer)/profile/page.tsx`: view and edit display name and optional email, phone shown read-only, sign-out; new users without a name are routed here after verification
- [ ] T018 [US1] Zod schemas for the profile form in `src/lib/validation.ts`, with user-facing messages
- [ ] T019 [US1] Customer home in `src/app/(customer)/page.tsx` — greeting and navigation for now; User Story 2 replaces its body with the public catalog

**Checkpoint**: US1 works end to end locally with the test numbers.

---

## Phase 4: User Story 2 — An operator publishes the plant catalog (Priority: P2)

**Goal**: Operator-curated species and priced size variants, with published prices readable by anyone.

**Independent Test**: As `050 000 0003`, create a species with two variants, publish one and leave one incomplete; signed out, the public catalog shows exactly the published one with its AED price (spec US2 scenarios 1–6).

- [ ] T020 [US2] Migration `supabase/migrations/0002_catalog.sql`: `plant_species`, `plant_variants` with the stock `CHECK` and the `stock_available` generated column, `plant_variant_price_history`; `variant_publish_gaps()`; the publish guard trigger; the price-history trigger; the `catalog` storage bucket with public read and operator write; all RLS policies per contracts/data-access.md
- [ ] T021 [US2] pgTAP tests `supabase/tests/0002_catalog_rls.sql`: anon and authenticated see only published variants and only species with a published variant; operator sees all; publishing an incomplete variant raises and names the gaps; publishing a complete one succeeds; stock below allocated is rejected; price history is append-only and gains a row on price change
- [ ] T022 [P] [US2] Catalog helpers in `src/lib/catalog.ts`: publish-gap messages mirroring the database function, availability label from `stock_available`, and size-tier and light-requirement display names
- [ ] T023 [P] [US2] Unit tests in `tests/unit/catalog.test.ts` for gap messages, availability labels and tier ordering
- [ ] T024 [US2] Operator gate in `src/app/(ops)/ops/layout.tsx`: `requireUser()` then the `is_operator` check, rendering `notFound()` rather than a permission error
- [ ] T025 [US2] Species list and editor in `src/app/(ops)/ops/catalog/page.tsx` and `src/app/(ops)/ops/catalog/[id]/page.tsx`: create and edit common name, botanical name, light requirement, watering interval, pet-safe flag and description
- [ ] T026 [US2] Variant editor in `src/app/(ops)/ops/catalog/[id]/variants.tsx`: size tier, height range, AED price, stock, photo upload to the `catalog` bucket, and publish and unpublish controls that render the gap list returned by `variant_publish_gaps` on a blocked publish
- [ ] T027 [US2] Extend `src/lib/validation.ts` with species and variant schemas, coercing numeric inputs and bounding price and stock
- [ ] T028 [US2] Public catalog in `src/app/(customer)/page.tsx`: published variants grouped by species with AED prices, pet-safe and light badges, and zero-stock variants shown as unavailable rather than hidden — readable with no account
- [ ] T029 [US2] Species detail in `src/app/(customer)/plants/[id]/page.tsx`: care profile and every published size variant with its price
- [ ] T030 [US2] Extend `supabase/seed.sql` with six species, published variants across all three size tiers, one incomplete draft variant and one published zero-stock variant

**Checkpoint**: The public price list is live and operator-maintained. Independently demonstrable alongside US1.

---

## Phase 5: User Story 3 — A business account with several members (Priority: P3)

**Goal**: Organizations with owner and member roles, invitations by phone that survive not having an account yet, and strict cross-tenant isolation.

**Independent Test**: As `050 000 0002`, invite a never-seen number; sign in as that number and the organization is there; remove them and it is gone; try to remove the last owner and it is refused (spec US3 scenarios 1–6).

- [ ] T031 [US3] Migration `supabase/migrations/0003_organizations.sql`: `organizations`, `organization_members`, `organization_invites`; `org_role()` helper; the last-owner guard trigger; `create_organization()` that authorises then writes the organization and the owner membership atomically; a replacement `handle_new_user()` that also converts pending invites; all RLS policies per contracts/data-access.md
- [ ] T032 [US3] pgTAP tests `supabase/tests/0003_organizations_rls.sql`: members see their own organization and nothing of another; only owners change billing details or manage members; removing or demoting the last owner raises; a member leaving is allowed; an invite converts to a membership on that number's first sign-in; a removed member loses access
- [ ] T033 [US3] Organizations list and creation in `src/app/(customer)/organizations/page.tsx` calling `create_organization`
- [ ] T034 [US3] Member management in `src/app/(customer)/organizations/[id]/members.tsx`: invite by phone number normalised through `normalizeUaePhone`, change role, remove member, with the last-owner refusal surfaced as a readable message
- [ ] T035 [US3] Extend `supabase/seed.sql` with the Northwind Labs organization owned by the second test account

**Checkpoint**: Business tenancy works and is provably isolated.

---

## Phase 6: User Story 4 — A site address inside a served zone (Priority: P4)

**Goal**: Operator-drawn service zones, and customer sites the database refuses to create outside them.

**Independent Test**: Save a site with the pin inside the Marina polygon and see that zone's service days; drag it into open desert and get a refusal plus a waitlist offer (spec US4 scenarios 1–6).

- [ ] T036 [US4] Migration `supabase/migrations/0004_zones_sites.sql`: `service_zones` with its GIST index, `sites` with the exactly-one-owner `CHECK`, `waitlist_entries`; `zone_for_point()`; the site trigger that assigns `zone_id` and raises when the pin is outside every active zone; the `sites_needing_zone_review` view; all RLS policies per contracts/data-access.md
- [ ] T037 [US4] pgTAP tests `supabase/tests/0004_zones_sites_rls.sql`: a point inside an active zone resolves and a site is created; a point outside every zone raises the named exception; deactivating a zone leaves existing sites intact and lists them in the review view; organization members see the organization's sites and outsiders see none; access notes are unreadable to outsiders; anon sees active zones only
- [ ] T038 [P] [US4] Zone helpers in `src/lib/zones.ts`: render `service_weekdays` as readable day names in Asia/Dubai order and format the next service day
- [ ] T039 [P] [US4] Unit tests in `tests/unit/zones.test.ts` for weekday rendering, ordering and the single-day and all-week edge cases
- [ ] T040 [US4] Leaflet map components in `src/components/map/pin-picker.tsx` and `src/components/map/zone-map.tsx`, loaded client-side only, defaulting to Dubai and taking coordinates as (longitude, latitude) when writing to the database
- [ ] T041 [US4] Sites list and creation in `src/app/(customer)/sites/page.tsx`: label, pin, building, unit, optional Makani and access notes; owned by the person or by an organization they belong to; shows the serving zone and its service days on success, and offers a waitlist entry on the out-of-zone refusal
- [ ] T042 [US4] Operator zone management in `src/app/(ops)/ops/zones/page.tsx`: list zones with their weekdays and active flag, view boundaries on a map, and see the `sites_needing_zone_review` list
- [ ] T043 [US4] Operator waitlist in `src/app/(ops)/ops/waitlist/page.tsx`: requests from outside served zones with their locations, newest first
- [ ] T044 [US4] Extend `supabase/seed.sql` with the two active zones (Business Bay, Dubai Marina) as polygons with service weekdays, one organization site and one personal site inside them

**Checkpoint**: All four stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T045 [P] Shared navigation and sign-out across the customer and operator surfaces, showing the active organization context where one exists
- [ ] T046 [P] Write `README.md` from quickstart.md: pitch, links to the constitution, PRD and research, stack, setup, test sign-ins, commands and the surfaces table
- [ ] T047 Accessibility and mobile pass over every screen: logical CSS properties so a later RTL pass is possible, labelled form controls, visible focus, and a body that never scrolls horizontally
- [ ] T048 Run the full validation gate — `npm run build`, `npm run test`, `supabase test db` — and walk the seven manual checks in quickstart.md, fixing anything red

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: depends on Setup. **Blocks every user story.**
- **User stories (Phases 3–6)**: all depend on Foundational.
  - US1 is the MVP slice and should land first.
  - US2 depends only on Foundational and can run beside US1 once the app shell exists.
  - US3 depends on Foundational; its migration replaces `handle_new_user()` from `0001`.
  - US4 depends on US3, because `sites` references `organizations`.
- **Polish (Phase 7)**: depends on the stories being complete.

### Within each user story

- Migration and its pgTAP tests before the screens that read the tables.
- Pure helpers and their unit tests before the components that use them.
- Seed extension alongside the migration, so `supabase db reset` stays demonstrable.

### Parallel opportunities

- T004 and T005 in Setup.
- T007, T008 and T009 in Foundational — different files, no shared state.
- T022 and T023 inside US2; T038 and T039 inside US4.
- US1 and US2 can be built by different people once Phase 2 is checkpointed.
- T045 and T046 in Polish.

---

## Implementation Strategy

### MVP first

1. Phase 1 Setup, then Phase 2 Foundational.
2. Phase 3 (US1) — stop and verify sign-in end to end with the test numbers.
3. Phase 4 (US2) — stop and verify the public price list renders signed out.

At that point the two constitutional differentiators are demonstrable: an
account exists, and anyone can see every plant's price without asking a human.

### Incremental delivery

Add US3 for business tenancy, then US4 for zone-bounded sites. Each story ends
at a checkpoint where the previous ones still pass, and feature 002 can start
against a real catalog and real sites.

---

## Notes

- `[P]` means different files and no dependency on incomplete work.
- Every task names its file path so it can be picked up without this document's
  context.
- Mark a task `[X]` as it completes; commit after each logical group.
- Never run `supabase migration new` — migrations here are hand-numbered.
- Verify pgTAP tests fail before the migration that satisfies them, so a test
  that never ran is not mistaken for a test that passes.
