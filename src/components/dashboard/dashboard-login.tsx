"use client";

import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AmbientBackground } from "@/components/survey/ambient-background";

export function DashboardLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "登录失败");
      router.replace("/dashboard");
      router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "登录失败"); }
    finally { setLoading(false); }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-5">
      <AmbientBackground />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(45,91,171,.3),transparent_35%)]" />
      <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="glass-strong relative z-10 w-full max-w-md rounded-[2rem] p-7 md:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/12 ring-1 ring-blue-300/25"><LockKeyhole className="h-5 w-5 text-blue-200" /></div>
        <p className="eyebrow mt-9">Private Analytics</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-.045em]">数据看板</h1>
        <p className="mt-3 text-sm leading-6 text-white/45">请输入管理员口令，查看调研趋势与原始问卷结果。</p>
        <form onSubmit={submit} className="mt-8">
          <label htmlFor="password" className="mb-2 block text-xs text-white/48">管理员口令</label>
          <input id="password" autoFocus required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-14 w-full rounded-2xl border border-white/12 bg-white/[.055] px-4 outline-none transition focus:border-blue-300/60 focus:ring-4 focus:ring-blue-400/10" placeholder="输入口令" />
          {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
          <button disabled={loading} className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white font-medium text-black transition-transform hover:scale-[1.01] disabled:opacity-60">
            {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <>进入看板<ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
