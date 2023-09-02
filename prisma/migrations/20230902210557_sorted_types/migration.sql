-- CreateTable
CREATE TABLE "IntentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Mempool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "fee" INTEGER NOT NULL,
    "signedOrder" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "solved" BOOLEAN NOT NULL,
    "typeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mempool_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "IntentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
