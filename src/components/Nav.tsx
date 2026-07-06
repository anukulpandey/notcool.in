"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import Eyes from "./Eyes";

const LINKS = [
  { href: "#wall", label: "the wall" },
  { href: "#vitals", label: "vitals" },
  { href: "#manifesto", label: "manifesto" },
];

/** Glass nav that ducks out of the way on scroll down, returns on scroll up. */
export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 140);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      // keyboard users tabbing into a ducked nav should see it come back
      onFocus={() => setHidden(false)}
      className="fixed inset-x-0 top-0 z-[80]"
    >
      <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-line/70 bg-void/55 px-4 py-2.5 backdrop-blur-xl sm:px-5 lg:mx-auto lg:w-[min(1400px,calc(100%-2rem))]">
        <a href="#top" className="flex items-center gap-2.5" data-hover>
          <Eyes eyeClass="h-[15px] w-[15px]" />
          <span className="font-mono text-sm font-semibold tracking-tight">notcool.in</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-hover
              className="group relative font-mono text-[13px] tracking-wide text-fog transition-colors hover:text-paper"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-acid transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="https://github.com/anukulpandey"
          target="_blank"
          rel="noopener noreferrer"
          data-hover
          className="rounded-full border border-line bg-ink px-4 py-1.5 font-mono text-[13px] text-paper transition-colors hover:border-acid hover:text-acid"
        >
          github ↗
        </a>
      </div>
    </motion.header>
  );
}
