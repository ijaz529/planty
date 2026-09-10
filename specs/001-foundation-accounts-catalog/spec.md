# Feature Specification: Foundation — Accounts, Organizations, Zones & Plant Catalog

**Feature Branch**: `001-foundation-accounts-catalog`
**Created**: 2026-09-10
**Status**: Draft
**Input**: User description: "Foundation for Planty: customer and business accounts with phone OTP, organizations and roles, service zones and site addresses, and the operator-curated plant catalog with published rental prices and stock."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A person creates an account and signs in (Priority: P1)

A prospective customer opens Planty, enters their UAE mobile number, receives
a one-time code by SMS, enters it, gives their name, and is signed in.
Returning customers repeat phone plus code and are recognised as the same
person. The same account works whether the person is renting plants for their
home, managing an office account, or is Planty staff.

**Why this priority**: No other capability can exist without identity. Every
later feature — a basket, a subscription, a site, a visit record — belongs to
an account. Phone-first sign-in matches how Dubai consumers already
authenticate and gives Planty a verified contact number for delivery and visit
coordination.

**Independent Test**: With nothing else built, a person signs up with a phone
number, closes the browser, returns, signs in again, sees their own name, and
can edit it. That is a working identity layer.

**Acceptance Scenarios**:

1. **Given** an unregistered UAE mobile number, **When** the person requests a
   code and enters it correctly within its validity window, **Then** an account
   is created, they are signed in, and they are asked for their name.
2. **Given** a registered person, **When** they sign in with their number and a
   valid code, **Then** they reach their existing account with their profile
   intact.
3. **Given** a person entering codes, **When** they enter an incorrect code or
   the code has expired, **Then** sign-in fails with a clear message and they
   may request a new code after a cooldown.
4. **Given** a signed-in person, **When** they open their profile, **Then** they
   can view and change their name and optional email, and see their verified
   phone number as read-only.
5. **Given** the same human entering their number in local format (05x…) on one
   visit and international format (+9715x…) on another, **When** they sign in,
   **Then** both resolve to the same single account.

---

### User Story 2 - An operator publishes the plant catalog (Priority: P2)

A Planty operator builds the rentable catalog: each plant species with its
care profile (light requirement, watering interval, pet safety), one or more
size variants (for example desk, floor, statement) each with its own photo,
monthly rental price and stock count. A variant is only offered to customers
once the operator publishes it and stock exists.

**Why this priority**: The catalog is the supply side and the price list. It is
what feature 002 renders and prices, and what feature 003 sells. Publishing
transparent prices is the product's core differentiator, so prices must be
first-class data an operator controls without a deploy.

**Independent Test**: An operator creates a species with two size variants,
sets prices and stock, publishes one variant and leaves the other in draft. A
signed-out visitor sees exactly one variant with its price. That is a working
published price list.

**Acceptance Scenarios**:

1. **Given** a signed-in operator, **When** they create a plant species with a
   common name, botanical name, light requirement and pet-safety flag, **Then**
   a draft species exists and no customer can see it.
2. **Given** a draft species, **When** the operator adds a size variant with a
   size tier, height range, photo, monthly rental price in AED and stock count,
   **Then** the variant becomes eligible for publishing.
3. **Given** an eligible variant, **When** the operator publishes it, **Then**
   it becomes visible to customers; publishing a variant that is missing a
   price, a photo or a size tier is rejected and the missing items are named.
4. **Given** a published variant, **When** the operator changes its price,
   **Then** the new price is what customers see from that moment, and the
   previous price remains recorded for subscriptions already priced at it.
5. **Given** a published variant whose available stock reaches zero, **When** a
   customer views the catalog, **Then** the variant is shown as unavailable
   rather than being silently hidden or offered.
6. **Given** anyone who is not an operator, **When** they attempt to create or
   change catalog entries, **Then** the attempt is refused.

---

### User Story 3 - A business account with several members (Priority: P3)

An office manager creates a business account for their company, giving the
company name and billing email. They invite a colleague by mobile number. The
colleague signs in with their own number and sees the company's account
alongside their personal one. The owner can remove a member; the removed
person immediately loses access to the company's data.

**Why this priority**: Offices are Planty's primary customer, and an office is
rarely one person. Shared access is what makes the account survive the office
manager changing jobs. It must exist before anything is sold to a business,
because subscriptions and sites hang off the organization, not the individual.

**Independent Test**: Two accounts, one organization. The owner invites the
second person, who then sees the organization. The owner removes them, and
they no longer do. A third, unrelated account never sees any of it.

**Acceptance Scenarios**:

1. **Given** a signed-in person, **When** they create an organization with a
   company name and billing email, **Then** the organization exists and they
   are its owner.
2. **Given** an organization owner, **When** they invite a mobile number as a
   member, **Then** the person signing in with that number gains access to the
   organization with the member role.
3. **Given** a member, **When** they attempt to remove another member, change
   the organization's billing details, or delete the organization, **Then** the
   attempt is refused; only owners may do those things.
4. **Given** a person belonging to no organization, **When** they use Planty,
   **Then** they act for themselves and never see any organization's data.
5. **Given** a removed member, **When** they next use Planty, **Then** the
   organization and its data are no longer accessible to them.
6. **Given** an organization with exactly one owner, **When** that owner tries
   to leave or be removed, **Then** the attempt is refused so no organization
   is ever left without an owner.

---

### User Story 4 - A site address inside a served zone (Priority: P4)

A customer adds the place the plants will live: a label such as "Marina
office", a map pin, building and unit details, and optional access notes. If
the pin falls inside a zone Planty serves, the site is accepted and shows the
days Planty visits that zone. If it falls outside, the customer is told so
plainly and can join a waitlist for their area instead.

**Why this priority**: Planty's economics depend on serving tight clusters, so
the boundary must be enforced by the product, not by a human reading an
address. Checkout in feature 003 and every visit in feature 004 are anchored
to a site. Dubai has no postal codes, so the pin — not the text — is the
address.

**Independent Test**: With two zones defined, a pin inside one produces an
accepted site showing that zone's service days; a pin in open desert produces
a refusal and a waitlist entry. No subscription is required to test this.

**Acceptance Scenarios**:

1. **Given** an operator, **When** they define a service zone with a name, a
   boundary and the weekdays Planty visits it, **Then** that zone becomes
   available for address validation.
2. **Given** a signed-in customer placing a pin inside a served zone, **When**
   they save the site with a label and building details, **Then** the site is
   created, linked to that zone, and shows the zone's service days.
3. **Given** a pin outside every served zone, **When** the customer tries to
   save the site, **Then** it is refused with a plain explanation and they are
   offered a waitlist registration for that location.
4. **Given** a site belonging to an organization, **When** any member of that
   organization views sites, **Then** they see it; **and** no one outside the
   organization can see it or its access notes.
5. **Given** a customer with a personal site, **When** they add access notes
   such as a gate code, **Then** those notes are visible only to them and to
   Planty staff.
6. **Given** a zone whose boundary is later changed so an existing site falls
   outside it, **When** the site is viewed, **Then** the site remains usable and
   is flagged to operators rather than being deleted.

---

### Edge Cases

- A number entered as `0501234567`, `501234567`, `971501234567` or
  `+971501234567` must resolve to one account; a UAE landline (04…) or a
  non-UAE number is refused with a clear reason.
- Someone requests many codes in a row: requests are rate-limited so SMS cost
  and abuse are contained, and the user is told when to try again.
- A person is both a private customer and a member of two organizations: one
  account must carry all three contexts without duplication.
- An operator lowers a variant's stock below the number already allocated to
  customers: the system must refuse rather than create phantom availability.
- An operator unpublishes a variant customers are already renting: existing
  rentals continue; the variant simply stops being offered.
- Two organizations register the same company name: both remain valid and
  distinguishable.
- A member is invited by a number that has never signed in: the invitation
  waits and is honoured on that number's first sign-in.
- A site's pin is inside a zone boundary but its building name suggests a
  different area: the pin decides, and the discrepancy is visible to operators.
- A plant species is toxic to pets and a customer has flagged pets at their
  site: the catalog must be able to express this, so 002 can act on it.

## Requirements *(mandatory)*

### Functional Requirements

**Identity and profile**

- **FR-001**: System MUST let a person create an account and sign in using a
  UAE mobile number verified by a one-time code, with no passwords.
- **FR-002**: System MUST normalise phone numbers so local and international
  formats resolve to exactly one account, and MUST reject non-UAE-mobile
  numbers with a clear reason.
- **FR-003**: System MUST rate-limit code requests per number and expire unused
  codes, with user-facing messages that say what to do next.
- **FR-004**: A person MUST be able to view and edit their display name and an
  optional email, and MUST see their verified phone number as read-only.
- **FR-005**: One account MUST be able to act as a private customer and as a
  member of one or more organizations without duplicate accounts.

**Roles**

- **FR-006**: System MUST support an internal operator role that can manage the
  catalog, zones and stock, and MUST restrict those capabilities to operators.
- **FR-007**: System MUST support an internal technician role, distinct from
  operator, which later features use to authorise visit work.
- **FR-008**: Internal roles MUST be assignable only by an operator, and role
  membership MUST be resolved from stored data at request time rather than
  from a token issued earlier.

**Organizations**

- **FR-009**: A person MUST be able to create an organization with a company
  name and a billing email, becoming its owner.
- **FR-010**: An owner MUST be able to invite members by mobile number and
  remove them; invitations MUST be honoured when that number first signs in.
- **FR-011**: System MUST enforce two organization roles, owner and member,
  where only owners may change billing details, manage members, or delete the
  organization.
- **FR-012**: System MUST prevent an organization from being left with no
  owner.
- **FR-013**: An organization's data MUST be invisible to anyone who is not a
  current member or Planty staff.

**Service zones and sites**

- **FR-014**: An operator MUST be able to define service zones, each with a
  name, a geographic boundary, the weekdays Planty visits, and an active flag.
- **FR-015**: A customer MUST be able to register a site with a label, a map
  pin, building and unit details, and optional access notes, owned either by
  themselves or by an organization they belong to.
- **FR-016**: System MUST validate a site's pin against active service zones
  and MUST refuse a site outside every zone, offering a waitlist registration
  instead.
- **FR-017**: An accepted site MUST show which zone serves it and which
  weekdays that zone is served.
- **FR-018**: Site access notes MUST be readable only by the site's owner (or
  the owning organization's members) and Planty staff.
- **FR-019**: A site whose zone is later withdrawn or reshaped MUST remain
  usable and MUST be surfaced to operators as needing attention.

**Plant catalog**

- **FR-020**: An operator MUST be able to create plant species with common
  name, botanical name, light requirement, watering interval guidance, a
  pet-safety flag, and a short description.
- **FR-021**: An operator MUST be able to add size variants to a species, each
  with a size tier, height range, photo, monthly rental price in AED, and a
  stock count.
- **FR-022**: A variant MUST NOT be publishable until it has a size tier, a
  photo and a price; a blocked publish MUST list the missing items.
- **FR-023**: Only published variants MUST be visible to customers, and
  visitors who are not signed in MUST be able to see the published catalog and
  its prices.
- **FR-024**: A variant with no available stock MUST be shown as unavailable
  rather than hidden, so the catalog does not appear to shrink.
- **FR-025**: System MUST record price history so that a price change does not
  retroactively alter what an existing subscription was priced at.
- **FR-026**: System MUST prevent stock from being set below the quantity
  already allocated to customers.
- **FR-027**: Prices, stock, zones and catalog content MUST all be data an
  operator changes at runtime, never values that require a code change.

### Key Entities *(include if feature involves data)*

- **Account**: A person identified by a verified UAE mobile number; has a
  display name and optional email; may simultaneously be a private customer, a
  member of organizations, and internal staff.
- **Staff Role**: Marks an account as a Planty operator or technician, granting
  internal capabilities.
- **Organization**: A business customer with a company name and billing email.
  Owns sites and, later, subscriptions.
- **Organization Membership**: Links an account to an organization with the
  role owner or member.
- **Service Zone**: A named, bounded area Planty serves, with the weekdays it
  is visited and whether it is currently active.
- **Site**: A physical place where plants live — label, map pin, building and
  unit details, access notes — belonging to an account or an organization, and
  linked to the zone that serves it.
- **Waitlist Entry**: A location outside every served zone that someone asked
  for, with enough detail to judge future expansion.
- **Plant Species**: A kind of plant Planty rents — names, light requirement,
  watering guidance, pet safety, description.
- **Plant Variant**: A sellable size of a species — size tier, height range,
  photo, monthly price in AED, stock count, published state.
- **Price History**: The record of what a variant's price was and when, so past
  pricing is auditable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new customer completes sign-up, from entering a phone number to
  a named, signed-in account, in under 90 seconds on a mid-range phone.
- **SC-002**: A visitor who is not signed in can see the full published catalog
  with a price against every plant, with no form, account or contact step.
- **SC-003**: An operator can publish a complete species with two size variants
  in under 5 minutes, without developer involvement.
- **SC-004**: 100% of publish attempts on incomplete variants are refused with
  the missing items named.
- **SC-005**: 100% of site registrations outside a served zone are refused and
  converted into a waitlist entry rather than an unserviceable customer.
- **SC-006**: Zero cross-account or cross-organization data disclosure across
  the full automated access-control test suite.
- **SC-007**: Zero duplicate accounts created for the same phone number across
  entry formats.

## Assumptions

- The launch market is Dubai, UAE; the currency is AED and the timezone is
  Asia/Dubai. This follows the constitution and carries the open founder-side
  dependency recorded in `docs/PRD.md` §11.
- One-time SMS codes are the only sign-in method in v1 — no passwords, no
  email links, no social sign-in. Email is a contact and billing field only.
- UAE (+971) mobile numbers only for the pilot; other country codes are
  refused with a clear message.
- Planty's own team performs catalog and zone administration in v1. There is no
  supplier or nursery self-service surface.
- The plant catalog is curated by hand from species proven for Dubai interiors.
  Catalog size in v1 is tens of entries, not thousands, so search and faceting
  beyond simple filters are unnecessary.
- Photos are supplied by the operator as uploads; image editing, multiple
  gallery images per variant, and 3D or AR assets are out of scope.
- Stock is a simple count per variant in v1. Reserving specific physical plants
  for specific customers, and tracking individual plants as assets, belongs to
  the visit and ops features (004, 006).
- No pricing calculation, basket, payment or subscription exists in this
  feature. It publishes prices as data; feature 002 computes totals from them.
- Zones are drawn by an operator as simple boundaries. Automatic routing,
  travel-time estimation and capacity planning are out of scope.
- Arabic-language content and RTL layout are deferred, but no decision here may
  make them harder later.
