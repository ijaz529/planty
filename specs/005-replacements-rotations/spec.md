# Feature Specification: Replacements & Rotations

**Feature Branch**: `005-replacements-rotations`
**Created**: 2026-09-10
**Status**: Draft
**Input**: User description: "Customer portal: ask for a declining plant to be replaced free under the guarantee, spend a counted rotation credit to swap a plant for something different, see the guarantee exclusions, and have operators triage requests onto the next visit."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A customer asks for an unhappy plant to be replaced (Priority: P1)

A customer sees on their subscription that a plant was marked declining at the
last visit, or simply notices one looks unwell. They ask for it to be replaced.
It costs nothing, because that is what Planty sells. They can see the request
was received and that it will be handled at the next visit.

**Why this priority**: "Plants that decline get replaced, not invoiced" is the
promise on the front page. Until a customer can act on it, it is marketing.
This is also the moment the guarantee's limits have to be visible, or the
promise is dishonest.

**Independent Test**: On a subscription with a plant marked declining, request a
replacement, see it acknowledged and attached to the next visit, and see the
guarantee's exclusions stated on the same page.

**Acceptance Scenarios**:

1. **Given** a customer viewing an active subscription, **When** they ask for a
   plant to be replaced and give a reason, **Then** the request is recorded at
   no charge and shown as received.
2. **Given** a plant marked declining at the last visit, **When** the customer
   views the subscription, **Then** that plant is offered for replacement
   without them having to describe the problem.
3. **Given** a request exists for a plant, **When** the customer tries to
   request the same plant again, **Then** they are told one is already open
   rather than creating a second.
4. **Given** any customer viewing a subscription, **When** they read the
   replacement guarantee, **Then** its exclusions are stated plainly on that
   page — damage by others, blocked access, plants moved without telling us,
   and conditions outside what was agreed.
5. **Given** a subscription that is not active, **When** the customer views it,
   **Then** no replacement can be requested.

---

### User Story 2 - A customer spends a rotation credit for something different (Priority: P2)

A customer is bored of a plant, or the season has turned. They swap it for a
different one from the catalogue. Each subscription gets a set number of these
each quarter; the customer can see how many are left and when they renew.
Spending the last one says so.

**Why this priority**: "A fresh set of plants, as per season" is the second half
of the pitch, and the constitution requires it to be a counted entitlement
rather than an open promise. It depends on the request machinery US1 builds.

**Independent Test**: Swap a plant for a different one, see the remaining count
fall by one, and see the request attached to the next visit. Exhaust the
allowance and see further swaps refused with the renewal date.

**Acceptance Scenarios**:

1. **Given** an active subscription with rotations remaining, **When** the
   customer picks a plant to swap and a different one to receive, **Then** the
   swap is recorded and the remaining count falls by one.
2. **Given** a customer viewing a subscription, **When** they look at rotations,
   **Then** they see how many remain this quarter and the date the allowance
   renews.
3. **Given** a subscription with no rotations left, **When** the customer tries
   to swap, **Then** it is refused, the renewal date is named, and asking for a
   declining plant to be replaced is still possible and still free.
4. **Given** a swap request, **When** the customer picks the replacement plant,
   **Then** only plants that are published and in stock can be chosen.
5. **Given** a swap that an operator declines, **When** the customer views it,
   **Then** the rotation credit is returned to them.

---

### User Story 3 - Planty acts on the requests (Priority: P3)

An operator sees every open request, approves or declines it with a reason, and
it appears on the technician's next stop at that site so it is actually done.
The technician marks it carried out.

**Why this priority**: A request nobody acts on is worse than no request at all.
It depends on both request kinds existing.

**Independent Test**: As an operator, approve a replacement; as the technician
assigned to that site's next visit, see it listed on the stop and mark it done;
as the customer, see it fulfilled.

**Acceptance Scenarios**:

1. **Given** open requests, **When** an operator views them, **Then** they see
   the customer, the site, the plant, the kind and the reason, oldest first.
2. **Given** a request, **When** an operator approves it, **Then** it is
   attached to the next planned visit at that site and the customer sees it as
   approved.
3. **Given** a request, **When** an operator declines it with a reason, **Then**
   the customer sees the decline and its reason, and a rotation credit is
   returned.
4. **Given** an approved request, **When** the technician opens that stop,
   **Then** they see what to bring and what to take away, and can mark it done.
5. **Given** a fulfilled request, **When** anyone views it, **Then** it shows as
   done with the date it happened.

---

### Edge Cases

- A plant is requested for replacement and then the subscription is cancelled:
  open requests close with the subscription.
- An operator approves a rotation for a plant that has since gone out of stock:
  the approval is refused with the reason, and the credit stays with the
  customer.
- A customer requests a rotation, an operator approves, then the customer
  changes their mind: they can withdraw while it is still unfulfilled, and the
  credit returns.
- Two members of the same organization request the same plant: the second is
  told one is already open.
- The quarter rolls over with requests still open: the allowance renews, and the
  open request stays attached to the quarter it was made in.
- A replacement request on a plant whose line has several plants: the request is
  about that line, and the customer says how many in the reason.

## Requirements *(mandatory)*

### Functional Requirements

**Replacements**

- **FR-001**: A customer MUST be able to request replacement of a plant on an
  active subscription of theirs, at no charge and with no limit on how many.
- **FR-002**: The system MUST highlight plants recorded as declining or needing
  attention at the most recent visit as candidates for replacement.
- **FR-003**: The system MUST prevent a second open request for a plant that
  already has one.
- **FR-004**: The replacement guarantee's exclusions MUST be stated on the
  customer's own subscription page.

**Rotations**

- **FR-005**: Each subscription MUST carry a rotation allowance per quarter,
  visible to the customer along with how many remain and when they renew.
- **FR-006**: A customer MUST be able to spend a rotation to swap one plant for
  a different published, in-stock plant.
- **FR-007**: A rotation MUST be refused when none remain, naming the renewal
  date, and MUST NOT prevent a free replacement request.
- **FR-008**: A declined or withdrawn rotation MUST return its credit.
- **FR-009**: The allowance MUST be operator-editable per subscription.

**Handling**

- **FR-010**: An operator MUST see open requests with customer, site, plant,
  kind and reason, and MUST be able to approve or decline with a reason.
- **FR-011**: Approving a request MUST attach it to the next planned visit at
  that site.
- **FR-012**: A technician MUST see approved requests on the stop, saying what
  to bring and what to remove, and MUST be able to mark them carried out.
- **FR-013**: Every request MUST record who changed its state and when.
- **FR-014**: Requests MUST be visible to the subscription's customer, the
  assigned technician and Planty staff, and to nobody else.

### Key Entities *(include if feature involves data)*

- **Plant Change Request**: One asked-for change to a subscription — which
  plant, whether it is a free replacement or a counted rotation, what is wanted
  instead, the reason, its state, the visit it is attached to, and who acted.
- **Rotation Allowance**: How many rotations a subscription may spend per
  quarter, and which quarter is current.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A customer can request a replacement in under 30 seconds from
  opening their subscription.
- **SC-002**: 100% of subscription pages state the replacement guarantee's
  exclusions.
- **SC-003**: The rotations remaining shown to a customer always equals the
  allowance minus rotations spent and not returned in the current quarter, with
  zero drift under the automated test.
- **SC-004**: 100% of rotation attempts beyond the allowance are refused with
  the renewal date named.
- **SC-005**: 100% of approved requests appear on the next planned visit at that
  site.
- **SC-006**: Zero requests visible across customer or organization boundaries
  under the automated access-control suite.

## Assumptions

- A quarter is a 90-day window from the installation date. Calendar quarters
  would renew unevenly for customers who joined mid-quarter.
- Replacement is free and unlimited because that is the product promise. Abuse
  is handled by an operator declining with a reason, not by a counter.
- A rotation swaps one subscription line for a different plant at the same
  quantity. Changing quantities, adding plants or removing them is a change to
  the subscription itself and belongs to a later feature.
- The monthly price does not change when a rotation swaps plants of different
  list prices in this release. Re-pricing a live subscription is a bigger
  decision than this feature should make on its own.
- Stock for an approved rotation or replacement is reserved when the technician
  marks it carried out, not at approval. Holding stock for unfulfilled requests
  would starve new orders.
- The guarantee's exclusion text is operator-editable, like the bank details.
- No notifications are sent. The customer sees state on their subscription page.
