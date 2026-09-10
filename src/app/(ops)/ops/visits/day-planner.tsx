"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { shortDate, visitStatusLabel, type VisitStatus } from "@/lib/visits";

export type PlannerVisit = {
  id: string;
  status: VisitStatus;
  sequence_no: number | null;
  technician_id: string | null;
  site: { label: string; building: string } | null;
  cadence: string;
};

export function DayPlanner({
  day,
  today,
  visits,
  technicians,
  upcoming,
  offServiceDays,
}: {
  day: string;
  today: string;
  visits: PlannerVisit[];
  technicians: { id: string; name: string }[];
  upcoming: { date: string; count: number }[];
  offServiceDays: { id: string; scheduled_date: string; label: string; zone_name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [generated, setGenerated] = useState<number | null>(null);

  async function assign(visitId: string, technicianId: string | null, seq: number) {
    setError(null);
    setBusy(visitId);
    const supabase = createClient();
    const { error: e } = await supabase.rpc("assign_visit", {
      p_visit_id: visitId,
      p_technician_id: technicianId,
      p_sequence_no: seq,
    });
    setBusy(null);
    if (e) { setError(e.message); return; }
    router.refresh();
  }

  async function generate() {
    setError(null);
    setBusy("generate");
    const supabase = createClient();
    const { data, error: e } = await supabase.rpc("generate_visits", { p_horizon_days: 28 });
    setBusy(null);
    if (e) { setError(e.message); return; }
    setGenerated(data as number);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Visits</h1>
          <p className="mt-1 text-muted">
            Assign who goes and in what order. Visits are generated nightly for the
            four weeks ahead.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={busy === "generate"}
          className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {busy === "generate" ? "Generating…" : "Generate now"}
        </button>
      </header>

      {generated !== null && (
        <p className="text-sm text-leaf">
          {generated === 0 ? "Nothing new to schedule." : `${generated} visit${generated === 1 ? "" : "s"} scheduled.`}
        </p>
      )}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {upcoming.map((u) => (
          <Link
            key={u.date}
            href={`/ops/visits?date=${u.date}`}
            className={`rounded-lg border px-3 py-2 text-sm ${
              u.date === day ? "border-leaf bg-leaf-soft" : "border-line bg-white"
            }`}
          >
            {shortDate(u.date)}
            <span className="ml-2 text-muted">{u.count}</span>
          </Link>
        ))}
        {upcoming.length === 0 && (
          <p className="text-sm text-muted">No visits scheduled yet. Generate to fill the weeks ahead.</p>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {shortDate(day)}
          {day === today && <span className="ml-2 text-sm font-normal text-muted">today</span>}
        </h2>
        {visits.length === 0 ? (
          <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">
            Nothing scheduled for this day.
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {visits.map((v, i) => (
              <li key={v.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{v.site?.label}</p>
                  <p className="text-sm text-muted">{v.site?.building} · {v.cadence}</p>
                </div>
                {v.status !== "planned" ? (
                  <span className="text-sm text-muted">{visitStatusLabel(v.status)}</span>
                ) : (
                  <>
                    <label className="text-sm">
                      <span className="sr-only">Order</span>
                      <input
                        type="number"
                        min={1}
                        defaultValue={v.sequence_no ?? i + 1}
                        onBlur={(e) => assign(v.id, v.technician_id, Number(e.target.value))}
                        className="w-16 rounded-lg border border-line px-2 py-2"
                      />
                    </label>
                    <select
                      value={v.technician_id ?? ""}
                      onChange={(e) => assign(v.id, e.target.value || null, v.sequence_no ?? i + 1)}
                      disabled={busy === v.id}
                      className="rounded-lg border border-line px-3 py-2 text-sm"
                      aria-label="Technician"
                    >
                      <option value="">Nobody yet</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {offServiceDays.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Scheduled off a service day</h2>
          <p className="text-sm text-muted">
            These were planned before the zone&apos;s days changed. Move or cancel them.
          </p>
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {offServiceDays.map((v) => (
              <li key={v.id} className="p-4 text-sm">
                <span className="font-medium">{v.label}</span> · {shortDate(v.scheduled_date)} ·{" "}
                <span className="text-red-700">not a {v.zone_name} day</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
