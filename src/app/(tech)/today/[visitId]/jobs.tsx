"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type StopJob = {
  id: string;
  kind: "replacement" | "rotation";
  plant: string;
  wants: string | null;
  reason: string | null;
  note: string | null;
  done: boolean;
};

/**
 * Approved requests ride the visit, so they appear where the technician is
 * already looking rather than in a second place to remember to check.
 */
export function StopJobs({ jobs }: { jobs: StopJob[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function fulfil(id: string) {
    setError(null);
    setBusy(id);
    const supabase = createClient();
    const { error: e } = await supabase.rpc("fulfil_plant_change", { p_request_id: id });
    setBusy(null);
    if (e) { setError(e.message); return; }
    router.refresh();
  }

  if (jobs.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Bring with you</h2>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <ul className="space-y-3">
        {jobs.map((j) => (
          <li key={j.id} className="space-y-2 rounded-xl border border-leaf bg-leaf-soft/50 p-4">
            <p className="font-medium">
              {j.kind === "replacement"
                ? `Replace: ${j.plant}`
                : `Swap out ${j.plant} for ${j.wants ?? "the new plant"}`}
            </p>
            {j.reason && <p className="text-sm text-muted">{j.reason}</p>}
            {j.note && <p className="text-sm text-muted">Office note: {j.note}</p>}
            {j.done ? (
              <p className="text-sm font-medium text-leaf">Done</p>
            ) : (
              <button
                onClick={() => fulfil(j.id)}
                disabled={busy === j.id}
                className="rounded-lg bg-leaf px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {busy === j.id ? "Saving…" : "Mark carried out"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
