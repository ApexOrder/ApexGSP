import fs from "node:fs";

export function getSteamCmdPath() {
  const paths = [
    "/usr/games/steamcmd",
    "/usr/bin/steamcmd",
    "/usr/local/bin/steamcmd",
  ];

  for (const path of paths) {
    if (fs.existsSync(path)) {
      return path;
    }
  }

  return null;
}