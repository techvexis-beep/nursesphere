-- CreateTable
CREATE TABLE "user_regulator_tracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "regulatorId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_regulator_tracking_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "regulators" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_regulator_tracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "regulator_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "regulatorId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "answer" TEXT,
    "answeredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "regulator_questions_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "regulators" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "regulator_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_regulator_tracking_userId_regulatorId_key" ON "user_regulator_tracking"("userId", "regulatorId");
