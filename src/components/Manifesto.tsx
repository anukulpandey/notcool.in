"use client";

import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";

const TEXT =
  "cool is a cage. this is a wall of weekend experiments — every one gets a subdomain, a burst of hyperfocus, and zero market research. some of them will break in public. all of them shipped.";

const PUNCH = "stay uncool.";

function Word({
  word,
  progress,
  range,
  accent = false,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block ${accent ? "text-acid" : ""}`}
    >
      {word}&nbsp;
    </motion.span>
  );
}

/** Words light up one by one as you scroll through. */
export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = TEXT.split(" ");
  const punchWords = PUNCH.split(" ");
  const total = words.length + punchWords.length;

  return (
    <section id="manifesto" className="relative mx-auto max-w-[1400px] px-5 py-32 sm:px-8 lg:px-10">
      <p className="mb-10 font-mono text-xs tracking-[0.28em] text-acid">03 — MANIFESTO</p>
      <h2 className="sr-only">manifesto</h2>
      <div ref={ref} className="max-w-5xl">
        <p className="font-display text-[clamp(1.7rem,4.4vw,3.8rem)] lowercase leading-[1.25] tracking-tight">
          {words.map((w, i) => (
            <Word
              key={i}
              word={w}
              progress={scrollYProgress}
              range={[(i / total) * 0.9, (i / total) * 0.9 + 0.1]}
            />
          ))}
          {punchWords.map((w, i) => (
            <Word
              key={`p${i}`}
              word={w}
              accent
              progress={scrollYProgress}
              range={[((words.length + i) / total) * 0.9, ((words.length + i) / total) * 0.9 + 0.1]}
            />
          ))}
        </p>
      </div>
    </section>
  );
}
