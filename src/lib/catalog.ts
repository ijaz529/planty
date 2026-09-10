/**
 * Catalog presentation helpers.
 *
 * `publishGaps` mirrors the database function `variant_publish_gaps` so the
 * operator sees what is missing before attempting to publish. The database is
 * still the authority: the guard trigger refuses an incomplete publish even if
 * this function is wrong (constitution VI).
 */

export type SizeTier = "desk" | "floor" | "statement";
export type LightRequirement = "low" | "medium" | "bright";

export type VariantLike = {
  size_tier: SizeTier | null;
  photo_path: string | null;
  price_aed: number | string | null;
  height_min_cm: number | null;
  height_max_cm: number | null;
};

/** Display order for size tiers, smallest first. */
export const SIZE_TIERS: SizeTier[] = ["desk", "floor", "statement"];

const TIER_LABELS: Record<SizeTier, string> = {
  desk: "Desk",
  floor: "Floor",
  statement: "Statement",
};

const TIER_BLURBS: Record<SizeTier, string> = {
  desk: "Sits on a desk, shelf or counter",
  floor: "Stands on the floor beside furniture",
  statement: "A full-height plant that anchors a room",
};

const LIGHT_LABELS: Record<LightRequirement, string> = {
  low: "Happy in low light",
  medium: "Wants some daylight",
  bright: "Needs a bright spot",
};

export function tierLabel(tier: SizeTier): string {
  return TIER_LABELS[tier];
}

export function tierBlurb(tier: SizeTier): string {
  return TIER_BLURBS[tier];
}

export function lightLabel(light: LightRequirement): string {
  return LIGHT_LABELS[light];
}

/** Sorts variants smallest tier first; anything untiered sinks to the end. */
export function byTier<T extends { size_tier: SizeTier | null }>(
  a: T,
  b: T
): number {
  const ai = a.size_tier ? SIZE_TIERS.indexOf(a.size_tier) : SIZE_TIERS.length;
  const bi = b.size_tier ? SIZE_TIERS.indexOf(b.size_tier) : SIZE_TIERS.length;
  return ai - bi;
}

/**
 * What still blocks publishing this variant. Empty means ready.
 * Order matches the database function so the two read identically.
 */
export function publishGaps(v: VariantLike): string[] {
  const gaps: string[] = [];
  if (!v.size_tier) gaps.push("a size tier");
  if (!v.photo_path) gaps.push("a photo");
  if (v.price_aed === null || v.price_aed === undefined || v.price_aed === "")
    gaps.push("a monthly price");
  if (v.height_min_cm === null || v.height_max_cm === null)
    gaps.push("a height range");
  return gaps;
}

/** One sentence an operator can act on, or null when nothing is missing. */
export function publishGapMessage(v: VariantLike): string | null {
  const gaps = publishGaps(v);
  if (gaps.length === 0) return null;
  return `Still needs ${listPhrase(gaps)} before it can be published.`;
}

/**
 * FR-024: an out-of-stock plant stays on the page and says so, rather than
 * quietly vanishing and making the catalog look smaller than it is.
 */
export function availabilityLabel(stockAvailable: number): string {
  if (stockAvailable <= 0) return "Currently unavailable";
  if (stockAvailable <= 3) return `Only ${stockAvailable} left`;
  return "Available";
}

export function isAvailable(stockAvailable: number): boolean {
  return stockAvailable > 0;
}

/** "a, b and c" — the way a person writes a list. */
export function listPhrase(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Money as a Dubai reader expects it. */
export function formatAed(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "—";
  return `AED ${n.toLocaleString("en-AE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function heightRange(
  min: number | null,
  max: number | null
): string | null {
  if (min === null || max === null) return null;
  return `${min}–${max} cm`;
}
