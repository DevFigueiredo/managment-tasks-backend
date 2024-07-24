-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_projects_tasks" (
    "projectId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("projectId", "taskId"),
    CONSTRAINT "projects_tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "projects_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_projects_tasks" ("projectId", "taskId") SELECT "projectId", "taskId" FROM "projects_tasks";
DROP TABLE "projects_tasks";
ALTER TABLE "new_projects_tasks" RENAME TO "projects_tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
