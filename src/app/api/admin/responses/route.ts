import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getSurveyResponsesPage } from "@/lib/repository";

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 20);
  return NextResponse.json(await getSurveyResponsesPage(page, pageSize));
}
