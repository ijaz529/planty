"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  isConsistent,
  movementSummary,
  rateComparison,
  ratePhrase,
  rateVerdict,
  reasonLabel,
  totals,
  type DepotRow,
} from "@/lib/depot";
import { createClient } from "@/lib/supabase/client";

export type Movement = {
  id: string; reason: string; delta_total: number; delta_allocated: number;
  delta_recovering: number; note: string | null; created_at: string; plant: string;
};

type Action = "receive_stock" | "write_off_stock" | "recover_stock";

export function DepotManager({
  rows,
  rate,
  movements,
}: {
  rows: DepotRow[];
  rate: number | null;
  movements: Movement[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<{ id: string; action: Action } | null>(null);
  const [qty, setQty] = useState("1");
  const [note, setNote] = useState("");

  const t = totals(rows);
  const verdict = rateVerdict(rate);

  async function run(variantId: string, action: Action) {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error: e } = await supabase.rpc(action, {
      p_variant_id: variantId,
      p_quantity: Number(qty),
      p_note: note || null,
    });
    setBusy(false);
    // The database owns the limits — what the depot holds, what is recovering —
    // so its refusal is the honest message.
    if (e) { setError(e.message); return; }
    setOpen(null);
    setQty("1");
    setNote("");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Depot</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Every plant Planty owns, where it is, and how fast the guarantee is
          consuming stock.
        </p>
      </header>

      <section
        className={`rounded-xl border p-5 ${
          verdict === "over" ? "border-red-300 bg-red-50" : "border-line bg-white"
        }`}
      >
        <h2 className="text-sm font-medium text-muted">Replacement rate</h2>
        <p className="mt-1 text-2xl font-semibold">{ratePhrase(rate)}</p>
        {rateComparison(rate) && (
          <p className={`mt-1 text-sm ${verdict === "over" ? "text-red-800" : "text-muted"}`}>
            {rateComparison(rate)}
          </p>
        )}
      </section>

      <dl className="grid gap-3 sm:grid-cols-4">
        {[
          ["Owned", t.owned],
          ["With customers", t.with_customers],
          ["Recovering", t.recovering],
          ["Ready to send", t.ready],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-line bg-white p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Plants</h2>
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {rows.map((r) => (
            <li key={r.variant_id} className="space-y-3 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {r.species_name}
                    {r.size_tier && <span className="font-normal text-muted"> · {r.size_tier}</span>}
                  </p>
                  <p className="text-sm text-muted">
                    {r.owned} owned · {r.with_customers} with customers ·{" "}
                    {r.recovering} recovering · <strong>{r.ready} ready</strong>
                  </p>
                  {!isConsistent(r) && (
                    <p className="text-sm text-red-700">These counts do not add up.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen({ id: r.variant_id, action: "receive_stock" })}
                    className="rounded-lg border border-line px-3 py-2 text-sm font-medium"
                  >
                    Receive
                  </button>
                  <button
                    onClick={() => setOpen({ id: r.variant_id, action: "write_off_stock" })}
                    className="rounded-lg border border-line px-3 py-2 text-sm font-medium"
                  >
                    Write off
                  </button>
                  {r.recovering > 0 && (
                    <button
                      onClick={() => setOpen({ id: r.variant_id, action: "recover_stock" })}
                      className="rounded-lg bg-leaf px-3 py-2 text-sm font-medium text-white"
                    >
                      Return {r.recovering}
                    </button>
                  )}
                </div>
              </div>

              {open?.id === r.variant_id && (
                <div className="flex flex-wrap items-end gap-2 rounded-lg bg-leaf-soft/50 p-3">
                  <label className="text-sm">
                    <span className="mb-1 block text-xs text-muted">How many</span>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="w-24 rounded-lg border border-line px-3 py-2"
                    />
                  </label>
                  <label className="flex-1 text-sm">
                    <span className="mb-1 block text-xs text-muted">
                      {open.action === "write_off_stock" ? "Why (recorded in the ledger)" : "Note"}
                    </span>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={
                        open.action === "write_off_stock"
                          ? "Root rot after the AC failure"
                          : "Delivery from the nursery"
                      }
                      className="w-full rounded-lg border border-line px-3 py-2"
                    />
                  </label>
                  <button
                    onClick={() => run(r.variant_id, open.action)}
                    disabled={busy}
                    className="rounded-lg bg-leaf px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {busy ? "Saving…" : "Record"}
                  </button>
                  <button
                    onClick={() => { setOpen(null); setError(null); }}
                    className="rounded-lg border border-line px-4 py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent movements</h2>
        <p className="text-sm text-muted">
          Nothing changes a count without appearing here.
        </p>
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {movements.length === 0 && (
            <li className="p-4 text-sm text-muted">No movements yet.</li>
          )}
          {movements.map((m) => (
            <li key={m.id} className="flex flex-wrap items-baseline gap-2 p-3 text-sm">
              <span className="w-40 shrink-0 text-muted">
                {new Date(m.created_at).toLocaleString("en-AE", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </span>
              <span className="font-medium">{m.plant}</span>
              <span>{reasonLabel(m.reason)}</span>
              <span className="font-mono text-xs">{movementSummary(m)}</span>
              {m.note && <span className="w-full text-muted">{m.note}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
