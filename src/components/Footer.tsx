"use client";

import { motion } from "framer-motion";
import Eyes from "./Eyes";
import Magnetic from "./Magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

function WaveText({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          whileHover={{ y: -14, color: "var(--color-acid)" }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Footer() {
  const toggleDisco = () => {
    document.documentElement.classList.toggle("disco");
  };

  return (
    <footer id="footer" className="relative overflow-hidden border-t border-line">
      {/* background outline marquee */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-8 overflow-hidden opacity-40">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((i) => (
            <span key={i} className="text-stroke-thin whitespace-nowrap pr-6 font-display text-[7rem] leading-none sm:text-[10rem]">
              {"NOTCOOL ✦ ".repeat(6)}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 pb-12 pt-44 text-center sm:px-8 sm:pt-56 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100000px 0px 0px 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-6 font-mono text-xs tracking-[0.25em] text-fog"
        >
          THAT&apos;S THE WALL. FOR NOW.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100000px 0px 0px 0px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          href="https://github.com/anukulpandey"
          target="_blank"
          rel="noopener noreferrer"
          data-hover
          className="inline-block font-display text-[clamp(3rem,11vw,9.5rem)] lowercase leading-none tracking-tight"
        >
          <WaveText text="stay uncool." />
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100000px 0px 0px 0px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 font-mono text-[13px] text-fog sm:gap-10"
        >
          <a
            data-hover
            className="transition-colors hover:text-acid"
            href="https://github.com/anukulpandey"
            target="_blank"
            rel="noopener noreferrer"
          >
            github ↗
          </a>
          <a
            data-hover
            className="transition-colors hover:text-acid"
            href="https://github.com/anukulpandey/notcool.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            source of this page ↗
          </a>
          <Magnetic>
            <button data-hover onClick={toggleDisco} className="transition-colors hover:text-acid">
              do not press ✦
            </button>
          </Magnetic>
        </motion.div>

        <div className="mt-14 flex items-center justify-center gap-3">
          <Eyes eyeClass="h-4 w-4" />
        </div>
        <p className="mx-auto mt-5 max-w-2xl font-mono text-[11px] leading-loose text-fog">
          © 2026 anukul pandey · handmade with next.js, eyeballs &amp; questionable priorities · no
          cookies — the tracking here is the eyes and one cookieless view counter, and they&apos;re
          both watching <span className="text-acid">you</span> · <span>↑↑↓↓←→←→BA</span>
        </p>
        <p className="mx-auto mt-4 max-w-2xl font-mono text-[10px] leading-loose text-fog/50">
          A personal showcase of independent side projects. All third-party names, logos and
          trademarks — brands, stores and protocols mentioned — belong to their respective owners
          and are used for identification only; no affiliation, sponsorship or endorsement is
          implied. Linked projects are the responsibility of their authors.
        </p>
      </div>
    </footer>
  );
}
