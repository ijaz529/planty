import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { requireUser } from "@/lib/supabase/server";
import { MembersManager } from "./members";

export type Member = {
  account_id: string;
  role: "owner" | "member";
  profiles: { display_name: string | null; phone: string } | null;
};

export type Invite = { id: string; phone: string; role: "owner" | "member" };

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name, billing_email")
    .eq("id", id)
    .maybeSingle();

  // RLS hides organizations you do not belong to, so "not visible" and
  // "does not exist" are the same answer to the person asking.
  if (!organization) notFound();

  const [{ data: members }, { data: invites }, { data: role }] =
    await Promise.all([
      supabase
        .from("organization_members")
        .select("account_id, role, profiles(display_name, phone)")
        .eq("organization_id", id),
      supabase
        .from("organization_invites")
        .select("id, phone, role")
        .eq("organization_id", id),
      supabase.rpc("org_role", { target_organization_id: id }),
    ]);

  const isOwner = role === "owner";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 space-y-6 p-6">
        <Link
          href="/organizations"
          className="text-sm text-muted underline underline-offset-4"
        >
          All organizations
        </Link>

        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">{organization.name}</h1>
          <p className="text-sm text-muted">
            Invoices go to {organization.billing_email}
          </p>
          <p className="text-sm text-muted">
            You are {isOwner ? "an owner" : "a member"}.
          </p>
        </header>

        <MembersManager
          organizationId={organization.id}
          isOwner={isOwner}
          currentAccountId={user.id}
          members={(members ?? []) as unknown as Member[]}
          invites={(invites ?? []) as Invite[]}
        />

        {!isOwner && (
          <p className="rounded-xl border border-line bg-white p-4 text-sm text-muted">
            Only owners can invite or remove people and change billing details.
          </p>
        )}
      </main>
    </>
  );
}
