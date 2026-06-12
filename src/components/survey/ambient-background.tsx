"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = { x: number; y: number; vx: number; vy: number; radius: number; alpha: number };

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let animationFrame = 0;
    let particles: Particle[] = [];
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = reduceMotion ? 18 : mobile ? 32 : 64;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - .5) * .16,
        vy: -.06 - Math.random() * .18,
        radius: .5 + Math.random() * 1.5,
        alpha: .12 + Math.random() * .38,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const particle of particles) {
        if (!reduceMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.y < -10) particle.y = window.innerHeight + 10;
          if (particle.x < -10) particle.x = window.innerWidth + 10;
          if (particle.x > window.innerWidth + 10) particle.x = -10;
        }
        context.beginPath();
        context.fillStyle = `rgba(168, 202, 255, ${particle.alpha})`;
        context.shadowBlur = 10;
        context.shadowColor = "rgba(98, 156, 255, .55)";
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-0 opacity-70" />
      <div aria-hidden className="pointer-glow" />
      <div aria-hidden className="noise" />
    </>
  );
}
