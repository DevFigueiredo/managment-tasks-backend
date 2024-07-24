/*
  Warnings:

  - The primary key for the `project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects_tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "progress" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_project" ("createdAt", "description", "id", "name", "progress", "updatedAt") SELECT "createdAt", "description", "id", "name", "progress", "updatedAt" FROM "project";
DROP TABLE "project";
ALTER TABLE "new_project" RENAME TO "project";
CREATE TABLE "new_projects_tasks" (
    "projectId" TEXT NOT NULL,
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
