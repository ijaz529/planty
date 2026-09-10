import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserContext } from "@/lib/roles";
import { BasketBadge } from "@/components/basket/basket-badge";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ctx = user ? await getUserContext(supabase) : null;

  return (
    <header className="border-b border-line bg-white">
      <nav className="mx-auto flex w-full max-w-3xl items-center gap-4 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Planty
        </Link>
        <Link href="/bundles" className="text-sm text-muted hover:text-foreground">
          Bundles
        </Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <BasketBadge />
          {user ? (
            <>
              <Link href="/sites" className="text-muted hover:text-foreground">
                Sites
              </Link>
              <Link
                href="/organizations"
                className="text-muted hover:text-foreground"
              >
                Organizations
              </Link>
              {ctx?.isOperator && (
                <Link href="/ops" className="text-muted hover:text-foreground">
                  Operations
                </Link>
              )}
              <Link href="/profile" className="text-muted hover:text-foreground">
                Profile
              </Link>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-leaf px-4 py-2 font-medium text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
