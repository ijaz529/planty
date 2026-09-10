import Link from "next/link";
import { notFound } from "next/navigation";
import { byTier, type SizeTier } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { VariantManager } from "./variants";

export type OpsVariant = {
  id: string;
  size_tier: SizeTier | null;
  price_aed: string | number | null;
  stock_total: number;
  stock_allocated: number;
  stock_available: number;
  photo_path: string | null;
  height_min_cm: number | null;
  height_max_cm: number | null;
  published: boolean;
};

export default async function OpsSpeciesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("plant_species")
    .select(
      "id, common_name, botanical_name, light_requirement, watering_interval_days, pet_safe, description, plant_variants(id, size_tier, price_aed, stock_total, stock_allocated, stock_available, photo_path, height_min_cm, height_max_cm, published)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const variants = [...((data.plant_variants ?? []) as OpsVariant[])].sort(
    byTier
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/ops/catalog"
          className="text-sm text-muted underline underline-offset-4"
        >
          All species
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">{data.common_name}</h1>
        <p className="italic text-muted">{data.botanical_name}</p>
      </div>

      <VariantManager speciesId={data.id} variants={variants} />
    </div>
  );
}
