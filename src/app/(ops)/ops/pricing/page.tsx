import { createClient } from "@/lib/supabase/server";
import { PricingEditor } from "./pricing-editor";

export default async function OpsPricingPage() {
  const supabase = await createClient();

  const [{ data: terms }, { data: cadences }, { data: zones }] =
    await Promise.all([
      supabase
        .from("rental_terms")
        .select("id, months, label, price_multiplier, is_default, active")
        .order("sort_order"),
      supabase
        .from("service_cadences")
        .select("id, code, label, visits_per_month, monthly_fee_aed, is_default, active")
        .order("sort_order"),
      supabase
        .from("service_zones")
        .select("id, name, minimum_monthly_aed, active")
        .order("name"),
    ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Pricing</h1>
        <p className="mt-1 max-w-2xl text-muted">
          These numbers are a hypothesis, not a market rate — no operator in
          Dubai publishes a rental price, so ours are the first. Change them
          here as you learn; nothing needs a deploy.
        </p>
      </header>

      <PricingEditor
        terms={(terms ?? []).map((t) => ({
          ...t,
          price_multiplier: Number(t.price_multiplier),
        }))}
        cadences={(cadences ?? []).map((c) => ({
          ...c,
          visits_per_month: Number(c.visits_per_month),
          monthly_fee_aed: Number(c.monthly_fee_aed),
        }))}
        zones={(zones ?? []).map((z) => ({
          ...z,
          minimum_monthly_aed: Number(z.minimum_monthly_aed),
        }))}
      />
    </div>
  );
}
