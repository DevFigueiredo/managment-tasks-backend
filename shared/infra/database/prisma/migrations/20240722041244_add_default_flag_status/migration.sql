-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_status" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "default" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT,
    CONSTRAINT "status_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_status" ("color", "id", "name", "projectId", "status") SELECT "color", "id", "name", "projectId", "status" FROM "status";
DROP TABLE "status";
ALTER TABLE "new_status" RENAME TO "status";
CREATE UNIQUE INDEX "status_name_key" ON "status"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;