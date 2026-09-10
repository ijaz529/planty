import Link from "next/link";
import { notFound } from "next/navigation";
import { PlantPhoto } from "@/components/plant-photo";
import { SiteHeader } from "@/components/site-header";
import {
  availabilityLabel,
  byTier,
  formatAed,
  heightRange,
  isAvailable,
  lightLabel,
  tierBlurb,
  tierLabel,
  type LightRequirement,
  type SizeTier,
} from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

type Variant = {
  id: string;
  size_tier: SizeTier | null;
  price_aed: string | number | null;
  stock_available: number;
  photo_path: string | null;
  height_min_cm: number | null;
  height_max_cm: number | null;
};

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("plant_species")
    .select(
      "id, common_name, botanical_name, light_requirement, watering_interval_days, pet_safe, description, plant_variants(id, size_tier, price_aed, stock_available, photo_path, height_min_cm, height_max_cm)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const variants = [...((data.plant_variants ?? []) as Variant[])].sort(byTier);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16">
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-muted underline underline-offset-4"
        >
          All plants
        </Link>

        <header className="mt-4 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {data.common_name}
          </h1>
          <p className="italic text-muted">{data.botanical_name}</p>
          {data.description && <p className="max-w-xl pt-2">{data.description}</p>}
        </header>

        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-white p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Light</dt>
            <dd className="mt-1 font-medium">
              {lightLabel(data.light_requirement as LightRequirement)}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">Water</dt>
            <dd className="mt-1 font-medium">
              About every {data.watering_interval_days} days
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <dt className="text-xs uppercase tracking-wide text-muted">
              Pets and children
            </dt>
            <dd className="mt-1 font-medium">
              {data.pet_safe ? "Pet safe" : "Keep away from pets"}
            </dd>
          </div>
        </dl>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Sizes and monthly price</h2>
          <p className="mt-1 text-sm text-muted">
            Every price includes the planter, delivery, installation, weekly care
            and free replacement.
          </p>

          <ul className="mt-5 space-y-4">
            {variants.map((v) => {
              const available = isAvailable(v.stock_available);
              const range = heightRange(v.height_min_cm, v.height_max_cm);
              return (
                <li
                  key={v.id}
                  className="flex gap-4 overflow-hidden rounded-xl border border-line bg-white p-4"
                >
                  <PlantPhoto
                    path={v.photo_path}
                    name={data.common_name}
                    className="h-24 w-24 shrink-0 rounded-lg"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="font-semibold">
                      {v.size_tier ? tierLabel(v.size_tier) : "Size"}
                      {range && (
                        <span className="font-normal text-muted"> · {range}</span>
                      )}
                    </p>
                    {v.size_tier && (
                      <p className="text-sm text-muted">{tierBlurb(v.size_tier)}</p>
                    )}
                    <p
                      className={`text-sm ${available ? "text-leaf" : "text-muted"}`}
                    >
                      {availabilityLabel(v.stock_available)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {v.price_aed !== null ? formatAed(v.price_aed) : "—"}
                    </p>
                    <p className="text-xs text-muted">per month</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
