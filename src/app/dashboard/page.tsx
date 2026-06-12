import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { SESSION_COOKIE, verifyAdminSession } from "@/lib/auth";
import { getAllSurveyResponses, getSurveyResponsesPage } from "@/lib/repository";
import { calculateDashboardStats } from "@/lib/statistics";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  if (!await verifyAdminSession(cookieStore.get(SESSION_COOKIE)?.value)) redirect("/dashboard/login");
  const [responses, page] = await Promise.all([getAllSurveyResponses(), getSurveyResponsesPage(1, 20)]);
  return <DashboardClient initialStats={calculateDashboardStats(responses)} initialPage={{ ...page, items: page.items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })) }} />;
}
