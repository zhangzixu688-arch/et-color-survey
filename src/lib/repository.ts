import type { SurveyResponse } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PurchasePurpose, SurveySubmission } from "@/lib/survey";

export type StoredSurveyResponse = Omit<SurveyResponse, "purchasePurposes" | "ranking"> & {
  purchasePurposes: PurchasePurpose[];
  ranking: string[];
};

function parseStoredResponse(response: SurveyResponse): StoredSurveyResponse {
  return {
    ...response,
    purchasePurposes: JSON.parse(response.purchasePurposes) as PurchasePurpose[],
    ranking: JSON.parse(response.ranking) as string[],
  };
}

export async function createSurveyResponse(submission: SurveySubmission) {
  const response = await prisma.surveyResponse.create({
    data: {
      clientSubmissionId: submission.clientSubmissionId,
      ageGroup: submission.ageGroup,
      purchasePurposes: JSON.stringify(submission.purchasePurposes),
      responsibleCountry: submission.responsibleCountry,
      productLine: submission.productLine,
      firstImpression: submission.firstImpression,
      purchaseChoice: submission.purchaseChoice,
      ranking: JSON.stringify(submission.ranking),
      premiumColor: submission.premiumColor,
      campaignColor: submission.campaignColor,
      resaleColor: submission.resaleColor,
    },
  });

  return parseStoredResponse(response);
}

export async function getAllSurveyResponses() {
  const responses = await prisma.surveyResponse.findMany({ orderBy: { createdAt: "desc" } });
  return responses.map(parseStoredResponse);
}

export async function getSurveyResponsesPage(page: number, pageSize: number) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(10, pageSize));
  const [total, responses] = await prisma.$transaction([
    prisma.surveyResponse.count(),
    prisma.surveyResponse.findMany({
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
  ]);

  return {
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
    items: responses.map(parseStoredResponse),
  };
}
