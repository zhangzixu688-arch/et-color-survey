import "dotenv/config";
import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = new PrismaClient();

async function prepareDatabase() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SurveyResponse" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "clientSubmissionId" TEXT NOT NULL,
      "ageGroup" TEXT NOT NULL,
      "purchasePurposes" TEXT NOT NULL,
      "responsibleCountry" TEXT NOT NULL DEFAULT '',
      "productLine" TEXT NOT NULL DEFAULT '',
      "firstImpression" TEXT NOT NULL,
      "purchaseChoice" TEXT NOT NULL,
      "ranking" TEXT NOT NULL,
      "premiumColor" TEXT NOT NULL,
      "campaignColor" TEXT NOT NULL,
      "resaleColor" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const columns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(`PRAGMA table_info("SurveyResponse")`);
  const columnNames = new Set(columns.map((column) => column.name));
  if (!columnNames.has("responsibleCountry")) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "SurveyResponse" ADD COLUMN "responsibleCountry" TEXT NOT NULL DEFAULT ''`);
  }
  if (!columnNames.has("productLine")) {
    await prisma.$executeRawUnsafe(`ALTER TABLE "SurveyResponse" ADD COLUMN "productLine" TEXT NOT NULL DEFAULT ''`);
  }
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "SurveyResponse_clientSubmissionId_key" ON "SurveyResponse"("clientSubmissionId")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "SurveyResponse_createdAt_idx" ON "SurveyResponse"("createdAt")`);
}

prepareDatabase()
  .then(() => console.log("Database ready."))
  .finally(() => prisma.$disconnect());
