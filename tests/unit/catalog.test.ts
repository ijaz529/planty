import { describe, expect, it } from "vitest";
import {
  availabilityLabel,
  byTier,
  formatAed,
  heightRange,
  isAvailable,
  listPhrase,
  publishGapMessage,
  publishGaps,
  type VariantLike,
} from "../../src/lib/catalog";

const complete: VariantLike = {
  size_tier: "desk",
  photo_path: "seed/snake-desk.svg",
  price_aed: 55,
  height_min_cm: 30,
  height_max_cm: 45,
};

describe("publishGaps", () => {
  it("returns nothing for a complete variant", () => {
    expect(publishGaps(complete)).toEqual([]);
  });

  it("lists every missing field in the order the database uses", () => {
    expect(
      publishGaps({
        size_tier: null,
        photo_path: null,
        price_aed: null,
        height_min_cm: null,
        height_max_cm: null,
      })
    ).toEqual(["a size tier", "a photo", "a monthly price", "a height range"]);
  });

  it("matches the seeded draft variant the pgTAP suite asserts on", () => {
    expect(
      publishGaps({
        size_tier: "floor",
        photo_path: null,
        price_aed: null,
        height_min_cm: null,
        height_max_cm: null,
      })
    ).toEqual(["a photo", "a monthly price", "a height range"]);
  });

  it("treats an empty price string as missing", () => {
    expect(publishGaps({ ...complete, price_aed: "" })).toContain(
      "a monthly price"
    );
  });

  it("treats a half-filled height range as missing", () => {
    expect(publishGaps({ ...complete, height_max_cm: null })).toEqual([
      "a height range",
    ]);
  });
});

describe("publishGapMessage", () => {
  it("is null when the variant is ready", () => {
    expect(publishGapMessage(complete)).toBeNull();
  });

  it("reads as a sentence a person would write", () => {
    expect(
      publishGapMessage({
        size_tier: "floor",
        photo_path: null,
        price_aed: null,
        height_min_cm: 70,
        height_max_cm: 100,
      })
    ).toBe("Still needs a photo and a monthly price before it can be published.");
  });
});

describe("availabilityLabel", () => {
  it.each([
    [0, "Currently unavailable"],
    [-2, "Currently unavailable"],
    [1, "Only 1 left"],
    [3, "Only 3 left"],
    [4, "Available"],
    [40, "Available"],
  ])("labels %i as %s", (stock, expected) => {
    expect(availabilityLabel(stock)).toBe(expected);
  });

  it("keeps an unavailable plant visible rather than hiding it", () => {
    // FR-024: the catalog must not appear to shrink when stock runs out.
    expect(isAvailable(0)).toBe(false);
    expect(availabilityLabel(0)).toMatch(/unavailable/i);
  });
});

describe("byTier", () => {
  it("orders desk before floor before statement", () => {
    const sorted = [
      { size_tier: "statement" as const },
      { size_tier: "desk" as const },
      { size_tier: "floor" as const },
    ].sort(byTier);
    expect(sorted.map((v) => v.size_tier)).toEqual([
      "desk",
      "floor",
      "statement",
    ]);
  });

  it("sinks untiered drafts to the end", () => {
    const sorted = [
      { size_tier: null },
      { size_tier: "desk" as const },
    ].sort(byTier);
    expect(sorted.map((v) => v.size_tier)).toEqual(["desk", null]);
  });
});

describe("listPhrase", () => {
  it.each([
    [[], ""],
    [["a photo"], "a photo"],
    [["a photo", "a price"], "a photo and a price"],
    [["a", "b", "c"], "a, b and c"],
  ])("renders %j as %s", (items, expected) => {
    expect(listPhrase(items as string[])).toBe(expected);
  });
});

describe("formatAed", () => {
  it("renders whole dirhams", () => {
    expect(formatAed(55)).toBe("AED 55");
    expect(formatAed("175.00")).toBe("AED 175");
  });

  it("renders anything unparseable as a dash rather than NaN", () => {
    expect(formatAed("not money")).toBe("—");
  });
});

describe("heightRange", () => {
  it("renders a complete range", () => {
    expect(heightRange(30, 45)).toBe("30–45 cm");
  });

  it("is null when either end is missing", () => {
    expect(heightRange(30, null)).toBeNull();
    expect(heightRange(null, 45)).toBeNull();
  });
});
