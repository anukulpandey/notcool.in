"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";

/** Lenis smooth scrolling + smooth anchor navigation. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.11 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      // leave modifier-clicks (open in new tab etc.) to the browser
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return;
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector<HTMLElement>(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72, duration: 1.4 });
        // keep the URL shareable and hand keyboard focus to the section
        history.pushState(null, "", href);
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  // reducedMotion="user" nulls transform/layout animations under
  // prefers-reduced-motion while keeping opacity fades
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
