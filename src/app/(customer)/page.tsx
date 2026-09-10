import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-6 p-6">
      <h1 className="text-3xl font-semibold">Planty</h1>
      <p className="text-muted">Rent plants. We keep them alive.</p>
      {user ? (
        <Link href="/profile" className="text-leaf underline underline-offset-4">
          Your profile
        </Link>
      ) : (
        <Link href="/auth" className="text-leaf underline underline-offset-4">
          Sign in
        </Link>
      )}
    </main>
  );
}
