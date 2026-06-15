import { describe, expect, it } from "vitest";
import { surveySubmissionSchema } from "@/lib/survey";
import { submission } from "../helpers";

describe("surveySubmissionSchema", () => {
  it("accepts a complete eight-question response", () => {
    expect(surveySubmissionSchema.safeParse(submission()).success).toBe(true);
  });

  it("accepts empty optional country and product line answers", () => {
    expect(surveySubmissionSchema.safeParse({ ...submission(), responsibleCountry: "", productLine: "" }).success).toBe(true);
  });

  it("rejects an empty required answer", () => {
    expect(surveySubmissionSchema.safeParse({ ...submission(), purchasePurposes: [] }).success).toBe(false);
  });

  it("rejects a ranking with duplicate colors", () => {
    const result = surveySubmissionSchema.safeParse({ ...submission(), ranking: ["红色", "红色", "绿色"] });
    expect(result.success).toBe(false);
  });

  it("rejects removed color choices", () => {
    const result = surveySubmissionSchema.safeParse({ ...submission(), firstImpression: "白色" });
    expect(result.success).toBe(false);
  });

  it("rejects old six-color rankings", () => {
    const result = surveySubmissionSchema.safeParse({ ...submission(), ranking: ["黑色", "蓝色", "白色", "米色", "绿色", "红色"] });
    expect(result.success).toBe(false);
  });
});
