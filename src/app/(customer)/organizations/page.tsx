import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getUserContext } from "@/lib/roles";
import { requireUser } from "@/lib/supabase/server";
import { NewOrganizationForm } from "./new-organization-form";

export default async function OrganizationsPage() {
  const { supabase } = await requireUser();
  const ctx = await getUserContext(supabase);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 space-y-6 p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <p className="text-sm text-muted">
            An organization keeps a company&apos;s sites and plants together, so
            they survive one person changing jobs.
          </p>
        </header>

        {ctx.memberships.length > 0 ? (
          <ul className="space-y-3">
            {ctx.memberships.map((m) => (
              <li key={m.organization_id}>
                <Link
                  href={`/organizations/${m.organization_id}`}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white p-4"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{m.organization_name}</p>
                    <p className="text-sm text-muted">
                      You are {m.role === "owner" ? "an owner" : "a member"}
                    </p>
                  </div>
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-line bg-white p-5 text-sm text-muted">
            You are not part of an organization yet. Create one if you are
            renting plants for a company.
          </p>
        )}

        <NewOrganizationForm />
      </main>
    </>
  );
}
