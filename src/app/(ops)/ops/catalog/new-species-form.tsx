"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { speciesSchema } from "@/lib/validation";

export function NewSpeciesForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const parsed = speciesSchema.safeParse({
      common_name: form.get("common_name"),
      botanical_name: form.get("botanical_name"),
      light_requirement: form.get("light_requirement"),
      watering_interval_days: form.get("watering_interval_days"),
      pet_safe: form.get("pet_safe") === "on",
      description: form.get("description"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("plant_species")
      .insert({ ...parsed.data, description: parsed.data.description || null })
      .select("id")
      .single();
    setBusy(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    setOpen(false);
    router.push(`/ops/catalog/${data.id}`);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-leaf px-5 py-3 font-medium text-white"
      >
        Add a species
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-line bg-white p-5"
    >
      <h2 className="font-semibold">New species</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Common name" name="common_name" placeholder="Snake plant" />
        <Field
          label="Botanical name"
          name="botanical_name"
          placeholder="Dracaena trifasciata"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="light_requirement" className="block text-sm font-medium">
            Light requirement
          </label>
          <select
            id="light_requirement"
            name="light_requirement"
            defaultValue="low"
            className="w-full rounded-lg border border-line px-4 py-3"
          >
            <option value="low">Happy in low light</option>
            <option value="medium">Wants some daylight</option>
            <option value="bright">Needs a bright spot</option>
          </select>
        </div>
        <Field
          label="Watering interval (days)"
          name="watering_interval_days"
          type="number"
          defaultValue="14"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="pet_safe" className="size-4" />
        Safe around pets and children
      </label>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded-lg border border-line px-4 py-3"
        />
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
          {busy ? "Creating…" : "Create species"}
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
