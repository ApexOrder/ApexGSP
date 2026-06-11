import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/panel/panel-shell";
import { getServerLogs } from "@/lib/servers/actions";
import { notFound, redirect } from "next/navigation";

export default async function ServerLogsPage({
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

  const logs = await getServerLogs(server.id);

  return (
    <PanelShell session={session}>
      <Link href={`/servers/${server.slug}`} className="text-sm text-emerald-400">
        ← Back to server
      </Link>

      <h2 className="mt-4 text-3xl font-bold">{server.name} Logs</h2>

      <pre className="mt-8 max-h-[70vh] overflow-auto rounded-2xl border border-emerald-500/20 bg-black/70 p-6 text-xs text-emerald-200">
        {logs}
      </pre>
    </PanelShell>
  );
}
