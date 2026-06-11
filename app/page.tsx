import { auth } from "@/auth";
import { PanelShell } from "@/components/panel/panel-shell";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <PanelShell session={session}>
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
        Command Centre
      </p>

      <h2 className="mt-3 text-3xl font-bold">Dashboard</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6">
          <p className="text-sm text-zinc-400">Servers</p>
          <p className="mt-3 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6">
          <p className="text-sm text-zinc-400">Online</p>
          <p className="mt-3 text-3xl font-bold text-emerald-400">0</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6">
          <p className="text-sm text-zinc-400">Backups</p>
          <p className="mt-3 text-3xl font-bold">0</p>
        </div>
      </div>
    </PanelShell>
  );
}