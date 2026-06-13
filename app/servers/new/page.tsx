import { auth } from "@/auth";
import { PanelShell } from "@/components/panel/panel-shell";
import { listGameDefinitions } from "@/lib/games/registry";
import { redirect } from "next/navigation";
import { NewServerForm } from "./new-server-form";

export default async function NewServerPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const games = listGameDefinitions();

  return (
    <PanelShell session={session}>
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
        New Server
      </p>

      <h2 className="mt-3 text-3xl font-bold">Create Server</h2>

      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Choose a supported game and ApexPanel will prepare the correct install
        driver, ports and defaults.
      </p>

      <NewServerForm games={games} />
    </PanelShell>
  );
}