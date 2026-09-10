# Feature Specification: Moving the Depot

**Feature Branch**: `009-depot-location`
**Created**: 2026-09-10
**Status**: Draft
**Input**: Founder description: "Add a screen to move the depot."

## Why this exists

Feature 008 gave routes somewhere to start and finish, and seeded it to Al Quoz
because that is where most Dubai nurseries keep their stock. It gave nobody a
way to move it. Changing where Planty's van starts its day currently means
someone writing SQL against a geography column, with the longitude and latitude
the right way round.

That is the wrong shape of task to leave to a person. Every route the business
plans is measured from this one point, so a depot in the wrong place makes every
suggestion confidently wrong, and nothing on screen would say so.

The depot page already exists and already answers "what is in the depot". This
adds "and where it is".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - An operator moves the depot (Priority: P1)

An operator opens the depot page, sees where Planty starts its day on a map,
drags the pin to the new warehouse, names it, and saves. The next route planned
is measured from there.

**Why this priority**: It is the whole feature.

**Independent Test**: Move the pin, save, reload, and see the new position.
Plan a route and see the distance change.

**Acceptance Scenarios**:

1. **Given** an operator on the depot page, **When** they look at where it is,
   **Then** they see it on a map with its name.
2. **Given** an operator, **When** they drag the pin and save, **Then** the
   depot moves and the page confirms it.
3. **Given** a moved depot, **When** a route is planned, **Then** it is measured
   from the new position.
4. **Given** an operator who changes their mind, **When** they leave without
   saving, **Then** nothing moves.
5. **Given** anyone who is not an operator, **When** they attempt to move it,
   **Then** it is refused.

---

### Edge Cases

- No depot set at all: the screen offers to place one rather than showing an
  empty map, and saving creates it.
- A name left blank: refused, because "the depot" with no name is no more useful
  than a bare coordinate.
- The pin dropped outside any served zone: allowed. A depot is a warehouse, not
  a customer, and Planty may well store plants somewhere it does not sell.
- Two operators saving at once: last one wins. There is one depot and one van;
  contention here is not a real problem.

## Requirements *(mandatory)*

- **FR-001**: An operator MUST be able to see the depot's position on a map.
- **FR-002**: An operator MUST be able to move it by dragging a pin, and name
  it.
- **FR-003**: Saving MUST refuse an empty name.
- **FR-004**: Only operators MAY move the depot.
- **FR-005**: Saving MUST work whether or not a depot already exists.
- **FR-006**: The coordinates being saved MUST be visible, so a wrong pin is
  visible before it is saved rather than after.
- **FR-007**: There MUST remain exactly one depot.

## Success Criteria *(mandatory)*

- **SC-001**: An operator can move the depot without writing SQL.
- **SC-002**: 100% of attempts to move it by anyone but an operator are refused.
- **SC-003**: After a move, a planned route is measured from the new position.
- **SC-004**: There is never more than one depot row.

## Assumptions

- **The map is the address.** Dubai has no postal codes, which is why sites are
  placed by pin (feature 001, research R4). The depot is placed the same way, by
  the same component, so longitude and latitude cannot be transposed by hand.
- **No geographic validation.** A bounding box would put the market into the
  schema, and the constitution keeps market constants to a named handful of
  files. The map and the coordinates shown beside it are the check.
- **No history.** Where the depot used to be is not a question the business has.
  If it becomes one, the stock ledger is the precedent for how to answer it.
