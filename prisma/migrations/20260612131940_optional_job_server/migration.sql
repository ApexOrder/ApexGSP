-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serverId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "message" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB,
    "result" JSONB,
    "error" TEXT,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "GameServer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("createdAt", "error", "finishedAt", "id", "message", "payload", "progress", "result", "serverId", "startedAt", "status", "title", "type", "updatedAt") SELECT "createdAt", "error", "finishedAt", "id", "message", "payload", "progress", "result", "serverId", "startedAt", "status", "title", "type", "updatedAt" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE INDEX "Job_serverId_idx" ON "Job"("serverId");
CREATE INDEX "Job_status_idx" ON "Job"("status");
CREATE INDEX "Job_type_idx" ON "Job"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
