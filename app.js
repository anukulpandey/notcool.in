/* ============================================================
   notcool.in — interactions
   everything here is handmade. no libraries were harmed.
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- boot splash ---------- */

  const boot = document.getElementById("boot");
  const bootText = document.getElementById("bootText");
  const bootLines = ["not loading…", "jk, almost there", "certified uncool ✓"];
  if (reduceMotion || sessionStorage.getItem("booted")) {
    boot.classList.add("done");
  } else {
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      if (i < bootLines.length) bootText.textContent = bootLines[i];
    }, 320);
    setTimeout(() => {
      clearInterval(tick);
      boot.classList.add("done");
      sessionStorage.setItem("booted", "1");
    }, 1000);
  }

  /* ---------- custom cursor ---------- */

  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  let mx = innerWidth / 2, my = innerHeight / 2;   // raw mouse
  let rx = mx, ry = my;                             // ring (lerped)
  let cursorLive = false;

  if (finePointer && !reduceMotion) {
    addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!cursorLive) {
        cursorLive = true;
        document.body.classList.add("cursor-on");
      }
    }, { passive: true });

    document.querySelectorAll("[data-hover]").forEach((el) => {
      el.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
    });

    (function cursorLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(cursorLoop);
    })();
  }

  /* ---------- the eyes (svg tracking, literally) ---------- */

  const eyes = [...document.querySelectorAll(".eye")];
  let lastPointerAt = 0;
  let wander = { x: innerWidth / 2, y: innerHeight / 3, tx: 0, ty: 0, next: 0 };

  addEventListener("pointermove", () => { lastPointerAt = performance.now(); }, { passive: true });

  function aimEyes(px, py) {
    for (const eye of eyes) {
      const pupil = eye.querySelector(".pupil");
      if (!pupil) continue;
      const r = eye.getBoundingClientRect();
      if (r.width === 0) continue;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ang = Math.atan2(py - cy, px - cx);
      const dist = Math.min(Math.hypot(px - cx, py - cy) / 4, 20); // viewBox units, max 20
      pupil.style.transform =
        `translate(${(Math.cos(ang) * dist).toFixed(1)}px, ${(Math.sin(ang) * dist).toFixed(1)}px)`;
    }
  }

  if (!reduceMotion) {
    (function eyeLoop(t) {
      // if the pointer has been idle (or doesn't exist), let the eyes wander
      if (performance.now() - lastPointerAt > 2600) {
        if (t > wander.next) {
          wander.tx = Math.random() * innerWidth;
          wander.ty = Math.random() * innerHeight;
          wander.next = t + 1400 + Math.random() * 1800;
        }
        wander.x += (wander.tx - wander.x) * 0.03;
        wander.y += (wander.ty - wander.y) * 0.03;
        aimEyes(wander.x, wander.y);
      } else {
        aimEyes(mx, my);
      }
      requestAnimationFrame(eyeLoop);
    })(0);

    // blink, like a normal pair of disembodied eyes
    setInterval(() => {
      eyes.forEach((eye, i) => {
        setTimeout(() => {
          eye.classList.add("blink");
          setTimeout(() => eye.classList.remove("blink"), 220);
        }, i % 2 === 0 ? 0 : 40);
      });
    }, 3800 + Math.random() * 1500);
  }

  /* ---------- particle field ---------- */

  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");
  let W, H, dpr, dots = [];

  function sizeField() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.min(110, Math.floor(innerWidth * innerHeight / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      vy: (Math.random() - 0.5) * 0.18 * dpr,
      r: (Math.random() * 1.3 + 0.6) * dpr,
    }));
  }
  sizeField();
  addEventListener("resize", sizeField);

  const LINK = 130;
  function drawField() {
    ctx.clearRect(0, 0, W, H);
    const pmx = mx * dpr, pmy = my * dpr;

    for (const d of dots) {
      // gentle drift + soft mouse repulsion
      const dx = d.x - pmx, dy = d.y - pmy;
      const dist2 = dx * dx + dy * dy;
      if (cursorLive && dist2 < (140 * dpr) ** 2 && dist2 > 0.01) {
        const f = (140 * dpr - Math.sqrt(dist2)) / (140 * dpr) * 0.03;
        d.vx += dx * f * 0.01;
        d.vy += dy * f * 0.01;
      }
      d.vx *= 0.995; d.vy *= 0.995;
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(242,242,239,0.34)";
      ctx.fill();
    }

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        const max = LINK * dpr;
        if (d2 < max * max) {
          const alpha = (1 - Math.sqrt(d2) / max) * 0.13;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(198,255,62,${alpha.toFixed(3)})`;
          ctx.lineWidth = dpr * 0.7;
          ctx.stroke();
        }
      }
    }
  }

  if (!reduceMotion) {
    (function fieldLoop() {
      if (!document.hidden) drawField();
      requestAnimationFrame(fieldLoop);
    })();
  } else {
    drawField(); // one static frame
  }

  /* ---------- scramble text ---------- */

  const GLYPHS = "!<>-_\\/[]{}—=+*^?#";
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const original = el.textContent;
    let frame = null;
    el.addEventListener("pointerenter", () => {
      if (reduceMotion) return;
      let i = 0;
      cancelAnimationFrame(frame);
      (function step() {
        i += 1.4;
        el.textContent = original
          .split("")
          .map((ch, idx) => {
            if (ch === " " || ch === " ") return ch;
            if (idx < i) return original[idx];
            return GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join("");
        if (i < original.length) frame = requestAnimationFrame(step);
        else el.textContent = original;
      })();
    });
  });

  /* ---------- card tilt + glare ---------- */

  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", ((px - 0.5) * 7).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - py) * 7).toFixed(2) + "deg");
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- magnetic buttons ---------- */

  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      const inner = btn.querySelector("span");
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
        if (inner) inner.style.transform = `translate(${dx * 0.1}px, ${dy * 0.1}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
        if (inner) inner.style.transform = "";
      });
    });
  }

  /* ---------- scroll reveals ---------- */

  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- live status pings ---------- */

  const pingCards = [...document.querySelectorAll("[data-ping]")];
  let liveCount = 0;
  const statLive = document.getElementById("statLive");

  pingCards.forEach((card) => {
    const url = card.dataset.ping;
    const label = card.querySelector(".status-text");
    const t0 = performance.now();
    const timeout = new Promise((_, rej) => setTimeout(rej, 7000));

    Promise.race([fetch(url, { mode: "no-cors", cache: "no-store" }), timeout])
      .then(() => {
        const ms = Math.max(1, Math.round(performance.now() - t0));
        card.classList.add("is-live");
        label.textContent = `alive · ${ms}ms`;
        liveCount += 1;
        statLive.textContent = liveCount;
      })
      .catch(() => {
        card.classList.add("is-down");
        label.textContent = "unreachable (probably my fault)";
        statLive.textContent = liveCount;
      });
  });

  /* ---------- click sparks ---------- */

  if (!reduceMotion) {
    addEventListener("pointerdown", (e) => {
      for (let i = 0; i < 7; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.textContent = "✦";
        const ang = (Math.PI * 2 * i) / 7 + Math.random();
        const d = 30 + Math.random() * 50;
        s.style.left = e.clientX + "px";
        s.style.top = e.clientY + "px";
        s.style.setProperty("--sx", Math.cos(ang) * d + "px");
        s.style.setProperty("--sy", Math.sin(ang) * d + "px");
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 750);
      }
    }, { passive: true });
  }

  /* ---------- konami / disco ---------- */

  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  addEventListener("keydown", (e) => {
    kIdx = e.key === KONAMI[kIdx] ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) {
      kIdx = 0;
      toggleDisco();
    }
  });
  document.getElementById("discoBtn").addEventListener("click", toggleDisco);

  function toggleDisco() {
    document.body.classList.toggle("disco");
    const on = document.body.classList.contains("disco");
    document.getElementById("discoBtn").textContent = on ? "ok stop ✦" : "do not press ✦";
  }

  /* ---------- misc ---------- */

  document.getElementById("year").textContent = new Date().getFullYear();

  console.log(
    "%c👀 the eyes saw you open devtools.",
    "font-size:16px; color:#c6ff3e; font-family:monospace;"
  );
  console.log(
    "%csource: https://github.com/anukulpandey/notcool.in — PRs of uncool ideas welcome.",
    "color:#8d8d97; font-family:monospace;"
  );
})();
