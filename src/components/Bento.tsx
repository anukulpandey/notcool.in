"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/projects";
import { useLivePing } from "@/lib/useLivePing";
import Eyes from "./Eyes";

const EASE = [0.22, 1, 0.36, 1] as const;

function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100000px 0px -60px 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-2xl border border-line bg-ink p-6 transition-colors hover:border-acid/40 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function StatusRow({ name, url }: { name: string; url: string }) {
  const ping = useLivePing(url);
  return (
    <div
      role="status"
      className="flex items-center justify-between border-b border-line/60 py-2.5 font-mono text-[12px] last:border-0"
    >
      <span className="text-paper">{name}</span>
      {ping.status === "pinging" && (
        <span className="animate-pulse text-fog motion-reduce:animate-none">···</span>
      )}
      {ping.status === "live" && <span className="text-emerald-400">● {ping.ms}ms</span>}
      {ping.status === "down" && <span className="text-red-400">● down</span>}
    </div>
  );
}

export default function Bento() {
  return (
    <section id="vitals" className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "100000px 0px -80px 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mb-12"
      >
        <p className="font-mono text-xs tracking-[0.28em] text-acid">02 — VITALS</p>
        <h2 className="mt-3 font-display text-5xl lowercase tracking-tight sm:text-6xl">
          the uncool dashboard
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* live status board */}
        <Card className="sm:col-span-2" delay={0}>
          <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-fog">SYSTEM STATUS</p>
          {projects.map((p) => (
            <StatusRow key={p.slug} name={p.host} url={p.url} />
          ))}
          <div className="flex items-center justify-between py-2.5 font-mono text-[12px]">
            <span className="text-paper">notcool.in</span>
            <span className="text-emerald-400">● you&apos;re literally here</span>
          </div>
        </Card>

        {/* surveillance dept */}
        <Card delay={0.05}>
          <p className="mb-4 font-mono text-[11px] tracking-[0.2em] text-fog">SURVEILLANCE DEPT.</p>
          <Eyes eyeClass="h-10 w-10" />
          <p className="mt-4 text-sm leading-relaxed text-fog">
            The only analytics on this site. They follow your cursor, they blink, and they get
            bored when you leave.
          </p>
        </Card>

        {/* zero cookies */}
        <Card delay={0.1}>
          <p className="mb-2 font-mono text-[11px] tracking-[0.2em] text-fog">PRIVACY REPORT</p>
          <p className="font-display text-7xl text-acid">0</p>
          <p className="mt-2 text-sm text-fog">cookies · trackers · popups · newsletters</p>
        </Card>

        {/* terminal proof */}
        <Card className="sm:col-span-2" delay={0.15}>
          <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-fog">PROOF OF UNCOOL</p>
          <div className="rounded-lg border border-line bg-void p-4 font-mono text-[12px] leading-relaxed">
            <p className="text-fog">
              <span className="text-acid">$</span> curl -sI notcool.in | grep -i x-certified
            </p>
            <p className="mt-1 text-paper">
              x-certified: <span className="text-acid">not-cool</span>
            </p>
            <p className="mt-2 text-fog"># yes, it&apos;s a real response header. try it.</p>
          </div>
        </Card>

        {/* stack */}
        <Card delay={0.2}>
          <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-fog">BUILT WITH</p>
          <div className="flex flex-wrap gap-2">
            {["next 15", "react 19", "tailwind 4", "framer motion", "canvas", "lenis"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-paper"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-fog">0 templates. 1 weekend. handmade eyeballs.</p>
        </Card>

        {/* next drop */}
        <Card delay={0.25}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              background:
                "repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 4px)",
            }}
          />
          <p className="mb-2 font-mono text-[11px] tracking-[0.2em] text-fog">NEXT DROP</p>
          <p className="font-display text-4xl text-fog">???</p>
          <p className="mt-2 font-mono text-[12px] text-fog">???.notcool.in</p>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            Currently a hallucination in a notes app. The wall always wins eventually.
          </p>
          <a
            href="https://github.com/anukulpandey/notcool.in/issues"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="mt-4 inline-block font-mono text-[12px] text-acid hover:underline"
          >
            pitch an uncool idea →
          </a>
        </Card>
      </div>
    </section>
  );
}
