# Phase 0 Research: Foundation — Accounts, Organizations, Zones & Plant Catalog

**Feature**: `001-foundation-accounts-catalog` · **Date**: 2026-09-10

Each item resolves an unknown from the plan's Technical Context. Market and
competitor research lives in `docs/research/`; this file covers only the
technical decisions this feature needs.

---

## R1 — Sign-in method and local development without real SMS

**Decision**: Supabase Auth phone provider with one-time SMS codes, Twilio as
the production sender. Locally, `[auth.sms.test_otp]` maps three fixed UAE
numbers to the code `123456`, and `[auth.sms.twilio]` is enabled with dummy
credentials.

**Rationale**: Phone-first sign-in matches how Dubai consumers authenticate
across the apps they already use, and it gives Planty the verified number that
delivery and visit coordination depend on. Supabase Auth owns code generation,
expiry and rate limiting, so FR-003 needs no custom code. The sibling project
`../barber-hero` proves this configuration works locally.

**Alternatives considered**:
- *Email magic links*: simpler locally, but a technician on a route and an
  office manager reached over WhatsApp both live on a phone number, not an
  inbox. It would also mean collecting a phone number separately anyway.
- *Passwords*: another credential to reset and leak, for no gain.

**Trap to avoid**: an SMS provider must be `enabled` in `config.toml` even for
test numbers, or `signInWithOtp` fails locally. Test-OTP keys are bare digits
with no `+` and no quotes. `auth.users.phone` stores the number *without* the
leading `+` while our own profile row stores E.164 *with* it; the sign-up
trigger bridges the two.

---

## R2 — Where roles live and how they are resolved

**Decision**: Two tables — `staff_roles` for internal Planty roles (operator,
technician) and `organization_members` for customer-side roles (owner,
member). Both are read at request time through `security definer` helper
functions: `is_operator()`, `is_technician()`, `org_role(org_id)`.

**Rationale**: FR-008 requires role membership to be resolved from stored data
rather than from a token issued earlier. A revoked operator or a removed
organization member must lose access immediately, not when their session
refreshes. Helper functions also keep RLS policies readable and let Postgres
cache the result within a statement.

**Alternatives considered**:
- *Roles as JWT `app_metadata` claims*: one fewer query, but a token minted
  before a removal keeps working until it expires. Spec US3 scenario 5 and US2
  scenario 6 both fail under that model.
- *A single polymorphic roles table*: conflates internal staff with customer
  tenancy, and makes every policy carry a discriminator.

**Trap to avoid**: an RLS policy on `organization_members` that itself queries
`organization_members` recurses. `org_role()` is `security definer`, so it
bypasses RLS and breaks the cycle. Every membership-dependent policy calls the
function instead of sub-querying the table.

---

## R3 — Representing service zones and testing whether a pin is inside one

**Decision**: PostGIS. A zone's boundary is `geography(Polygon, 4326)`; a
site's pin is `geography(Point, 4326)`. Zone resolution is a `security definer`
function that returns the active zone covering a point, and a trigger on
`sites` calls it and rejects the row when nothing covers the pin.

**Rationale**: Constitution principle I makes the zone boundary a hard business
rule, so it belongs in the database where it cannot be bypassed by a client.
PostGIS ships with Supabase, `ST_Covers` on a geography is exact, and a GIST
index keeps it fast. Dubai zone shapes follow roads and communities and are not
rectangles.

**Alternatives considered**:
- *Bounding boxes*: cheap, but Dubai's served clusters interleave, so a box
  around Business Bay swallows parts of areas we do not serve.
- *A list of community names*: depends on the customer choosing the right label
  and on address text, which Dubai does not reliably have — there are no postal
  codes.
- *Validating in the client*: not trustworthy, and principle VI puts trusted
  logic in the database.

**Trap to avoid**: `geography` orders coordinates as (longitude, latitude).
Fixture data written the other way around lands in the Indian Ocean and every
zone test passes for the wrong reason, so the pgTAP fixtures assert a known
in-zone and a known out-of-zone point explicitly.

---

## R4 — Map and geocoding provider

**Decision**: Leaflet with OpenStreetMap tiles for both operator zone drawing
and customer pin placement. An optional free-text Makani field on the site. No
geocoding provider in this feature.

**Rationale**: The pin is the address, so an autocomplete service is not on the
critical path; a map the user drags is. Leaflet needs no API key, no billing
account and no per-request cost, which suits a pilot. The sibling project
already uses this pairing. Makani is Dubai's official building-entrance code
and is worth capturing as a hint for technicians even though nothing consumes
it yet.

**Alternatives considered**:
- *Google Places Autocomplete*: excellent, but it introduces a key, a billing
  relationship and caching restrictions on stored coordinates, for a step the
  pin already solves.
- *Mapbox*: same reasoning, plus permanent-geocoding pricing if coordinates are
  stored long term.

**Revisit when**: customers complain about finding their building on a map, or
technicians report bad pins. Then add autocomplete as a convenience that still
writes a pin.

---

## R5 — Publish eligibility for catalog variants

**Decision**: A `variant_publish_gaps(variant_id)` function returns the list of
missing items, and a `BEFORE UPDATE` trigger blocks any transition to published
while that list is non-empty. The user interface calls the same function to
show the gaps before the attempt.

**Rationale**: FR-022 and SC-004 demand that every blocked publish names what is
missing, and that the block cannot be bypassed. One function used by both the
guard and the interface means the two can never disagree about what "complete"
means.

**Alternatives considered**:
- *Validation only in the form*: any direct write publishes an incomplete
  variant, and the constitution forbids client-only trusted logic.
- *`NOT NULL` columns instead of a guard*: a draft variant legitimately has no
  photo or price yet, so the columns must be nullable while unpublished.

---

## R6 — Price changes and price history

**Decision**: `plant_variants.price_aed` holds the current price. An
`AFTER UPDATE` trigger appends to `plant_variant_price_history` whenever the
price changes, recording the new price, who changed it, and when. Subscriptions
in feature 003 will snapshot the price they were sold at on their own rows.

**Rationale**: FR-025 requires that changing a price does not retroactively
alter what an existing subscription was priced at. The snapshot on the
subscription is what actually guarantees that; the history table is the audit
trail that explains a snapshot to a human later. Keeping the current price on
the variant keeps every catalog read a single-table query.

**Alternatives considered**:
- *Effective-dated price rows only, with no current price on the variant*:
  correct, but every catalog listing becomes a lateral join against a date, for
  a catalog of tens of rows and a pilot that changes prices rarely.
- *No history at all*: cheapest, but a customer disputing an invoice has no
  answer, and prices are the product's central claim.

---

## R7 — Stock counting in this feature

**Decision**: Two integers per variant — `stock_total` and `stock_allocated`
(defaulting to zero) — with `stock_available` as a generated column and a
`CHECK` constraint that allocation never exceeds total. Nothing in this feature
increments allocation; feature 003 does when a subscription is confirmed.

**Rationale**: FR-024 needs an availability signal now, and FR-026 needs the
guard now, but no allocation exists until something is sold. Two counters and a
constraint deliver both without inventing the reservation machinery that
features 003 and 006 will design against real requirements.

**Alternatives considered**:
- *Individual physical plants as asset rows now*: that is the right model for
  visits and replacements, and it is explicitly feature 006. Building it here
  would be speculative under principle VII.
- *A single `stock` integer decremented on sale*: loses the distinction between
  "we own twelve" and "nine are already out", which is exactly what an operator
  needs to see.

---

## R8 — Invitations to a number that has never signed in

**Decision**: An `organization_invites` table keyed by organization and E.164
phone number. The existing new-user trigger converts every pending invite for
that number into a membership at the moment the account is created, inside the
same transaction.

**Rationale**: US3 scenario 2 and FR-010 require an invitation to be honoured on
first sign-in, which means the invitation must survive not having an account to
attach to. Doing the conversion in the sign-up trigger means there is no window
in which a signed-in user is missing their organization, and no client code path
that can be skipped.

**Alternatives considered**:
- *Invite links with tokens*: better for email, pointless for phone — the phone
  number is already the identity, and a link adds a delivery channel and an
  expiry policy to manage.
- *Claiming invites lazily on first page load*: introduces a race between two
  tabs and leaves the first request after sign-up without the membership.

---

## R9 — Photo storage for catalog variants

**Decision**: A Supabase Storage bucket named `catalog` with public read and
operator-only write. The variant row stores the object path; the published
catalog is public, so the images must be too.

**Rationale**: FR-023 requires signed-out visitors to see the catalog, so signed
URLs would add latency and expiry handling to images that are marketing assets
anyway. Write access is restricted to operators through a storage policy that
calls the same `is_operator()` helper as the table policies.

---

## R10 — Test strategy for this feature

**Decision**: Two layers, matching constitution principle IX.

- **pgTAP** (`supabase test db`) for everything the database enforces: the RLS
  matrix per role, cross-organization isolation, the publish guard, the stock
  constraint, zone resolution and rejection, last-owner protection, and invite
  conversion.
- **Vitest** for the pure functions the interface depends on: UAE phone
  normalisation, the human-readable rendering of a zone's service weekdays, and
  the client-side mirror of publish-gap messages.

**Rationale**: The trust-critical logic in this feature is almost entirely
access control and state guards, which live in Postgres and can only be tested
honestly against a real Postgres with real roles. Component tests over forms
would test the framework, not the rules.

**Fixtures**: fixed UUIDs so tests read as scenarios rather than as noise —
accounts `10000000-0000-4000-8000-00000000000N`, organizations
`20000000-…`, zones `30000000-…`, species and variants `40000000-…`. The three
seeded phone numbers double as the local test-OTP numbers.
