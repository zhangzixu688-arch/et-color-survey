CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientSubmissionId" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "purchasePurposes" TEXT NOT NULL,
    "firstImpression" TEXT NOT NULL,
    "purchaseChoice" TEXT NOT NULL,
    "ranking" TEXT NOT NULL,
    "premiumColor" TEXT NOT NULL,
    "campaignColor" TEXT NOT NULL,
    "resaleColor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "SurveyResponse_clientSubmissionId_key" ON "SurveyResponse"("clientSubmissionId");
CREATE INDEX "SurveyResponse_createdAt_idx" ON "SurveyResponse"("createdAt");
