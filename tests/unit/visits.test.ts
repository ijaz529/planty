import { describe, expect, it } from "vitest";
import {
  cadenceGapDays,
  conditionLabel,
  scheduleFrom,
  visitStatusLabel,
} from "../../src/lib/visits";
import { toDateString } from "../../src/lib/installation";

describe("cadenceGapDays", () => {
  it("turns the seeded cadences into the right spacing", () => {
    expect(cadenceGapDays(4.33)).toBe(7); // weekly
    expect(cadenceGapDays(2.17)).toBe(14); // fortnightly
  });

  it("handles a monthly cadence", () => {
    expect(cadenceGapDays(1)).toBe(30);
  });

  it("falls back to weekly for nonsense", () => {
    expect(cadenceGapDays(0)).toBe(7);
    expect(cadenceGapDays(-3)).toBe(7);
    expect(cadenceGapDays(Number.NaN)).toBe(7);
  });
});

describe("scheduleFrom", () => {
  // Monday 14 September 2026. Business Bay is served Monday and Wednesday.
  const mon = new Date(2026, 8, 14);

  it("spaces a fortnightly subscription two weeks apart, not two served days", () => {
    // The bug this test exists for: counting served days would give
    // 14th, 21st, 28th — weekly — in a zone served twice a week.
    const days = scheduleFrom([1, 3], 2.17, mon, 28).map(toDateString);
    expect(days).toEqual(["2026-09-14", "2026-09-28", "2026-10-12"]);
  });

  it("spaces a weekly subscription seven days apart", () => {
    const days = scheduleFrom([1, 3], 4.33, mon, 21).map(toDateString);
    expect(days).toEqual(["2026-09-14", "2026-09-21", "2026-09-28", "2026-10-05"]);
  });

  it("only ever lands on a served weekday", () => {
    for (const d of scheduleFrom([2, 4], 4.33, mon, 60)) {
      expect([2, 4]).toContain(d.getDay());
    }
  });

  it("snaps forward when the gap lands on an unserved day", () => {
    // Served Tuesdays only, weekly: every visit is a Tuesday.
    const days = scheduleFrom([2], 4.33, mon, 21).map((d) => d.getDay());
    expect(new Set(days)).toEqual(new Set([2]));
  });

  it("returns nothing for a zone with no served days", () => {
    expect(scheduleFrom([], 4.33, mon, 28)).toEqual([]);
  });

  it("respects the horizon", () => {
    expect(scheduleFrom([1, 3], 4.33, mon, 7).map(toDateString)).toEqual([
      "2026-09-14",
      "2026-09-21",
    ]);
  });
});

describe("labels", () => {
  it("names each condition for a person", () => {
    expect(conditionLabel("needs_attention")).toBe("Needs attention");
    expect(conditionLabel("replaced")).toBe("Replaced today");
  });

  it("says a missed visit could not be done, rather than 'missed'", () => {
    expect(visitStatusLabel("missed")).toBe("Could not be done");
  });
});
