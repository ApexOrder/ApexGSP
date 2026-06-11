import fs from "node:fs/promises";
import path from "node:path";
import { Job } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { runCommand } from "@/lib/system/command";
import { create7dtdServerConfig } from "@/lib/games/7dtd/config";
import { getGameDefinition } from "@/lib/games/registry";

export async function runSteamInstallJob(job: Job) {
  const server = await prisma.gameServer.findUnique({
    where: { id: job.serverId },
  });

  if (!server) throw new Error("Server not found.");

  const game = getGameDefinition(server.game);

  if (game.installDriver !== "steamcmd") {
    throw new Error(`${game.name} does not use the SteamCMD install driver.`);
  }

  if (!game.steamAppId) {
    throw new Error(`${game.name} is missing a Steam App ID.`);
  }

  await prisma.job.update({
    where: { id: job.id },
    data: {
      progress: 10,
      message: "Preparing server folders.",
    },
  });

  await fs.mkdir(server.installPath, { recursive: true });
  await fs.mkdir(path.join(server.installPath, "serverfiles"), { recursive: true });
  await fs.mkdir(path.join(server.installPath, "config"), { recursive: true });
  await fs.mkdir(path.join(server.installPath, "logs"), { recursive: true });
  await fs.mkdir(path.join(server.installPath, "steamcmd"), { recursive: true });

  await prisma.job.update({
    where: { id: job.id },
    data: {
      progress: 25,
      message: `Installing ${game.name} with SteamCMD.`,
    },
  });

  await runCommand(
    "steamcmd",
    [
      "+force_install_dir",
      path.join(server.installPath, "serverfiles"),
      "+login",
      "anonymous",
      "+app_update",
      game.steamAppId,
      "validate",
      "+quit",
    ],
    server.installPath,
  );

  await prisma.job.update({
    where: { id: job.id },
    data: {
      progress: 75,
      message: "Generating server config.",
    },
  });

  if (server.game === "7dtd") {
    await fs.writeFile(
      path.join(server.installPath, "config", "serverconfig.xml"),
      create7dtdServerConfig({
        serverName: server.name,
        gamePort: server.gamePort,
        maxPlayers: server.maxPlayers,
        world: server.world,
        worldSeed: server.worldSeed,
        worldSize: server.worldSize,
        difficulty: server.difficulty,
        xpMultiplier: server.xpMultiplier,
        lootAbundance: server.lootAbundance,
        bloodMoonFreq: server.bloodMoonFreq,
        bloodMoonCount: server.bloodMoonCount,
        serverPassword: server.serverPassword,
        eacEnabled: server.eacEnabled,
      }),
    );
  }

  await prisma.gameServer.update({
    where: { id: server.id },
    data: {
      status: "STOPPED",
      installed: true,
      containerName: null,
    },
  });

  await prisma.job.update({
    where: { id: job.id },
    data: {
      progress: 95,
      message: "Install completed.",
      result: {
        game: game.id,
        installDriver: game.installDriver,
        steamAppId: game.steamAppId,
      },
    },
  });
}
