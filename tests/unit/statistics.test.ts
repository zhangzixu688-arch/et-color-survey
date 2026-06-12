import { describe, expect, it } from "vitest";
import { calculateDashboardStats } from "@/lib/statistics";
import { stored } from "../helpers";

describe("calculateDashboardStats", () => {
  it("calculates percentages and weighted ranking", () => {
    const stats = calculateDashboardStats([
      stored(),
      stored({ id: "response-2", clientSubmissionId: "391a7b4e-6d73-43b0-a417-d7373772f3a6", ranking: ["蓝色", "黑色", "白色", "米色", "绿色", "红色"] }),
    ]);
    expect(stats.totalResponses).toBe(2);
    expect(stats.colorMetrics.purchaseChoice.find((item) => item.name === "黑色")?.percentage).toBe(100);
    expect(stats.ranking[0]).toMatchObject({ color: "黑色", totalScore: 11, firstPlaceCount: 1 });
  });

  it("breaks score ties by first-place count, then fixed color order", () => {
    const stats = calculateDashboardStats([
      stored({ ranking: ["红色", "米色", "白色", "黑色", "蓝色", "绿色"] }),
      stored({ id: "response-2", clientSubmissionId: "391a7b4e-6d73-43b0-a417-d7373772f3a6", ranking: ["米色", "红色", "白色", "黑色", "蓝色", "绿色"] }),
    ]);
    expect(stats.ranking.slice(0, 2).map((item) => item.color)).toEqual(["米色", "红色"]);
  });
});
