"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Eyes from "./Eyes";

const LINES = ["not loading…", "jk, almost there", "certified uncool ✓"];

// sessionStorage throws when the user blocks all cookies/site data —
// degrade to "play the preloader every visit" instead of crashing the app
function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* blocked storage — fine */
  }
}

/** Brief boot screen: counter + eyes. Skipped on repeat visits this session. */
export default function Preloader() {
  const [show, setShow] = useState(true);
  const [skipped, setSkipped] = useState(false);
  const [pct, setPct] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (
      safeGet("booted") ||
      new URLSearchParams(window.location.search).has("noanim") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // vanish instantly — no exit animation for repeat visitors
      setSkipped(true);
      setShow(false);
      return;
    }
    const t0 = performance.now();
    const DUR = 1150;
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / DUR);
      // ease-out so it "loads" fast then savors the last few percent
      const eased = 1 - Math.pow(1 - p, 2.4);
      setPct(Math.round(eased * 100));
      setLine(Math.min(LINES.length - 1, Math.floor(p * LINES.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        safeSet("booted", "1");
        setTimeout(() => setShow(false), 180);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (skipped) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="preloader fixed inset-0 z-[95] flex flex-col items-center justify-center gap-6 bg-void"
          aria-hidden="true"
        >
          <Eyes eyeClass="h-9 w-9" />
          <div className="font-mono text-xs tracking-[0.18em] text-fog">{LINES[line]}</div>
          <div className="h-px w-44 overflow-hidden bg-line">
            <div className="h-full bg-acid transition-[width] duration-75" style={{ width: `${pct}%` }} />
          </div>
          <div className="absolute bottom-8 right-10 font-display text-6xl text-ink-2 select-none">
            {pct}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
