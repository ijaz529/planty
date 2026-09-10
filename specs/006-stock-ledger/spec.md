# Feature Specification: Stock Ledger & Depot

**Feature Branch**: `006-stock-ledger`
**Created**: 2026-09-10
**Status**: Draft
**Input**: User description: "Ops console: stock and asset management, replacement fulfilment, and the plant consumption the business needs to see."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Planty can see how fast it is burning plants (Priority: P1)

An operator opens the depot and sees, for every plant, how many Planty owns,
how many are out with customers, how many came back and are recovering, and how
many are ready to send. Under that is the number that decides the business:
what share of the fleet was written off in the last month, against the target.

**Why this priority**: The replacement guarantee is Planty's central promise and
its largest uncosted risk. The PRD calls a replacement rate above four percent a
month a reason to change the plant palette or the pricing. Today nothing records
a write-off at all, so that number cannot be produced. Everything else in this
feature exists to make it true.

**Independent Test**: With seeded stock, write off a plant, receive a delivery,
and see both in the ledger with their reasons, the counts move accordingly, and
the replacement rate reflects the write-off.

**Acceptance Scenarios**:

1. **Given** an operator opening the depot, **When** they view a plant, **Then**
   they see owned, with customers, recovering and ready-to-send counts that add
   up.
2. **Given** any change to stock, **When** an operator views the ledger, **Then**
   they see what moved, by how much, why, when and who did it.
3. **Given** write-offs in the last month, **When** an operator views the depot,
   **Then** they see the replacement rate as a share of the fleet, next to the
   target it must stay under.
4. **Given** an operator receiving a delivery, **When** they record it, **Then**
   the owned and ready-to-send counts rise and a movement records the reason.
5. **Given** anyone who is not an operator, **When** they attempt to change
   stock, **Then** it is refused.

---

### User Story 2 - A replacement costs Planty a plant, and it shows (Priority: P2)

When a technician marks a replacement carried out, the plant that died leaves
the fleet and a fresh one takes its place at the customer. The customer's count
is unchanged; Planty owns one fewer. When a swap is carried out, the plant that
comes back is not immediately sellable — it goes into recovery until an operator
says it is fit to send out again.

**Why this priority**: This is the honest accounting of the guarantee. Without
it the depot slowly empties while the numbers say nothing changed, and the
replacement rate in US1 has nothing to count.

**Independent Test**: Fulfil a replacement and see owned fall by one with a
write-off movement, while the customer's allocation stays put. Fulfil a swap and
see the outgoing plant land in recovery rather than back on the shelf.

**Acceptance Scenarios**:

1. **Given** an approved replacement, **When** the technician marks it carried
   out, **Then** one unit of that plant is written off, the customer keeps the
   same number allocated, and both facts appear in the ledger.
2. **Given** a replacement with no spare of that plant in the depot, **When** the
   technician tries to carry it out, **Then** it is refused naming the plant, and
   nothing is written off.
3. **Given** an approved swap, **When** it is carried out, **Then** the incoming
   plants are allocated and the outgoing ones move into recovery, not back into
   ready-to-send.
4. **Given** plants in recovery, **When** an operator returns them to stock,
   **Then** they become ready to send and a movement records it.
5. **Given** a plant that did not survive recovery, **When** an operator writes
   it off, **Then** it leaves the fleet with its reason recorded.

---

### User Story 3 - Every existing movement of stock is in the ledger too (Priority: P3)

Orders, cancellations and swaps already move stock. All of them appear in the
ledger with their reason and the subscription they belong to, so the counts can
always be explained and never merely asserted.

**Why this priority**: A ledger that records only some movements is worse than
none, because it looks complete. It depends on the ledger existing.

**Independent Test**: Place an order, cancel it, and see an allocation and a
release in the ledger, each naming the subscription.

**Acceptance Scenarios**:

1. **Given** an order is placed, **When** the ledger is viewed, **Then** an
   allocation movement exists for every line, naming the subscription.
2. **Given** a subscription is cancelled, **When** the ledger is viewed, **Then**
   a release movement exists for every line.
3. **Given** any plant, **When** its movements are summed from the beginning,
   **Then** the totals equal the counts shown on the plant.
4. **Given** a movement, **When** anyone tries to change or delete it, **Then**
   it is refused, because the ledger is a record of what happened.

---

### Edge Cases

- Writing off more than are in the depot: refused, naming what is available.
- Receiving a negative or zero quantity: refused.
- A replacement for a plant Planty no longer stocks: refused with the reason, so
  an operator can offer a substitute rather than a silent failure.
- Recovery of plants that were never allocated: impossible, since recovery is
  only ever entered from a swap.
- Writing off a plant while some are out with customers: allowed, because a dead
  plant in the depot is unrelated to plants in the field, but never below the
  number allocated plus recovering.
- The replacement rate when the fleet is empty: shown as unavailable rather than
  as a division by zero.

## Requirements *(mandatory)*

### Functional Requirements

**The ledger**

- **FR-001**: Every change to any stock count MUST write a movement recording
  the plant, the amounts moved, the reason, the time, who did it, and the
  subscription or request it belongs to where there is one.
- **FR-002**: Movements MUST be immutable — no update, no delete, by anyone.
- **FR-003**: The sum of all movements for a plant MUST equal its current
  counts.
- **FR-004**: Only operators MAY record movements directly; everything else
  MUST go through the flows that already exist.

**Depot counts**

- **FR-005**: Each plant MUST carry: how many Planty owns, how many are out with
  customers, how many are recovering, and how many are ready to send, where
  ready-to-send is what remains after the other two.
- **FR-006**: Ready-to-send MUST never be negative, and owned MUST never fall
  below what is out with customers plus recovering.
- **FR-007**: An operator MUST be able to receive a delivery, write off a plant
  with a reason, and return recovered plants to stock.

**Consumption**

- **FR-008**: Carrying out a replacement MUST write off one unit of that plant
  per plant replaced and leave the customer's allocation unchanged.
- **FR-009**: A replacement MUST be refused when the depot has none ready to
  send, naming the plant.
- **FR-010**: Carrying out a swap MUST move the outgoing plants into recovery
  rather than straight to ready-to-send.

**The metric**

- **FR-011**: The system MUST report, for a period, how many plants were written
  off as a share of the fleet, and MUST present it against the target.
- **FR-012**: The metric MUST be unavailable rather than misleading when there
  is nothing to divide by.

### Key Entities *(include if feature involves data)*

- **Stock Movement**: One recorded change to a plant's counts — which plant, how
  much moved in each count, why, when, by whom, and what it belonged to.
- **Depot Position**: A plant's current counts — owned, with customers,
  recovering, ready to send.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every plant, the sum of its movements equals its current
  counts exactly, with zero drift under the automated test.
- **SC-002**: 100% of stock changes, from any flow, write a movement.
- **SC-003**: An operator can find why a plant's count changed, and when, in
  under one minute.
- **SC-004**: The replacement rate for a period is reproducible from the ledger
  alone.
- **SC-005**: 100% of attempts to write off more than are available are refused.
- **SC-006**: Zero movements can be altered or removed once written.

## Assumptions

- Stock is counted per plant size, not per physical plant. Individual plant
  identity — a label on a pot, an age, a history of which customers it lived
  with — is deferred. The business question this feature answers is how fast
  plants are consumed, and a count answers it. Per-unit identity earns its place
  when Planty needs to know which specific plant to recover or retire, which is
  a fleet-management problem it does not yet have.
- Recovering plants return to stock only when an operator says so. Automatic
  recovery after a fixed period would guess at plant health.
- A replacement is like for like: the same plant, a fresh unit. Substituting a
  different plant is a swap, and the customer chooses it.
- No purchase orders, supplier records or costs. The ledger records units, not
  money; plant cost per unit is a pricing question the research has not yet
  answered with real wholesale figures.
- No stocktake or reconciliation flow. An operator correcting a miscount uses an
  adjustment movement with a note.
