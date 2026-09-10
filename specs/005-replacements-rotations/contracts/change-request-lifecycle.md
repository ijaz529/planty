# Contract: Plant Change Request Lifecycle

**Feature**: `005-replacements-rotations` · **Date**: 2026-09-10

## States

```
requested ──approve──▶ approved ──technician marks done──▶ fulfilled
    │                      │
    ├──decline────────────┴──▶ declined
    └──customer withdraws─────▶ withdrawn
```

`declined`, `withdrawn` and `fulfilled` are terminal. Only `requested` and
`approved` count against the rotation allowance, so declining or withdrawing
returns the credit without any counter being touched.

## `request_plant_change(line_id, kind, requested_variant_id, reason) → uuid`

Customer of the subscription. Refuses, in order:

1. Subscription not active → `this subscription is not active`.
2. An open request already on that line → `that plant already has an open request`.
3. `kind = 'rotation'` and `rotations_remaining() = 0` →
   `no rotations left until <date>`.
4. `kind = 'rotation'` and the wanted plant is unpublished or out of stock →
   `choose a plant that is in stock`.

A `replacement` needs no allowance and no target plant.

## `decide_plant_change(request_id, approve, note)`

Operator only. On approve, sets `visit_id` to the earliest planned visit at that
subscription's site. Refuses a rotation whose wanted plant has since gone out of
stock, leaving the credit with the customer.

## `withdraw_plant_change(request_id)`

Customer, while `requested` or `approved`. Idempotent.

## `fulfil_plant_change(request_id)`

Assigned technician or operator, from `approved` only. Moves stock: the incoming
plant's `stock_allocated` rises, the outgoing plant's falls. Refuses with
`not enough <plant> in stock` and leaves the request open.

## Invariants the tests assert

1. `rotations_remaining` always equals allowance minus `requested` + `approved`
   + `fulfilled` rotations in the current 90-day window (SC-003).
2. Declining or withdrawing a rotation restores the count exactly.
3. Exhausting rotations never blocks a replacement (FR-007).
4. At most one open request per line.
5. Approving attaches the request to the next planned visit at that site (SC-005).
6. Fulfilment moves stock both ways and never below zero.
7. No request is visible across customer or organization boundaries (SC-006).
