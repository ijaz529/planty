# Contract: Stock Ledger

**Feature**: `006-stock-ledger` · **Date**: 2026-09-10

## The four counts

```
owned          stock_total
with customers stock_allocated
recovering     stock_recovering
ready to send  stock_available = total − allocated − recovering   (generated)
```

Invariant, enforced by table CHECK: `allocated + recovering <= total`.

## `record_stock_movement(...)`

The only writer. Refuses unless the caller is an operator or the call comes from
one of the flows below (which are `security definer` and vouch for themselves).
Applies the deltas, then writes an immutable row. Raises if the resulting
position would break the invariant.

## Movements each flow writes

| Flow | Reason | total | allocated | recovering |
|---|---|---|---|---|
| Order placed | `allocated` | — | +qty | — |
| Subscription cancelled | `released` | — | −qty | — |
| Delivery received | `received` | +qty | — | — |
| Replacement carried out | `replaced` | −1 per plant | — | — |
| Swap carried out, incoming | `rotated_in` | — | +qty | — |
| Swap carried out, outgoing | `rotated_out` | — | −qty | +qty |
| Recovered plants returned | `recovered` | — | — | −qty |
| Written off | `written_off` | −qty | — | — |
| Operator correction | `adjusted` | any | any | any |

A replacement leaves `allocated` alone deliberately: the customer still has the
same number of plants, a fresh one having taken the dead one's place.

## Invariants the tests assert

1. For every plant, the sum of movement deltas equals its current counts (SC-001).
2. Every flow that changes a count writes a movement (SC-002).
3. A replacement reduces owned by one per plant and leaves allocated unchanged.
4. A replacement with nothing ready to send is refused, naming the plant, and
   writes nothing.
5. A swap moves the outgoing plants into recovering, not into ready-to-send.
6. Writing off more than the depot holds is refused.
7. No role can update or delete a movement.
8. `replacement_rate` is null on an empty fleet, never zero.
