import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/panel/panel-shell";
import { updateRawServerConfig } from "@/lib/servers/actions";
import { notFound, redirect } from "next/navigation";

export default async function RawConfigPage({
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

  const filePath = path.join(server.installPath, "config", "serverconfig.xml");

  let xml = "";

  try {
    xml = await fs.readFile(filePath, "utf8");
  } catch {
    xml = "<ServerSettings>\n</ServerSettings>\n";
  }

  return (
    <PanelShell session={session}>
      <Link href={`/servers/${server.slug}/config`} className="text-sm text-emerald-400">
        ? Back to config
      </Link>

      <h2 className="mt-4 text-3xl font-bold">{server.name} Raw XML</h2>

      <form action={updateRawServerConfig.bind(null, server.id)} className="mt-8">
        <textarea
          name="xml"
          defaultValue={xml}
          spellCheck={false}
          className="min-h-[65vh] w-full rounded-2xl border border-emerald-500/20 bg-black/70 p-6 font-mono text-xs text-emerald-200"
        />

        <button
          type="submit"
          className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
        >
          Save Raw XML
        </button>
      </form>
    </PanelShell>
  );
}