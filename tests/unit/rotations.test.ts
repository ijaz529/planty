import { describe, expect, it } from "vitest";
import {
  changeKindLabel,
  changeStatusLabel,
  isOpen,
  needsAttention,
  renewalPhrase,
  rotationsPhrase,
} from "../../src/lib/rotations";

describe("rotationsPhrase", () => {
  it("says how many there are before any are spent", () => {
    expect(rotationsPhrase(2, 2)).toBe("2 swaps to use this quarter");
  });

  it("counts down once some are used", () => {
    expect(rotationsPhrase(1, 2)).toBe("1 of 2 swaps left this quarter");
  });

  it("is plain when there are none left", () => {
    expect(rotationsPhrase(0, 2)).toBe("No swaps left this quarter");
  });

  it("says so when the plan includes none at all", () => {
    // Different from having spent them: nothing renews.
    expect(rotationsPhrase(0, 0)).toBe("Swaps are not included on this plan");
  });

  it("gets the singular right", () => {
    expect(rotationsPhrase(1, 1)).toBe("1 swap to use this quarter");
  });
});

describe("renewalPhrase", () => {
  it("names the date the allowance comes back", () => {
    expect(renewalPhrase("2026-12-13")).toBe("renews on 13 December");
  });
});

describe("labels", () => {
  it("describes states in the customer's terms, not the database's", () => {
    expect(changeStatusLabel("requested")).toBe("Received");
    expect(changeStatusLabel("approved")).toBe("Booked for the next visit");
    expect(changeStatusLabel("declined")).toBe("Not covered");
  });

  it("calls a rotation a swap, which is what a person would say", () => {
    expect(changeKindLabel("rotation")).toBe("Swap");
    expect(changeKindLabel("replacement")).toBe("Replacement");
  });
});

describe("isOpen", () => {
  it.each([
    ["requested", true],
    ["approved", true],
    ["declined", false],
    ["fulfilled", false],
    ["withdrawn", false],
  ] as const)("%s is open: %s", (status, expected) => {
    expect(isOpen(status)).toBe(expected);
  });
});

describe("needsAttention", () => {
  it("flags the two conditions worth offering a replacement for", () => {
    expect(needsAttention("declining")).toBe(true);
    expect(needsAttention("needs_attention")).toBe(true);
  });

  it("leaves healthy and replaced plants alone", () => {
    expect(needsAttention("healthy")).toBe(false);
    expect(needsAttention("replaced")).toBe(false);
    expect(needsAttention(null)).toBe(false);
  });
});
