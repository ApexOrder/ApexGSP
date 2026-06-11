import { runJobWorker } from "@/lib/jobs/worker";

export async function POST() {
  await runJobWorker();

  return Response.json({ ok: true });
}
