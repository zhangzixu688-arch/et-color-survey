"use client";

import { AmbientBackground } from "@/components/survey/ambient-background";
import { ColorGallery } from "@/components/survey/color-gallery";
import { HeroStage } from "@/components/survey/hero-stage";
import { SurveyForm } from "@/components/survey/survey-form";

export function SurveyExperience() {
  return (
    <main className="relative min-h-screen overflow-clip bg-[#05070a]">
      <AmbientBackground />
      <HeroStage />
      <ColorGallery />
      <SurveyForm />
      <footer className="relative z-10 border-t border-white/8 px-5 py-8 text-center font-mono text-[10px] uppercase tracking-[.2em] text-white/28">EX7 Color Perception Study · 2026</footer>
    </main>
  );
}
