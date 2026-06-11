import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/panel/panel-shell";
import { notFound, redirect } from "next/navigation";
import {
  installServer,
  startServer,
  stopServer,
  restartServer,
  refreshServerStatus,
} from "@/lib/servers/actions";import { ServerStatus } from "@prisma/client";

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const { slug } = await params;

  const server = await prisma.gameServer.findUnique({
    where: { slug },
  });

  if (!server) notFound();

  return (
    <PanelShell session={session}>
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
        7 Days To Die
      </p>

      <h2 className="mt-3 text-3xl font-bold">{server.name}</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6">
          <p className="text-sm text-zinc-400">Status</p>
          <p className="mt-3 text-2xl font-bold text-emerald-400">
            {server.status}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6">
          <p className="text-sm text-zinc-400">Game Port</p>
          <p className="mt-3 text-2xl font-bold">{server.gamePort}</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6">
          <p className="text-sm text-zinc-400">Max Players</p>
          <p className="mt-3 text-2xl font-bold">{server.maxPlayers}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-black/40 p-6">
        <p className="text-sm text-zinc-400">Install Path</p>
        <code className="mt-3 block text-emerald-300">{server.installPath}</code>
      </div>

<div className="mt-6 rounded-2xl border border-emerald-500/20 bg-black/40 p-6">
  <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
    Controls
  </p>
  <div className="mt-5 flex flex-wrap gap-3">
    <form action={installServer.bind(null, server.id)}>
  <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400">
    Install
  </button>
</form>
    <form action={startServer.bind(null, server.id)}>
  <button className="rounded-xl border border-emerald-500/30 px-5 py-3 font-semibold text-emerald-300 hover:bg-emerald-500/10">
    Start
  </button>
</form>
    <form action={stopServer.bind(null, server.id)}>
  <button className="rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-300 hover:bg-red-500/10">
    Stop
  </button>
</form>
<form action={restartServer.bind(null, server.id)}>
  <button className="rounded-xl border border-yellow-500/30 px-5 py-3 font-semibold text-yellow-300 hover:bg-yellow-500/10">
    Restart
  </button>
</form>

<form action={refreshServerStatus.bind(null, server.id)}>
  <button className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-zinc-200 hover:bg-white/10">
    Refresh Status
  </button>
</form>
<a
  href={`/servers/${server.slug}/config`}
  className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-zinc-200 hover:bg-white/10"
>
  Config
</a>
 <a
  href={`/servers/${server.slug}/logs`}
  className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-zinc-200 hover:bg-white/10"
>
  View Logs
</a>
<a
  href={`/servers/${server.slug}/backups`}
  className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-zinc-200 hover:bg-white/10"
>
  Backups
</a>
 </div>
</div>
    </PanelShell>
  );
}
