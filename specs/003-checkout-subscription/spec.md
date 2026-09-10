# Feature Specification: Checkout & Subscription

**Feature Branch**: `003-checkout-subscription`
**Created**: 2026-09-10
**Status**: Draft
**Input**: User description: "Checkout and subscription: turn a priced basket into a subscription — confirm the site, book an installation day the zone already serves, choose how to pay, allocate stock, and track the subscription from pending to active to cancelled."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A customer turns a basket into a subscription (Priority: P1)

A signed-in customer with a basket that clears the zone minimum confirms the
site, picks an installation day from the days Planty already visits that zone,
and places the order. The plants are reserved for them at the price they saw.
They get a subscription page that says what they ordered, what it costs each
month, when installation is, and what happens next.

**Why this priority**: Everything before this was a brochure. This is the first
moment Planty makes a commitment to a customer and a customer makes one back.
Without it, features 001 and 002 have no consequence.

**Independent Test**: With a priced basket attached to a site, complete checkout
and land on a subscription showing the same lines and the same monthly total
the basket showed; the plants' available stock drops by the quantities ordered.

**Acceptance Scenarios**:

1. **Given** a basket that meets the zone minimum for a chosen site, **When**
   the customer places the order, **Then** a subscription exists with every
   line, price and the monthly total exactly as the basket displayed them.
2. **Given** an order is placed, **When** the catalog is viewed, **Then** the
   available stock of each ordered plant has fallen by the quantity ordered.
3. **Given** a basket below the zone minimum, **When** the customer tries to
   check out, **Then** it is refused with the shortfall named, the same way the
   basket refused it.
4. **Given** the installation day picker, **When** the customer chooses a day,
   **Then** only days Planty serves that zone, at least two working days ahead,
   can be chosen.
5. **Given** two customers race for the last plant of a size, **When** both
   place orders, **Then** exactly one succeeds and the other is told plainly
   which plant ran out, without a half-created order.
6. **Given** a price changed after the basket was built, **When** the order is
   placed, **Then** the customer is shown the new price and asked to confirm
   before anything is reserved; a stale number is never silently charged.

---

### User Story 2 - Paying by invoice, the way an office does (Priority: P2)

A business customer chooses to pay by bank transfer. Their subscription is
created as pending, the invoice details and reference are shown, and once
Planty sees the money an operator confirms it and the subscription becomes
active. Until then the plants stay reserved for a bounded period.

**Why this priority**: Offices are the primary customer and they pay against
an invoice, not a card. This makes the whole flow usable for the launch segment
with no payment processor at all, which also means it can be tested end to end
today.

**Independent Test**: Place an invoice order, see the payment reference and
bank details on the subscription, have an operator mark it paid, and watch the
status move to active.

**Acceptance Scenarios**:

1. **Given** a customer checking out, **When** they choose to pay by invoice,
   **Then** the subscription is created pending payment and shows a unique
   reference, the amount due, and the bank details to pay.
2. **Given** a pending subscription, **When** an operator records the payment,
   **Then** it becomes active and the customer sees that on their subscription
   page.
3. **Given** a pending subscription, **When** its reservation window passes
   with no payment, **Then** an operator can release it, which returns the
   plants to stock.
4. **Given** anyone who is not an operator, **When** they try to mark a
   subscription paid, **Then** it is refused.

---

### User Story 3 - Seeing and cancelling a subscription (Priority: P3)

A customer sees every subscription of theirs and their organizations, with its
status and installation date. A pending subscription can be cancelled by the
customer, which releases the plants. An active one shows how long it runs and
says that cancellation during the term goes through Planty.

**Why this priority**: A customer who has committed money needs to see what
they committed to. Cancelling before payment is a courtesy that costs nothing
and prevents a stuck reservation.

**Independent Test**: Place two orders, cancel the pending one and see stock
return; open the active one and see its term, installation day and status.

**Acceptance Scenarios**:

1. **Given** a signed-in customer, **When** they open their subscriptions,
   **Then** they see their own and their organizations' subscriptions, and
   nobody else's.
2. **Given** a pending subscription, **When** the customer cancels it, **Then**
   it is cancelled and the plants return to available stock.
3. **Given** an active subscription, **When** the customer views it, **Then**
   they see the term end date and are told how cancellation works, and cannot
   cancel it themselves in this release.
4. **Given** a cancelled subscription, **When** viewed, **Then** it is clearly
   marked and cannot be reactivated by the customer.

---

### Edge Cases

- The chosen site's zone was retired between basket and checkout: refuse with
  an explanation rather than book a visit nobody will make.
- A basket containing an unavailable line at checkout: the unavailable line is
  dropped from the order and the customer is told before confirming.
- The customer belongs to an organization and picks its site: the subscription
  belongs to the organization, and its billing email is used.
- A personal site with no email on the profile: the invoice needs somewhere to
  go, so checkout asks for one.
- An operator marks an already-active subscription paid again: harmless, no
  state change, no error that alarms anyone.
- Cancelling a subscription twice: idempotent.
- Cancelling an active subscription as a customer: refused with the explanation
  that active terms are handled by Planty.
- Installation on a day the zone serves but which is a public holiday: out of
  scope; the operator reschedules by hand.

## Requirements *(mandatory)*

### Functional Requirements

**Placing an order**

- **FR-001**: A signed-in customer MUST be able to create a subscription from a
  basket attached to a site they own or whose organization they belong to.
- **FR-002**: The order MUST be priced by the system of record at the moment of
  placing it, and MUST be refused if it no longer meets the site's zone
  minimum, using the same rule the basket uses.
- **FR-003**: The subscription MUST snapshot every priced line, the term, the
  cadence, the fees and the monthly total, so later price changes never alter
  what this customer agreed to.
- **FR-004**: If the authoritative price differs from what the customer last
  saw, the system MUST show the new price and require confirmation before
  reserving anything.
- **FR-005**: Placing an order MUST reserve stock for every priced line, and
  MUST fail atomically — reserving nothing — if any line cannot be reserved,
  naming the plant that ran out.
- **FR-006**: The customer MUST choose an installation day; only days the
  site's zone is served, at least two working days ahead, MAY be offered.
- **FR-007**: A basket line that is unavailable at checkout MUST be excluded
  from the order and disclosed before confirmation.

**Payment**

- **FR-008**: The system MUST support payment by invoice: the subscription is
  created pending, with a unique payment reference, the amount due, and bank
  details, and MUST require a billing email to exist.
- **FR-009**: Only an operator MUST be able to record a payment, which MUST
  move a pending subscription to active.
- **FR-010**: A pending subscription MUST carry a reservation expiry, and an
  operator MUST be able to release an expired one, returning its stock.
- **FR-011**: The system MUST record who changed a subscription's status and
  when, for every transition.

**Lifecycle**

- **FR-012**: A subscription MUST move only along allowed transitions: pending
  to active, pending to cancelled, active to cancelled. Any other transition
  MUST be refused.
- **FR-013**: A customer MUST be able to cancel a pending subscription; a
  cancelled subscription MUST return its reserved stock exactly once.
- **FR-014**: A customer MUST NOT be able to cancel an active subscription in
  this release; only an operator may.
- **FR-015**: A subscription MUST carry its term start (installation day), term
  end, and monthly total in a form the customer can read.

**Visibility**

- **FR-016**: A customer MUST see subscriptions they own and those of their
  organizations, and none belonging to anyone else.
- **FR-017**: Operators MUST see all subscriptions with their status, reference
  and site, and MUST be able to act on them.

### Key Entities *(include if feature involves data)*

- **Subscription**: A customer's commitment — who it belongs to (an account or
  an organization), which site, the priced snapshot, term, cadence,
  installation day, term end, payment method, status, reservation expiry, and
  a payment reference.
- **Subscription Line**: One plant size in the snapshot with unit price,
  quantity and line total, exactly as priced when ordered.
- **Status Event**: An immutable record of each status transition, who made it
  and when.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A customer with a basket goes from "place order" to a subscription
  page in under 90 seconds, with no step that needs a human.
- **SC-002**: 100% of subscriptions snapshot a monthly total equal to what the
  system of record priced at the instant of ordering.
- **SC-003**: Available stock after any sequence of orders and cancellations
  equals the seeded stock minus every active or pending reservation, with zero
  drift under the automated race test.
- **SC-004**: 100% of orders below the zone minimum, or with an installation
  day the zone does not serve, are refused with the reason named.
- **SC-005**: Zero subscriptions visible across account or organization
  boundaries under the automated access-control suite.

## Assumptions

- Payment by invoice is the only method in this feature. Card payment through
  a payment processor is deferred: the launch customer is an office that pays
  against an invoice, and a processor account cannot exist until the trade
  licence does. The data model leaves a clear seam — a payment method and a
  "mark paid" transition — for a processor's webhook to use later.
- No recurring billing runs. This feature records the first month's amount due
  and the monthly total; invoicing subsequent months belongs to a later feature.
- No visits are generated. Feature 004 creates visits from active
  subscriptions.
- The rotation entitlement in the PRD is deferred to feature 005.
- Bank details shown on the invoice are operator-configured text, not a
  payments integration.
- The reservation window for an unpaid subscription is seven days.
- Term end is the installation day plus the term's months. Renewal behaviour at
  the end of term is a later feature.
- Public holidays are not modelled; operators reschedule by hand.
