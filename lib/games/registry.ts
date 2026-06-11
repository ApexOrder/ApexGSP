export type InstallDriver =
  | "steamcmd"
  | "docker"
  | "java"
  | "fivem"
  | "custom";

export type GameDefinition = {
  id: string;
  name: string;
  installDriver: InstallDriver;
  steamAppId?: string;
  executable?: string;
  defaultGamePort: number;
  defaultQueryPort?: number;
  defaultMaxPlayers: number;
  supportsMods: boolean;
  supportsWorkshop: boolean;
};

export const GAME_REGISTRY: Record<string, GameDefinition> = {
  "7dtd": {
    id: "7dtd",
    name: "7 Days to Die",
    installDriver: "steamcmd",
    steamAppId: "294420",
    executable: "startserver.sh",
    defaultGamePort: 26900,
    defaultQueryPort: 26901,
    defaultMaxPlayers: 8,
    supportsMods: true,
    supportsWorkshop: false,
  },

  dayz: {
    id: "dayz",
    name: "DayZ",
    installDriver: "steamcmd",
    steamAppId: "223350",
    executable: "DayZServer",
    defaultGamePort: 2302,
    defaultQueryPort: 27016,
    defaultMaxPlayers: 60,
    supportsMods: true,
    supportsWorkshop: true,
  },

  valheim: {
    id: "valheim",
    name: "Valheim",
    installDriver: "steamcmd",
    steamAppId: "896660",
    executable: "valheim_server.x86_64",
    defaultGamePort: 2456,
    defaultQueryPort: 2457,
    defaultMaxPlayers: 10,
    supportsMods: true,
    supportsWorkshop: false,
  },

  rust: {
    id: "rust",
    name: "Rust",
    installDriver: "steamcmd",
    steamAppId: "258550",
    executable: "RustDedicated",
    defaultGamePort: 28015,
    defaultQueryPort: 28016,
    defaultMaxPlayers: 100,
    supportsMods: true,
    supportsWorkshop: true,
  },

  minecraft: {
    id: "minecraft",
    name: "Minecraft Java",
    installDriver: "java",
    executable: "server.jar",
    defaultGamePort: 25565,
    defaultMaxPlayers: 20,
    supportsMods: true,
    supportsWorkshop: false,
  },

  fivem: {
    id: "fivem",
    name: "FiveM",
    installDriver: "fivem",
    executable: "run.sh",
    defaultGamePort: 30120,
    defaultMaxPlayers: 48,
    supportsMods: true,
    supportsWorkshop: false,
  },
};

export function getGameDefinition(gameId: string) {
  const game = GAME_REGISTRY[gameId];

  if (!game) {
    throw new Error(`Unsupported game: ${gameId}`);
  }

  return game;
}

export function listGameDefinitions() {
  return Object.values(GAME_REGISTRY);
}
