import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/panel/panel-shell";
import {
  createServerBackup,
  restoreServerBackup,
} from "@/lib/servers/actions";
import { notFound, redirect } from "next/navigation";

const jobStyles = {
  PENDING: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  RUNNING: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  COMPLETE: "border-green-500/30 bg-green-500/10 text-green-300",
  FAILED: "border-red-500/30 bg-red-500/10 text-red-300",
  CANCELLED: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
};

export default async function BackupsPage({
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

  const jobs = await prisma.job.findMany({
    where: {
      serverId: server.id,
      type: "BACKUP_CREATE",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const hasActiveJobs = jobs.some(
    (job) => job.status === "PENDING" || job.status === "RUNNING",
  );

  const backupRoot =
    process.env.APEXPANEL_BACKUP_ROOT ?? "/opt/apexpanel-data/backups";
  const backupDir = path.join(backupRoot, server.slug);

  let backups: string[] = [];

  try {
    backups = await fs.readdir(backupDir);
  } catch {
    backups = [];
  }

  backups = backups.filter((file) => file.endsWith(".tar.gz")).sort().reverse();

  return (
    <PanelShell session={session}>
      {hasActiveJobs && <meta httpEquiv="refresh" content="3" />}

      <Link href={`/servers/${server.slug}`} className="text-sm text-emerald-400">
        ? Back to server
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{server.name} Backups</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Create and restore compressed backups of this server folder.
          </p>
        </div>

        <form action={createServerBackup.bind(null, server.id)}>
          <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400">
            Create Backup
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-black/40 p-5 shadow-lg shadow-emerald-950/20">
        <h3 className="text-lg font-semibold text-emerald-300">
          Backup Jobs
        </h3>

        <div className="mt-4 space-y-3">
          {jobs.length === 0 ? (
            <p className="text-sm text-zinc-400">No backup jobs yet.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-white/10 bg-zinc-950/80 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{job.title}</p>
                    <p className="text-sm text-zinc-400">
                      {job.message ?? job.status}
                    </p>

                    {job.error && (
                      <p className="mt-1 text-sm text-red-400">{job.error}</p>
                    )}
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      jobStyles[job.status]
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Progress: {job.progress}%
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {backups.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6 text-zinc-400">
            No backups yet.
          </div>
        ) : (
          backups.map((backup) => (
            <div
              key={backup}
              className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-black/40 p-5"
            >
              <span className="font-mono text-sm text-emerald-200">
                {backup}
              </span>

              <form action={restoreServerBackup.bind(null, server.id, backup)}>
                <button className="rounded-xl border border-yellow-500/30 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/10">
                  Restore
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </PanelShell>
  );
}