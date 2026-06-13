import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/panel/panel-shell";
import { redirect } from "next/navigation";

const jobStyles = {
  PENDING: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  RUNNING: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  COMPLETE: "border-green-500/30 bg-green-500/10 text-green-300",
  FAILED: "border-red-500/30 bg-red-500/10 text-red-300",
  CANCELLED: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
};

export default async function HostPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const jobs = await prisma.job.findMany({
    where: {
      type: "HOST_STEAMCMD_INSTALL",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const hasActiveJobs = jobs.some(
    (job) => job.status === "PENDING" || job.status === "RUNNING",
  );

  return (
    <PanelShell session={session}>
      {hasActiveJobs && <meta httpEquiv="refresh" content="3" />}

      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
          ApexPanel Host
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">
          Host Management
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Install and manage system dependencies required by game servers.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-6 shadow-lg shadow-emerald-950/20">
          <h3 className="text-lg font-semibold text-emerald-300">
            SteamCMD
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Required for Steam-based game servers such as 7 Days to Die,
            DayZ, Valheim, Rust and Palworld.
          </p>

          <a
            href="/api/host/install-steamcmd"
            className="mt-5 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
          >
            Install SteamCMD
          </a>
        </div>

        <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-yellow-950/10">
          <h3 className="text-lg font-semibold text-yellow-300">
            More dependencies coming soon
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Docker, Wine, Proton, Java and FiveM artifacts will be added as
            separate host-level jobs.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-black/40 p-5">
        <h3 className="text-lg font-semibold text-emerald-300">
          Host Jobs
        </h3>

        <div className="mt-4 space-y-3">
          {jobs.length === 0 ? (
            <p className="text-sm text-zinc-400">No host jobs yet.</p>
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
    </PanelShell>
  );
}