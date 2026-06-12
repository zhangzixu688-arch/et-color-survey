"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useRef, useState } from "react";

export function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  const chartData = data.length ? data : [{ date: "暂无数据", count: 0 }];
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.floor(entry.contentRect.width), height: Math.floor(entry.contentRect.height) }));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={containerRef} className="h-full min-w-0 w-full">
    {size.width > 0 && size.height > 0 && <AreaChart width={size.width} height={size.height} data={chartData}>
        <defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#62a0ff" stopOpacity={.45}/><stop offset="100%" stopColor="#62a0ff" stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false}/>
        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,.38)", fontSize: 10 }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fill: "rgba(255,255,255,.3)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false}/>
        <Tooltip contentStyle={{ background: "#090d13", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }}/>
        <Area type="monotone" dataKey="count" stroke="#77adff" strokeWidth={2} fill="url(#trendFill)" />
    </AreaChart>}
    </div>
  );
}
