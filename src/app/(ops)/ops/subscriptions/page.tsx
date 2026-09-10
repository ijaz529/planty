import { createClient } from "@/lib/supabase/server";
import { SubscriptionsManager } from "./manager";

export default async function OpsSubscriptionsPage() {
  const supabase = await createClient();
  const [{ data: subs }, { data: bank }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("id, status, payment_reference, billing_email, monthly_total_aed, installation_date, reserved_until, sites(label), organizations(name), profiles:owner_account_id(display_name)")
      .order("created_at", { ascending: false }),
    supabase.from("operator_settings").select("value").eq("key", "bank_details").maybeSingle(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
        <p className="mt-1 text-muted">Record payments as transfers land. Release reservations that expire unpaid.</p>
      </header>
      <SubscriptionsManager
        subs={(subs ?? []).map((s) => ({
          id: s.id,
          status: s.status,
          reference: s.payment_reference,
          email: s.billing_email,
          total: Number(s.monthly_total_aed),
          install: s.installation_date,
          reserved_until: s.reserved_until,
          site: (s.sites as unknown as { label: string } | null)?.label ?? "",
          customer:
            (s.organizations as unknown as { name: string } | null)?.name ??
            (s.profiles as unknown as { display_name: string } | null)?.display_name ??
            "",
        }))}
        bankDetails={bank?.value ?? ""}
      />
    </div>
  );
}
