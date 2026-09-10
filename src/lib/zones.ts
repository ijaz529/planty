/**
 * Service-zone presentation.
 *
 * Weekdays are stored as 0 = Sunday … 6 = Saturday, matching Postgres
 * `extract(dow)`. The UAE working week runs Monday to Friday, so lists are
 * rendered starting on Monday rather than Sunday.
 */

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const SHORT_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Monday first, Sunday last — how a Dubai working week reads. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function dayName(day: number): string {
  return DAY_NAMES[day] ?? "";
}

export function shortDayName(day: number): string {
  return SHORT_NAMES[day] ?? "";
}

/** Sorts weekdays into working-week order and drops anything out of range. */
export function orderWeekdays(days: number[]): number[] {
  return [...new Set(days)]
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)
    .sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
}

/**
 * "Mondays and Wednesdays" — the sentence a customer reads on their site.
 * Every day of the week collapses to "Every day".
 */
export function serviceDaysPhrase(days: number[]): string {
  const ordered = orderWeekdays(days);
  if (ordered.length === 0) return "No visit days set";
  if (ordered.length === 7) return "Every day";

  const names = ordered.map((d) => `${dayName(d)}s`);
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Compact form for a list or badge: "Mon · Wed". */
export function serviceDaysShort(days: number[]): string {
  const ordered = orderWeekdays(days);
  if (ordered.length === 0) return "—";
  return ordered.map(shortDayName).join(" · ");
}

/**
 * The next date Planty visits this zone, given a starting date. Returns the
 * same day when it is a service day, so "today" is a valid answer.
 */
export function nextServiceDay(days: number[], from: Date): Date | null {
  const ordered = orderWeekdays(days);
  if (ordered.length === 0) return null;

  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = new Date(from);
    candidate.setDate(from.getDate() + offset);
    if (ordered.includes(candidate.getDay())) return candidate;
  }
  return null;
}
