import { describe, expect, it } from "vitest";
import cases from "../../specs/002-configure-and-price/contracts/pricing-cases.json";
import {
  fromFils,
  priceBasket,
  toFils,
  type PriceableVariant,
  type RentalTerm,
  type ServiceCadence,
} from "../../src/lib/pricing";

/**
 * These fixtures are the same file that supabase/tests/0005_pricing.sql runs
 * against the database function. If this suite passes and that one fails, the
 * two implementations of the pricing rule have drifted — which is the entire
 * reason the file is shared.
 */

const V = (n: string) => `40000000-0000-4000-8000-0000000001${n}`;

// Mirrors the seeded catalog. Kept beside the fixtures deliberately: if the
// seed changes, both this and the pgTAP suite must be updated together.
const CATALOG: PriceableVariant[] = [
  { id: V("01"), species_name: "Snake plant", size_tier: "desk", price_aed: 6, stock_available: 24, published: true },
  { id: V("02"), species_name: "Snake plant", size_tier: "floor", price_aed: 16, stock_available: 10, published: true },
  { id: V("03"), species_name: "ZZ plant", size_tier: "desk", price_aed: 7, stock_available: 18, published: true },
  { id: V("05"), species_name: "Golden pothos", size_tier: "desk", price_aed: 5, stock_available: 30, published: true },
  { id: V("07"), species_name: "Chinese evergreen", size_tier: "floor", price_aed: 18, stock_available: 6, published: true },
  { id: V("08"), species_name: "Kentia palm", size_tier: "statement", price_aed: 35, stock_available: 5, published: true },
  // Published but out of stock: must price as unavailable, never disappear.
  { id: V("09"), species_name: "Areca palm", size_tier: "statement", price_aed: 32, stock_available: 0, published: true },
  // Unpublished draft: exists, must never be sellable.
  { id: V("10"), species_name: "Areca palm", size_tier: "floor", price_aed: null, stock_available: 4, published: false },
];

const TERMS: Record<string, RentalTerm> = {
  "3": { id: "t3", months: 3, label: "3 months", price_multiplier: 1.15 },
  "6": { id: "t6", months: 6, label: "6 months", price_multiplier: 1.07 },
  "12": { id: "t12", months: 12, label: "12 months", price_multiplier: 1.0 },
};

const CADENCES: Record<string, ServiceCadence> = {
  weekly: { id: "cw", code: "weekly", label: "Every week", visits_per_month: 4.33, monthly_fee_aed: 250 },
  fortnightly: { id: "cf", code: "fortnightly", label: "Every 2 weeks", visits_per_month: 2.17, monthly_fee_aed: 150 },
};

const CHEAPEST_MULTIPLIER = 1.0;

describe("shared pricing fixtures", () => {
  for (const c of cases.cases) {
    it(c.name, () => {
      const quote = priceBasket(
        c.items.map((i) => ({ variant_id: i.variant, quantity: i.quantity })),
        CATALOG,
        TERMS[String(c.term_months)],
        CADENCES[c.cadence_code],
        { cheapestMultiplier: CHEAPEST_MULTIPLIER }
      );

      const e = c.expect as Record<string, unknown>;

      if ("plants_subtotal_aed" in e)
        expect(quote.plants_subtotal_aed).toBe(e.plants_subtotal_aed);
      if ("service_fee_aed" in e)
        expect(quote.service_fee_aed).toBe(e.service_fee_aed);
      if ("subtotal_aed" in e) expect(quote.subtotal_aed).toBe(e.subtotal_aed);
      if ("monthly_total_aed" in e)
        expect(quote.monthly_total_aed).toBe(e.monthly_total_aed);
      if ("cheapest_monthly_total_aed" in e)
        expect(quote.cheapest_monthly_total_aed).toBe(
          e.cheapest_monthly_total_aed
        );
      if ("flexibility_cost_aed" in e)
        expect(quote.flexibility_cost_aed).toBe(e.flexibility_cost_aed);
      if ("has_unavailable_lines" in e)
        expect(quote.has_unavailable_lines).toBe(e.has_unavailable_lines);

      for (const [id, status] of Object.entries(
        (e.line_statuses ?? {}) as Record<string, string>
      )) {
        expect(quote.lines.find((l) => l.variant_id === id)?.status).toBe(status);
      }
      for (const [id, qty] of Object.entries(
        (e.line_quantities ?? {}) as Record<string, number>
      )) {
        expect(quote.lines.find((l) => l.variant_id === id)?.quantity).toBe(qty);
      }
      for (const [id, req] of Object.entries(
        (e.line_requested ?? {}) as Record<string, number>
      )) {
        expect(
          quote.lines.find((l) => l.variant_id === id)?.requested_quantity
        ).toBe(req);
      }
    });
  }
});

describe("pricing invariants", () => {
  /** Every fixture must satisfy these, not just the ones that assert them. */
  const quotes = cases.cases.map((c) =>
    priceBasket(
      c.items.map((i) => ({ variant_id: i.variant, quantity: i.quantity })),
      CATALOG,
      TERMS[String(c.term_months)],
      CADENCES[c.cadence_code],
      { cheapestMultiplier: CHEAPEST_MULTIPLIER }
    )
  );

  it("line totals sum exactly to the plants subtotal (SC-003)", () => {
    for (const q of quotes) {
      const sum = q.lines.reduce((acc, l) => acc + toFils(l.line_total_aed), 0);
      expect(fromFils(sum)).toBe(q.plants_subtotal_aed);
    }
  });

  it("subtotal times the multiplier equals the monthly total (SC-003)", () => {
    for (const q of quotes) {
      const expected = fromFils(
        Math.round(
          (toFils(q.subtotal_aed) * Math.round(q.term.multiplier * 10000)) / 10000
        )
      );
      expect(q.monthly_total_aed).toBe(expected);
    }
  });

  it("flexibility cost is the difference from the cheapest term, never negative", () => {
    for (const q of quotes) {
      expect(q.flexibility_cost_aed).toBe(
        fromFils(toFils(q.monthly_total_aed) - toFils(q.cheapest_monthly_total_aed))
      );
      expect(q.flexibility_cost_aed).toBeGreaterThanOrEqual(0);
    }
  });

  it("no unavailable line ever contributes to a total", () => {
    for (const q of quotes) {
      for (const line of q.lines) {
        if (line.status === "unavailable") {
          expect(line.line_total_aed).toBe(0);
          expect(line.quantity).toBe(0);
        }
      }
    }
  });

  it("plants subtotal plus fee equals subtotal", () => {
    for (const q of quotes) {
      expect(fromFils(toFils(q.plants_subtotal_aed) + toFils(q.service_fee_aed))).toBe(
        q.subtotal_aed
      );
    }
  });
});

describe("priceBasket edge handling", () => {
  const term = TERMS["12"];
  const cadence = CADENCES.fortnightly;

  it("ignores fractional and zero quantities entirely", () => {
    const q = priceBasket(
      [
        { variant_id: V("01"), quantity: 2.5 },
        { variant_id: V("01"), quantity: 0 },
        { variant_id: V("03"), quantity: -3 },
      ],
      CATALOG,
      term,
      cadence
    );
    expect(q.lines).toHaveLength(0);
    expect(q.monthly_total_aed).toBe(0);
  });

  it("charges no service fee when nothing is priceable", () => {
    const q = priceBasket(
      [{ variant_id: V("09"), quantity: 2 }],
      CATALOG,
      term,
      cadence
    );
    expect(q.service_fee_aed).toBe(0);
    expect(q.monthly_total_aed).toBe(0);
    expect(q.has_unavailable_lines).toBe(true);
  });

  it("enforces a minimum only when a site has been applied", () => {
    const items = [{ variant_id: V("01"), quantity: 1 }];

    const guidance = priceBasket(items, CATALOG, term, cadence, {
      minimumMonthlyAed: 400,
      siteApplied: false,
    });
    expect(guidance.meets_minimum).toBe(true);
    expect(guidance.shortfall_aed).toBe(0);

    const enforced = priceBasket(items, CATALOG, term, cadence, {
      minimumMonthlyAed: 400,
      siteApplied: true,
    });
    expect(enforced.meets_minimum).toBe(false);
    // 6 + 150 = 156, so 244 short of 400. The 400 here is an argument, not the
    // seeded minimum — this test is about when the rule applies, not its value.
    expect(enforced.shortfall_aed).toBe(244);
  });

  it("clears the minimum once the basket is big enough", () => {
    const q = priceBasket(
      [{ variant_id: V("08"), quantity: 2 }],
      CATALOG,
      term,
      cadence,
      { minimumMonthlyAed: 200, siteApplied: true }
    );
    // 35 x 2 + 150 = 220.
    expect(q.monthly_total_aed).toBe(220);
    expect(q.meets_minimum).toBe(true);
    expect(q.shortfall_aed).toBe(0);
  });

  // Feature 007, FR-004 and SC-005. The old AED 400 minimum was set when a desk
  // plant cost AED 45 and a small order came to about AED 450, so it almost
  // never bound. At AED 5 a plant it would have bound on nearly every customer
  // and quietly overridden the price the catalogue advertises.
  it("prices an ordinary small order from the list, not the minimum", () => {
    const SEEDED_MINIMUM = 150;
    const q = priceBasket(
      [
        { variant_id: V("05"), quantity: 3 },
        { variant_id: V("01"), quantity: 2 },
      ],
      CATALOG,
      term,
      cadence,
      { minimumMonthlyAed: SEEDED_MINIMUM, siteApplied: true }
    );
    // 5 x 3 + 6 x 2 = 27 of plants, plus the AED 150 fortnightly fee.
    expect(q.plants_subtotal_aed).toBe(27);
    expect(q.monthly_total_aed).toBe(177);
    expect(q.meets_minimum).toBe(true);
    expect(q.shortfall_aed).toBe(0);
  });

  it("keeps money exact where floating point would not", () => {
    // 6 x 3 + 35 + 250 = 303, and 303 * 1.07 is 324.21000000000004 in binary
    // floating point. Integer fils land it on 324.21.
    const q = priceBasket(
      [
        { variant_id: V("01"), quantity: 3 },
        { variant_id: V("08"), quantity: 1 },
      ],
      CATALOG,
      TERMS["6"],
      CADENCES.weekly
    );
    expect(303 * 1.07).not.toBe(324.21);
    expect(q.monthly_total_aed).toBe(324.21);
  });
});
