import { prisma } from "@/lib/prisma";
import { runBackupCreateJob } from "@/lib/jobs/handlers/backup-create";
import { runSteamInstallJob } from "@/lib/jobs/handlers/steam-install";

let isWorking = false;

export async function runJobWorker() {
  if (isWorking) return;

  isWorking = true;

  try {
    const job = await prisma.job.findFirst({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!job) return;

    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "RUNNING",
        startedAt: new Date(),
        progress: 5,
        message: "Job started.",
      },
    });

    try {
      if (job.type === "BACKUP_CREATE") {
  await runBackupCreateJob(job);
} else if (job.type === "STEAM_INSTALL") {
  await runSteamInstallJob(job);
} else {        throw new Error(`No handler registered for job type: ${job.type}`);
      }

      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "COMPLETE",
          progress: 100,
          message: "Job completed successfully.",
          finishedAt: new Date(),
        },
      });
    } catch (error) {
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          message: "Job failed.",
          error: error instanceof Error ? error.message : String(error),
          finishedAt: new Date(),
        },
      });
    }
  } finally {
    isWorking = false;
  }
}
