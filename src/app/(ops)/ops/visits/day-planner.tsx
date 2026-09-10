"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  formatDistance,
  planRoute,
  routeLength,
  savingPhrase,
} from "@/lib/route";
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
  const [suggestion, setSuggestion] = useState<{
    order: { id: string; label: string }[];
    unroutable: string[];
    distance: number;
    saving: string | null;
  } | null>(null);

  /**
   * Suggest an order, and change nothing until the operator says so (FR-007).
   * The stops and the depot come from the database rather than from the props
   * above, because PostGIS coordinates do not survive the trip as numbers.
   */
  async function suggestRoute() {
    setError(null);
    setSuggestion(null);
    setBusy("route");
    const supabase = createClient();
    const [{ data: depotRows, error: de }, { data: stops, error: se }] = await Promise.all([
      supabase.rpc("depot_point"),
      supabase.rpc("route_candidates", { p_date: day }),
    ]);
    setBusy(null);
    if (de || se) { setError((de ?? se)!.message); return; }

    const depot = (depotRows as { label: string; lat: number; lon: number }[] | null)?.[0];
    if (!depot) {
      setError("No depot is set, so a route has nowhere to start. Set one first.");
      return;
    }
    const candidates = (stops ?? []) as {
      visit_id: string; site_label: string; lat: number | null; lon: number | null;
    }[];
    if (candidates.length === 0) {
      setError("Nothing left to order on this day.");
      return;
    }

    const before = routeLength(
      depot,
      candidates
        .filter((c) => c.lat !== null && c.lon !== null)
        .map((c) => ({ lat: c.lat as number, lon: c.lon as number }))
    );
    const plan = planRoute(
      depot,
      candidates.map((c) => ({ id: c.visit_id, lat: c.lat, lon: c.lon }))
    );
    const labelOf = (id: string) =>
      candidates.find((c) => c.visit_id === id)?.site_label ?? "Stop";

    setSuggestion({
      order: plan.order.map((s) => ({ id: s.id, label: labelOf(s.id) })),
      unroutable: plan.unroutable.map(labelOf),
      distance: plan.distanceMetres,
      saving: savingPhrase(before, plan.distanceMetres),
    });
  }

  /** FR-008: renumber the day in the suggested order, in one action. */
  async function applyRoute() {
    if (!suggestion) return;
    setError(null);
    setBusy("route");
    const supabase = createClient();
    const { error: e } = await supabase.rpc("apply_route", {
      p_visit_ids: suggestion.order.map((s) => s.id),
    });
    setBusy(null);
    if (e) { setError(e.message); return; }
    setSuggestion(null);
    router.refresh();
  }

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
        {visits.some((v) => v.status === "planned") && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={suggestRoute}
              disabled={busy === "route"}
              className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {busy === "route" ? "Working…" : "Plan the route"}
            </button>
            <span className="text-sm text-muted">
              Orders the day from the depot and back. Nothing changes until you
              apply it.
            </span>
          </div>
        )}

        {suggestion && (
          <div className="space-y-3 rounded-xl border border-leaf bg-leaf-soft/40 p-4">
            <p className="text-sm font-medium">
              {formatDistance(suggestion.distance)}
              {suggestion.saving && (
                <span className="font-normal text-leaf"> · {suggestion.saving}</span>
              )}
              {!suggestion.saving && (
                <span className="font-normal text-muted">
                  {" "}· the order you have is already about as short
                </span>
              )}
            </p>
            <ol className="space-y-1 text-sm">
              {suggestion.order.map((s, i) => (
                <li key={s.id}>
                  <span className="mr-2 font-medium text-muted">{i + 1}</span>
                  {s.label}
                </li>
              ))}
            </ol>
            {suggestion.unroutable.length > 0 && (
              <p className="text-sm text-amber-800">
                No pin on the map for {suggestion.unroutable.join(", ")}, so
                {suggestion.unroutable.length === 1 ? " it is" : " they are"} left
                where {suggestion.unroutable.length === 1 ? "it is" : "they are"}.
                Add an address to include{" "}
                {suggestion.unroutable.length === 1 ? "it" : "them"}.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={applyRoute}
                disabled={busy === "route"}
                className="rounded-lg bg-leaf px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                Use this order
              </button>
              <button
                onClick={() => setSuggestion(null)}
                className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium"
              >
                Keep mine
              </button>
            </div>
          </div>
        )}

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
