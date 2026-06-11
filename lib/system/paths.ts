import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export function getApexPanelHome() {
  return process.env.APEXPANEL_HOME || path.join(os.homedir(), ".apexpanel");
}

export function getServerRoot() {
  return process.env.APEXPANEL_SERVER_ROOT || path.join(getApexPanelHome(), "servers");
}

export async function ensureDirectory(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export function safeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
