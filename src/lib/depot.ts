/**
 * Depot presentation. The counts and the rate are computed in Postgres; these
 * turn them into something an operator can read at a glance.
 */

export type DepotRow = {
  variant_id: string;
  species_name: string;
  size_tier: string | null;
  owned: number;
  with_customers: number;
  recovering: number;
  ready: number;
  last_movement: string | null;
};

/** The PRD names this as the point where the palette or the pricing changes. */
export const REPLACEMENT_RATE_TARGET = 4;

export type RateVerdict = "unknown" | "under" | "over";

export function rateVerdict(rate: number | null): RateVerdict {
  if (rate === null || rate === undefined || !Number.isFinite(rate)) return "unknown";
  return rate <= REPLACEMENT_RATE_TARGET ? "under" : "over";
}

/**
 * A rate of zero on an empty fleet reads as success, so an unknown rate says
 * so rather than showing a number that means nothing.
 */
export function ratePhrase(rate: number | null): string {
  if (rate === null || rate === undefined || !Number.isFinite(rate)) {
    return "Not enough stock to measure yet";
  }
  return `${rate.toFixed(2)}% of the fleet replaced in the last 30 days`;
}

export function rateComparison(rate: number | null): string {
  const verdict = rateVerdict(rate);
  if (verdict === "unknown") return "";
  if (verdict === "under") return `Within the ${REPLACEMENT_RATE_TARGET}% target`;
  return `Above the ${REPLACEMENT_RATE_TARGET}% target — look at the palette or the pricing`;
}

/** Every count in the depot, so a header can state the position in one line. */
export function totals(rows: DepotRow[]) {
  return rows.reduce(
    (acc, r) => ({
      owned: acc.owned + r.owned,
      with_customers: acc.with_customers + r.with_customers,
      recovering: acc.recovering + r.recovering,
      ready: acc.ready + r.ready,
    }),
    { owned: 0, with_customers: 0, recovering: 0, ready: 0 }
  );
}

/** True when the four counts on a row are self-consistent. */
export function isConsistent(r: DepotRow): boolean {
  return r.with_customers + r.recovering + r.ready === r.owned;
}

const REASON_LABELS: Record<string, string> = {
  received: "Delivery received",
  allocated: "Sent to a customer",
  released: "Order cancelled",
  replaced: "Replaced under guarantee",
  rotated_out: "Collected in a swap",
  rotated_in: "Sent out in a swap",
  recovered: "Back to ready",
  written_off: "Written off",
  lost: "Lost",
  adjusted: "Adjusted",
};

export function reasonLabel(reason: string): string {
  return REASON_LABELS[reason] ?? reason;
}

/** "+10 owned", "−4 with customers, +4 recovering" */
export function movementSummary(m: {
  delta_total: number;
  delta_allocated: number;
  delta_recovering: number;
}): string {
  const parts: string[] = [];
  const sign = (n: number) => (n > 0 ? `+${n}` : `−${Math.abs(n)}`);
  if (m.delta_total) parts.push(`${sign(m.delta_total)} owned`);
  if (m.delta_allocated) parts.push(`${sign(m.delta_allocated)} with customers`);
  if (m.delta_recovering) parts.push(`${sign(m.delta_recovering)} recovering`);
  return parts.join(", ");
}
