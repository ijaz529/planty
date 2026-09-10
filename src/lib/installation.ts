/**
 * Installation-day helpers — a mirror of the database rule so the picker can
 * offer only valid days. `create_subscription()` validates independently.
 *
 * Rule: at least two Monday–Friday days after "today", and the weekday must be
 * one the site's zone is served on. Weekdays are 0 = Sunday … 6 = Saturday.
 */

/** Today plus two working (Mon–Fri) days, as a date with no time. */
export function minInstallationDate(from: Date): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let working = 0;
  while (working < 2) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5) working += 1;
  }
  return d;
}

/** The next `count` dates on or after the minimum that fall on a service day. */
export function installationCandidates(
  serviceWeekdays: number[],
  from: Date,
  count = 6
): Date[] {
  const allowed = new Set(serviceWeekdays.filter((d) => d >= 0 && d <= 6));
  if (allowed.size === 0 || count <= 0) return [];

  const out: Date[] = [];
  const d = minInstallationDate(from);
  // At most a few weeks of scanning; every allowed weekday recurs within 7 days.
  for (let i = 0; i < 7 * count + 7 && out.length < count; i += 1) {
    if (allowed.has(d.getDay())) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** "2026-09-14" — what the database column expects. */
export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "Monday 14 September" — what a person reads. */
export function formatInstallationDay(d: Date): string {
  return d.toLocaleDateString("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
