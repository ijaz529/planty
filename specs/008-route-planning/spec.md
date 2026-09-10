# Feature Specification: Route Planning

**Feature Branch**: `008-route-planning`
**Created**: 2026-09-10
**Status**: Draft
**Input**: Founder description: "On my side I'll have one person for maintenance
and replacing the plants, as per an algorithm to suggest the most efficient
route."

## Why this exists

Planty has one technician. Feature 004 gave them a day of stops and feature 005
gave them work to do at each one, but the order of those stops is typed in by
hand, one sequence number at a time. Nobody can hold a good route in their head,
and the operator typing the numbers has no idea whether their order is good.

Feature 007 made this urgent rather than merely untidy. At AED 5 a plant, the
service fee is the only line that pays a salary, and the arithmetic in that
feature's research rests entirely on ten stops a day. At six stops the margin
roughly halves. Stops per day is now the number the business turns on, and it is
decided by the order somebody drives them in.

This is the constitution's first principle arriving as software: route density
is the business.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The operator asks for a route and gets one (Priority: P1)

An operator looks at a day with a handful of stops on it, asks for a route, and
sees an order to drive them in, starting and finishing at the depot, with the
distance it comes to. They apply it in one action, or ignore it and keep their
own order.

**Why this priority**: It is the whole feature. Everything else refines it.

**Independent Test**: On a day with several assigned stops, ask for a route, see
an order and a distance, apply it, and see the stops renumbered.

**Acceptance Scenarios**:

1. **Given** a day with stops that have addresses, **When** the operator asks
   for a route, **Then** they see the stops in a suggested order with the total
   driving distance.
2. **Given** a suggested route, **When** the operator applies it, **Then** every
   stop is renumbered in that order and the technician's day reflects it.
3. **Given** a suggested route, **When** the operator ignores it, **Then**
   nothing changes and they can still set an order by hand.
4. **Given** a route has been applied, **When** the operator asks again after
   adding a stop, **Then** the new suggestion includes it.
5. **Given** anyone who is not an operator, **When** they attempt to apply a
   route, **Then** it is refused.

---

### User Story 2 - The suggestion is better than the order it replaces (Priority: P2)

The suggested order is meaningfully shorter than the arbitrary order it came in,
and never longer.

**Why this priority**: A suggestion nobody trusts is a button nobody presses. It
depends on US1 existing.

**Independent Test**: Against a set of stops with a known best answer, the
suggestion matches it; against random sets, it is never worse than the order it
started from.

**Acceptance Scenarios**:

1. **Given** stops arranged so one order is obviously shortest, **When** a route
   is suggested, **Then** it is that order.
2. **Given** any set of stops, **When** a route is suggested, **Then** its total
   distance is never greater than the unsorted order's.
3. **Given** a day with one stop, **When** a route is suggested, **Then** it is
   that stop, with the distance out and back.
4. **Given** a day with no stops, **When** a route is suggested, **Then** it says
   so rather than failing.

---

### Edge Cases

- A site with no coordinates: it cannot be routed, and it is listed as such and
  placed at the end rather than silently dropped.
- Two sites at the same address: both appear, in either order, and the distance
  between them is zero.
- Stops assigned to nobody: routed all the same, because the order of the day is
  the same question whoever drives it.
- A day with a finished stop on it: finished stops keep their number and are not
  reordered, because they already happened.
- No depot set: the route cannot start anywhere, so the operator is told to set
  one rather than given a route from an arbitrary point.

## Requirements *(mandatory)*

**The depot**

- **FR-001**: The system MUST hold one depot location, the point a technician
  starts and finishes a day at.
- **FR-002**: Only operators MAY change it. Technicians MAY read it.

**Suggesting**

- **FR-003**: The system MUST order a day's unfinished stops to reduce total
  driving distance, starting and finishing at the depot.
- **FR-004**: The suggestion MUST never be longer than the order it replaces.
- **FR-005**: The total distance MUST be shown with the suggestion, so an
  operator can see whether applying it is worth anything.
- **FR-006**: Stops whose site has no coordinates MUST be reported and placed
  last, never dropped.
- **FR-007**: A suggestion MUST NOT change anything until an operator applies it.

**Applying**

- **FR-008**: Applying a route MUST renumber the day's unfinished stops in the
  suggested order.
- **FR-009**: Only an operator MAY apply a route.
- **FR-010**: Applying MUST refuse a set of stops that are not all on one day.
- **FR-011**: A finished stop MUST NOT be renumbered.

### Key Entities

- **Depot**: One location, with a label, that a route starts and finishes at.

## Success Criteria *(mandatory)*

- **SC-001**: An operator can order a day of stops in one action.
- **SC-002**: The suggestion is never longer than the order it replaces, across
  the whole random test set.
- **SC-003**: On a set of stops with a known shortest order, the suggestion finds
  it.
- **SC-004**: 100% of attempts to apply a route by anyone but an operator are
  refused.
- **SC-005**: Zero stops are dropped from a suggestion, including ones that
  cannot be routed.

## Assumptions

- **Straight-line distance, not driving distance.** Planty has no routing
  service and no map data. Straight lines between points rank orders well enough
  to beat typing numbers by hand, and every figure shown says it is as the crow
  flies rather than implying a satnav's answer. A real distance matrix is the
  obvious next step and it changes only how two points are measured, not the
  algorithm around it.
- **No time windows, traffic or service durations.** A stop takes as long as it
  takes and any hour will do. Real constraints belong here eventually; guessing
  at them now would produce worse routes than ignoring them.
- **One vehicle.** There is one technician. Splitting a day between two people is
  a different problem and Planty does not have it yet.
- **The operator decides.** The algorithm suggests and the operator applies. A
  route that quietly rewrote itself would take away the local knowledge that
  makes a route good — which building is impossible before ten, whose loading
  bay is shut on a Tuesday.
