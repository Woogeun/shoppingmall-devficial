-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminId_idx" ON "AdminAuditLog"("adminId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entityType_entityId_idx" ON "AdminAuditLog"("entityType", "entityId");
