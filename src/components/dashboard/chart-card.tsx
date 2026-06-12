"use client";

import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useRef, useState } from "react";
import { COLOR_META, getColorDisplayName, type CarColor } from "@/lib/survey";
import type { CountDatum } from "@/lib/statistics";

export function ChartCard({ title, subtitle, data, colorized = false }: { title: string; subtitle?: string; data: CountDatum[]; colorized?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const formatLabel = (label: unknown) => getColorDisplayName(String(label ?? ""));
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.floor(entry.contentRect.width), height: Math.floor(entry.contentRect.height) }));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="glass-strong rounded-[1.6rem] p-5 md:p-7">
      <div className="mb-6"><h2 className="text-lg font-medium tracking-[-.02em]">{title}</h2>{subtitle && <p className="mt-1 text-xs text-white/38">{subtitle}</p>}</div>
      <div ref={containerRef} className="h-64 min-w-0 w-full">
        {size.width > 0 && size.height > 0 && <BarChart width={size.width} height={size.height} data={data} margin={{ top: 10, right: 2, left: -25, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,.54)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={getColorDisplayName} />
            <YAxis tick={{ fill: "rgba(255,255,255,.34)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip cursor={{ fill: "rgba(255,255,255,.04)" }} contentStyle={{ background: "rgba(8,12,18,.94)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 14 }} formatter={(value) => [`${value} 人`, "选择人数"]} labelFormatter={formatLabel} />
            <Bar dataKey="count" radius={[7, 7, 2, 2]} maxBarSize={42}>
              {data.map((item) => <Cell key={item.name} fill={colorized && item.name in COLOR_META ? COLOR_META[item.name as CarColor].hex : "#6299f5"} />)}
            </Bar>
        </BarChart>}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">{data.map((item) => <div key={item.name} className="rounded-xl bg-white/[.035] px-2 py-2"><p className="text-[10px] text-white/38">{getColorDisplayName(item.name)}</p><p className="mt-1 text-sm font-medium">{item.percentage}%</p></div>)}</div>
    </section>
  );
}
