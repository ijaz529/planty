/**
 * UAE mobile number normalisation.
 *
 * Planty signs people in by phone, so every entry format a person might type
 * has to resolve to exactly one account (spec FR-002, SC-007). The canonical
 * form is E.164: +9715XXXXXXXX.
 *
 * Accepted inputs, with any spaces, dashes or brackets:
 *   0501234567, 501234567, 971501234567, +971501234567, 00971501234567
 * Rejected: landlines (04…), non-UAE country codes, wrong lengths, letters.
 */

export type PhoneResult =
  | { ok: true; e164: string }
  | { ok: false; error: string };

const NOT_A_DIGIT = /[\s\-().]/g;

/** UAE mobile prefixes in national form, after the leading 0 is stripped. */
const MOBILE_PREFIXES = ["50", "52", "54", "55", "56", "58"];

export function normalizeUaePhone(input: string): PhoneResult {
  const cleaned = (input ?? "").replace(NOT_A_DIGIT, "");

  if (cleaned.length === 0) {
    return { ok: false, error: "Enter your mobile number" };
  }
  if (/[^\d+]/.test(cleaned) || cleaned.indexOf("+") > 0) {
    return { ok: false, error: "Use digits only" };
  }

  // Reduce every accepted shape to the 9-digit national number (5XXXXXXXX).
  let national = cleaned;
  if (national.startsWith("+971")) national = national.slice(4);
  else if (national.startsWith("00971")) national = national.slice(5);
  else if (national.startsWith("971")) national = national.slice(3);

  // Both "+9710501234567" and a plain "0501234567" carry a trunk zero.
  if (national.startsWith("0")) national = national.slice(1);

  if (national.length === 0) {
    return { ok: false, error: "Enter your mobile number" };
  }
  if (!/^\d+$/.test(national)) {
    return { ok: false, error: "Use digits only" };
  }
  if (!MOBILE_PREFIXES.includes(national.slice(0, 2))) {
    return {
      ok: false,
      error: "Enter a UAE mobile number, for example 050 123 4567",
    };
  }
  if (national.length !== 9) {
    return {
      ok: false,
      error:
        national.length < 9
          ? "That number is too short"
          : "That number is too long",
    };
  }

  return { ok: true, e164: `+971${national}` };
}

/** Renders E.164 back as a UAE reader expects to see it: 050 123 4567. */
export function formatUaePhone(e164: string): string {
  const m = /^\+971(\d{2})(\d{3})(\d{4})$/.exec(e164);
  if (!m) return e164;
  return `0${m[1]} ${m[2]} ${m[3]}`;
}
