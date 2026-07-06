"use client";

import { useEffect, useRef } from "react";

/**
 * The void is not empty. Little glowing eye-pairs lurk in the dark at
 * different depths — they blink, they watch your cursor, and if you chase
 * them they snap shut and reappear somewhere else. One huge, very dim pair
 * occasionally opens deep in the background.
 *
 * Canvas 2D, ~30fps, pauses offscreen, static under reduced motion.
 */

const TINTS = [
  { rgb: "244,244,239", w: 0.62 }, // paper
  { rgb: "200,255,46", w: 0.2 }, // acid
  { rgb: "34,211,238", w: 0.12 }, // cyan
  { rgb: "139,92,246", w: 0.06 }, // violet
];

function pickTint() {
  let r = Math.random();
  for (const t of TINTS) {
    if (r < t.w) return t.rgb;
    r -= t.w;
  }
  return TINTS[0].rgb;
}

type Pair = {
  x: number; // relative 0..1
  y: number;
  depth: number; // 0 far … 1 near
  r: number; // eye radius, css px
  rgb: string;
  alpha: number;
  open: number; // 0 closed … 1 open
  target: number;
  nextBlink: number;
  phase: number; // bob phase
  lookX: number;
  lookY: number;
  hidden: boolean;
  hiddenUntil: number;
  scaredSince: number;
  big: boolean;
  bigNextShow: number;
};

export default function EyesInTheDark({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0; // css px
    let H = 0;
    let dpr = 1;

    // ---- spawn logic ---------------------------------------------------

    // keep clear of the wordmark/copy: on desktop the text owns the left
    // ~58%, on mobile it owns the middle band
    const spawnPoint = () => {
      if (W < 768) {
        return Math.random() < 0.72
          ? { x: 0.06 + Math.random() * 0.88, y: 0.74 + Math.random() * 0.2 }
          : { x: 0.52 + Math.random() * 0.42, y: 0.045 + Math.random() * 0.06 };
      }
      return { x: 0.6 + Math.random() * 0.36, y: 0.08 + Math.random() * 0.84 };
    };

    const pairs: Pair[] = [];

    const farEnough = (x: number, y: number, r: number) =>
      pairs.every((p) => {
        const dx = (p.x - x) * W;
        const dy = (p.y - y) * H;
        return Math.hypot(dx, dy) > (p.r + r) * 4.2 + 26;
      });

    const makePair = (big = false): Pair => {
      const depth = big ? 0.12 : 0.15 + Math.random() * 0.85;
      const r = big ? 64 : 4.5 + depth * 13;
      let pt = spawnPoint();
      for (let i = 0; i < 24; i++) {
        if (farEnough(pt.x, pt.y, r)) break;
        pt = spawnPoint();
      }
      return {
        x: pt.x,
        y: pt.y,
        depth,
        r,
        rgb: big ? "244,244,239" : pickTint(),
        alpha: big ? 0.12 : 0.16 + depth * 0.5,
        open: 0,
        target: big ? 0 : 1,
        nextBlink: performance.now() + 1500 + Math.random() * 5000,
        phase: Math.random() * Math.PI * 2,
        lookX: 0,
        lookY: 0,
        hidden: false,
        hiddenUntil: 0,
        scaredSince: 0,
        big,
        bigNextShow: performance.now() + 6000 + Math.random() * 14000,
      };
    };

    const populate = () => {
      pairs.length = 0;
      const n = W < 768 ? 9 : 16;
      for (let i = 0; i < n; i++) pairs.push(makePair());
      if (W >= 768) pairs.push(makePair(true)); // the big one
    };

    // ---- input ----------------------------------------------------------

    let mx = -9999;
    let my = -9999;
    let lastMove = 0;
    const wander = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4, next: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      lastMove = performance.now();
    };
    addEventListener("pointermove", onMove, { passive: true });

    // ---- sizing ---------------------------------------------------------

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (pairs.length === 0) populate();
      draw(performance.now()); // canvas resize clears the buffer — repaint now
    };
    addEventListener("resize", resize);

    // ---- update + draw ---------------------------------------------------

    const update = (t: number) => {
      // idle cursor? aim at a slow wander target so the eyes stay alive
      let aimX = mx;
      let aimY = my;
      if (t - lastMove > 3200 || mx < -999) {
        if (t > wander.next) {
          wander.tx = Math.random();
          wander.ty = Math.random();
          wander.next = t + 2200 + Math.random() * 2600;
        }
        wander.x += (wander.tx - wander.x) * 0.02;
        wander.y += (wander.ty - wander.y) * 0.02;
        aimX = wander.x * W;
        aimY = wander.y * H;
      }

      for (const p of pairs) {
        const cx = p.x * W;
        const cy = p.y * H;

        if (p.big) {
          // the big lurker: slow open, long stare, slow close, long sleep
          if (p.hidden && t > p.bigNextShow) {
            p.hidden = false;
            p.target = 1;
          }
          if (!p.hidden && p.open > 0.98 && p.target === 1 && t > p.nextBlink) {
            p.target = 0; // done staring, sink back
            p.bigNextShow = t + 12000 + Math.random() * 20000;
            p.nextBlink = t + 8000 + Math.random() * 6000;
          }
          if (!p.hidden && p.open < 0.02 && p.target === 0) {
            p.hidden = true;
            const pt = spawnPoint();
            p.x = pt.x;
            p.y = pt.y;
          }
          if (!p.hidden && p.target === 1 && p.open > 0.9 && p.nextBlink < t) {
            p.nextBlink = t + 8000 + Math.random() * 6000;
          }
          p.open += (p.target - p.open) * 0.025; // slow, deliberate
        } else {
          // respawn after hiding
          if (p.hidden) {
            if (t > p.hiddenUntil) {
              const pt = spawnPoint();
              p.x = pt.x;
              p.y = pt.y;
              p.hidden = false;
              p.target = 1;
              p.nextBlink = t + 2000 + Math.random() * 4000;
            }
          } else {
            // scared of the cursor
            const d = Math.hypot(mx - cx, my - cy);
            const scareR = p.r * 5 + 70;
            if (d < scareR && t - lastMove < 3000) {
              p.target = 0;
              if (!p.scaredSince) p.scaredSince = t;
              if (p.open < 0.05 && t - p.scaredSince > 500) {
                // gone. reappears elsewhere.
                p.hidden = true;
                p.hiddenUntil = t + 900 + Math.random() * 2400;
                p.scaredSince = 0;
              }
            } else {
              p.scaredSince = 0;
              // blink now and then
              if (t > p.nextBlink) {
                p.target = 0;
                if (p.open < 0.08) {
                  p.target = 1;
                  p.nextBlink = t + 2600 + Math.random() * 5200;
                }
              } else {
                p.target = 1;
              }
            }
            p.open += (p.target - p.open) * 0.28;
          }
        }

        // pupils track the cursor (or the wander target)
        const ang = Math.atan2(aimY - cy, aimX - cx);
        const pull = Math.min(Math.hypot(aimX - cx, aimY - cy) / 300, 1);
        p.lookX += (Math.cos(ang) * pull - p.lookX) * 0.07;
        p.lookY += (Math.sin(ang) * pull - p.lookY) * 0.07;
      }
    };

    const drawEye = (ex: number, ey: number, p: Pair) => {
      const { r, rgb, alpha } = p;
      const open = Math.max(p.open, 0);
      if (open < 0.01) return;

      // soft glow
      const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, r * 2.6);
      glow.addColorStop(0, `rgba(${rgb},${(alpha * 0.3 * open).toFixed(3)})`);
      glow.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // sclera (lids close by squashing vertically)
      ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(ex, ey, r, r * open, 0, 0, Math.PI * 2);
      ctx.fill();

      // pupil + glint, clipped to the sclera
      if (open > 0.18) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(ex, ey, r, r * open, 0, 0, Math.PI * 2);
        ctx.clip();
        const px = ex + p.lookX * r * 0.34;
        const py = ey + p.lookY * r * 0.34 * open;
        ctx.fillStyle = `rgba(5,5,8,${Math.min(1, alpha + 0.25).toFixed(3)})`;
        ctx.beginPath();
        ctx.ellipse(px, py, r * 0.46, r * 0.46 * Math.min(1, open + 0.2), 0, 0, Math.PI * 2);
        ctx.fill();
        if (open > 0.35) {
          const glint = p.rgb === "200,255,46" ? "244,244,239" : "200,255,46";
          ctx.fillStyle = `rgba(${glint},${(alpha * 0.95).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px - r * 0.16, py - r * 0.16, Math.max(0.8, r * 0.12), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      // far → near
      const sorted = [...pairs].sort((a, b) => a.depth - b.depth);
      for (const p of sorted) {
        if (p.hidden && !p.big) continue;
        const bob = Math.sin(t * 0.0006 + p.phase) * (2.5 + p.depth * 3.5);
        // slight parallax toward the cursor
        const par = p.depth * 10;
        const ox = mx > -999 ? ((mx - W / 2) / W) * par : 0;
        const oy = my > -999 ? ((my - H / 2) / H) * par : 0;
        const cx = p.x * W + ox;
        const cy = p.y * H + bob + oy;
        const gap = p.r * 1.24;
        drawEye(cx - gap, cy, p);
        drawEye(cx + gap, cy, p);
      }
    };

    // ---- loop -----------------------------------------------------------

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
      update(t);
      draw(t);
    };

    resize();
    if (reduce) {
      // static frame: everything calmly open, nobody moves
      for (const p of pairs) p.open = p.big ? 0 : 1;
      draw(performance.now());
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
