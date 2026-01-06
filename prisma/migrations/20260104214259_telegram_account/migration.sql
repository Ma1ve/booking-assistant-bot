-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TelegramAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chatId" TEXT NOT NULL,
    "username" TEXT,
    "userId" INTEGER,
    CONSTRAINT "TelegramAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TelegramAccount" ("chatId", "id", "username") SELECT "chatId", "id", "username" FROM "TelegramAccount";
DROP TABLE "TelegramAccount";
ALTER TABLE "new_TelegramAccount" RENAME TO "TelegramAccount";
CREATE UNIQUE INDEX "TelegramAccount_chatId_key" ON "TelegramAccount"("chatId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "telegram" TEXT
);
INSERT INTO "new_User" ("address", "endTime", "firstName", "id", "lastName", "startTime", "telegram") SELECT "address", "endTime", "firstName", "id", "lastName", "startTime", "telegram" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
