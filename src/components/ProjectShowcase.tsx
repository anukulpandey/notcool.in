"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/projects";
import { useLivePing } from "@/lib/useLivePing";
import LiveEmbed from "./LiveEmbed";
import Magnetic from "./Magnetic";

function StatusChip({ url }: { url: string }) {
  const ping = useLivePing(url);
  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 rounded-full border border-line bg-ink px-3 py-1 font-mono text-[11px] tracking-wider"
    >
      {ping.status === "pinging" && (
        <>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fog motion-reduce:animate-none" />
          <span className="text-fog">pinging…</span>
        </>
      )}
      {ping.status === "live" && (
        <>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-emerald-400">alive · {ping.ms}ms</span>
        </>
      )}
      {ping.status === "down" && (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <span className="text-red-400">unreachable</span>
        </>
      )}
    </span>
  );
}

export default function ProjectShowcase({
  project,
  index,
  flip = false,
}: {
  project: Project;
  index: number;
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // useReducedMotion() is null on the server, so dropping the parallax style
  // on the FIRST client render would hydration-mismatch and strand the
  // SSR'd transform. Render to match SSR first, remove the parallax after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const rotate = useTransform(scrollYProgress, [0, 1], flip ? [2.5, -1.5] : [-2.5, 1.5]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      id={project.slug}
      className="relative grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      {/* ghost index number */}
      <span
        aria-hidden
        className={`text-stroke-thin pointer-events-none absolute -top-16 select-none font-display text-[9rem] leading-none sm:text-[12rem] ${
          flip ? "right-0" : "left-0"
        }`}
      >
        {num}
      </span>

      {/* copy */}
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "100000px 0px -80px 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`relative lg:col-span-5 ${flip ? "lg:order-2" : ""}`}
      >
        <StatusChip url={project.url} />
        <h3 className="mt-5 font-display text-5xl lowercase tracking-tight sm:text-6xl">
          {project.name}
        </h3>
        <p className="mt-2 font-mono text-sm" style={{ color: project.accent }}>
          {project.host}
        </p>
        <p className="mt-3 text-lg font-medium text-paper">{project.tagline}</p>
        <p className="mt-4 max-w-md leading-relaxed text-fog">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-3.5 py-1 font-mono text-[11px] text-fog transition-colors"
            >
              {t}
            </span>
          ))}
        </div>

        <Magnetic className="mt-8">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-mono text-sm font-semibold transition-all hover:gap-3"
            style={{ borderColor: `${project.accent}55`, color: project.accent }}
          >
            visit {project.name} <span aria-hidden>→</span>
          </a>
        </Magnetic>
      </motion.div>

      {/* screenshot in a browser frame, parallaxed */}
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-hover
        style={mounted && reduce ? undefined : { y, rotate }}
        className={`group relative block lg:col-span-7 ${flip ? "lg:order-1" : ""}`}
        aria-label={`open ${project.name}`}
      >
        {/* accent glow behind the frame */}
        <div
          aria-hidden
          className="absolute -inset-8 -z-10 rounded-[3rem] opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
          style={{ background: `radial-gradient(ellipse at center, ${project.accent}, transparent 70%)` }}
        />
        <div className="overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-[1.015]">
          {/* browser chrome */}
          <div className="flex items-center gap-3 border-b border-line bg-ink px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <span className="flex items-center gap-2 rounded-md bg-void px-4 py-1 font-mono text-[11px] text-fog">
                <span className="text-[9px]" style={{ color: project.accent }}>
                  ●
                </span>
                {project.host}
              </span>
            </div>
          </div>
          <LiveEmbed project={project} />
        </div>
      </motion.a>
    </div>
  );
}
