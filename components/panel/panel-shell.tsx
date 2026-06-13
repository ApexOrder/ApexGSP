import Link from "next/link";
import { signOut } from "@/auth";
import type { Session } from "next-auth";

export function PanelShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const isOwner = session.user.role === "OWNER";

  return (
    <main className="min-h-screen bg-[#050807] text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-emerald-500/20 bg-black/40 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
            ApexOrder
          </p>
          <h1 className="mt-3 text-2xl font-bold">ApexPanel</h1>

          <nav className="mt-10 space-y-2">
            <Link className="block rounded-xl px-4 py-3 hover:bg-emerald-500/10" href="/">
              Dashboard
            </Link>

            <Link className="block rounded-xl px-4 py-3 hover:bg-emerald-500/10" href="/servers">
              Game Servers
            </Link>

            <Link className="block rounded-xl px-4 py-3 hover:bg-emerald-500/10" href="/host">
              Host Management
            </Link>
            {isOwner && (
              <Link className="block rounded-xl px-4 py-3 hover:bg-emerald-500/10" href="/admin/users">
                User Access
              </Link>
              
            )}
          </nav>
        </aside>

        <section className="flex-1">
          <header className="flex items-center justify-between border-b border-emerald-500/20 bg-black/20 px-8 py-5">
            <div>
              <p className="text-sm text-zinc-400">Signed in as</p>
              <p className="font-semibold">{session.user.name}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
                {session.user.role}
              </span>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10">
                  Sign out
                </button>
              </form>
            </div>
          </header>

          <div className="p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
