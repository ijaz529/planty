# Phase 0 Research: Visit Engine

**Feature**: `004-visit-engine` · **Date**: 2026-09-10

## R1 — Generating visits: materialised rows on a short horizon

**Decision**: `generate_visits(p_horizon_days integer default 28)` walks every
active subscription and inserts a `visits` row for each served weekday at the
cadence spacing, within the term. A unique index on
`(subscription_id, scheduled_date)` makes it idempotent. `pg_cron` runs it
nightly; an operator can also run it on demand.

**Rationale**: FR-001, FR-004, FR-007. Materialised rows are the operational
truth an operator assigns and a technician works from — a computed schedule
cannot carry an assignment or a completion. A four-week horizon means a
cancellation cannot leave months of orphaned work, which is the failure a long
horizon produces.

**Alternatives considered**:
- *Compute the schedule on read*: nothing to assign, nothing to complete.
- *Generate the whole term at activation*: every cancellation, cadence change or
  zone reshape then has to clean up months of rows.

**Cadence spacing**: from `visits_per_month` — 4.33 means every served day,
2.17 means every other served day. Expressed as a stride over the zone's served
days, not as a day count, so the visit always lands on a day Planty drives.

## R2 — Paying feature 001's debt: the technician's sight is narrowed here

**Decision**: The `sites` select policy from `0004_zones_sites.sql` loses its
blanket `is_technician()` clause. It is replaced by: a technician may read a
site only if they have a visit assigned there that is not yet finished.

**Rationale**: Feature 001's plan recorded this as a scheduled correction, not
an accepted violation — the role had to exist before there was a visit to scope
it to. Now there is. FR-009 and the privacy line in the constitution both turn
on it: a gate code is readable by the person going through that gate today, not
by every technician forever.

**How it is asserted**: the pgTAP suite checks a technician sees a site while
assigned and stops seeing it once the visit is done, and that a technician with
no assignment sees nothing.

## R3 — Completion is guarded in the database

**Decision**: `complete_visit(p_visit_id, p_note)` refuses unless the visit has
at least one photo and a condition row for every plant on the subscription. The
interface disables its button for the same reasons, but the guard is what makes
SC-001 true.

**Rationale**: Constitution IV says a visit is not done until its record is
complete. A rule enforced only by a disabled button is a rule that a lost
connection, a retry or a future screen will break.

## R4 — Photos in Storage, path in the row

**Decision**: A private `visits` storage bucket. Objects are keyed
`<visit_id>/<uuid>.<ext>`. Reads are authorised by a storage policy that checks
the caller may see the visit; the app serves them through signed URLs.

**Rationale**: Unlike catalogue images, these are pictures inside a customer's
office. The `catalog` bucket is public because prices are public; this one must
not be.

## R5 — Which plants are expected at a stop

**Decision**: From `subscription_lines` — the plants the customer is renting.
The technician records one condition row per line.

**Rationale**: Feature 001 deliberately deferred tracking individual physical
plants to feature 006. A condition per rented line is the honest granularity
today: "the four snake plants are fine, one Kentia is declining".

## R6 — Nightly scheduling

**Decision**: `pg_cron` at 22:00 UTC (02:00 Asia/Dubai) calling
`generate_visits()`. It is available in the local stack. If the schedule is ever
absent, the operator button is the fallback and the day list shows how far ahead
visits exist.

**Rationale**: FR-007. Automatic generation with a visible manual path means a
failed job is recoverable by the person who notices it.
