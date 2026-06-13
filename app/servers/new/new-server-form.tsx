"use client";

import { createServer } from "@/lib/servers/actions";
import type { GameDefinition } from "@/lib/games/registry";
import { useState } from "react";

export function NewServerForm({ games }: { games: GameDefinition[] }) {
  const [selectedGameId, setSelectedGameId] = useState("7dtd");

  const selectedGame =
    games.find((game) => game.id === selectedGameId) ?? games[0];

  return (
    <form
      action={createServer}
      className="mt-8 max-w-2xl rounded-2xl border border-emerald-500/20 bg-black/40 p-6"
    >
      <label className="block">
        <span className="text-sm text-zinc-400">Server Name</span>
        <input
          name="name"
          required
          placeholder="My Awesome Server"
          className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
        />
      </label>

      <label className="mt-5 block">
        <span className="text-sm text-zinc-400">Game</span>
        <select
          name="game"
          value={selectedGameId}
          onChange={(event) => setSelectedGameId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
        >
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label>
          <span className="text-sm text-zinc-400">Game Port</span>
          <input
            name="gamePort"
            type="number"
            value={selectedGame.defaultGamePort}
            readOnly
            className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
          />
        </label>

        <label>
          <span className="text-sm text-zinc-400">Query Port</span>
          <input
            name="queryPort"
            type="number"
            value={selectedGame.defaultQueryPort ?? ""}
            readOnly
            placeholder="None"
            className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
          />
        </label>

        <label>
          <span className="text-sm text-zinc-400">Max Players</span>
          <input
            name="maxPlayers"
            type="number"
            value={selectedGame.defaultMaxPlayers}
            readOnly
            className="mt-2 w-full rounded-xl border border-emerald-500/20 bg-black px-4 py-3 text-white"
          />
        </label>
      </div>

      <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
        <p className="text-sm text-yellow-300">
          Driver: {selectedGame.installDriver}
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Mods: {selectedGame.supportsMods ? "Supported" : "Not supported"} ·
          Workshop:{" "}
          {selectedGame.supportsWorkshop ? "Supported" : "Not supported"}
        </p>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
      >
        Create Server
      </button>
    </form>
  );
}