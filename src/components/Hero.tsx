"use client";

import { motion } from "framer-motion";
import Eyes from "./Eyes";
import Magnetic from "./Magnetic";
import VoidGrid from "./VoidGrid";

const EASE = [0.22, 1, 0.36, 1] as const;

function Letters({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "115%", rotate: 5 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.055 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center overflow-hidden">
      {/* graph paper in the dark; your cursor is the flashlight */}
      <VoidGrid className="absolute inset-0 h-full w-full" />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-28 pt-28 sm:px-8 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.15 }}
          className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-fog sm:text-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
          </span>
          ~/ANUKUL/EXPERIMENTS · 0% COOL · 100% SHIPPED
        </motion.p>

        <h1 aria-label="not cool" className="font-display leading-[0.88] tracking-tight select-none">
          <span className="block text-[max(4rem,min(16.5vw,26vh))]">
            <Letters text="NOT" className="text-stroke" delay={0.35} />
          </span>
          <span className="flex items-center text-[max(4rem,min(16.5vw,26vh))]">
            <Letters text="C" delay={0.62} />
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.85 }}
              className="mx-[0.03em] inline-flex"
            >
              <Eyes eyeClass="h-[0.76em] w-[0.76em]" gapClass="gap-[0.05em]" />
            </motion.span>
            <Letters text="L" delay={0.78} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.25 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-fog sm:text-lg"
        >
          A wall of internet experiments by{" "}
          <a
            href="https://github.com/anukulpandey"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="font-medium text-paper underline decoration-acid decoration-wavy underline-offset-4 hover:text-acid"
          >
            Anukul Pandey
          </a>
          . Every subdomain is a separate fever dream — none of them asked for permission to exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <a
              href="#wall"
              data-hover
              className="glow-acid inline-flex items-center gap-2 rounded-full bg-acid px-8 py-4 font-mono text-sm font-bold text-void transition-transform active:scale-95"
            >
              see the wall ↓
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="https://github.com/anukulpandey/notcool.in"
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              className="inline-flex items-center gap-2 rounded-full border border-line px-8 py-4 font-mono text-sm text-paper transition-colors hover:border-acid hover:text-acid"
            >
              view source ↗
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-7 left-5 flex items-center gap-3 sm:left-8 lg:left-10"
        aria-hidden="true"
      >
        <motion.span
          animate={{ scaleY: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.45, 1] }}
          className="block h-10 w-px origin-top bg-gradient-to-b from-acid to-transparent"
        />
        <span className="font-mono text-[10px] tracking-[0.2em] text-fog">
          SCROLL — IT GETS WEIRDER
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-7 right-5 hidden font-mono text-[10px] tracking-[0.2em] text-fog sm:right-8 sm:block lg:right-10"
        aria-hidden="true"
      >
        EST. 2026 · CERTIFIED UNCOOL
      </motion.div>
    </section>
  );
}
