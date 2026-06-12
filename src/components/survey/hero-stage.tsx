"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";
import { CAR_COLORS, COLOR_META } from "@/lib/survey";
import { CarPicture } from "@/components/survey/car-picture";

export function HeroStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -110]);
  const carScale = useTransform(scrollYProgress, [0, .8, 1], [1, 1.035, .94]);
  const carY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 38]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActiveIndex(Math.min(CAR_COLORS.length - 1, Math.floor(value * CAR_COLORS.length)));
  });

  const activeColor = CAR_COLORS[activeIndex];
  const meta = COLOR_META[activeColor];

  return (
    <section ref={sectionRef} className="relative z-10 h-[520vh]" aria-label="六种车身颜色动态展示">
      <div className="sticky top-0 flex h-screen overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 transition-[background] duration-1000"
          style={{ background: `radial-gradient(circle at 58% 52%, ${meta.glow}, transparent 29%), radial-gradient(circle at 50% 100%, rgba(47,82,138,.22), transparent 42%), #05070a` }}
        />
        <div aria-hidden className="soft-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col px-5 pb-8 pt-24 md:px-12 lg:px-20">
          <motion.div style={{ y: textY }} className="relative z-20 max-w-3xl">
            <p className="eyebrow mb-5">ET / Color Perception Study</p>
            <h1 className="display-title text-[clamp(3.5rem,8vw,8.8rem)]">色彩，决定<br /><span className="text-white/42">第一印象。</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/58 md:text-lg">六种车身色彩，同一台车。跟随光线与视线，告诉我们哪一种更接近你的选择。</p>
          </motion.div>

          <motion.div style={{ scale: carScale, y: carY }} className="pointer-events-none absolute inset-x-[-12vw] bottom-[8vh] z-10 mx-auto h-[48vh] md:inset-x-[2vw] md:bottom-[-3vh] md:h-[58vh]">
            <AnimatePresence mode="sync">
              <motion.div
                key={activeColor}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(5px)" }}
                transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-end justify-center"
              >
                <CarPicture color={activeColor} eager={activeIndex === 0} className="h-full w-full object-contain object-bottom drop-shadow-[0_38px_48px_rgba(0,0,0,.5)]" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="absolute bottom-7 left-5 z-30 md:bottom-10 md:left-12 lg:left-20">
            <AnimatePresence mode="wait">
              <motion.div key={activeColor} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full ring-4 ring-white/10" style={{ background: meta.hex }} /><span className="text-xl font-medium">{activeColor}</span></div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[.28em] text-white/38">{meta.english} · 0{activeIndex + 1}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-7 right-5 z-30 flex items-center gap-3 text-xs text-white/44 md:bottom-10 md:right-12 lg:right-20">
            <span className="hidden sm:inline">继续滚动探索</span><ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 z-40 h-[2px] bg-white/8 w-full"><motion.div className="h-full bg-gradient-to-r from-blue-400 to-white" style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} /></div>
      </div>
    </section>
  );
}
