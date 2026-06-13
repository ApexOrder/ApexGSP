import { Job } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { runCommand } from "@/lib/system/command";

export async function runHostSteamCmdInstallJob(job: Job) {
  await prisma.job.update({
    where: { id: job.id },
    data: {
      progress: 10,
      message: "Checking for SteamCMD.",
    },
  });

  if (process.getuid && process.getuid() !== 0) {
    throw new Error(
      "SteamCMD host install requires root privileges. Run ApexPanel on the target Linux host as root/admin, or install SteamCMD manually on this development environment.",
    );
  }

  try {
    await runCommand("which", ["steamcmd"], "/");

    await prisma.job.update({
      where: { id: job.id },
      data: {
        progress: 100,
        message: "SteamCMD is already installed.",
      },
    });

    return;
  } catch {}

  await prisma.job.update({
    where: { id: job.id },
    data: {
      progress: 25,
      message: "Preparing package sources.",
    },
  });

  await runCommand("dpkg", ["--add-architecture", "i386"], "/");
  await runCommand("apt-get", ["update"], "/");
  await runCommand("apt-get", ["install", "-y", "software-properties-common"], "/");
  await runCommand("add-apt-repository", ["multiverse", "-y"], "/");

  await prisma.job.update({
    where: { id: job.id },
    data: {
      progress: 60,
      message: "Installing SteamCMD.",
    },
  });

  await runCommand("apt-get", ["update"], "/");
  await runCommand("apt-get", ["install", "-y", "steamcmd"], "/");

  await prisma.job.update({
    where: { id: job.id },
    data: {
      progress: 90,
      message: "Verifying SteamCMD.",
    },
  });

  await runCommand("which", ["steamcmd"], "/");
}
