# Feature Specification: Configure & Price

**Feature Branch**: `002-configure-and-price`
**Created**: 2026-09-10
**Status**: Draft
**Input**: User description: "Configure and price: browse the catalog, build a basket from plants or a starter bundle, choose a rental term and visit cadence, and see the exact monthly total update live, with the zone minimum enforced."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Someone builds a basket and sees what it costs (Priority: P1)

A visitor browsing the catalog adds plants to a basket, changes quantities, and
watches a running monthly total. They pick how long they want the plants and how
often a technician should visit, and the total updates for both. Nothing is
hidden behind a form: the number they see is the number they would be charged.

**Why this priority**: This is the product's whole differentiator. Feature 001
published prices; this turns them into an answer to "what would this cost me?"
Every competitor in the market makes a customer request a quote to get here, so
a working basket is the thing that makes Planty different from a brochure.

**Independent Test**: Without an account, add three plants, change a quantity,
switch from a 12-month to a 3-month term and from fortnightly to weekly visits,
and see the monthly total change correctly at each step. Reload and the basket
is still there.

**Acceptance Scenarios**:

1. **Given** a visitor on the catalog with an empty basket, **When** they add a
   plant size, **Then** the basket shows that plant, its quantity, its monthly
   price, and a monthly total that includes the recurring service fee.
2. **Given** a basket with items, **When** the visitor changes a quantity or
   removes a line, **Then** every total updates immediately and consistently.
3. **Given** a basket, **When** the visitor chooses a different rental term,
   **Then** the monthly price changes in the direction the term implies, and the
   saving or premium against the longest term is stated in money.
4. **Given** a basket, **When** the visitor switches visit cadence, **Then** the
   service fee changes, the change is labelled as a cadence change, and the
   plant prices do not move.
5. **Given** a visitor who is not signed in, **When** they build a basket,
   **Then** no account is requested at any point, and the basket survives a page
   reload.
6. **Given** a basket containing a plant whose stock has since run out, **When**
   the basket is priced, **Then** that line is flagged as unavailable, excluded
   from the total, and the visitor is told plainly.

---

### User Story 2 - A starter bundle gets someone to a number in one click (Priority: P2)

A visitor who does not know how many plants an office needs picks a starter
bundle — for example a small office — and lands on a fully populated basket at a
stated monthly price. They can then change anything in it.

**Why this priority**: The buyer is usually an office manager who has never
bought plants before and has no idea whether their floor needs eight plants or
thirty. A bundle turns an unfamiliar decision into a familiar one, and it sets
the anchor price. It depends on the basket existing, so it follows US1.

**Independent Test**: With no account, open the bundles, choose one, and arrive
at a basket whose contents and total match what the bundle advertised. Change a
quantity and the total moves off the bundle price.

**Acceptance Scenarios**:

1. **Given** published bundles, **When** a visitor views them, **Then** each
   shows its name, who it suits, what it contains, and its monthly price at the
   default term and cadence.
2. **Given** a bundle, **When** a visitor chooses it, **Then** their basket is
   replaced by that bundle's contents and the total matches the advertised
   price.
3. **Given** a bundle containing a plant that is out of stock, **When** it is
   displayed, **Then** it is shown as temporarily unavailable rather than
   offered at a price that cannot be honoured.
4. **Given** an operator, **When** they create or edit a bundle, **Then** the
   change is live for customers without a deploy.

---

### User Story 3 - The basket is checked against where the plants will go (Priority: P3)

A signed-in customer picks which of their sites the basket is for. If the basket
is worth less per month than Planty's minimum for that site's zone, they are
told what the minimum is and how far short they are, before they get any further.

**Why this priority**: A visit that does not pay for itself is the failure mode
that kills this kind of business, and the minimum is how the product refuses
one. It needs sites, so it follows the anonymous basket in US1 and US2.

**Independent Test**: Sign in, attach a basket below the zone minimum to a site,
and see a clear shortfall message; add plants until it clears and the message
goes away.

**Acceptance Scenarios**:

1. **Given** a signed-in customer with at least one site, **When** they open
   their basket, **Then** they can choose which site it is for.
2. **Given** a basket below the minimum for the chosen site's zone, **When** it
   is priced, **Then** the shortfall is shown in money and the basket cannot
   proceed.
3. **Given** a basket at or above the minimum, **When** it is priced, **Then**
   it can proceed and the chosen site's visit days are shown.
4. **Given** a visitor who is not signed in, **When** they build a basket,
   **Then** the minimum is shown as information, not as a blocker, because no
   site has been chosen yet.
5. **Given** a customer who belongs to an organization, **When** they choose a
   site, **Then** they can pick any site of theirs or of that organization.

---

### Edge Cases

- A price changes while a basket is open: the basket must reprice to the current
  price and say so, rather than silently honouring a stale number or silently
  changing the total.
- A variant is unpublished while it sits in someone's basket: the line is
  dropped from the total and explained.
- Quantities: zero removes the line; a quantity beyond available stock is capped
  and the cap is explained; negative and fractional quantities are impossible.
- A basket with only unavailable lines must not display a total that looks
  purchasable.
- Someone puts one small plant in a basket: the minimum makes this refusable,
  and the message must say what would make it work rather than only refusing.
- A bundle whose contents cost more than the bundle's stated price, or less:
  which number wins must be unambiguous.
- Rounding: the sum of the displayed lines must equal the displayed total. No
  penny that appears from nowhere.
- The same person prices the same basket signed out and signed in: they must get
  the same number.

## Requirements *(mandatory)*

### Functional Requirements

**Basket**

- **FR-001**: A visitor MUST be able to add published, in-stock plant sizes to a
  basket, change quantities, and remove lines, without an account.
- **FR-002**: The basket MUST survive a page reload for the same visitor.
- **FR-003**: The basket MUST reject quantities that are not whole numbers of one
  or more, and MUST cap a quantity at the available stock, saying so when it does.
- **FR-004**: A basket line whose variant is no longer published or no longer in
  stock MUST be shown as unavailable, excluded from the total, and explained.

**Pricing**

- **FR-005**: The monthly total MUST be computed as the sum of per-plant monthly
  prices times quantities, plus a recurring service fee determined by the chosen
  visit cadence, adjusted by a multiplier determined by the chosen rental term.
- **FR-006**: Pricing MUST be computed by the system of record, not by the
  browser, so that the price displayed is the price that would be charged.
- **FR-007**: The system MUST offer at least two rental terms and at least two
  visit cadences, each with its own effect on the total, all of them operator-
  editable data rather than fixed values.
- **FR-008**: A priced basket MUST break down into: each line with unit price and
  line total, the plants subtotal, the service fee, the term effect, and the
  monthly total. Displayed parts MUST sum to the displayed total.
- **FR-009**: The system MUST state the money difference between the chosen term
  and the cheapest available term, so the cost of flexibility is explicit.
- **FR-010**: Prices used MUST always be the current published prices; a basket
  MUST reprice rather than retain a stale total.

**Bundles**

- **FR-011**: An operator MUST be able to define bundles as a named set of plant
  sizes and quantities, with a description of who each suits, and publish or
  unpublish them.
- **FR-012**: A published bundle MUST display its monthly price computed from its
  contents at the default term and cadence, so a bundle can never advertise a
  price its contents do not produce.
- **FR-013**: Choosing a bundle MUST populate the basket with its contents, after
  which every line behaves like any other basket line.
- **FR-014**: A bundle containing an unavailable plant MUST be shown as
  temporarily unavailable rather than offered.

**Zone minimum**

- **FR-015**: Each service zone MUST carry a minimum monthly value, operator-
  editable.
- **FR-016**: A signed-in customer MUST be able to attach a basket to one of
  their own or their organization's sites.
- **FR-017**: When a site is chosen, the system MUST compare the monthly total
  against that site's zone minimum and MUST refuse to proceed while short,
  stating the shortfall in money.
- **FR-018**: When no site is chosen, the minimum MUST be shown as guidance
  rather than enforced.

### Key Entities *(include if feature involves data)*

- **Basket**: A visitor's working set of plant sizes and quantities, plus the
  chosen term, cadence and optionally a site. Belongs to the browser until an
  account exists.
- **Rental Term**: An offered commitment length with a label and a multiplier
  applied to the monthly total.
- **Visit Cadence**: An offered visit frequency with a label, the number of
  visits it implies per month, and the recurring service fee it carries.
- **Bundle**: A named, published starter set of plant sizes and quantities, with
  a description of the customer it suits.
- **Quote**: The priced result of a basket — its lines, subtotals, term effect,
  monthly total, and whether it meets the applicable minimum.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor with no account can go from the catalog to a complete
  monthly price for a realistic office in under 2 minutes, with no form and no
  contact step.
- **SC-002**: The price shown in the browser equals the price computed by the
  system of record for every basket, term and cadence combination under test.
- **SC-003**: Displayed line totals plus the service fee, adjusted by the term,
  equal the displayed monthly total exactly, with no rounding discrepancy.
- **SC-004**: 100% of baskets below a chosen site's zone minimum are refused
  with the shortfall named in money.
- **SC-005**: 100% of baskets containing an unpublished or out-of-stock plant
  exclude it from the total and say why.
- **SC-006**: An operator can change a price, a term multiplier, a cadence fee
  or a bundle and see it reflected in a customer-facing price within one page
  load, without a deploy.

## Assumptions

- No payment, checkout, subscription or order exists in this feature. It ends at
  a priced basket a customer believes. Feature 003 takes the money.
- The basket lives in the visitor's browser. Server-side baskets, cross-device
  carry-over and abandoned-basket recovery are deferred until accounts are known
  to matter for this step.
- One basket per visitor at a time. Saved or named baskets, and comparing two
  configurations side by side, are out of scope.
- Pricing is per-plant plus a per-site service fee, with a term multiplier. Other
  shapes — per square metre, per desk, per visit — are not modelled.
- Delivery, installation and replacement are included in the monthly price and
  are not separately priced lines. There is no setup fee, matching what the
  market does.
- The rotation entitlement described in the PRD is a property of a subscription,
  not of a basket, and belongs to a later feature.
- Discounts, promotional codes, negotiated rates and per-customer pricing are all
  out of scope; every visitor sees the same published price.
- VAT presentation is out of scope in this feature; prices are shown as the
  monthly amount in AED as the operator entered them.
- Prices themselves remain an unvalidated hypothesis, per the constitution. This
  feature must therefore treat every price, fee and multiplier as data an
  operator can change, and must not encode any particular level.
