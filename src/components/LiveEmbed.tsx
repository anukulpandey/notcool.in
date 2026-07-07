"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

// render the site at a real desktop size, then CSS-scale it down to fit the
// card — so embedded apps use their desktop layout instead of collapsing to
// mobile inside a narrow frame
const DESIGN_W = 1440;
const DESIGN_H = 900;

/**
 * A live, scaled-down iframe preview of a project, backed by its screenshot.
 *
 * - poster screenshot paints instantly (no layout shift, no blank frame)
 * - the iframe only mounts once the card nears the viewport (lazy — three
 *   full apps is a lot; sarae alone loads a face-mesh model)
 * - once loaded it cross-fades over the poster; if it's blocked or never
 *   loads, the poster stays — nothing breaks
 * - pointer-events are off so page-scroll stays smooth and the whole card
 *   remains a single click target to open the real site
 * - reduced-motion users keep the static screenshot
 */
export default function LiveEmbed({ project }: { project: Project }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [scale, setScale] = useState(0);

  // lazy-mount the iframe when the card is within ~400px of the viewport
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // poster only
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // keep the fixed-size iframe scaled to exactly fill the card width
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / DESIGN_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // if the frame never loads (e.g. a future site sends X-Frame-Options),
  // fall back to the poster rather than showing a blank box forever
  useEffect(() => {
    if (!mount || loaded) return;
    const t = setTimeout(() => setFailed((f) => (loaded ? f : true)), 9000);
    return () => clearTimeout(t);
  }, [mount, loaded]);

  const showLive = loaded && !failed;

  return (
    <div ref={boxRef} className="relative aspect-[1440/900] overflow-hidden bg-ink-2">
      {/* poster: instant, and the fallback if the embed can't load */}
      <Image
        src={project.screenshot}
        alt={`${project.name} — ${project.tagline}`}
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className={`object-cover object-top transition-opacity duration-700 ${
          showLive ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* live embed */}
      {mount && !failed && scale > 0 && (
        <iframe
          src={project.url}
          title={`live preview of ${project.name}`}
          loading="lazy"
          // our own subdomains; allow-same-origin lets the apps run normally.
          // no camera/mic in allow=… → sarae's try-on shows its idle state
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          referrerPolicy="no-referrer"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className={`pointer-events-none absolute left-0 top-0 border-0 transition-opacity duration-700 ${
            showLive ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* little "live" tag once the real thing is showing */}
      <span
        aria-hidden
        className={`absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full border border-line/70 bg-void/70 px-2.5 py-1 font-mono text-[10px] tracking-wider backdrop-blur transition-opacity duration-500 ${
          showLive ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-emerald-400">live</span>
      </span>
    </div>
  );
}
