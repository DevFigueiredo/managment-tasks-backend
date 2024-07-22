/*
  Warnings:

  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tasks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "text" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_projects_tasks" (
    "projectId" INTEGER NOT NULL,
    "taskId" TEXT NOT NULL,

    PRIMARY KEY ("projectId", "taskId"),
    CONSTRAINT "projects_tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "projects_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_projects_tasks" ("projectId", "taskId") SELECT "projectId", "taskId" FROM "projects_tasks";
DROP TABLE "projects_tasks";
ALTER TABLE "new_projects_tasks" RENAME TO "projects_tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;