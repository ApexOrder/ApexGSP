import { prisma } from "@/lib/prisma";
import { JobType } from "@prisma/client";

export async function createJob({
  serverId,
  type,
  title,
  message,
  payload,
}: {
  serverId: string;
  type: JobType;
  title: string;
  message?: string;
  payload?: unknown;
}) {
  return prisma.job.create({
    data: {
      serverId,
      type,
      title,
      message,
      payload: payload as any,
      status: "PENDING",
      progress: 0,
    },
  });
}