/*
  Warnings:

  - You are about to drop the `AdminAuditLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AdminAuditLog";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "meta" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserAuditLog_userId_idx" ON "UserAuditLog"("userId");

-- CreateIndex
CREATE INDEX "UserAuditLog_entityType_entityId_idx" ON "UserAuditLog"("entityType", "entityId");
