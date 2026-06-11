import { auth } from "@/auth";
import { PanelShell } from "@/components/panel/panel-shell";
import { createServer } from "@/lib/servers/actions";
import { redirect } from "next/navigation";

export default async function NewServerPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  return (
    <PanelShell session={session}>
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
        New Server
      </p>

      <h2 className="mt-3 text-3xl font-bold">Create 7 Days To Die Server</h2>

      <form
        action={createServer}
        className="mt-8 max-w-2xl rounded-2xl border border-emerald-500/20 bg-black/40 p-6"
      >
        <label className="block">
          <span className="text-sm text-zinc-400">Server Name</span>
          <input
            name="name"
            required
            placeholder="Forsaken Bloodlines"
            className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
          />
        </label>

        <input type="hidden" name="game" value="7dtd" />

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label>
            <span className="text-sm text-zinc-400">Game Port</span>
            <input
              name="gamePort"
              type="number"
              defaultValue={26900}
              className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
            />
          </label>

          <label>
            <span className="text-sm text-zinc-400">Query Port</span>
            <input
              name="queryPort"
              type="number"
              defaultValue={26901}
              className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
            />
          </label>

          <label>
            <span className="text-sm text-zinc-400">Max Players</span>
            <input
              name="maxPlayers"
              type="number"
              defaultValue={8}
              className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
        >
          Create Server
        </button>
      </form>
    </PanelShell>
  );
}
