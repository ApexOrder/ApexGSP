import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/panel/panel-shell";
import { updateServerConfig } from "@/lib/servers/actions";
import { notFound, redirect } from "next/navigation";

export default async function ServerConfigPage({
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

  return (
    <PanelShell session={session}>
      <Link href={`/servers/${server.slug}`} className="text-sm text-emerald-400">
        ? Back to server
      </Link>

      <h2 className="mt-4 text-3xl font-bold">{server.name} Config</h2>

      <form
        action={updateServerConfig.bind(null, server.id)}
        className="mt-8 max-w-5xl rounded-2xl border border-emerald-500/20 bg-black/40 p-6"
      >
        <label className="block">
          <span className="text-sm text-zinc-400">Server Name</span>
          <input name="name" defaultValue={server.name} className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white" />
        </label>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Input name="gamePort" label="Game Port" value={server.gamePort} />
          <Input name="queryPort" label="Query Port" value={server.queryPort ?? 26901} />
          <Input name="maxPlayers" label="Max Players" value={server.maxPlayers} />
        </div>

        <h3 className="mt-8 text-xl font-bold">World</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label>
            <span className="text-sm text-zinc-400">World</span>
            <select name="world" defaultValue={server.world ?? "Navezgane"} className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white">
              <option value="Navezgane">Navezgane</option>
              <option value="RWG">Random Gen</option>
              <option value="PREGEN6k">PREGEN6k</option>
              <option value="PREGEN8k">PREGEN8k</option>
              <option value="PREGEN10k">PREGEN10k</option>
            </select>
          </label>

          <Input name="worldSeed" label="World Seed" value={server.worldSeed ?? "ApexPanel"} />
          <Input name="worldSize" label="World Size" value={server.worldSize ?? 6144} />
        </div>

        <h3 className="mt-8 text-xl font-bold">Gameplay</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Input name="difficulty" label="Difficulty" value={server.difficulty ?? 0} />
          <Input name="xpMultiplier" label="XP Multiplier" value={server.xpMultiplier ?? 100} />
          <Input name="lootAbundance" label="Loot Abundance" value={server.lootAbundance ?? 100} />
        </div>

        <h3 className="mt-8 text-xl font-bold">Blood Moon</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Input name="bloodMoonFreq" label="Blood Moon Frequency" value={server.bloodMoonFreq ?? 7} />
          <Input name="bloodMoonCount" label="Blood Moon Enemy Count" value={server.bloodMoonCount ?? 8} />

          <label>
            <span className="text-sm text-zinc-400">EAC Enabled</span>
            <div className="mt-4">
              <input name="eacEnabled" type="checkbox" defaultChecked={server.eacEnabled ?? true} />
            </div>
          </label>
        </div>

        <label className="mt-5 block">
          <span className="text-sm text-zinc-400">Server Password</span>
          <input name="serverPassword" defaultValue={server.serverPassword ?? ""} className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white" />
        </label>

        <button type="submit" className="mt-8 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400">
          Save Config
        </button>
<Link
  href={`/servers/${server.slug}/config/raw`}
  className="mt-4 inline-block text-sm text-emerald-400"
>
  View raw serverconfig.xml
</Link>
      </form>
    </PanelShell>
  );
}

function Input({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string | number;
}) {
  return (
    <label>
      <span className="text-sm text-zinc-400">{label}</span>
      <input
        name={name}
        defaultValue={value}
        className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
      />
    </label>
  );
}