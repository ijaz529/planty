import { describe, expect, it } from "vitest";
import { formatUaePhone, normalizeUaePhone } from "../../src/lib/phone";

const E164 = "+971501234567";

describe("normalizeUaePhone", () => {
  it.each([
    ["0501234567"],
    ["501234567"],
    ["971501234567"],
    ["+971501234567"],
    ["00971501234567"],
    ["+9710501234567"], // trunk zero after the country code, seen in the wild
    ["050 123 4567"],
    ["050-123-4567"],
    ["(050) 123 4567"],
    ["+971 50 123 4567"],
  ])("normalizes %s", (input) => {
    expect(normalizeUaePhone(input)).toEqual({ ok: true, e164: E164 });
  });

  it.each([
    ["52", "+971521234567"],
    ["54", "+971541234567"],
    ["55", "+971551234567"],
    ["56", "+971561234567"],
    ["58", "+971581234567"],
  ])("accepts the 0%s mobile prefix", (prefix, expected) => {
    expect(normalizeUaePhone(`0${prefix}1234567`)).toEqual({
      ok: true,
      e164: expected,
    });
  });

  it.each([
    ["", "empty"],
    ["043331234", "Dubai landline (04)"],
    ["+97143331234", "landline with country code"],
    ["+14155551234", "US number"],
    ["+919812345678", "Indian number"],
    ["05012345", "too short"],
    ["05012345678", "too long"],
    ["05o1234567", "letter inside"],
    ["+971", "country code only"],
    ["971", "country code only, no plus"],
    ["50+1234567", "plus in the middle"],
  ])("rejects %s (%s)", (input) => {
    expect(normalizeUaePhone(input).ok).toBe(false);
  });

  it("names the reason for a non-mobile UAE number", () => {
    const res = normalizeUaePhone("043331234");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("UAE mobile");
  });

  it("distinguishes too short from too long", () => {
    const short = normalizeUaePhone("05012345");
    const long = normalizeUaePhone("05012345678");
    expect(short.ok).toBe(false);
    expect(long.ok).toBe(false);
    if (!short.ok) expect(short.error).toContain("short");
    if (!long.ok) expect(long.error).toContain("long");
  });

  it("maps every accepted format of one number to a single value", () => {
    const forms = [
      "0501234567",
      "501234567",
      "971501234567",
      "+971501234567",
      "00971501234567",
      "050 123 4567",
    ];
    const results = new Set(
      forms.map((f) => {
        const r = normalizeUaePhone(f);
        return r.ok ? r.e164 : `invalid:${f}`;
      })
    );
    expect(results).toEqual(new Set([E164]));
  });
});

describe("formatUaePhone", () => {
  it("renders E.164 in the local reading form", () => {
    expect(formatUaePhone(E164)).toBe("050 123 4567");
  });

  it("returns anything unrecognised unchanged", () => {
    expect(formatUaePhone("not a number")).toBe("not a number");
  });
});
