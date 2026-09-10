"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlantPhoto } from "@/components/plant-photo";
import {
  formatAed,
  heightRange,
  publishGapMessage,
  tierLabel,
  type SizeTier,
} from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";
import { variantSchema } from "@/lib/validation";
import type { OpsVariant } from "./page";

export function VariantManager({
  speciesId,
  variants,
}: {
  speciesId: string;
  variants: OpsVariant[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  /**
   * The database refuses an incomplete publish and says what is missing.
   * We surface that message verbatim rather than paraphrasing it, so the
   * operator sees the same reason the guard gave.
   */
  async function togglePublish(v: OpsVariant) {
    setError(null);
    setBusyId(v.id);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("plant_variants")
      .update({ published: !v.published })
      .eq("id", v.id);
    setBusyId(null);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  }

  async function uploadPhoto(v: OpsVariant, file: File) {
    setError(null);
    setBusyId(v.id);
    const supabase = createClient();
    const path = `${speciesId}/${v.id}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("catalog")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setBusyId(null);
      setError(uploadError.message);
      return;
    }

    const { error: dbError } = await supabase
      .from("plant_variants")
      .update({ photo_path: path })
      .eq("id", v.id);
    setBusyId(null);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  }

  async function saveFields(v: OpsVariant, form: FormData) {
    setError(null);
    const parsed = variantSchema.safeParse({
      size_tier: form.get("size_tier"),
      height_min_cm: form.get("height_min_cm"),
      height_max_cm: form.get("height_max_cm"),
      price_aed: form.get("price_aed"),
      stock_total: form.get("stock_total"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setBusyId(v.id);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("plant_variants")
      .update(parsed.data)
      .eq("id", v.id);
    setBusyId(null);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  }

  async function addVariant() {
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("plant_variants")
      .insert({ species_id: speciesId });
    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Sizes</h2>
        <button
          onClick={addVariant}
          className="ml-auto rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium"
        >
          Add a size
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <ul className="space-y-4">
        {variants.map((v) => {
          const gap = publishGapMessage(v);
          return (
            <li key={v.id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-start gap-4">
                <PlantPhoto
                  path={v.photo_path}
                  name={v.size_tier ? tierLabel(v.size_tier) : "Draft"}
                  className="h-20 w-20 shrink-0 rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold">
                    {v.size_tier ? tierLabel(v.size_tier) : "Untiered draft"}
                    <span className="ml-2 rounded-full bg-leaf-soft px-2 py-0.5 text-xs font-normal text-leaf">
                      {v.published ? "Published" : "Draft"}
                    </span>
                  </p>
                  <p className="text-sm text-muted">
                    {heightRange(v.height_min_cm, v.height_max_cm) ?? "No height set"}
                    {" · "}
                    {v.price_aed !== null ? formatAed(v.price_aed) : "No price"} / month
                    {" · "}
                    {v.stock_available} of {v.stock_total} in stock
                  </p>
                </div>
                <button
                  onClick={() => togglePublish(v)}
                  disabled={busyId === v.id}
                  className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60 ${
                    v.published
                      ? "border border-line bg-white"
                      : "bg-leaf text-white"
                  }`}
                >
                  {v.published ? "Unpublish" : "Publish"}
                </button>
              </div>

              {gap && !v.published && (
                <p className="mt-3 rounded-lg bg-leaf-soft/60 p-3 text-sm text-muted">
                  {gap}
                </p>
              )}

              <form
                action={(form) => saveFields(v, form)}
                className="mt-4 grid gap-3 sm:grid-cols-5"
              >
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Size</span>
                  <select
                    name="size_tier"
                    defaultValue={v.size_tier ?? ""}
                    className="w-full rounded-lg border border-line px-3 py-2"
                  >
                    <option value="">Choose…</option>
                    <option value="desk">Desk</option>
                    <option value="floor">Floor</option>
                    <option value="statement">Statement</option>
                  </select>
                </label>
                <NumberField
                  label="Min cm"
                  name="height_min_cm"
                  value={v.height_min_cm}
                />
                <NumberField
                  label="Max cm"
                  name="height_max_cm"
                  value={v.height_max_cm}
                />
                <NumberField
                  label="AED / month"
                  name="price_aed"
                  value={v.price_aed === null ? null : Number(v.price_aed)}
                />
                <NumberField label="Stock" name="stock_total" value={v.stock_total} />
                <div className="sm:col-span-5 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={busyId === v.id}
                    className="rounded-lg bg-leaf px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  >
                    Save
                  </button>
                  <label className="text-sm text-muted">
                    <span className="underline underline-offset-4">
                      Upload photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadPhoto(v, file);
                      }}
                    />
                  </label>
                </div>
              </form>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function NumberField({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: number | null;
}) {
  return (
    <label className="text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type="number"
        name={name}
        defaultValue={value ?? ""}
        className="w-full rounded-lg border border-line px-3 py-2"
      />
    </label>
  );
}
