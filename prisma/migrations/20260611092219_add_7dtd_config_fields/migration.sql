-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameServer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "installPath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'STOPPED',
    "gamePort" INTEGER NOT NULL,
    "queryPort" INTEGER,
    "maxPlayers" INTEGER NOT NULL,
    "world" TEXT NOT NULL DEFAULT 'Navezgane',
    "worldSeed" TEXT NOT NULL DEFAULT 'ApexPanel',
    "worldSize" INTEGER NOT NULL DEFAULT 6144,
    "difficulty" INTEGER NOT NULL DEFAULT 0,
    "xpMultiplier" INTEGER NOT NULL DEFAULT 100,
    "lootAbundance" INTEGER NOT NULL DEFAULT 100,
    "bloodMoonFreq" INTEGER NOT NULL DEFAULT 7,
    "bloodMoonCount" INTEGER NOT NULL DEFAULT 8,
    "serverPassword" TEXT,
    "eacEnabled" BOOLEAN NOT NULL DEFAULT true,
    "installed" BOOLEAN NOT NULL DEFAULT false,
    "containerName" TEXT,
    "lastStartedAt" DATETIME,
    "lastStoppedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GameServer" ("containerName", "createdAt", "game", "gamePort", "id", "installPath", "installed", "lastStartedAt", "lastStoppedAt", "maxPlayers", "name", "queryPort", "slug", "status", "updatedAt") SELECT "containerName", "createdAt", "game", "gamePort", "id", "installPath", "installed", "lastStartedAt", "lastStoppedAt", "maxPlayers", "name", "queryPort", "slug", "status", "updatedAt" FROM "GameServer";
DROP TABLE "GameServer";
ALTER TABLE "new_GameServer" RENAME TO "GameServer";
CREATE UNIQUE INDEX "GameServer_slug_key" ON "GameServer"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
