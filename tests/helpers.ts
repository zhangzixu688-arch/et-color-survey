import type { StoredSurveyResponse } from "@/lib/repository";
import type { SurveySubmission } from "@/lib/survey";

export function submission(overrides: Partial<SurveySubmission> = {}): SurveySubmission {
  return {
    clientSubmissionId: crypto.randomUUID(),
    ageGroup: "26-35岁",
    purchasePurposes: ["家用", "通勤"],
    responsibleCountry: "德国",
    productLine: "SUV",
    firstImpression: "蓝色",
    purchaseChoice: "",
    ranking: ["红色", "蓝色", "绿色"],
    premiumColor: "红色",
    campaignColor: "",
    resaleColor: "绿色",
    ...overrides,
  };
}

export function stored(overrides: Partial<StoredSurveyResponse> = {}): StoredSurveyResponse {
  return {
    id: "response-1",
    createdAt: new Date("2026-06-11T10:00:00.000Z"),
    ...submission({ clientSubmissionId: "ed12d73b-2315-4c9a-810a-e32363c58835" }),
    ...overrides,
  };
}
