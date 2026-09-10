import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { BasketScreen, type PricingConfig } from "./basket-screen";

export const metadata = {
  title: "Your basket — Planty",
  description: "What your plants would cost each month, before you talk to anyone.",
};

export default async function BasketPage() {
  const supabase = await createClient();

  const [{ data: terms }, { data: cadences }, { data: variants }, { data: user }] =
    await Promise.all([
      supabase
        .from("rental_terms")
        .select("id, months, label, price_multiplier")
        .order("sort_order"),
      supabase
        .from("service_cadences")
        .select("id, code, label, visits_per_month, monthly_fee_aed")
        .order("sort_order"),
      supabase
        .from("plant_variants")
        .select(
          "id, size_tier, price_aed, stock_available, published, plant_species(common_name)"
        ),
      supabase.auth.getUser(),
    ]);

  // Sites are only offered to someone signed in; RLS returns nothing otherwise.
  const { data: sites } = user?.user
    ? await supabase
        .from("sites")
        .select("id, label, building, service_zones(name, service_weekdays, minimum_monthly_aed)")
        .order("label")
    : { data: null };

  const config: PricingConfig = {
    terms: (terms ?? []).map((t) => ({
      id: t.id,
      months: t.months,
      label: t.label,
      price_multiplier: Number(t.price_multiplier),
    })),
    cadences: (cadences ?? []).map((c) => ({
      id: c.id,
      code: c.code,
      label: c.label,
      visits_per_month: Number(c.visits_per_month),
      monthly_fee_aed: Number(c.monthly_fee_aed),
    })),
    catalog: (variants ?? []).map((v) => ({
      id: v.id,
      species_name:
        (v.plant_species as unknown as { common_name: string } | null)
          ?.common_name ?? "Plant",
      size_tier: v.size_tier,
      price_aed: v.price_aed === null ? null : Number(v.price_aed),
      stock_available: v.stock_available,
      published: v.published,
    })),
    sites: (sites ?? []).map((s) => {
      const zone = s.service_zones as unknown as {
        name: string;
        service_weekdays: number[];
        minimum_monthly_aed: number;
      } | null;
      return {
        id: s.id,
        label: s.label,
        building: s.building,
        zone_name: zone?.name ?? null,
        service_weekdays: zone?.service_weekdays ?? [],
        minimum_monthly_aed: Number(zone?.minimum_monthly_aed ?? 0),
      };
    }),
    signedIn: Boolean(user?.user),
  };

  return (
    <>
      <SiteHeader />
      <BasketScreen config={config} />
    </>
  );
}
