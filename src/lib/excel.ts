import ExcelJS from "exceljs";
import type { StoredSurveyResponse } from "@/lib/repository";
import type { DashboardStats } from "@/lib/statistics";

const HEADER_FILL = "FF111827";
const ACCENT_FILL = "FF2A6DF4";

function styleHeader(row: ExcelJS.Row, fill = HEADER_FILL) {
  row.font = { color: { argb: "FFFFFFFF" }, bold: true };
  row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };
  row.alignment = { vertical: "middle", horizontal: "center" };
  row.height = 24;
}

export async function buildSurveyWorkbook(stats: DashboardStats, responses: StoredSurveyResponse[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "车色偏好调研问卷";
  workbook.created = new Date();

  const summary = workbook.addWorksheet("汇总指标", { views: [{ state: "frozen", ySplit: 2 }] });
  summary.addRow(["车色偏好调研数据汇总"]);
  summary.mergeCells("A1:F1");
  summary.getCell("A1").font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } };
  summary.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACCENT_FILL } };
  summary.getCell("A1").alignment = { horizontal: "center" };
  summary.addRow(["总填写人数", stats.totalResponses]);
  summary.addRow([]);
  summary.addRow(["综合排名", "颜色", "加权总分", "平均名次", "第一名次数"]);
  styleHeader(summary.getRow(4));
  for (const item of stats.ranking) summary.addRow([item.rank, item.color, item.totalScore, item.averageRank, item.firstPlaceCount]);

  const metricLabels: Record<keyof DashboardStats["colorMetrics"], string> = {
    firstImpression: "第一眼喜欢",
    purchaseChoice: "实际购买",
    premiumColor: "高级感",
    campaignColor: "宣传主视觉",
    resaleColor: "二手保值",
  };
  for (const [key, values] of Object.entries(stats.colorMetrics) as [keyof DashboardStats["colorMetrics"], DashboardStats["colorMetrics"][keyof DashboardStats["colorMetrics"]]][]) {
    summary.addRow([]);
    const heading = summary.addRow([metricLabels[key], "人数", "占比"]);
    styleHeader(heading);
    for (const value of values) summary.addRow([value.name, value.count, value.percentage / 100]);
  }
  summary.getColumn(1).width = 22;
  summary.getColumn(2).width = 16;
  summary.getColumn(3).width = 16;
  summary.getColumn(4).width = 16;
  summary.getColumn(5).width = 16;
  summary.eachRow((row) => row.eachCell((cell) => { cell.border = { bottom: { style: "hair", color: { argb: "FFD1D5DB" } } }; }));

  const detail = workbook.addWorksheet("原始问卷明细", { views: [{ state: "frozen", ySplit: 1 }] });
  detail.columns = [
    { header: "提交ID", key: "id", width: 28 },
    { header: "提交时间", key: "createdAt", width: 22 },
    { header: "年龄段", key: "ageGroup", width: 14 },
    { header: "主要购车用途", key: "purchasePurposes", width: 34 },
    { header: "所负责的国家", key: "responsibleCountry", width: 22 },
    { header: "负责的产品线", key: "productLine", width: 22 },
    { header: "第一眼最喜欢", key: "firstImpression", width: 16 },
    { header: "实际购车选择", key: "purchaseChoice", width: 16 },
    { header: "购买意愿排序", key: "ranking", width: 42 },
    { header: "高级感颜色", key: "premiumColor", width: 16 },
    { header: "宣传主视觉", key: "campaignColor", width: 16 },
    { header: "二手保值颜色", key: "resaleColor", width: 16 },
  ];
  styleHeader(detail.getRow(1));
  for (const response of responses) {
    detail.addRow({
      id: response.clientSubmissionId,
      createdAt: response.createdAt,
      ageGroup: response.ageGroup,
      purchasePurposes: response.purchasePurposes.join("、"),
      responsibleCountry: response.responsibleCountry,
      productLine: response.productLine,
      firstImpression: response.firstImpression,
      purchaseChoice: response.purchaseChoice,
      ranking: response.ranking.map((color, index) => `${index + 1}.${color}`).join("  "),
      premiumColor: response.premiumColor,
      campaignColor: response.campaignColor,
      resaleColor: response.resaleColor,
    });
  }
  detail.getColumn("createdAt").numFmt = "yyyy-mm-dd hh:mm:ss";
  detail.autoFilter = { from: "A1", to: "L1" };

  return workbook.xlsx.writeBuffer();
}
