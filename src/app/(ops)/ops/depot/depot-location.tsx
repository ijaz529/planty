"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PinPicker } from "@/components/map/pin-picker";
import { createClient } from "@/lib/supabase/client";

export type DepotPoint = { label: string; lat: number; lon: number };

/** Al Quoz, where a depot would sit if Planty has not said otherwise yet. */
const FALLBACK = { lat: 25.129, lon: 55.234 };

/**
 * Where the van starts and finishes. Every route is measured from this point,
 * so it is worth being able to see it rather than trusting a coordinate typed
 * into a migration.
 *
 * The pin is the address, as it is for customer sites — Dubai has no postal
 * codes (feature 001, research R4) — and placing it on a map is also what stops
 * longitude and latitude being transposed by hand.
 */
export function DepotLocation({ depot }: { depot: DepotPoint | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(depot?.label ?? "Planty depot");
  const [lat, setLat] = useState(depot?.lat ?? FALLBACK.lat);
  const [lon, setLon] = useState(depot?.lon ?? FALLBACK.lon);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const moved =
    !depot ||
    depot.label !== label ||
    Math.abs(depot.lat - lat) > 1e-7 ||
    Math.abs(depot.lon - lon) > 1e-7;

  async function save() {
    setError(null);
    setSaved(false);
    setBusy(true);
    const supabase = createClient();
    // The database owns the rules — who may move it, and that it has a name.
    const { error: e } = await supabase.rpc("set_depot", {
      p_label: label,
      p_lat: lat,
      p_lon: lon,
    });
    setBusy(false);
    if (e) { setError(e.message); return; }
    setSaved(true);
    setEditing(false);
    router.refresh();
  }

  function cancel() {
    setLabel(depot?.label ?? "Planty depot");
    setLat(depot?.lat ?? FALLBACK.lat);
    setLon(depot?.lon ?? FALLBACK.lon);
    setError(null);
    setEditing(false);
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Where the day starts</h2>
          <p className="mt-1 text-sm text-muted">
            Every route is measured out from here and back again.
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium"
          >
            {depot ? "Move the depot" : "Place the depot"}
          </button>
        )}
      </div>

      {saved && !editing && (
        <p className="text-sm text-leaf">
          Saved. Routes planned from now on start here.
        </p>
      )}

      {!editing ? (
        <div className="rounded-xl border border-line bg-white p-4">
          {depot ? (
            <>
              <p className="font-medium">{depot.label}</p>
              <p className="mt-1 text-sm text-muted">
                {depot.lat.toFixed(5)}, {depot.lon.toFixed(5)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">
              No depot is set, so routes have nowhere to start. Place one to plan
              a day.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-line bg-white p-5">
          <label className="block space-y-1">
            <span className="text-sm font-medium">What it is called</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Al Quoz depot"
              className="w-full rounded-lg border border-line px-4 py-3"
            />
          </label>

          <div className="space-y-2">
            <span className="block text-sm font-medium">
              Drag the pin to the warehouse
            </span>
            <PinPicker
              lat={lat}
              lng={lon}
              onMove={(newLat, newLng) => {
                setLat(newLat);
                setLon(newLng);
              }}
            />
            {/* FR-006: a wrong pin should be visible before it is saved. */}
            <p className="text-xs text-muted">
              {lat.toFixed(5)}, {lon.toFixed(5)} · the pin is the address, as it
              is for customer sites.
            </p>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={busy || !moved}
              className="rounded-lg bg-leaf px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save the depot"}
            </button>
            <button
              onClick={cancel}
              className="rounded-lg border border-line px-5 py-3 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
