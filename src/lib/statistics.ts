import type { StoredSurveyResponse } from "@/lib/repository";
import { AGE_GROUPS, CAR_COLORS, PURCHASE_PURPOSES, type CarColor } from "@/lib/survey";

export type CountDatum = { name: string; count: number; percentage: number };
export type ColorMetricKey = "firstImpression" | "purchaseChoice" | "premiumColor" | "campaignColor" | "resaleColor";
export type RankingDatum = { color: CarColor; rank: number; totalScore: number; averageRank: number; firstPlaceCount: number };
export type DashboardStats = {
  totalResponses: number;
  ageDistribution: CountDatum[];
  purposeDistribution: CountDatum[];
  colorMetrics: Record<ColorMetricKey, CountDatum[]>;
  ranking: RankingDatum[];
  trend: { date: string; count: number }[];
};

function percentage(count: number, total: number) {
  return total === 0 ? 0 : Number(((count / total) * 100).toFixed(1));
}

function distribution(values: string[], choices: readonly string[], denominator = values.length): CountDatum[] {
  return choices.map((name) => {
    const count = values.filter((value) => value === name).length;
    return { name, count, percentage: percentage(count, denominator) };
  });
}

export function calculateDashboardStats(responses: StoredSurveyResponse[]): DashboardStats {
  const total = responses.length;
  const colorMetricKeys: ColorMetricKey[] = ["firstImpression", "purchaseChoice", "premiumColor", "campaignColor", "resaleColor"];
  const colorMetrics = Object.fromEntries(
    colorMetricKeys.map((key) => [key, distribution(responses.map((response) => response[key]), CAR_COLORS, total)]),
  ) as DashboardStats["colorMetrics"];

  const ranking = CAR_COLORS.map((color, colorIndex) => {
    let totalScore = 0;
    let rankTotal = 0;
    let firstPlaceCount = 0;
    for (const response of responses) {
      const index = response.ranking.indexOf(color);
      if (index >= 0) {
        totalScore += CAR_COLORS.length - index;
        rankTotal += index + 1;
        if (index === 0) firstPlaceCount += 1;
      }
    }
    return { color, rank: 0, totalScore, averageRank: total === 0 ? 0 : Number((rankTotal / total).toFixed(2)), firstPlaceCount, colorIndex };
  })
    .sort((a, b) => b.totalScore - a.totalScore || b.firstPlaceCount - a.firstPlaceCount || a.colorIndex - b.colorIndex)
    .map((item, index) => ({
      color: item.color,
      rank: index + 1,
      totalScore: item.totalScore,
      averageRank: item.averageRank,
      firstPlaceCount: item.firstPlaceCount,
    }));

  const trendMap = new Map<string, number>();
  for (const response of responses) {
    const date = response.createdAt.toISOString().slice(0, 10);
    trendMap.set(date, (trendMap.get(date) ?? 0) + 1);
  }

  return {
    totalResponses: total,
    ageDistribution: distribution(responses.map((response) => response.ageGroup), AGE_GROUPS, total),
    purposeDistribution: PURCHASE_PURPOSES.map((name) => {
      const count = responses.filter((response) => response.purchasePurposes.includes(name)).length;
      return { name, count, percentage: percentage(count, total) };
    }),
    colorMetrics,
    ranking,
    trend: [...trendMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count })),
  };
}
