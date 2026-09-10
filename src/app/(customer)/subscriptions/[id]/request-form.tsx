"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { tierLabel, type SizeTier } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";

export type CarePlant = {
  line_id: string;
  species_name: string;
  size_tier: string | null;
  quantity: number;
  flagged: boolean;
  has_open_request: boolean;
};

export type SwapTarget = { variant_id: string; label: string };

export function RequestForm({
  plants,
  swapTargets,
  rotationsLeft,
  renewalDate,
}: {
  plants: CarePlant[];
  swapTargets: SwapTarget[];
  rotationsLeft: number;
  renewalDate: string | null;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"none" | "replacement" | "rotation">("none");
  const [lineId, setLineId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const available = plants.filter((p) => !p.has_open_request);
  const flagged = available.filter((p) => p.flagged);

  async function submit() {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error: e } = await supabase.rpc("request_plant_change", {
      p_line_id: lineId,
      p_kind: mode,
      p_requested_variant_id: mode === "rotation" ? targetId : null,
      p_reason: reason || null,
    });
    setBusy(false);
    // The database owns the rules — the allowance, the one-open-request limit,
    // whether the plant is in stock — so its words are the honest ones.
    if (e) { setError(e.message); return; }
    setMode("none");
    setLineId("");
    setTargetId("");
    setReason("");
    router.refresh();
  }

  if (available.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">
        Every plant already has a request open.
      </p>
    );
  }

  if (mode === "none") {
    return (
      <div className="space-y-3">
        {flagged.length > 0 && (
          <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium">
              {flagged.length === 1
                ? "One of your plants was struggling at the last visit."
                : `${flagged.length} of your plants were struggling at the last visit.`}
            </p>
            <ul className="text-sm text-muted">
              {flagged.map((p) => (
                <li key={p.line_id}>
                  {p.quantity} × {p.species_name}
                  {p.size_tier && ` · ${tierLabel(p.size_tier as SizeTier)}`}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setMode("replacement");
                setLineId(flagged[0].line_id);
              }}
              className="rounded-lg bg-leaf px-4 py-2 text-sm font-medium text-white"
            >
              Ask us to replace it — free
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setMode("replacement")}
            className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium"
          >
            Report a plant that is unwell
          </button>
          <button
            onClick={() => setMode("rotation")}
            disabled={rotationsLeft <= 0 || swapTargets.length === 0}
            className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            title={rotationsLeft <= 0 ? "No swaps left this month" : undefined}
          >
            Swap one for something different
          </button>
        </div>
        {rotationsLeft <= 0 && renewalDate && (
          <p className="text-sm text-muted">
            Your swaps come back on{" "}
            {new Date(renewalDate).toLocaleDateString("en-AE", { day: "numeric", month: "long" })}.
            Reporting an unwell plant is always free.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-line bg-white p-5">
      <h3 className="font-semibold">
        {mode === "replacement" ? "Which plant is unwell?" : "Which plant would you like to swap?"}
      </h3>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Plant</span>
        <select
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
          className="w-full rounded-lg border border-line px-4 py-3"
        >
          <option value="">Choose…</option>
          {available.map((p) => (
            <option key={p.line_id} value={p.line_id}>
              {p.quantity} × {p.species_name}
              {p.size_tier ? ` · ${tierLabel(p.size_tier as SizeTier)}` : ""}
              {p.flagged ? " (was struggling)" : ""}
            </option>
          ))}
        </select>
      </label>

      {mode === "rotation" && (
        <label className="block space-y-1">
          <span className="text-sm font-medium">Swap it for</span>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full rounded-lg border border-line px-4 py-3"
          >
            <option value="">Choose…</option>
            {swapTargets.map((t) => (
              <option key={t.variant_id} value={t.variant_id}>{t.label}</option>
            ))}
          </select>
          <span className="block text-xs text-muted">
            Only plants we have in stock right now.
          </span>
        </label>
      )}

      <label className="block space-y-1">
        <span className="text-sm font-medium">
          {mode === "replacement" ? "What is wrong with it?" : "Anything we should know?"}
        </span>
        <textarea
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={
            mode === "replacement"
              ? "Leaves browning since the air conditioning was serviced"
              : "Somewhere brighter would suit the corner better"
          }
          className="w-full rounded-lg border border-line px-4 py-3"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={submit}
          disabled={busy || !lineId || (mode === "rotation" && !targetId)}
          className="rounded-lg bg-leaf px-5 py-3 font-medium text-white disabled:opacity-50"
        >
          {busy ? "Sending…" : mode === "replacement" ? "Ask for a replacement" : "Use a swap"}
        </button>
        <button
          onClick={() => { setMode("none"); setError(null); }}
          className="rounded-lg border border-line px-5 py-3 font-medium"
        >
          Cancel
        </button>
      </div>
      {mode === "rotation" && (
        <p className="text-sm text-muted">
          This uses one of your {rotationsLeft} remaining swaps.
        </p>
      )}
    </div>
  );
}
