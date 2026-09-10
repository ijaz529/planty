import { describe, expect, it } from "vitest";
import {
  installationCandidates,
  minInstallationDate,
  toDateString,
} from "../../src/lib/installation";

// 2026-09-14 is a Monday; 2026-09-18 is a Friday; 2026-09-19 a Saturday.
const mon = new Date(2026, 8, 14);
const thu = new Date(2026, 8, 17);
const fri = new Date(2026, 8, 18);
const sat = new Date(2026, 8, 19);

describe("minInstallationDate", () => {
  it("is two working days after a Monday", () => {
    expect(toDateString(minInstallationDate(mon))).toBe("2026-09-16");
  });

  it("skips the weekend from a Thursday", () => {
    // Fri counts, Sat and Sun do not, Mon counts.
    expect(toDateString(minInstallationDate(thu))).toBe("2026-09-21");
  });

  it("skips the weekend from a Friday", () => {
    expect(toDateString(minInstallationDate(fri))).toBe("2026-09-22");
  });

  it("from a Saturday counts Monday and Tuesday", () => {
    expect(toDateString(minInstallationDate(sat))).toBe("2026-09-22");
  });

  it("drops the time of day", () => {
    const withTime = new Date(2026, 8, 14, 23, 59);
    expect(minInstallationDate(withTime).getHours()).toBe(0);
  });
});

describe("installationCandidates", () => {
  it("offers only the zone's weekdays, at or after the minimum", () => {
    // Business Bay: Monday and Wednesday. From Monday 14th, min is Wed 16th.
    const days = installationCandidates([1, 3], mon, 4).map(toDateString);
    expect(days).toEqual([
      "2026-09-16",
      "2026-09-21",
      "2026-09-23",
      "2026-09-28",
    ]);
  });

  it("never offers a day before the minimum", () => {
    const min = minInstallationDate(fri);
    for (const d of installationCandidates([0, 1, 2, 3, 4, 5, 6], fri, 5)) {
      expect(d.getTime()).toBeGreaterThanOrEqual(min.getTime());
    }
  });

  it("returns nothing for a zone with no service days", () => {
    expect(installationCandidates([], mon)).toEqual([]);
  });

  it("ignores weekday values outside the week", () => {
    expect(installationCandidates([9, -1], mon)).toEqual([]);
  });

  it("returns the requested count", () => {
    expect(installationCandidates([2, 4], mon, 3)).toHaveLength(3);
  });
});
