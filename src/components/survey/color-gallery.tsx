"use client";

import { motion } from "framer-motion";
import { CAR_COLORS, COLOR_META } from "@/lib/survey";
import { CarPicture } from "@/components/survey/car-picture";

export function ColorGallery() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <div className="mb-12 max-w-2xl md:mb-20">
        <p className="eyebrow mb-4">The Six Expressions</p>
        <h2 className="display-title text-5xl md:text-7xl">同一轮廓，<br /><span className="text-white/40">六种表达。</span></h2>
        <p className="mt-4 text-lg text-white/62">One silhouette, six expressions.</p>
        <p className="mt-6 leading-7 text-white/52">请在相同视角与光线下观察每一种车漆。接下来的问题，没有标准答案。</p>
        <p className="mt-2 leading-7 text-white/38">View each paint color from the same angle and lighting. There is no standard answer in the questions that follow.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {CAR_COLORS.map((color, index) => {
          const meta = COLOR_META[color];
          return (
            <motion.article
              key={color}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: .65, delay: index * .055 }}
              whileHover={{ y: -7, rotateX: 1.5, rotateY: index % 2 ? -1.5 : 1.5 }}
              className="glass group relative aspect-[4/3] overflow-hidden rounded-[1.3rem] p-3 md:rounded-[2rem] md:p-5"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 50% 70%, ${meta.glow}, transparent 55%)` }} />
              <div className="relative flex h-[78%] items-center justify-center transition-transform duration-700 group-hover:scale-[1.035]">
                <CarPicture color={color} className="h-full w-full object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,.4)]" />
              </div>
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between md:inset-x-5 md:bottom-5">
                <div><h3 className="text-sm font-medium md:text-lg">{color}</h3><p className="hidden font-mono text-[9px] uppercase tracking-[.2em] text-white/35 sm:block">{meta.english}</p></div>
                <span className="h-3 w-3 rounded-full ring-4 ring-white/8 md:h-4 md:w-4" style={{ background: meta.hex }} />
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
