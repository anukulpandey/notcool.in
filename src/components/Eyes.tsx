"use client";

import { useEffect, useRef } from "react";

type EyesProps = {
  /** tailwind sizing for each eyeball, e.g. "h-5 w-5" or "h-[0.78em] w-[0.78em]" */
  eyeClass?: string;
  className?: string;
  gapClass?: string;
};

/**
 * The signature notcool.in googly eyes. They follow the cursor,
 * blink occasionally, and wander off when you stop moving.
 */
export default function Eyes({
  eyeClass = "h-5 w-5",
  className = "",
  gapClass = "gap-[0.08em]",
}: EyesProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pupils = Array.from(root.querySelectorAll<SVGGElement>("g[data-pupil]"));
    if (reduce || pupils.length === 0) return;

    let raf = 0;
    let mx = innerWidth / 2;
    let my = innerHeight / 3;
    let lastMove = 0;
    let lastFrame = 0;
    const wander = { x: mx, y: my, tx: mx, ty: my, next: 0 };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
    };
    addEventListener("pointermove", onMove, { passive: true });

    // don't burn frames measuring eyeballs nobody can see
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(root);

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || t - lastFrame < 33) return; // ~30fps
      lastFrame = t;
      let px = mx;
      let py = my;
      // idle? let the eyes get bored and look around on their own
      if (performance.now() - lastMove > 2600) {
        if (t > wander.next) {
          wander.tx = Math.random() * innerWidth;
          wander.ty = Math.random() * innerHeight;
          wander.next = t + 1400 + Math.random() * 1800;
        }
        wander.x += (wander.tx - wander.x) * 0.03;
        wander.y += (wander.ty - wander.y) * 0.03;
        px = wander.x;
        py = wander.y;
      }
      for (const pupil of pupils) {
        const svg = pupil.ownerSVGElement;
        if (!svg) continue;
        const r = svg.getBoundingClientRect();
        if (r.width === 0) continue;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const ang = Math.atan2(py - cy, px - cx);
        const dist = Math.min(Math.hypot(px - cx, py - cy) / 4, 20);
        pupil.style.transform = `translate(${(Math.cos(ang) * dist).toFixed(1)}px, ${(
          Math.sin(ang) * dist
        ).toFixed(1)}px)`;
      }
    };
    raf = requestAnimationFrame(loop);

    // blink like a normal pair of disembodied eyeballs
    const blinkTimer = setInterval(() => {
      const svgs = root.querySelectorAll<SVGSVGElement>("svg");
      svgs.forEach((svg, i) => {
        setTimeout(() => {
          svg.style.transform = "scaleY(0.06)";
          setTimeout(() => (svg.style.transform = ""), 110);
        }, i * 40);
      });
    }, 3800 + Math.random() * 1600);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(blinkTimer);
      io.disconnect();
      removeEventListener("pointermove", onMove);
    };
  }, []);

  const eye = (
    <svg
      viewBox="0 0 100 100"
      className={`eye-svg block ${eyeClass} transition-transform duration-100`}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" fill="var(--color-paper)" />
      <g data-pupil style={{ transition: "transform 80ms linear" }}>
        <circle cx="50" cy="50" r="21" fill="var(--color-void)" />
        <circle cx="42" cy="42" r="7" fill="var(--color-acid)" />
      </g>
    </svg>
  );

  return (
    <span ref={rootRef} className={`inline-flex items-center ${gapClass} ${className}`} aria-hidden="true">
      {eye}
      {eye}
    </span>
  );
}
