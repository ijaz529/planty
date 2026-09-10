"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { changeKindLabel, changeStatusLabel, isOpen, type ChangeKind, type ChangeStatus } from "@/lib/rotations";
import { createClient } from "@/lib/supabase/client";

export type TriageRow = {
  id: string; kind: string; status: string; reason: string | null;
  decision_note: string | null; created_at: string;
  site: string; plant: string; wants: string | null;
};

export function RequestTriage({ rows }: { rows: TriageRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});

  async function decide(id: string, approve: boolean) {
    setError(null);
    setBusy(id);
    const supabase = createClient();
    const { error: e } = await supabase.rpc("decide_plant_change", {
      p_request_id: id,
      p_approve: approve,
      p_note: note[id] || null,
    });
    setBusy(null);
    if (e) { setError(e.message); return; }
    router.refresh();
  }

  const open = rows.filter((r) => isOpen(r.status as ChangeStatus) && r.status === "requested");
  const booked = rows.filter((r) => r.status === "approved");
  const closed = rows.filter((r) => !isOpen(r.status as ChangeStatus));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Requests</h1>
        <p className="mt-1 max-w-2xl text-muted">
          A replacement is our guarantee and is free. A swap spends one of the
          customer&apos;s monthly allowance — declining one gives it back.
        </p>
      </header>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Waiting on you ({open.length})</h2>
        {open.length === 0 ? (
          <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">Nothing to decide.</p>
        ) : (
          <ul className="space-y-3">
            {open.map((r) => (
              <li key={r.id} className="space-y-3 rounded-xl border border-line bg-white p-4">
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {changeKindLabel(r.kind as ChangeKind)} · {r.site}
                    </p>
                    <p className="text-sm text-muted">
                      {r.plant}
                      {r.wants && ` → ${r.wants}`}
                    </p>
                    {r.reason && <p className="mt-1 text-sm">{r.reason}</p>}
                  </div>
                  <span className="text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString("en-AE", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <input
                  value={note[r.id] ?? ""}
                  onChange={(e) => setNote((n) => ({ ...n, [r.id]: e.target.value }))}
                  placeholder="A note the customer will see"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => decide(r.id, true)}
                    disabled={busy === r.id}
                    className="rounded-lg bg-leaf px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  >
                    Approve for the next visit
                  </button>
                  <button
                    onClick={() => decide(r.id, false)}
                    disabled={busy === r.id}
                    className="rounded-lg border border-line px-4 py-2 text-sm font-medium disabled:opacity-60"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Booked onto a visit ({booked.length})</h2>
        {booked.length === 0 ? (
          <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">None waiting to be done.</p>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {booked.map((r) => (
              <li key={r.id} className="p-4 text-sm">
                <span className="font-medium">{changeKindLabel(r.kind as ChangeKind)}</span> · {r.site} · {r.plant}
                {r.wants && ` → ${r.wants}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      {closed.length > 0 && (
        <details className="rounded-xl border border-line bg-white p-4">
          <summary className="cursor-pointer font-medium">Closed ({closed.length})</summary>
          <ul className="mt-3 space-y-2 text-sm">
            {closed.map((r) => (
              <li key={r.id}>
                {changeKindLabel(r.kind as ChangeKind)} · {r.site} · {r.plant} ·{" "}
                <span className="text-muted">{changeStatusLabel(r.status as ChangeStatus)}</span>
                {r.decision_note && <span className="block text-muted">{r.decision_note}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
