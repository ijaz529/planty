import { describe, expect, it } from "vitest";
import {
  changeKindLabel,
  changeStatusLabel,
  isOpen,
  needsAttention,
  offerReplacement,
  renewalPhrase,
  rotationsPhrase,
} from "../../src/lib/rotations";

describe("rotationsPhrase", () => {
  it("says how many there are before any are spent", () => {
    expect(rotationsPhrase(2, 2)).toBe("2 swaps to use this month");
  });

  it("counts down once some are used", () => {
    expect(rotationsPhrase(1, 2)).toBe("1 of 2 swaps left this month");
  });

  it("is plain when there are none left", () => {
    expect(rotationsPhrase(0, 2)).toBe("No swaps left this month");
  });

  it("says so when the plan includes none at all", () => {
    // Different from having spent them: nothing renews.
    expect(rotationsPhrase(0, 0)).toBe("Swaps are not included on this plan");
  });

  it("gets the singular right", () => {
    expect(rotationsPhrase(1, 1)).toBe("1 swap to use this month");
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

describe("offerReplacement", () => {
  const visit = "2026-09-14T08:30:00Z";

  it("offers a struggling plant up when nothing has been replaced", () => {
    expect(offerReplacement("declining", visit, null)).toBe(true);
    expect(offerReplacement("needs_attention", visit, null)).toBe(true);
  });

  it("stays quiet about a healthy plant whatever the history", () => {
    expect(offerReplacement("healthy", visit, null)).toBe(false);
    expect(offerReplacement("healthy", visit, "2026-09-20T10:00:00Z")).toBe(false);
  });

  it("stops offering once the plant has actually been replaced", () => {
    // The fresh plant is not the one the technician found declining.
    expect(offerReplacement("declining", visit, "2026-09-20T10:00:00Z")).toBe(false);
  });

  it("keeps offering when the replacement came before that verdict", () => {
    // A later visit found the *replacement* struggling too. Still a candidate.
    expect(offerReplacement("declining", visit, "2026-08-30T10:00:00Z")).toBe(true);
  });

  it("treats a replacement at the same instant as the visit as older", () => {
    expect(offerReplacement("declining", visit, visit)).toBe(true);
  });

  it("does not offer when the verdict has no date to compare against", () => {
    expect(offerReplacement("declining", null, "2026-09-20T10:00:00Z")).toBe(false);
  });
});
