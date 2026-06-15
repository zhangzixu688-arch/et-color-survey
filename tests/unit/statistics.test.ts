import { describe, expect, it } from "vitest";
import { calculateDashboardStats } from "@/lib/statistics";
import { stored } from "../helpers";

describe("calculateDashboardStats", () => {
  it("calculates percentages and weighted ranking", () => {
    const stats = calculateDashboardStats([
      stored(),
      stored({ id: "response-2", clientSubmissionId: "391a7b4e-6d73-43b0-a417-d7373772f3a6", firstImpression: "红色", ranking: ["蓝色", "红色", "绿色"] }),
    ]);
    expect(stats.totalResponses).toBe(2);
    expect(stats.colorMetrics.firstImpression.find((item) => item.name === "红色")?.percentage).toBe(50);
    expect(stats.ranking[0]).toMatchObject({ color: "红色", totalScore: 5, firstPlaceCount: 1 });
  });

  it("breaks score ties by first-place count, then fixed color order", () => {
    const stats = calculateDashboardStats([
      stored({ ranking: ["红色", "蓝色", "绿色"] }),
      stored({ id: "response-2", clientSubmissionId: "391a7b4e-6d73-43b0-a417-d7373772f3a6", ranking: ["蓝色", "红色", "绿色"] }),
    ]);
    expect(stats.ranking.slice(0, 2).map((item) => item.color)).toEqual(["红色", "蓝色"]);
  });

  it("uses only red, blue, and green from legacy six-color rankings", () => {
    const stats = calculateDashboardStats([
      stored({ ranking: ["黑色", "蓝色", "白色", "米色", "绿色", "红色"] }),
    ]);
    expect(stats.ranking.map((item) => item.color)).toEqual(["蓝色", "绿色", "红色"]);
    expect(stats.ranking[0]).toMatchObject({ color: "蓝色", totalScore: 3, firstPlaceCount: 1 });
  });
});
