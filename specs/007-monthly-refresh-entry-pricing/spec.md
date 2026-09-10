# Feature Specification: Monthly Refreshes & Entry Pricing

**Feature Branch**: `007-monthly-refresh-entry-pricing`
**Created**: 2026-09-10
**Status**: Draft
**Input**: Founder description: "It's a subscription and I can't change the
plant an unlimited number of times (max 2 per month). Price needs to be much
cheaper — starting from 5 dirhams a month per plant, unlimited refreshes."

## Why this exists

Planty priced a desk plant at AED 45 a month and let a customer swap it twice a
quarter. Both numbers were guesses made before anyone had sold anything. The
founder has replaced them: a plant starts at AED 5 a month, and a customer may
swap twice a month rather than twice a quarter.

The two halves of the sentence look contradictory — "max 2 per month" next to
"unlimited refreshes" — and they are not. They describe the two different things
Planty already sells, and this feature keeps them apart:

- A **refresh** is Planty replacing a plant that is tired or declining with a
  fresh one of the same kind. Planty decides it, it is free, and it is
  unlimited. That is the product.
- A **swap** is the customer choosing a different plant because they fancy a
  change. The customer decides it, and it is counted.

Nothing about refreshes changes here. What changes is that the swap window
shortens from ninety days to thirty, and every price falls.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A plant costs about what a coffee costs (Priority: P1)

Someone who would never have paid AED 45 a month for a pot plant sees a price
starting at AED 5 and puts four on the page before thinking about it. The price
they see is the price they pay, as it always was.

**Why this priority**: The whole pivot is the price. Everything else in this
feature is bookkeeping around it.

**Independent Test**: Open the catalogue signed out and see prices from AED 5.
Build a basket and see it priced from the new list with no surprises at
checkout.

**Acceptance Scenarios**:

1. **Given** anyone opening the catalogue, **When** they read the prices,
   **Then** the cheapest published plant is AED 5 a month and the range is
   visible without an account.
2. **Given** a customer building a basket, **When** they price it, **Then**
   every line uses the current list price and the total is the sum they were
   shown.
3. **Given** a small order, **When** it is priced in a served zone, **Then** the
   zone minimum does not silently inflate it past what the catalogue implied.
4. **Given** a subscription already running, **When** prices change, **Then**
   that subscription keeps the price it was sold at.

---

### User Story 2 - Two swaps a month, and they renew monthly (Priority: P2)

A customer swaps a plant, swaps another, and is told they have none left until a
date about a month away rather than a season away. Asking for a struggling plant
to be replaced is still free and still unlimited.

**Why this priority**: It is the second half of the founder's sentence, and the
cheaper the plant the more often somebody will want a different one.

**Independent Test**: Spend both swaps, be refused the third with a date inside
thirty days, and still be able to request a free replacement.

**Acceptance Scenarios**:

1. **Given** an active subscription, **When** the customer views their swaps,
   **Then** they see how many remain **this month** and the date they renew.
2. **Given** two swaps spent this month, **When** the customer tries a third,
   **Then** it is refused and the renewal date named is within thirty days of
   the window's start.
3. **Given** a spent allowance, **When** the customer reports an unwell plant,
   **Then** the replacement is accepted, free, and does not touch the count.
4. **Given** a window that has rolled over, **When** the customer views their
   swaps, **Then** the allowance is whole again and swaps spent in the previous
   window do not reduce it.

---

### Edge Cases

- A subscription created before this change: its window shortens from the next
  boundary, and swaps already spent in the old ninety-day window are counted
  against whichever thirty-day window they fall in. Nobody is charged twice for
  the same swap.
- A swap requested before installation: still lands in the first window, which
  opens when the subscription was created.
- A zone minimum above the price of a small order: the customer is told the
  minimum applies and why, as before. The minimum falls so that this is rare
  rather than routine.
- The cheapest plant going out of stock: the catalogue still says what the range
  starts at for plants that can be ordered.

## Requirements *(mandatory)*

**Pricing**

- **FR-001**: Published plant prices MUST start at AED 5 a month, with a size
  premium that keeps larger plants dearer than desk plants.
- **FR-002**: Prices MUST remain operator-editable data, changeable without a
  deploy, as they are today.
- **FR-003**: A running subscription MUST keep the price it was sold at when the
  list changes.
- **FR-004**: The zone minimum MUST NOT routinely override the price the
  catalogue advertises; it MUST be set low enough that an ordinary small order
  clears it.

**Swaps**

- **FR-005**: The swap allowance MUST renew every thirty days rather than every
  ninety.
- **FR-006**: The number remaining and the renewal date MUST be visible to the
  customer, and both MUST say "this month".
- **FR-007**: Refusing a swap MUST name the renewal date.
- **FR-008**: Replacements MUST remain free and unlimited and MUST NOT consume a
  swap.

### Key Entities

No new entities. `rotation_allowance` keeps its meaning and changes its period.

## Success Criteria *(mandatory)*

- **SC-001**: The cheapest published plant is AED 5 a month.
- **SC-002**: The swap window is thirty days, with zero drift under the
  automated test.
- **SC-003**: 100% of swap refusals name a date within thirty days of the
  window's start.
- **SC-004**: Zero running subscriptions change price when the list changes.
- **SC-005**: An order of a handful of desk plants in a served zone is priced
  from the list, not from the minimum.

## Assumptions

- "Unlimited refreshes" is the promise Planty already makes: a declining plant
  is replaced free, as often as needed. It is marketing language for the
  replacement guarantee, not a new entitlement, and it is why the swap cap and
  the word "unlimited" can sit in the same sentence.
- The service fee is untouched. At AED 5 a plant the service fee is what pays
  the person who does the visiting, and cutting it would break the economics the
  price cut relies on. See `research.md`.
- The price ladder below is a starting point chosen to honour "from AED 5" while
  keeping a real premium for floor and statement plants. Every number is
  operator-editable, which is the point: the founder tunes them against real
  sales rather than against this document.
- Existing subscriptions are not re-priced. Re-pricing a live subscription is a
  bigger decision than this feature should make on its own — the same
  reservation feature 005 recorded.
