"use client";

import { AmbientBackground } from "@/components/survey/ambient-background";
import { ColorGallery } from "@/components/survey/color-gallery";
import { HeroStage } from "@/components/survey/hero-stage";
import { SurveyForm } from "@/components/survey/survey-form";

export function SurveyExperience() {
  return (
    <main className="relative min-h-screen overflow-clip bg-[#05070a]">
      <div className="pointer-events-none fixed right-4 top-4 z-[60] rounded-full border border-white/10 bg-black/18 px-4 py-2 backdrop-blur-xl md:right-8 md:top-7 md:px-5">
        <img src="/brand-logo.png" alt="EXEED EXLANTIX" className="h-auto w-36 opacity-90 md:w-52" />
      </div>
      <AmbientBackground />
      <HeroStage />
      <ColorGallery />
      <SurveyForm />
      <footer className="relative z-10 border-t border-white/8 px-5 py-8 text-center font-mono text-[10px] uppercase tracking-[.2em] text-white/28">ET Color Perception Study · 2026</footer>
    </main>
  );
}
