# Feature Specification: Visit Engine

**Feature Branch**: `004-visit-engine`
**Created**: 2026-09-10
**Status**: Draft
**Input**: User description: "Visit engine: generate recurring maintenance visits from active subscriptions on the days the zone is served, give technicians a day list with a per-stop checklist and per-plant condition and photos, and show the customer proof that every visit happened."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A technician works a day's route (Priority: P1)

A technician opens Planty on their phone at the start of the day and sees the
stops they are assigned, in the order they should drive them. Each stop shows
the site, how to get in, and the plants that live there. At the stop they work
down the plant list, marking how each one is doing, and take a photo. They
cannot finish the visit without that record.

**Why this priority**: Everything Planty sells is this visit. The technician
surface is the product's only production system, and a visit whose record is
missing is indistinguishable from a visit that never happened.

**Independent Test**: With a seeded active subscription and visits generated,
sign in as a technician, open today's route, complete a stop with conditions
and a photo, and see it marked done; try to finish another without a photo and
be refused.

**Acceptance Scenarios**:

1. **Given** a technician with assigned visits today, **When** they open their
   day, **Then** they see each stop in route order with the site name, address,
   access notes and the plants expected there.
2. **Given** a stop, **When** the technician records a condition for every
   plant and adds at least one photo, **Then** they can complete the visit and
   it is marked done with the time it was completed.
3. **Given** a stop with no photo, **When** the technician tries to complete
   it, **Then** it is refused and the missing requirement is named.
4. **Given** a stop nobody could get into, **When** the technician marks it
   could not be done and gives a reason, **Then** it is recorded as missed with
   that reason, and it is visible to operators.
5. **Given** a technician, **When** they open a site they are not assigned to
   today, **Then** they cannot see it or its access notes.

---

### User Story 2 - The customer sees that their plants were looked after (Priority: P2)

A customer opens their subscription and sees every visit that has happened,
newest first, each with the date, who came, what was done, how each plant was
doing, and the photos. They can see when the next visit is due.

**Why this priority**: The customer is buying an outcome they cannot verify.
This is the whole trust product, and it is cheap to build once the record
exists.

**Independent Test**: After a technician completes a visit, the customer opens
the subscription and sees that visit with its photos, conditions and date, and
the date of the next one.

**Acceptance Scenarios**:

1. **Given** a subscription with completed visits, **When** the customer opens
   it, **Then** they see each visit newest first with its date, the plant
   conditions recorded and the photos taken.
2. **Given** an active subscription, **When** the customer views it, **Then**
   they see when the next visit is scheduled.
3. **Given** a visit that was missed, **When** the customer views it, **Then**
   they see it was missed and the reason, rather than it silently disappearing.
4. **Given** a customer, **When** they try to view another customer's visits,
   **Then** they cannot.

---

### User Story 3 - Visits appear without anyone creating them (Priority: P3)

Visits for every active subscription are created automatically for the weeks
ahead, on days the site's zone is served, at the subscription's cadence. An
operator sees the days ahead, assigns technicians and orders each day's stops.

**Why this priority**: A schedule somebody has to remember to create is a
schedule that will be missed. It depends on the visit record existing, so it
follows US1.

**Independent Test**: Activate a subscription, run generation, and see visits
appear on the right weekdays at the right spacing; run it again and see no
duplicates.

**Acceptance Scenarios**:

1. **Given** an active subscription, **When** visits are generated, **Then**
   visits exist for the weeks ahead only on the weekdays its zone is served and
   spaced by its cadence.
2. **Given** visits already generated, **When** generation runs again, **Then**
   no duplicate visit is created for a date that already has one.
3. **Given** a subscription that is cancelled, **When** generation runs,
   **Then** no new visits are created for it and future planned visits are
   removed.
4. **Given** an operator viewing a day, **When** they assign a technician and
   set the order of stops, **Then** the technician sees exactly that list in
   that order.
5. **Given** a subscription whose term has ended, **When** generation runs,
   **Then** no visits are created beyond the term end.

---

### Edge Cases

- The first visit is the installation day; it must exist and be the first visit
  of the subscription.
- A subscription activated after its installation day has passed: generate from
  the next served day rather than in the past.
- A zone's service days change after visits exist: existing planned visits stay
  and operators are shown which no longer fall on a served day.
- A plant is added to or removed from a subscription later: out of scope, since
  subscriptions are fixed in this release.
- Two technicians assigned the same stop: the last assignment wins and only one
  technician sees it.
- A visit completed twice: the second attempt changes nothing.
- A photo upload that fails: the visit stays open rather than completing without
  its record.
- A technician marking a plant as needing replacement: recorded and visible to
  operators; the replacement itself is a later feature.

## Requirements *(mandatory)*

### Functional Requirements

**Generation**

- **FR-001**: The system MUST create visits for every active subscription for a
  rolling horizon of at least four weeks ahead.
- **FR-002**: A visit MUST only fall on a weekday the site's zone is served.
- **FR-003**: Visits MUST be spaced according to the subscription's cadence.
- **FR-004**: Generation MUST be idempotent — running it repeatedly MUST NOT
  create a second visit for a date that already has one.
- **FR-005**: Generation MUST NOT create visits before the installation date,
  after the term end, or for subscriptions that are not active.
- **FR-006**: When a subscription stops being active, its future planned visits
  MUST be removed, and its completed visits MUST be kept.
- **FR-007**: Generation MUST run automatically without a person triggering it,
  and an operator MUST also be able to run it on demand.

**The technician's day**

- **FR-008**: A technician MUST see the visits assigned to them for a given
  day, in the order an operator set, with the site, address, access notes and
  the plants expected.
- **FR-009**: A technician MUST NOT be able to see sites, access notes or
  customers they are not assigned to.
- **FR-010**: A technician MUST be able to record, per plant, a condition from
  a fixed set and an optional note.
- **FR-011**: A technician MUST be able to attach one or more photos to a visit.
- **FR-012**: A visit MUST NOT be completable without at least one photo and a
  condition recorded for every plant expected at that stop.
- **FR-013**: A technician MUST be able to mark a visit as missed with a
  reason, which MUST be recorded and visible to operators and the customer.
- **FR-014**: Completing a visit MUST record who completed it and when.

**The customer's proof**

- **FR-015**: A customer MUST see every visit for their subscription with its
  date, status, plant conditions, notes and photos.
- **FR-016**: A customer MUST see the date of the next scheduled visit for an
  active subscription.
- **FR-017**: Visit records MUST be visible only to the subscription's customer,
  the assigned technician and Planty staff.

**Operations**

- **FR-018**: An operator MUST see any day's visits, assign a technician, and
  set the order of stops.
- **FR-019**: An operator MUST see visits whose date no longer falls on a day
  their zone is served.

### Key Entities *(include if feature involves data)*

- **Visit**: One scheduled attendance at a site for a subscription — its date,
  status, assigned technician, position in the day's route, completion time and
  any missed reason.
- **Visit Plant Record**: How one plant was doing at one visit — condition, an
  optional note.
- **Visit Photo**: An image taken at a visit, with who took it and when.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of completed visits have at least one photo and a condition
  for every plant expected at that stop.
- **SC-002**: 100% of generated visits fall on a weekday their zone is served,
  within the subscription's term, at its cadence spacing.
- **SC-003**: Running generation repeatedly produces no duplicate visits, under
  the automated test.
- **SC-004**: A technician can complete a stop of ten plants in under two
  minutes on a phone.
- **SC-005**: Zero visit records visible across customer, technician or
  organization boundaries under the automated access-control suite.
- **SC-006**: A customer can see the outcome of their most recent visit within
  one page load of opening their subscription.

## Assumptions

- Route order is set by an operator by hand. Automatic route optimisation is
  deferred until there are more technicians than one person can plan for.
- Visits are generated for a rolling four-week horizon, so a pause or
  cancellation cannot leave months of orphaned work.
- Plant conditions come from a fixed set: healthy, needs attention, declining,
  replaced. Free-text notes carry anything else.
- Photos are per visit, not per plant. A technician photographs the installation
  as a whole; per-plant photography is slower than the two-minute target.
- Replacing a declining plant is recorded as a condition here. The replacement
  workflow, its stock movement and its effect on the rotation entitlement belong
  to feature 005 or 006.
- Technicians are Planty staff with the technician role from feature 001. There
  is no technician self-signup, no subcontractor accounts and no per-visit pay.
- No customer notifications are sent in this feature. The record exists and the
  customer can see it; messaging is a later feature.
- Time of day is not scheduled. A visit belongs to a day, and the technician
  works the day's order.
