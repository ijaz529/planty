import { describe, expect, it } from "vitest";
import {
  dayName,
  nextServiceDay,
  orderWeekdays,
  serviceDaysPhrase,
  serviceDaysShort,
} from "../../src/lib/zones";

describe("orderWeekdays", () => {
  it("puts Monday first and Sunday last", () => {
    expect(orderWeekdays([0, 6, 1, 3])).toEqual([1, 3, 6, 0]);
  });

  it("removes duplicates", () => {
    expect(orderWeekdays([1, 1, 3])).toEqual([1, 3]);
  });

  it("drops values outside the week", () => {
    expect(orderWeekdays([1, 7, -1, 99])).toEqual([1]);
  });

  it("returns nothing for an empty list", () => {
    expect(orderWeekdays([])).toEqual([]);
  });
});

describe("serviceDaysPhrase", () => {
  it("reads as a sentence for two days", () => {
    expect(serviceDaysPhrase([1, 3])).toBe("Mondays and Wednesdays");
  });

  it("uses commas then and for three or more", () => {
    expect(serviceDaysPhrase([1, 3, 5])).toBe(
      "Mondays, Wednesdays and Fridays"
    );
  });

  it("handles a single day", () => {
    expect(serviceDaysPhrase([2])).toBe("Tuesdays");
  });

  it("collapses a full week", () => {
    expect(serviceDaysPhrase([0, 1, 2, 3, 4, 5, 6])).toBe("Every day");
  });

  it("says so when no days are set", () => {
    expect(serviceDaysPhrase([])).toBe("No visit days set");
  });

  it("orders the sentence by the working week, not by number", () => {
    // Sunday is the last working day in this ordering, not the first.
    expect(serviceDaysPhrase([0, 1])).toBe("Mondays and Sundays");
  });
});

describe("serviceDaysShort", () => {
  it("joins short names in working-week order", () => {
    expect(serviceDaysShort([3, 1])).toBe("Mon · Wed");
  });

  it("renders a dash when empty", () => {
    expect(serviceDaysShort([])).toBe("—");
  });
});

describe("nextServiceDay", () => {
  // 2026-09-14 is a Monday.
  const monday = new Date(2026, 8, 14);

  it("returns today when today is a service day", () => {
    const next = nextServiceDay([1], monday);
    expect(next?.getDate()).toBe(14);
  });

  it("finds the next matching day later in the week", () => {
    const next = nextServiceDay([3], monday);
    expect(next?.getDay()).toBe(3);
    expect(next?.getDate()).toBe(16);
  });

  it("wraps into the following week", () => {
    const next = nextServiceDay([0], monday);
    expect(next?.getDay()).toBe(0);
    expect(next?.getDate()).toBe(20);
  });

  it("is null when no days are set", () => {
    expect(nextServiceDay([], monday)).toBeNull();
  });
});

describe("dayName", () => {
  it("names each weekday", () => {
    expect(dayName(0)).toBe("Sunday");
    expect(dayName(6)).toBe("Saturday");
  });

  it("returns an empty string for anything out of range", () => {
    expect(dayName(9)).toBe("");
  });
});
