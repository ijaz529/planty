# Phase 0 Research: Stock Ledger & Depot

**Feature**: `006-stock-ledger` · **Date**: 2026-09-10

## R1 — A ledger, not per-plant identity

**Decision**: Stock stays counted per plant size. Every change writes an
immutable `stock_movements` row. Individual physical plants get no identity, no
label and no history in this release.

**Rationale**: The question the business needs answered is how fast plants are
consumed — the PRD names a replacement rate above four percent a month as a
reason to change the palette or the pricing, and today nothing records a
write-off at all, so the number cannot be produced. A ledger of counts answers
that completely. Per-unit identity answers a different question — which specific
plant to recover or retire — which is a fleet-management problem Planty does not
have with one technician and tens of plants.

**Feature 001 deferred "tracking individual plants as assets" to this feature.**
A deferral is not a commitment, and building it now would be the speculative
abstraction principle VII forbids. The trigger to revisit is stated in the spec:
when Planty needs to know which specific plant to recover, not merely how many.

**Alternatives considered**: an `assets` table with QR labels per pot, as the
trade does. It adds a scan to every visit, which works against the two-minute
stop target from feature 004, and it answers nothing the pilot is asking.

## R2 — Four counts, one of them derived

**Decision**: `stock_total` (owned), `stock_allocated` (with customers),
`stock_recovering` (back from a swap, not yet fit to send), and
`stock_available` generated as `total − allocated − recovering`.

**Rationale**: A plant returned from a customer is not sellable the moment it
lands — the operations research is explicit that returned stock needs recovery
and acclimatisation. Putting it straight back into ready-to-send would let the
catalogue promise a plant nobody would actually ship. A third count makes the
distinction visible instead of pretending.

**Consequence**: `stock_available` is an existing generated column and must be
dropped and recreated with the new expression. Feature 002's pricing reads it
and needs no change, because the meaning — what can be sold — is unchanged.

## R3 — One function writes every movement

**Decision**: `record_stock_movement()` is the only place any count changes. The
three existing flows that mutate stock — placing an order, cancelling one, and
carrying out a swap — are rewritten to call it.

**Rationale**: FR-001 and SC-002. A ledger that records only new movements would
be worse than none, because it would look complete while the counts drifted from
it. Retrofitting the existing flows is most of this feature's work and is the
part that makes the ledger trustworthy.

**Guard placement**: the function enforces that owned never falls below
allocated plus recovering, so no caller can produce an impossible position.

## R4 — A replacement writes off a plant

**Decision**: Fulfilling a replacement writes off one unit per plant replaced
and leaves the customer's allocation untouched. Owned falls; with-customers does
not.

**Rationale**: The customer still has the same number of plants — a fresh one
took the dead one's place. Planty owns one fewer, because one died. Feature 005
left this as a deliberate gap with a note pointing here; this is that gap
closed, and it is what makes the replacement rate countable.

**Refusal**: if nothing is ready to send, the fulfilment is refused naming the
plant, so an operator can offer a substitute rather than the request failing
silently.

## R5 — The metric is computed from the ledger

**Decision**: `replacement_rate(p_days)` returns written-off units over the
period against the average fleet, or null when there is no fleet to divide by.

**Rationale**: SC-004 says the rate must be reproducible from the ledger alone.
Deriving it means no counter to maintain and no second version of the truth.
Returning null rather than zero for an empty fleet keeps a meaningless number
off an operator's screen (FR-012).
