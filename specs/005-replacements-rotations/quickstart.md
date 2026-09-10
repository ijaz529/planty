# Quickstart: Replacements & Rotations

**Feature**: `005-replacements-rotations` · **Date**: 2026-09-10

```bash
supabase db reset && npm run seed:images && npm run dev
```

## Verifying by hand

1. As Nadia (`050 000 0002`), open the active subscription. The replacement
   guarantee and its exclusions are stated on the page, and rotations remaining
   this quarter are shown with their renewal date.
2. Ask for the Kentia to be replaced, giving a reason. It is free, and shows as
   received. Try again on the same plant: you are told one is already open.
3. Spend a rotation to swap the ZZ plants for something else. Remaining falls
   by one.
4. As operator `050 000 0003`, open `/ops/requests`. Approve the replacement,
   decline the rotation with a reason.
5. Back as Nadia: the replacement is approved and attached to the next visit;
   the rotation shows declined with its reason and the credit is back.
6. As Tariq (`050 000 0004`), open the next stop. The approved replacement is
   listed as work to do; mark it carried out and watch stock move.

## Tests

```bash
npm run test         # rotation window arithmetic
supabase test db     # allowance, refusals, approval routing, stock movement
```
