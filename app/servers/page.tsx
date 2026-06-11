import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/panel/panel-shell";
import { redirect } from "next/navigation";

export default async function ServersPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const servers = await prisma.gameServer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <PanelShell session={session}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
            Game Servers
          </p>
          <h2 className="mt-3 text-3xl font-bold">Servers</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Manage standalone ApexPanel game servers.
          </p>
        </div>

        <Link
          href="/servers/new"
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
        >
          New Server
        </Link>
      </div>

      <div className="mt-8">
        {servers.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-8 text-zinc-400">
            No servers yet. Create your first 7 Days To Die server.
          </div>
        ) : (
          <div className="grid gap-4">
            {servers.map((server) => (
              <Link
                key={server.id}
                href={`/servers/${server.slug}`}
                className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6 hover:bg-emerald-500/5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{server.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {server.game} · {server.installPath}
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
                    {server.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PanelShell>
  );
}
