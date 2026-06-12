"use client";

import { motion } from "framer-motion";
import { Download, LogOut, RefreshCw, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AmbientBackground } from "@/components/survey/ambient-background";
import { COLOR_META } from "@/lib/survey";
import type { DashboardStats } from "@/lib/statistics";

const ChartCard = dynamic(() => import("@/components/dashboard/chart-card").then((module) => module.ChartCard), { ssr: false, loading: () => <div className="glass-strong h-80 animate-pulse rounded-[1.6rem]" /> });
const TrendChart = dynamic(() => import("@/components/dashboard/trend-chart").then((module) => module.TrendChart), { ssr: false, loading: () => <div className="h-full animate-pulse rounded-2xl bg-white/[.035]" /> });

type RawItem = {
  id: string;
  clientSubmissionId: string;
  ageGroup: string;
  purchasePurposes: string[];
  responsibleCountry: string;
  productLine: string;
  firstImpression: string;
  purchaseChoice: string;
  ranking: string[];
  premiumColor: string;
  campaignColor: string;
  resaleColor: string;
  createdAt: string;
};
type PageData = { total: number; page: number; pageSize: number; totalPages: number; items: RawItem[] };

const metricTitles: { key: keyof DashboardStats["colorMetrics"]; title: string; subtitle: string }[] = [
  { key: "firstImpression", title: "第一眼吸引力", subtitle: "第 5 题 · 传播吸引力" },
  { key: "purchaseChoice", title: "实际购买意愿", subtitle: "第 6 题 · 主销色潜力" },
  { key: "premiumColor", title: "高级感认知", subtitle: "第 8 题 · 品牌形象色" },
  { key: "campaignColor", title: "主视觉适配度", subtitle: "第 9 题 · 广告传播色" },
  { key: "resaleColor", title: "保值感认知", subtitle: "第 10 题 · 二手保值判断" },
];

export function DashboardClient({ initialStats, initialPage }: { initialStats: DashboardStats; initialPage: PageData }) {
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [pageData, setPageData] = useState(initialPage);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (response.status === 401) return router.replace("/dashboard/login");
      setStats(await response.json());
    } finally { setRefreshing(false); }
  };
  const loadPage = async (page: number) => {
    const response = await fetch(`/api/admin/responses?page=${page}&pageSize=${pageData.pageSize}`, { cache: "no-store" });
    if (response.status === 401) return router.replace("/dashboard/login");
    setPageData(await response.json());
  };
  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/dashboard/login"); router.refresh(); };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070a] px-4 pb-20 pt-6 md:px-8 lg:px-12">
      <AmbientBackground />
      <div className="relative z-10 mx-auto max-w-[1600px]">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-5 border-b border-white/8 pb-6">
          <div><p className="eyebrow">EX7 / Research Intelligence</p><h1 className="mt-2 text-3xl font-medium tracking-[-.045em] md:text-5xl">车色偏好数据</h1></div>
          <div className="flex gap-2">
            <button onClick={refresh} className="glass flex h-11 items-center gap-2 rounded-full px-4 text-sm text-white/68 hover:text-white"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />刷新</button>
            <a href="/api/admin/export.xlsx" className="flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-black"><Download className="h-4 w-4" />导出 Excel</a>
            <button onClick={logout} aria-label="退出登录" className="glass flex h-11 w-11 items-center justify-center rounded-full text-white/60 hover:text-white"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>

        <section className="mb-5 grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong flex min-h-64 flex-col justify-between rounded-[1.8rem] p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400/12 ring-1 ring-blue-300/20"><Users className="h-5 w-5 text-blue-200" /></div>
            <div><p className="text-[clamp(4rem,8vw,7rem)] font-medium leading-none tracking-[-.07em]">{stats.totalResponses}</p><p className="mt-3 text-sm text-white/40">累计有效问卷</p></div>
          </motion.div>
          <section className="glass-strong rounded-[1.8rem] p-6 md:p-8">
            <div className="mb-5"><h2 className="text-lg font-medium">提交趋势</h2><p className="mt-1 text-xs text-white/38">按自然日统计</p></div>
            <div className="h-52 min-w-0"><TrendChart data={stats.trend} /></div>
          </section>
        </section>

        <section className="mb-5 grid gap-5 md:grid-cols-2"><ChartCard title="年龄分布" data={stats.ageDistribution} /><ChartCard title="主要购车用途" subtitle="多选题，占比以总样本数为分母" data={stats.purposeDistribution} /></section>
        <section className="mb-5 grid gap-5 xl:grid-cols-2">{metricTitles.map((metric) => <ChartCard key={metric.key} title={metric.title} subtitle={metric.subtitle} data={stats.colorMetrics[metric.key]} colorized />)}</section>

        <section className="glass-strong mb-5 overflow-hidden rounded-[1.8rem]">
          <div className="border-b border-white/8 p-6 md:p-8"><p className="eyebrow">Weighted Ranking</p><h2 className="mt-2 text-2xl font-medium tracking-[-.03em]">购买意愿综合排名</h2><p className="mt-2 text-xs text-white/38">第一名 6 分，依次递减至第六名 1 分</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="text-xs text-white/35"><tr><th className="px-7 py-4 font-normal">排名</th><th className="px-7 py-4 font-normal">颜色</th><th className="px-7 py-4 font-normal">加权总分</th><th className="px-7 py-4 font-normal">平均名次</th><th className="px-7 py-4 font-normal">第一名次数</th></tr></thead><tbody>{stats.ranking.map((item) => <tr key={item.color} className="border-t border-white/7"><td className="px-7 py-5 font-mono text-2xl text-white/65">{String(item.rank).padStart(2, "0")}</td><td className="px-7 py-5"><span className="inline-flex items-center gap-3"><span className="h-3 w-3 rounded-full ring-4 ring-white/5" style={{ background: COLOR_META[item.color].hex }} />{item.color}</span></td><td className="px-7 py-5 font-medium">{item.totalScore}</td><td className="px-7 py-5 text-white/55">{item.averageRank || "-"}</td><td className="px-7 py-5 text-white/55">{item.firstPlaceCount}</td></tr>)}</tbody></table></div>
        </section>

        <section className="glass-strong overflow-hidden rounded-[1.8rem]">
          <div className="flex items-end justify-between border-b border-white/8 p-6 md:p-8"><div><p className="eyebrow">Raw Responses</p><h2 className="mt-2 text-2xl font-medium tracking-[-.03em]">原始问卷明细</h2></div><span className="text-xs text-white/35">共 {pageData.total} 条</span></div>
          <div className="scrollbar-thin overflow-x-auto"><table className="w-full min-w-[1700px] text-left text-sm"><thead className="text-xs text-white/35"><tr>{["提交时间","年龄段","购车用途","负责国家","产品线","第一眼","实际购买","完整排序","高级感","主视觉","保值"].map((title) => <th key={title} className="px-5 py-4 font-normal">{title}</th>)}</tr></thead><tbody>{pageData.items.map((item) => <tr key={item.id} className="border-t border-white/7 text-white/62 hover:bg-white/[.025]"><td className="whitespace-nowrap px-5 py-4">{new Date(item.createdAt).toLocaleString("zh-CN", { hour12: false })}</td><td className="px-5 py-4">{item.ageGroup}</td><td className="px-5 py-4">{item.purchasePurposes.join("、")}</td><td className="px-5 py-4">{item.responsibleCountry || "-"}</td><td className="px-5 py-4">{item.productLine || "-"}</td><td className="px-5 py-4">{item.firstImpression}</td><td className="px-5 py-4">{item.purchaseChoice}</td><td className="px-5 py-4">{item.ranking.join(" › ")}</td><td className="px-5 py-4">{item.premiumColor}</td><td className="px-5 py-4">{item.campaignColor}</td><td className="px-5 py-4">{item.resaleColor}</td></tr>)}{pageData.items.length === 0 && <tr><td colSpan={11} className="px-5 py-16 text-center text-white/35">尚无问卷数据</td></tr>}</tbody></table></div>
          <div className="flex items-center justify-between border-t border-white/8 px-6 py-4 text-xs text-white/45"><button disabled={pageData.page <= 1} onClick={() => loadPage(pageData.page - 1)} className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-25">上一页</button><span>第 {pageData.page} / {pageData.totalPages} 页</span><button disabled={pageData.page >= pageData.totalPages} onClick={() => loadPage(pageData.page + 1)} className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-25">下一页</button></div>
        </section>
      </div>
    </main>
  );
}
