import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { buildSurveyWorkbook } from "@/lib/excel";
import { getAllSurveyResponses } from "@/lib/repository";
import { calculateDashboardStats } from "@/lib/statistics";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const responses = await getAllSurveyResponses();
  const buffer = await buildSurveyWorkbook(calculateDashboardStats(responses), responses);
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(`车色调研数据_${date}.xlsx`)}`,
      "Cache-Control": "no-store",
    },
  });
}
