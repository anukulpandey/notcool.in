"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  index,
  kicker,
  title,
  sub,
}: {
  index: string;
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100000px 0px -80px 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <p className="font-mono text-xs tracking-[0.28em] text-acid">
        {index} — {kicker}
      </p>
      <h2 className="mt-3 font-display text-5xl lowercase tracking-tight sm:text-7xl">{title}</h2>
      {sub && <p className="mt-4 max-w-xl leading-relaxed text-fog">{sub}</p>}
    </motion.div>
  );
}
