import { redirect } from "next/navigation";
import Link from "next/link";
import { formatUaePhone } from "@/lib/phone";
import { requireUser } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { supabase } = await requireUser();
  const { welcome } = await searchParams;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email, phone")
    .single();

  if (!profile) redirect("/auth");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {welcome ? "Welcome to Planty" : "Your profile"}
        </h1>
        <p className="text-sm text-muted">
          {welcome
            ? "Tell us what to call you and you are all set."
            : "This is how we address you and where receipts go."}
        </p>
      </header>

      <ProfileForm
        displayName={profile.display_name ?? ""}
        email={profile.email ?? ""}
        phone={formatUaePhone(profile.phone)}
      />

      <Link href="/" className="text-sm text-muted underline underline-offset-4">
        Back to plants
      </Link>
    </main>
  );
}
