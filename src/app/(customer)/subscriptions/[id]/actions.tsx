"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CancelButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function cancel() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase.rpc("cancel_subscription", {
      p_id: id,
      p_note: "cancelled by customer",
    });
    setBusy(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="text-sm text-muted underline underline-offset-4">
        Cancel this order
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-line bg-white p-4 text-sm">
      <p>Cancel and release the plants? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={cancel} disabled={busy} className="rounded-lg bg-red-700 px-4 py-2 font-medium text-white disabled:opacity-60">
          {busy ? "Cancelling…" : "Yes, cancel"}
        </button>
        <button onClick={() => setConfirming(false)} className="rounded-lg border border-line px-4 py-2 font-medium">
          Keep it
        </button>
      </div>
      {error && <p role="alert" className="text-red-700">{error}</p>}
    </div>
  );
}
