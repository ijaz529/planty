"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { normalizeUaePhone } from "@/lib/phone";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = normalizeUaePhone(input);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      phone: parsed.e164,
    });
    setBusy(false);

    if (authError) {
      setError(
        authError.status === 429
          ? "Too many codes requested. Wait a minute and try again."
          : "We could not send a code just now. Please try again."
      );
      return;
    }

    router.push(`/auth/verify?phone=${encodeURIComponent(parsed.e164)}`);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-8 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Sign in to Planty</h1>
        <p className="text-sm text-muted">
          We send a six-digit code to your mobile. No password to remember.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">
            Mobile number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="050 123 4567"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "phone-error" : undefined}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-base outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/30"
          />
          {error && (
            <p id="phone-error" role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-leaf px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {busy ? "Sending code…" : "Send code"}
        </button>
      </form>

      <p className="text-xs text-muted">
        UAE mobile numbers only while Planty is in its Dubai pilot.
      </p>
    </main>
  );
}
