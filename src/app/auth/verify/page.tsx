"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { formatUaePhone } from "@/lib/phone";
import { getUserContext, postSignInPath } from "@/lib/roles";
import { createClient } from "@/lib/supabase/client";

const RESEND_SECONDS = 30;

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code we sent you");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    });

    if (authError) {
      setBusy(false);
      const message = authError.message.toLowerCase();
      setError(
        message.includes("expired")
          ? "That code has expired. Request a new one."
          : "That code is not right. Check it and try again."
      );
      return;
    }

    // New accounts have no name yet, so send them to fill it in first.
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .single();

    if (!profile?.display_name) {
      router.push("/profile?welcome=1");
      return;
    }

    const ctx = await getUserContext(supabase);
    router.push(postSignInPath(ctx));
  }

  async function onResend() {
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({ phone });
    if (authError) {
      setError("We could not send another code just now.");
      return;
    }
    setNotice("A new code is on its way.");
    setCooldown(RESEND_SECONDS);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-8 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Enter your code</h1>
        <p className="text-sm text-muted">
          Sent to {phone ? formatUaePhone(phone) : "your mobile"}.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor="code" className="block text-sm font-medium">
            Six-digit code
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "code-error" : undefined}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/30"
          />
          {error && (
            <p id="code-error" role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          {notice && <p className="text-sm text-leaf">{notice}</p>}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-leaf px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {busy ? "Checking…" : "Continue"}
        </button>
      </form>

      <button
        type="button"
        onClick={onResend}
        disabled={cooldown > 0}
        className="text-sm text-muted underline underline-offset-4 disabled:no-underline disabled:opacity-60"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Send a new code"}
      </button>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
