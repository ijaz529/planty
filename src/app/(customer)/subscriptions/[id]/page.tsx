import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { tierLabel, type SizeTier } from "@/lib/catalog";
import { formatPrecise } from "@/lib/pricing";
import { requireUser } from "@/lib/supabase/server";
import { StatusBadge } from "../status-badge";
import { CancelButton } from "./actions";
import { VisitFeed } from "./visits";
import { CareSection } from "./care";

const longDate = (d: string) =>
  new Date(d).toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default async function SubscriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireUser();

  const [{ data: sub }, { data: lines }, { data: bank }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*, sites(label, building, service_zones(name))")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("subscription_lines").select("*").eq("subscription_id", id),
    supabase.from("operator_settings").select("value").eq("key", "bank_details").maybeSingle(),
  ]);
  if (!sub) notFound();

  const site = sub.sites as unknown as { label: string; building: string; service_zones: { name: string } | null } | null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-6">
        <Link href="/subscriptions" className="text-sm text-muted underline underline-offset-4">All subscriptions</Link>

        <header className="flex flex-wrap items-center gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{site?.label ?? "Subscription"}</h1>
            <p className="text-sm text-muted">{site?.building} · {site?.service_zones?.name}</p>
          </div>
          <StatusBadge status={sub.status} />
        </header>

        {sub.status === "pending" && (
          <section className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-semibold">Pay by bank transfer to confirm</h2>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Reference</dt><dd className="font-mono font-semibold">{sub.payment_reference}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Amount due now</dt><dd className="font-semibold">{formatPrecise(Number(sub.monthly_total_aed))}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Invoice sent to</dt><dd>{sub.billing_email}</dd></div>
            </dl>
            <pre className="whitespace-pre-wrap rounded-lg bg-white p-3 font-sans text-sm">{bank?.value ?? "Bank details to follow."}</pre>
            <p className="text-xs text-muted">
              Your plants are reserved until {longDate(sub.reserved_until)}. We confirm as soon as the transfer lands.
            </p>
          </section>
        )}

        {sub.status === "active" && (
          <p className="rounded-xl border border-line bg-leaf-soft p-4 text-sm">
            Paid and confirmed. Installation is on {longDate(sub.installation_date)}.
          </p>
        )}

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">What you are renting</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {(lines ?? []).map((l) => (
              <li key={l.id} className="flex justify-between p-4 text-sm">
                <span>{l.quantity} × {l.species_name}{l.size_tier && <span className="text-muted"> · {tierLabel(l.size_tier as SizeTier)}</span>}</span>
                <span className="font-medium">{formatPrecise(Number(l.line_total_aed))}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1 rounded-xl border border-line bg-white p-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Visits — {sub.cadence_label.toLowerCase()}</dt><dd>{formatPrecise(Number(sub.service_fee_aed))}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Term</dt><dd>{sub.term_label}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Every month</dt><dd>{formatPrecise(Number(sub.monthly_total_aed))}</dd></div>
          </dl>
        </section>

        <section className="rounded-xl border border-line bg-white p-4 text-sm">
          <p><span className="text-muted">Installation</span> · {longDate(sub.installation_date)}</p>
          <p><span className="text-muted">Term ends</span> · {longDate(sub.ends_on)}</p>
        </section>

        {sub.status !== "pending" && (
          <>
            <CareSection subscriptionId={sub.id} active={sub.status === "active"} />
            <VisitFeed subscriptionId={sub.id} />
          </>
        )}

        {sub.status === "pending" && <CancelButton id={sub.id} />}
        {sub.status === "active" && (
          <p className="text-sm text-muted">
            To change or end an active subscription, contact Planty — we handle it with you so the plants are collected properly.
          </p>
        )}
      </main>
    </>
  );
}
