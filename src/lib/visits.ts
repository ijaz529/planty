/**
 * Visit helpers. The schedule itself is generated in Postgres; this mirrors the
 * spacing rule so an operator screen can say when the next visit is due, and
 * carries the labels the technician and customer surfaces share.
 */

export type PlantCondition =
  | "healthy"
  | "needs_attention"
  | "declining"
  | "replaced";

export type VisitStatus = "planned" | "done" | "missed";

const CONDITION_LABELS: Record<PlantCondition, string> = {
  healthy: "Healthy",
  needs_attention: "Needs attention",
  declining: "Declining",
  replaced: "Replaced today",
};

/** Ordered worst-last, which is the order a technician taps through. */
export const CONDITIONS: PlantCondition[] = [
  "healthy",
  "needs_attention",
  "declining",
  "replaced",
];

export function conditionLabel(c: PlantCondition): string {
  return CONDITION_LABELS[c] ?? c;
}

const STATUS_LABELS: Record<VisitStatus, string> = {
  planned: "Scheduled",
  done: "Done",
  missed: "Could not be done",
};

export function visitStatusLabel(s: VisitStatus): string {
  return STATUS_LABELS[s] ?? s;
}

/**
 * Days between visits for a cadence. Spacing is in days and then snapped to a
 * served day — counting served days instead would turn a fortnightly
 * subscription into a weekly one in any zone served twice a week.
 */
export function cadenceGapDays(visitsPerMonth: number): number {
  if (!Number.isFinite(visitsPerMonth) || visitsPerMonth <= 0) return 7;
  return Math.max(Math.round(30.44 / visitsPerMonth), 1);
}

/** The dates a subscription would be visited, mirroring the database rule. */
export function scheduleFrom(
  serviceWeekdays: number[],
  visitsPerMonth: number,
  from: Date,
  horizonDays: number
): Date[] {
  const allowed = new Set(serviceWeekdays.filter((d) => d >= 0 && d <= 6));
  if (allowed.size === 0) return [];

  const gap = cadenceGapDays(visitsPerMonth);
  const stop = new Date(from);
  stop.setDate(stop.getDate() + horizonDays);

  const out: Date[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  const advanceToServed = () => {
    let guard = 0;
    while (d <= stop && !allowed.has(d.getDay()) && guard < 400) {
      d.setDate(d.getDate() + 1);
      guard += 1;
    }
  };

  advanceToServed();
  while (d <= stop) {
    out.push(new Date(d));
    d.setDate(d.getDate() + gap);
    advanceToServed();
  }
  return out;
}

/** "Mon 14 Sep" — compact enough for a day list. */
export function shortDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-AE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
