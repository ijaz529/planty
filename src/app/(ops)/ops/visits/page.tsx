import { createClient } from "@/lib/supabase/server";
import { DayPlanner, type PlannerVisit } from "./day-planner";

export default async function OpsVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createClient();
  const { date } = await searchParams;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(new Date());
  const day = date ?? today;

  const [{ data: visits }, { data: technicians }, { data: days }, { data: offDay }] =
    await Promise.all([
      supabase
        .from("visits")
        .select("id, scheduled_date, status, sequence_no, technician_id, sites(label, building), subscriptions(cadence_label)")
        .eq("scheduled_date", day)
        .order("sequence_no", { nullsFirst: false }),
      supabase
        .from("staff_roles")
        .select("account_id, profiles(display_name)")
        .eq("role", "technician"),
      supabase
        .from("visits")
        .select("scheduled_date")
        .eq("status", "planned")
        .gte("scheduled_date", today)
        .order("scheduled_date"),
      // FR-019: visits whose date no longer falls on a day their zone is served.
      supabase.rpc("visits_off_service_days"),
    ]);

  const counts = new Map<string, number>();
  for (const d of days ?? []) {
    counts.set(d.scheduled_date, (counts.get(d.scheduled_date) ?? 0) + 1);
  }

  return (
    <DayPlanner
      day={day}
      today={today}
      visits={(visits ?? []).map((v) => ({
        id: v.id,
        status: v.status,
        sequence_no: v.sequence_no,
        technician_id: v.technician_id,
        site: (v.sites as unknown as { label: string; building: string } | null),
        cadence: (v.subscriptions as unknown as { cadence_label: string } | null)?.cadence_label ?? "",
      })) as PlannerVisit[]}
      technicians={(technicians ?? []).map((t) => ({
        id: t.account_id,
        name: (t.profiles as unknown as { display_name: string } | null)?.display_name ?? "Technician",
      }))}
      upcoming={[...counts.entries()].map(([d, n]) => ({ date: d, count: n })).slice(0, 10)}
      offServiceDays={(offDay as { id: string; scheduled_date: string; label: string; zone_name: string }[]) ?? []}
    />
  );
}
