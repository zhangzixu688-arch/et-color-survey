"use client";

import { motion } from "framer-motion";

export function QuestionCard({ number, title, hint, error, children }: {
  number: number;
  title: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={`question-${number}`}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-strong scroll-mt-24 rounded-[1.5rem] p-5 md:rounded-[2rem] md:p-9 ${error ? "ring-1 ring-red-400/70" : ""}`}
      aria-labelledby={`question-${number}-title`}
    >
      <div className="mb-7 flex gap-4 md:mb-9 md:gap-6">
        <span className="font-mono text-xs text-blue-300/72">0{number}</span>
        <div>
          <h3 id={`question-${number}-title`} className="text-xl font-medium leading-snug tracking-[-.025em] md:text-2xl">{title}</h3>
          {hint && <p className="mt-2 text-sm leading-6 text-white/42">{hint}</p>}
        </div>
      </div>
      {children}
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    </motion.section>
  );
}
