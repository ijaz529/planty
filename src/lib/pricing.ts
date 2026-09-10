/**
 * The pricing rule, in TypeScript.
 *
 * This is a MIRROR. `price_basket()` in Postgres is the authority — it is what
 * a customer would actually be charged, and the basket screen reconciles
 * against it. This copy exists so the total moves the instant someone drags a
 * quantity, instead of after a round trip.
 *
 * The two are kept honest by one shared fixture file,
 * `specs/002-configure-and-price/contracts/pricing-cases.json`, which both the
 * Vitest suite and the pgTAP suite execute. If they drift, a test fails.
 *
 * The rule itself is in `contracts/pricing-contract.md`. Change one side
 * without the other and the fixtures will say so.
 *
 * All arithmetic is in integer fils (hundredths of a dirham). No binary float
 * touches money, and rounding happens exactly twice: once per line, once when
 * the term multiplier is applied.
 */

export type LineStatus = "ok" | "capped" | "unavailable";

export type BasketItem = { variant_id: string; quantity: number };

/** What the mirror needs to know about a variant. Comes from the catalog. */
export type PriceableVariant = {
  id: string;
  species_name: string;
  size_tier: string | null;
  price_aed: number | string | null;
  stock_available: number;
  published: boolean;
};

export type RentalTerm = {
  id: string;
  months: number;
  label: string;
  price_multiplier: number | string;
};

export type ServiceCadence = {
  id: string;
  code: string;
  label: string;
  visits_per_month: number | string;
  monthly_fee_aed: number | string;
};

export type PricedLine = {
  variant_id: string;
  species_name: string;
  size_tier: string | null;
  unit_price_aed: number;
  requested_quantity: number;
  quantity: number;
  line_total_aed: number;
  status: LineStatus;
};

export type Quote = {
  currency: "AED";
  lines: PricedLine[];
  plants_subtotal_aed: number;
  service_fee_aed: number;
  subtotal_aed: number;
  term: { id: string; months: number; label: string; multiplier: number };
  cadence: {
    id: string;
    code: string;
    label: string;
    visits_per_month: number;
    monthly_fee_aed: number;
  };
  monthly_total_aed: number;
  cheapest_monthly_total_aed: number;
  flexibility_cost_aed: number;
  has_unavailable_lines: boolean;
  site_applied: boolean;
  minimum_monthly_aed: number;
  meets_minimum: boolean;
  shortfall_aed: number;
};

const num = (v: number | string | null | undefined): number =>
  v === null || v === undefined ? 0 : typeof v === "string" ? Number(v) : v;

/** Dirhams to whole fils. Half rounds up, matching Postgres `round`. */
export function toFils(aed: number | string | null | undefined): number {
  const n = num(aed);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

/** Fils back to dirhams for display, always two decimals of precision. */
export function fromFils(fils: number): number {
  return Math.round(fils) / 100;
}

/**
 * Multiply a fils amount by a decimal multiplier, rounding once.
 * Scaling the multiplier to an integer first avoids the float error that makes
 * `59000 * 1.07` land on 63129.999999999993.
 */
function applyMultiplier(fils: number, multiplier: number): number {
  const scaled = Math.round(multiplier * 10000);
  return Math.round((fils * scaled) / 10000);
}

export function priceBasket(
  items: BasketItem[],
  catalog: PriceableVariant[],
  term: RentalTerm,
  cadence: ServiceCadence,
  options: {
    cheapestMultiplier?: number;
    minimumMonthlyAed?: number;
    siteApplied?: boolean;
  } = {}
): Quote {
  const byId = new Map(catalog.map((v) => [v.id, v]));

  const lines: PricedLine[] = [];
  let plantsFils = 0;
  let priceable = false;
  let hasUnavailable = false;

  for (const item of items) {
    // Quantities are whole numbers of at least one; anything else is not a line.
    if (!Number.isInteger(item.quantity) || item.quantity < 1) continue;

    const variant = byId.get(item.variant_id);
    const unitFils = toFils(variant?.price_aed ?? 0);
    const stock = variant?.stock_available ?? 0;

    let status: LineStatus;
    let quantity: number;
    let lineFils: number;

    if (!variant || !variant.published || variant.price_aed === null || stock <= 0) {
      status = "unavailable";
      quantity = 0;
      lineFils = 0;
      hasUnavailable = true;
    } else if (stock < item.quantity) {
      status = "capped";
      quantity = stock;
      lineFils = unitFils * quantity;
      plantsFils += lineFils;
      priceable = true;
    } else {
      status = "ok";
      quantity = item.quantity;
      lineFils = unitFils * quantity;
      plantsFils += lineFils;
      priceable = true;
    }

    lines.push({
      variant_id: item.variant_id,
      species_name: variant?.species_name ?? "Unknown plant",
      size_tier: variant?.size_tier ?? null,
      unit_price_aed: fromFils(unitFils),
      requested_quantity: item.quantity,
      quantity,
      line_total_aed: fromFils(lineFils),
      status,
    });
  }

  // No priceable line means no visit, so no service fee. An all-unavailable
  // basket totals zero rather than showing a bare fee.
  const feeFils = priceable ? toFils(cadence.monthly_fee_aed) : 0;
  const subtotalFils = plantsFils + feeFils;

  const multiplier = num(term.price_multiplier);
  const totalFils = applyMultiplier(subtotalFils, multiplier);

  const cheapestMultiplier = options.cheapestMultiplier ?? multiplier;
  const cheapestFils = applyMultiplier(subtotalFils, cheapestMultiplier);

  const minimumFils = toFils(options.minimumMonthlyAed ?? 0);
  const siteApplied = options.siteApplied ?? false;
  const meets = siteApplied ? totalFils >= minimumFils : true;
  const shortfallFils = siteApplied ? Math.max(minimumFils - totalFils, 0) : 0;

  return {
    currency: "AED",
    lines,
    plants_subtotal_aed: fromFils(plantsFils),
    service_fee_aed: fromFils(feeFils),
    subtotal_aed: fromFils(subtotalFils),
    term: {
      id: term.id,
      months: term.months,
      label: term.label,
      multiplier,
    },
    cadence: {
      id: cadence.id,
      code: cadence.code,
      label: cadence.label,
      visits_per_month: num(cadence.visits_per_month),
      monthly_fee_aed: num(cadence.monthly_fee_aed),
    },
    monthly_total_aed: fromFils(totalFils),
    cheapest_monthly_total_aed: fromFils(cheapestFils),
    flexibility_cost_aed: fromFils(totalFils - cheapestFils),
    has_unavailable_lines: hasUnavailable,
    site_applied: siteApplied,
    minimum_monthly_aed: fromFils(minimumFils),
    meets_minimum: meets,
    shortfall_aed: fromFils(shortfallFils),
  };
}

/** "AED 1,702" — whole dirhams, which is how these prices are quoted. */
export function formatMonthly(aed: number): string {
  return `AED ${Math.round(aed).toLocaleString("en-AE")}`;
}

/** "AED 425.50" — keeps fils when they are not zero. */
export function formatPrecise(aed: number): string {
  const hasFils = Math.round(aed * 100) % 100 !== 0;
  return `AED ${aed.toLocaleString("en-AE", {
    minimumFractionDigits: hasFils ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}
