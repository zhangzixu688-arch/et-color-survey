import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { buildSurveyWorkbook } from "@/lib/excel";
import { calculateDashboardStats } from "@/lib/statistics";
import { stored } from "../helpers";

describe("buildSurveyWorkbook", () => {
  it("creates summary and raw response worksheets", async () => {
    const responses = [stored()];
    const buffer = await buildSurveyWorkbook(calculateDashboardStats(responses), responses);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual(["汇总指标", "原始问卷明细"]);
    expect(workbook.getWorksheet("原始问卷明细")?.rowCount).toBe(2);
  });
});
