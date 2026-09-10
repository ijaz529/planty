# Phase 0 Research: Replacements & Rotations

**Feature**: `005-replacements-rotations` · **Date**: 2026-09-10

## R1 — One request table, two kinds

**Decision**: A single `plant_change_requests` table with a `kind` of
`replacement` or `rotation`. Both end the same way: a technician swaps a plant
at the next visit.

**Rationale**: The mechanism is identical — pick a line, say why, an operator
approves, a technician carries it out. What differs is the meaning: a
replacement is Planty honouring its guarantee and is free and unlimited; a
rotation is the customer exercising a counted entitlement. Two tables would
duplicate the whole lifecycle to express one enum.

**Why the distinction matters and must stay visible**: they are opposite
promises. Confusing them would either meter the guarantee — breaking the
product's central claim — or make seasonal variety unlimited, which the
research shows is uneconomic. The customer sees them as two different actions
with two different costs.

## R2 — The quarter is 90 days from installation

**Decision**: A subscription's rotation allowance renews every 90 days counted
from its installation date. `rotation_period_start(subscription)` returns the
current window's start; remaining is the allowance minus rotations in that
window that were not returned.

**Rationale**: Calendar quarters would give a customer who joined in March a
two-week first quarter. The trade rotates seasonal colour roughly quarterly, so
90 days matches the practice without punishing when someone joined.

**Alternatives considered**: calendar quarters (uneven first period); per
billing month (too frequent for seasonal planting, and the research says colour
rotations run four to eight weeks at the fastest).

## R3 — Remaining is computed, never stored

**Decision**: No `rotations_used` counter. Remaining is derived from the
requests in the current window: allowance minus those in state `requested`,
`approved` or `fulfilled`. Declined and withdrawn requests simply stop counting.

**Rationale**: SC-003 says the number shown must always equal the truth. A
stored counter has to be decremented on spend and incremented on decline and on
withdrawal and on cancellation, and one missed path makes it lie forever.
Deriving it means "returning a credit" is just a state change, and FR-008 needs
no code at all.

## R4 — Stock moves at fulfilment, not approval

**Decision**: An approved rotation or replacement reserves nothing. When the
technician marks it carried out, the incoming plant's `stock_allocated` rises
and the outgoing plant's falls, in one statement.

**Rationale**: An approval is an intention; a fulfilment is a fact. Holding
stock for requests that may sit for a week would starve new orders of plants
that are physically on the shelf, which is the same failure the reservation
window in feature 003 exists to bound.

**Consequence, accepted**: an approved rotation can fail at the stop because the
plant ran out. The technician sees that plainly and the request stays open, so
nothing is silently lost.

## R5 — Approved requests reach the technician through the visit

**Decision**: Approval sets `visit_id` to the next planned visit at that site.
The technician's stop screen reads requests by that visit.

**Rationale**: FR-011 and FR-012. The technician's day is already built around
visits; attaching work to the visit means it appears where they are already
looking, with no second inbox to check.

## R6 — Guarantee exclusions are operator text

**Decision**: An `operator_settings` row, `replacement_exclusions`, rendered on
every subscription page.

**Rationale**: Constitution V requires the exclusions to be stated in the
customer's own contract view — a requirement the product has not met until now.
Making it a setting rather than a constant means the wording can follow legal
advice without a deploy, exactly like the bank details in feature 003.
