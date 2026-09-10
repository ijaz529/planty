"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { siteSchema } from "@/lib/validation";

// Leaflet touches window on import, so it must not run during SSR.
const PinPicker = dynamic(
  () => import("@/components/map/pin-picker").then((m) => m.PinPicker),
  { ssr: false, loading: () => <div className="h-64 rounded-lg bg-leaf-soft" /> }
);

// Downtown Dubai — a sensible place to start dragging from.
const DEFAULT_LAT = 25.187;
const DEFAULT_LNG = 55.27;

export function NewSiteForm({
  organizations,
}: {
  organizations: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lng, setLng] = useState(DEFAULT_LNG);
  const [error, setError] = useState<string | null>(null);
  const [outOfZone, setOutOfZone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOutOfZone(false);

    const form = new FormData(event.currentTarget);
    const parsed = siteSchema.safeParse({
      label: form.get("label"),
      building: form.get("building"),
      unit: form.get("unit"),
      makani: form.get("makani"),
      access_notes: form.get("access_notes"),
      owner: form.get("owner"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const owner = parsed.data.owner;
    const { error: dbError } = await supabase.from("sites").insert({
      label: parsed.data.label,
      building: parsed.data.building,
      unit: parsed.data.unit || null,
      makani: parsed.data.makani || null,
      access_notes: parsed.data.access_notes || null,
      owner_account_id: owner === "me" ? user!.id : null,
      organization_id: owner === "me" ? null : owner,
      // PostGIS geography is (longitude, latitude).
      location: `SRID=4326;POINT(${lng} ${lat})`,
      // Overwritten by the trigger with the zone that actually covers the pin.
      zone_id: "00000000-0000-0000-0000-000000000000",
    });
    setBusy(false);

    if (dbError) {
      // The database is the authority on where we serve, so we surface its
      // refusal rather than duplicating the boundary check in the browser.
      if (dbError.message.includes("do not serve this location")) {
        setOutOfZone(true);
        return;
      }
      setError(dbError.message);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  async function joinWaitlist(note: string) {
    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("waitlist_entries").insert({
      account_id: user!.id,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      area_note: note || null,
    });
    setBusy(false);
    setOutOfZone(false);
    setOpen(false);
    setError(null);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-leaf px-5 py-3 font-medium text-white"
      >
        Add a site
      </button>
    );
  }

  if (outOfZone) {
    return (
      <div className="space-y-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-semibold">We do not serve that spot yet</h2>
        <p className="text-sm text-muted">
          Planty keeps its visits tight so a technician can reach every customer
          the same week. Tell us where you are and we will let you know when we
          reach your area.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => joinWaitlist("")}
            disabled={busy}
            className="rounded-lg bg-leaf px-5 py-3 font-medium text-white disabled:opacity-60"
          >
            {busy ? "Adding…" : "Add me to the waitlist"}
          </button>
          <button
            onClick={() => setOutOfZone(false)}
            className="rounded-lg border border-line px-5 py-3 font-medium"
          >
            Move the pin instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-line bg-white p-5"
    >
      <h2 className="font-semibold">New site</h2>

      <div className="space-y-2">
        <span className="block text-sm font-medium">
          Drop the pin on the building
        </span>
        <PinPicker
          lat={lat}
          lng={lng}
          onMove={(newLat, newLng) => {
            setLat(newLat);
            setLng(newLng);
          }}
        />
        <p className="text-xs text-muted">
          Dubai has no postal codes, so the pin is the address.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="owner" className="block text-sm font-medium">
          This site belongs to
        </label>
        <select
          id="owner"
          name="owner"
          defaultValue="me"
          className="w-full rounded-lg border border-line px-4 py-3"
        >
          <option value="me">Me</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      <Field label="Name this place" name="label" placeholder="Marina office" />
      <Field
        label="Building or villa"
        name="building"
        placeholder="Bay Square Building 8"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Unit or floor" name="unit" placeholder="Level 3" />
        <Field
          label="Makani number"
          name="makani"
          placeholder="2467887634"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="access_notes" className="block text-sm font-medium">
          How does our technician get in?
        </label>
        <textarea
          id="access_notes"
          name="access_notes"
          rows={3}
          placeholder="Gate code, reception name, parking, pets to know about"
          className="w-full rounded-lg border border-line px-4 py-3"
        />
        <p className="text-xs text-muted">
          Only you and the Planty team assigned to your visits can read this.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-leaf px-5 py-3 font-medium text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save site"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-line px-5 py-3 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full rounded-lg border border-line px-4 py-3"
        {...rest}
      />
    </div>
  );
}
