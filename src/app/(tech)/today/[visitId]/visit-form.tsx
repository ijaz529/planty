"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { tierLabel, type SizeTier } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";
import { CONDITIONS, conditionLabel, type PlantCondition } from "@/lib/visits";

export type VisitPlant = {
  line_id: string;
  species_name: string;
  size_tier: string | null;
  quantity: number;
  condition: PlantCondition | null;
  note: string;
};

export function VisitForm({
  visitId,
  plants,
  photoCount,
}: {
  visitId: string;
  plants: VisitPlant[];
  photoCount: number;
}) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, PlantCondition | null>>(
    Object.fromEntries(plants.map((p) => [p.line_id, p.condition]))
  );
  const [photos, setPhotos] = useState(photoCount);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [missing, setMissing] = useState(false);
  const [reason, setReason] = useState("");

  const allRecorded = plants.every((p) => state[p.line_id]);

  async function setCondition(lineId: string, condition: PlantCondition) {
    setState((s) => ({ ...s, [lineId]: condition }));
    setError(null);
    const supabase = createClient();
    const { error: e } = await supabase
      .from("visit_plant_records")
      .upsert(
        { visit_id: visitId, subscription_line_id: lineId, condition },
        { onConflict: "visit_id,subscription_line_id" }
      );
    if (e) {
      setError(e.message);
      setState((s) => ({ ...s, [lineId]: null }));
    }
  }

  async function addPhoto(file: File) {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${visitId}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage.from("visits").upload(path, file);
    if (upErr) {
      setBusy(false);
      setError(upErr.message);
      return;
    }
    const { error: rowErr } = await supabase
      .from("visit_photos")
      .insert({ visit_id: visitId, storage_path: path });
    setBusy(false);
    if (rowErr) {
      setError(rowErr.message);
      return;
    }
    setPhotos((n) => n + 1);
  }

  /** The database refuses an incomplete visit; we show its words, not ours. */
  async function complete() {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error: e } = await supabase.rpc("complete_visit", {
      p_visit_id: visitId,
      p_note: note || null,
    });
    setBusy(false);
    if (e) {
      setError(e.message);
      return;
    }
    router.push("/today");
    router.refresh();
  }

  async function miss() {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error: e } = await supabase.rpc("miss_visit", {
      p_visit_id: visitId,
      p_reason: reason,
    });
    setBusy(false);
    if (e) {
      setError(e.message);
      return;
    }
    router.push("/today");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How are they doing?</h2>
        <ul className="space-y-3">
          {plants.map((p) => (
            <li key={p.line_id} className="rounded-xl border border-line bg-white p-4">
              <p className="font-medium">
                {p.quantity} × {p.species_name}
                {p.size_tier && (
                  <span className="font-normal text-muted"> · {tierLabel(p.size_tier as SizeTier)}</span>
                )}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(p.line_id, c)}
                    aria-pressed={state[p.line_id] === c}
                    className={`rounded-lg border px-3 py-2.5 text-sm ${
                      state[p.line_id] === c
                        ? "border-leaf bg-leaf text-white"
                        : "border-line bg-white"
                    }`}
                  >
                    {conditionLabel(c)}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Photo</h2>
        <p className="text-sm text-muted">
          {photos === 0
            ? "At least one photo is needed to finish."
            : `${photos} photo${photos === 1 ? "" : "s"} added.`}
        </p>
        <label className="block">
          <span className="sr-only">Add a photo</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) addPhoto(f);
            }}
            className="block w-full rounded-lg border border-line bg-white p-3 text-sm"
          />
        </label>
      </section>

      <section className="space-y-2">
        <label htmlFor="note" className="text-lg font-semibold">
          Anything to note?
        </label>
        <textarea
          id="note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Watered, wiped leaves, one to watch"
          className="w-full rounded-lg border border-line bg-white px-4 py-3"
        />
      </section>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        onClick={complete}
        disabled={busy || !allRecorded || photos === 0}
        className="w-full rounded-lg bg-leaf px-5 py-4 text-lg font-medium text-white disabled:opacity-50"
      >
        {busy ? "Saving…" : "Finish this stop"}
      </button>
      {(!allRecorded || photos === 0) && (
        <p className="-mt-4 text-center text-sm text-muted">
          {!allRecorded && photos === 0
            ? "Mark every plant and add a photo first."
            : !allRecorded
              ? "Mark every plant first."
              : "Add a photo first."}
        </p>
      )}

      {!missing ? (
        <button
          onClick={() => setMissing(true)}
          className="w-full text-sm text-muted underline underline-offset-4"
        >
          Could not do this stop
        </button>
      ) : (
        <div className="space-y-2 rounded-xl border border-line bg-white p-4">
          <label htmlFor="reason" className="text-sm font-medium">
            What stopped you?
          </label>
          <input
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Office closed, nobody at reception"
            className="w-full rounded-lg border border-line px-4 py-3"
          />
          <div className="flex gap-3">
            <button
              onClick={miss}
              disabled={busy || reason.trim().length === 0}
              className="rounded-lg bg-red-700 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              Record as missed
            </button>
            <button onClick={() => setMissing(false)} className="rounded-lg border border-line px-4 py-2 font-medium">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
