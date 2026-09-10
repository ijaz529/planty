"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "@/app/(customer)/subscriptions/status-badge";
import { formatPrecise } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/client";

type Row = {
  id: string; status: string; reference: string; email: string; total: number;
  install: string; reserved_until: string; site: string; customer: string;
};

export function SubscriptionsManager({ subs, bankDetails }: { subs: Row[]; bankDetails: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [bank, setBank] = useState(bankDetails);
  const [busy, setBusy] = useState<string | null>(null);

  async function call(fn: "mark_subscription_paid" | "cancel_subscription", id: string, note?: string) {
    setError(null);
    setBusy(id);
    const supabase = createClient();
    const { error: e } = await supabase.rpc(fn, fn === "cancel_subscription" ? { p_id: id, p_note: note ?? null } : { p_id: id });
    setBusy(null);
    if (e) { setError(e.message); return; }
    router.refresh();
  }

  async function saveBank() {
    setError(null);
    const supabase = createClient();
    const { error: e } = await supabase.from("operator_settings").update({ value: bank }).eq("key", "bank_details");
    if (e) { setError(e.message); return; }
    router.refresh();
  }

  const expired = (r: Row) => r.status === "pending" && new Date(r.reserved_until) < new Date();

  return (
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <ul className="divide-y divide-line rounded-xl border border-line bg-white">
        {subs.length === 0 && <li className="p-4 text-sm text-muted">No subscriptions yet.</li>}
        {subs.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="flex-1">
              <p className="font-medium">{r.customer} · {r.site}</p>
              <p className="text-sm text-muted">
                <span className="font-mono">{r.reference}</span> · {formatPrecise(r.total)}/mo · installs {new Date(r.install).toLocaleDateString("en-AE", { day: "numeric", month: "short" })} · {r.email}
              </p>
              {expired(r) && <p className="text-sm text-red-700">Reservation expired unpaid.</p>}
            </div>
            <StatusBadge status={r.status} />
            {r.status === "pending" && (
              <>
                <button onClick={() => call("mark_subscription_paid", r.id)} disabled={busy === r.id}
                  className="rounded-lg bg-leaf px-3 py-2 text-sm font-medium text-white disabled:opacity-60">
                  Mark paid
                </button>
                <button onClick={() => call("cancel_subscription", r.id, expired(r) ? "reservation expired" : "cancelled by operator")} disabled={busy === r.id}
                  className="rounded-lg border border-line px-3 py-2 text-sm font-medium disabled:opacity-60">
                  {expired(r) ? "Release" : "Cancel"}
                </button>
              </>
            )}
            {r.status === "active" && (
              <button onClick={() => call("cancel_subscription", r.id, "ended by operator")} disabled={busy === r.id}
                className="rounded-lg border border-line px-3 py-2 text-sm font-medium disabled:opacity-60">
                End
              </button>
            )}
          </li>
        ))}
      </ul>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Bank details shown on invoices</h2>
        <textarea value={bank} onChange={(e) => setBank(e.target.value)} rows={5}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 font-mono text-sm" />
        <button onClick={saveBank} disabled={bank === bankDetails}
          className="rounded-lg bg-leaf px-4 py-2 font-medium text-white disabled:opacity-40">
          Save
        </button>
      </section>
    </div>
  );
}
