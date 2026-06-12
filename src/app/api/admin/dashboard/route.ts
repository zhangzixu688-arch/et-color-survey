import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getAllSurveyResponses } from "@/lib/repository";
import { calculateDashboardStats } from "@/lib/statistics";

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  return NextResponse.json(calculateDashboardStats(await getAllSurveyResponses()));
}
