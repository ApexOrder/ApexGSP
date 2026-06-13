import { installHostSteamCmd } from "@/lib/host/actions";
import { redirect } from "next/navigation";

export async function GET() {
  await installHostSteamCmd();
  redirect("/host");
}