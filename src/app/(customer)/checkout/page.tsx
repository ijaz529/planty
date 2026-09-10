import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { requireUser } from "@/lib/supabase/server";
import { CheckoutForm, type CheckoutConfig } from "./checkout-form";

export const metadata = { title: "Checkout — Planty" };

export default async function CheckoutPage() {
  const { supabase, user } = await requireUser();

  const [{ data: sites }, { data: profile }, { data: terms }, { data: cadences }] =
    await Promise.all([
      supabase
        .from("sites")
        .select(
          "id, label, building, organization_id, organizations(billing_email), service_zones(name, service_weekdays, active)"
        )
        .order("label"),
      supabase.from("profiles").select("email").eq("id", user.id).maybeSingle(),
      supabase.from("rental_terms").select("id, months, label").order("sort_order"),
      supabase.from("service_cadences").select("id, code, label").order("sort_order"),
    ]);

  if (!sites || sites.length === 0) redirect("/sites");

  const config: CheckoutConfig = {
    sites: sites.map((s) => {
      const zone = s.service_zones as unknown as {
        name: string;
        service_weekdays: number[];
        active: boolean;
      } | null;
      const org = s.organizations as unknown as { billing_email: string } | null;
      return {
        id: s.id,
        label: s.label,
        building: s.building,
        zone_name: zone?.name ?? "",
        zone_active: zone?.active ?? false,
        service_weekdays: zone?.service_weekdays ?? [],
        default_email: org?.billing_email ?? profile?.email ?? "",
      };
    }),
    terms: terms ?? [],
    cadences: cadences ?? [],
  };

  return (
    <>
      <SiteHeader />
      <CheckoutForm config={config} />
    </>
  );
}
