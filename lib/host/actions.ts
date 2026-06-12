"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createJob } from "@/lib/jobs/create-job";
import { revalidatePath } from "next/cache";

async function requireHostAdmin() {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorised.");

  if (!["OWNER", "ADMIN"].includes(session.user.role)) {
    throw new Error("You do not have permission to manage host settings.");
  }

  return session;
}

export async function installHostSteamCmd() {
  await requireHostAdmin();

  const existingJob = await prisma.job.findFirst({
    where: {
      type: "HOST_STEAMCMD_INSTALL",
      status: {
        in: ["PENDING", "RUNNING"],
      },
    },
  });

  if (existingJob) {
    revalidatePath("/host");
    return;
  }

  await createJob({
    type: "HOST_STEAMCMD_INSTALL",
    title: "Installing SteamCMD",
    message: "SteamCMD host install queued.",
  });

  revalidatePath("/host");
}
