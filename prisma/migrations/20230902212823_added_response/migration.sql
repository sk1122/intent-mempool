/*
  Warnings:

  - Added the required column `response` to the `Mempool` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mempool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "fee" INTEGER NOT NULL,
    "signedOrder" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "solved" BOOLEAN NOT NULL,
    "response" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mempool_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "IntentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Mempool" ("approved", "batch", "conditions", "createdAt", "description", "fee", "id", "name", "signedOrder", "solved", "typeId") SELECT "approved", "batch", "conditions", "createdAt", "description", "fee", "id", "name", "signedOrder", "solved", "typeId" FROM "Mempool";
DROP TABLE "Mempool";
ALTER TABLE "new_Mempool" RENAME TO "Mempool";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
