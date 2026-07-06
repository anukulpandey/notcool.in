"use client";

import { useEffect, useRef } from "react";

/**
 * Minimal hero background: a barely-there dot grid on pure black, with a
 * soft light that follows the cursor and gently brightens nearby dots —
 * a flashlight over graph paper. Drifts on its own when the cursor idles.
 *
 * Canvas 2D, ~30fps, base grid cached offscreen, pauses offscreen,
 * static under reduced motion.
 */

const SPACING = 30; // px between dots
const BASE_ALPHA = 0.07; // resting dot brightness
const LIGHT_R = 300; // spotlight radius, px
const BOOST = 0.4; // max added brightness at the light's center

export default function VoidGrid({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let base: HTMLCanvasElement | null = null;

    // light position (lerped) + cursor target
    let lx = -9999;
    let ly = -9999;
    let tx = -9999;
    let ty = -9999;
    let lastMove = 0;
    const wander = { x: 0.7, y: 0.45, nx: 0.7, ny: 0.45, next: 0 };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (lx < -999) {
        lx = tx;
        ly = ty;
      }
      lastMove = performance.now();
    };
    addEventListener("pointermove", onMove, { passive: true });

    // render the resting grid once — per frame we just blit it
    const renderBase = () => {
      base = document.createElement("canvas");
      base.width = canvas.width;
      base.height = canvas.height;
      const bctx = base.getContext("2d")!;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.fillStyle = `rgba(244,244,239,${BASE_ALPHA})`;
      for (let y = SPACING / 2; y < H; y += SPACING) {
        for (let x = SPACING / 2; x < W; x += SPACING) {
          bctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
        }
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      if (base) ctx.drawImage(base, 0, 0, W, H);
      if (lx < -999) return;

      // only touch dots inside the spotlight
      const x0 = Math.max(SPACING / 2, Math.floor((lx - LIGHT_R) / SPACING) * SPACING + SPACING / 2);
      const y0 = Math.max(SPACING / 2, Math.floor((ly - LIGHT_R) / SPACING) * SPACING + SPACING / 2);
      const breathe = 1 + Math.sin(t * 0.0012) * 0.06; // the light gently breathes
      const r = LIGHT_R * breathe;

      for (let y = y0; y < Math.min(H, ly + r); y += SPACING) {
        for (let x = x0; x < Math.min(W, lx + r); x += SPACING) {
          const d = Math.hypot(x - lx, y - ly);
          if (d >= r) continue;
          const k = 1 - d / r; // 0 edge … 1 center
          const ease = k * k * (3 - 2 * k); // smoothstep
          const a = BASE_ALPHA + BOOST * ease;
          // a hint of acid right at the heart of the light
          const g = 244 + (255 - 244) * ease * 0.5;
          const b = 239 - (239 - 46) * ease * 0.25;
          const s = 1.5 + ease * 1.3;
          ctx.fillStyle = `rgba(244,${g.toFixed(0)},${b.toFixed(0)},${a.toFixed(3)})`;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
    };

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderBase();
      draw(performance.now()); // resize clears the buffer — repaint now
    };
    addEventListener("resize", resize);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(canvas);

    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (t - last < 33) return; // ~30fps
      last = t;

      // idle cursor? drift the light on its own so the page stays alive
      if (t - lastMove > 3500 || tx < -999) {
        if (t > wander.next) {
          wander.nx = 0.15 + Math.random() * 0.7;
          wander.ny = 0.15 + Math.random() * 0.7;
          wander.next = t + 3200 + Math.random() * 3000;
        }
        wander.x += (wander.nx - wander.x) * 0.008;
        wander.y += (wander.ny - wander.y) * 0.008;
        tx = wander.x * W;
        ty = wander.y * H;
        if (lx < -999) {
          lx = tx;
          ly = ty;
        }
      }

      lx += (tx - lx) * 0.09;
      ly += (ty - ly) * 0.09;
      draw(t);
    };

    resize();
    if (reduce) {
      // static: grid + one fixed pool of light, no motion
      lx = W * 0.72;
      ly = H * 0.4;
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
