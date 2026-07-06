"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Custom cursor: acid dot + lazy trailing ring that flares on interactive elements. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const onMove = (e: PointerEvent) => {
      // touchscreen laptops pass the fine-pointer media query but still
      // send touch pointermoves — don't strand the dot at a tap point
      if (e.pointerType === "touch") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!document.documentElement.classList.contains("custom-cursor")) {
        document.documentElement.classList.add("custom-cursor");
        setEnabled(true);
      }
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = e.target as HTMLElement;
      setHovering(!!el.closest?.("a, button, [data-hover]"));
    };
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerover", onOver, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerover", onOver);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* framer's inline transform replaces Tailwind translate classes,
          so center via negative margins instead */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 rounded-full bg-acid"
        style={{ x, y, marginLeft: -4, marginTop: -4 }}
      />
      <motion.div
        aria-hidden
        animate={{
          // scale is compositor-only; animating width/height forces layout
          scale: hovering ? 1 : 0.6,
          backgroundColor: hovering ? "rgba(200,255,46,0.12)" : "rgba(200,255,46,0)",
        }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-14 w-14 rounded-full border-[1.5px] border-acid/60"
        style={{ x: ringX, y: ringY, marginLeft: -28, marginTop: -28 }}
      />
    </>
  );
}
