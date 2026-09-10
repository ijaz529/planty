import type { SupabaseClient } from "@supabase/supabase-js";

export type Membership = {
  organization_id: string;
  role: "owner" | "member";
  organization_name: string;
};

export type UserContext = {
  isOperator: boolean;
  isTechnician: boolean;
  memberships: Membership[];
};

/**
 * Roles are read from the database on every request, never from a token claim,
 * so a revoked operator or a removed member loses access immediately
 * (spec FR-008, research R2).
 */
export async function getUserContext(
  supabase: SupabaseClient
): Promise<UserContext> {
  const [{ data: isOperator }, { data: isTechnician }, memberships] =
    await Promise.all([
      supabase.rpc("is_operator"),
      supabase.rpc("is_technician"),
      loadMemberships(supabase),
    ]);

  return {
    isOperator: Boolean(isOperator),
    isTechnician: Boolean(isTechnician),
    memberships,
  };
}

/**
 * Organizations arrive in feature 001 US3. Until that migration is applied the
 * table does not exist, so a failure here is not an error worth surfacing.
 */
async function loadMemberships(
  supabase: SupabaseClient
): Promise<Membership[]> {
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(name)");

  if (error || !data) return [];

  return data.map((m) => ({
    organization_id: m.organization_id as string,
    role: m.role as "owner" | "member",
    organization_name:
      (m.organizations as unknown as { name: string } | null)?.name ??
      "Unknown organization",
  }));
}

/** Where to send someone immediately after they sign in. */
export function postSignInPath(ctx: UserContext): string {
  if (ctx.isOperator) return "/ops";
  // A technician's job starts at their round, not the catalog.
  if (ctx.isTechnician) return "/today";
  return "/";
}
