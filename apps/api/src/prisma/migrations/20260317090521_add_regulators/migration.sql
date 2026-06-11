-- CreateTable
CREATE TABLE "regulators" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "description" TEXT,
    "contactEmail" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "regulator_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regulatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "name" TEXT NOT NULL,
    "title" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "regulator_users_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "regulators" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "regulator_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "regulator_announcements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regulatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'LICENSING',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" DATETIME,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "regulator_announcements_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "regulators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "licensing_pathways" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regulatorId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pathwayType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "documents" TEXT NOT NULL,
    "fees" TEXT NOT NULL,
    "timeline" TEXT,
    "examRequired" BOOLEAN NOT NULL DEFAULT false,
    "examName" TEXT,
    "englishRequired" BOOLEAN NOT NULL DEFAULT false,
    "englishTests" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "licensing_pathways_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "regulators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "regulator_faqs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regulatorId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "regulator_faqs_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "regulators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "live_qa_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regulatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "streamUrl" TEXT,
    "isRecorded" BOOLEAN NOT NULL DEFAULT true,
    "recordingUrl" TEXT,
    "attendeeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    CONSTRAINT "live_qa_sessions_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "regulators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "live_qa_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "live_qa_questions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "live_qa_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "live_qa_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "regulator_analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regulatorId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "totalMigrations" INTEGER NOT NULL DEFAULT 0,
    "examPassRate" REAL,
    "avgProcessingDays" REAL,
    "activeNurses" INTEGER NOT NULL DEFAULT 0,
    "newApplications" INTEGER NOT NULL DEFAULT 0,
    "jobPlacements" INTEGER NOT NULL DEFAULT 0,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "pathwayViews" INTEGER NOT NULL DEFAULT 0,
    "faqViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "regulator_analytics_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "regulators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "regulators_slug_key" ON "regulators"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "regulator_users_regulatorId_userId_key" ON "regulator_users"("regulatorId", "userId");
