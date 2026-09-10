import { describe, expect, it } from "vitest";
import {
  isConsistent,
  movementSummary,
  rateComparison,
  ratePhrase,
  rateVerdict,
  reasonLabel,
  totals,
  type DepotRow,
} from "../../src/lib/depot";

const row = (o: Partial<DepotRow> = {}): DepotRow => ({
  variant_id: "v",
  species_name: "Snake plant",
  size_tier: "desk",
  owned: 24,
  with_customers: 6,
  recovering: 0,
  ready: 18,
  last_movement: null,
  ...o,
});

describe("rateVerdict and phrasing", () => {
  it("says so when there is nothing to measure, rather than showing zero", () => {
    // A rate of 0% on an empty fleet reads as success. It is not.
    expect(rateVerdict(null)).toBe("unknown");
    expect(ratePhrase(null)).toBe("Not enough stock to measure yet");
    expect(rateComparison(null)).toBe("");
  });

  it("reads a rate within the target as within it", () => {
    expect(rateVerdict(2.5)).toBe("under");
    expect(rateComparison(2.5)).toContain("Within the 4% target");
  });

  it("treats exactly the target as still within it", () => {
    expect(rateVerdict(4)).toBe("under");
  });

  it("names what to do when the rate is over", () => {
    expect(rateVerdict(6.1)).toBe("over");
    expect(rateComparison(6.1)).toContain("palette or the pricing");
  });

  it("states the rate to two places over the period", () => {
    expect(ratePhrase(3.5)).toBe("3.50% of the fleet replaced in the last 30 days");
  });
});

describe("totals", () => {
  it("adds up the depot", () => {
    expect(totals([row(), row({ owned: 10, with_customers: 3, ready: 7 })])).toEqual({
      owned: 34,
      with_customers: 9,
      recovering: 0,
      ready: 25,
    });
  });

  it("is all zeroes for an empty depot", () => {
    expect(totals([])).toEqual({ owned: 0, with_customers: 0, recovering: 0, ready: 0 });
  });
});

describe("isConsistent", () => {
  it("accepts a row whose parts add up to what is owned", () => {
    expect(isConsistent(row())).toBe(true);
    expect(isConsistent(row({ owned: 10, with_customers: 4, recovering: 2, ready: 4 }))).toBe(true);
  });

  it("rejects one that does not", () => {
    expect(isConsistent(row({ owned: 10, with_customers: 4, recovering: 2, ready: 9 }))).toBe(false);
  });
});

describe("movementSummary", () => {
  it("describes a delivery", () => {
    expect(movementSummary({ delta_total: 10, delta_allocated: 0, delta_recovering: 0 }))
      .toBe("+10 owned");
  });

  it("describes a write-off", () => {
    expect(movementSummary({ delta_total: -2, delta_allocated: 0, delta_recovering: 0 }))
      .toBe("−2 owned");
  });

  it("describes a swap collection, which touches two counts", () => {
    expect(movementSummary({ delta_total: 0, delta_allocated: -4, delta_recovering: 4 }))
      .toBe("−4 with customers, +4 recovering");
  });
});

describe("reasonLabel", () => {
  it("says what happened in words an operator would use", () => {
    expect(reasonLabel("replaced")).toBe("Replaced under guarantee");
    expect(reasonLabel("rotated_out")).toBe("Collected in a swap");
  });

  it("falls back to the raw reason for anything unknown", () => {
    expect(reasonLabel("something_new")).toBe("something_new");
  });
});
