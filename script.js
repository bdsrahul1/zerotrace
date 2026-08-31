/* ============================================================
   ZERO TRACE — interactions
   1. Vortex particle field (canvas) — blue/amber galactic swirl
   2. Scroll progress bar
   3. Reveal-on-scroll (IntersectionObserver)
   4. Evidence-orbit node readout
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Vortex particle field ---------- */
  const canvas = document.getElementById("vortex");
  const ctx = canvas.getContext("2d");
  let w, h, cx, cy, particles = [], dpr = Math.min(window.devicePixelRatio || 1, 2);

  const COLORS = ["#3d8bff", "#67a8ff", "#e2a63c", "#f3c76b", "#cdd8ff"];

  // pointer state (canvas px), gravity center lerps toward it
  let pointerX = null, pointerY = null, gx = 0, gy = 0;

  function resize() {
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    cx = w / 2;
    cy = h / 2;
    seed();
  }

  function seed() {
    const count = Math.min(260, Math.floor((innerWidth * innerHeight) / 7000));
    particles = [];
    for (let i = 0; i < count; i++) {
      const r = (Math.random() ** 0.6) * Math.min(w, h) * 0.55;
      const a = Math.random() * Math.PI * 2;
      particles.push({
        r,
        a,
        speed: (0.00016 + Math.random() * 0.00042) * (r < Math.min(w, h) * 0.28 ? 1.7 : 1),
        size: (Math.random() * 1.6 + 0.4) * dpr,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        tw: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.15,
      });
    }
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);

    // gravity center drifts toward the pointer, else recenters
    const tgx = pointerX == null ? cx : pointerX;
    const tgy = pointerY == null ? cy : pointerY;
    gx += (tgx - (cx + gx)) * 0.04;
    gy += (tgy - (cy + gy)) * 0.04;
    const dcx = cx + gx * 0.6;
    const dcy = cy + gy * 0.6;

    // scroll pushes the camera in — particles brighten & spread
    const push = 1 + Math.min(scrollY / innerHeight, 3) * 0.14;

    const g = ctx.createRadialGradient(dcx, dcy, 0, dcx, dcy, Math.min(w, h) * 0.5);
    g.addColorStop(0, "rgba(61,139,255,0.10)");
    g.addColorStop(0.5, "rgba(226,166,60,0.05)");
    g.addColorStop(1, "rgba(5,7,13,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (const p of particles) {
      p.a += p.speed;
      const r = p.r * push;
      const x = dcx + Math.cos(p.a) * r;
      const y = dcy + Math.sin(p.a) * r * 0.62; // elliptical tilt
      const tw = 0.55 + Math.sin(t * 0.002 + p.tw) * 0.45;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = tw * 0.8;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  addEventListener("resize", resize, { passive: true });
  resize();
  if (reduceMotion) {
    frame(0); // single static paint
  } else {
    requestAnimationFrame(frame);
  }

  /* ---------- 2. Scroll progress ---------- */
  const bar = document.getElementById("scrollBar");
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    bar.style.width = pct + "%";
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const title = e.target.matches(".section-title")
          ? e.target
          : e.target.querySelector(".section-title, .end-title");
        if (e.isIntersecting) {
          e.target.classList.add("in");
          if (title) decrypt(title);            // re-run every time it enters view
        }
      });
    },
    { threshold: 0.16 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- decrypt / scramble text ---------- */
  const GLYPHS = "ABCDEF0123456789#%$&/<>*=+";
  function decrypt(el) {
    if (reduceMotion) return;
    // stop any in-flight scramble on this element before restarting
    if (el._decryptIds) el._decryptIds.forEach(clearInterval);
    el._decryptIds = [];
    const textNodes = [];
    (function walk(n) {
      n.childNodes.forEach((c) => {
        if (c.nodeType === 3 && (c._final || c.textContent.trim())) textNodes.push(c);
        else if (c.nodeType === 1) walk(c);
      });
    })(el);
    textNodes.forEach((tn) => {
      const final = tn._final || (tn._final = tn.textContent); // remember original
      const len = final.length;
      let f = 0;
      const step = Math.max(1, len / 22);
      const id = setInterval(() => {
        let out = "";
        for (let i = 0; i < len; i++) {
          if (final[i] === " ") { out += " "; continue; }
          out += i < f ? final[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        tn.textContent = out;
        f += step;
        if (f >= len) { clearInterval(id); tn.textContent = final; }
      }, 30);
      el._decryptIds.push(id);
    });
  }

  /* ---------- 4. Evidence-orbit readout ---------- */
  const detail = document.getElementById("orbitDetail");
  const nodes = document.querySelectorAll(".node");
  nodes.forEach((n) => {
    const show = () => {
      nodes.forEach((x) => x.classList.remove("active"));
      n.classList.add("active");
      detail.textContent = n.dataset.info || "";
    };
    n.addEventListener("mouseenter", show);
    n.addEventListener("focus", show);
    n.addEventListener("click", show);
  });

  /* ---------- 5. Research category filter ---------- */
  const filters = document.querySelectorAll(".filter");
  const cases = document.querySelectorAll(".case");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      cases.forEach((c) => {
        const match = cat === "all" || c.dataset.cat === cat;
        c.classList.toggle("hide", !match);
      });
    });
  });

  /* ---------- 6. Pointer: vortex gravity, cursor glow, parallax ---------- */
  const glow = document.getElementById("cursorGlow");
  const heroFig = document.querySelector(".hero-figure");
  const heroCopy = document.querySelector(".hero-copy");
  addEventListener("pointermove", (e) => {
    pointerX = e.clientX * dpr;
    pointerY = e.clientY * dpr;
    if (glow) {
      glow.style.opacity = "1";
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
    if (!reduceMotion) {
      const nx = (e.clientX / innerWidth - 0.5);
      const ny = (e.clientY / innerHeight - 0.5);
      if (heroFig) heroFig.style.transform = `translate(${nx * 22}px, ${ny * 18}px)`;
      if (heroCopy) heroCopy.style.transform = `translate(${nx * -10}px, ${ny * -8}px)`;
    }
  }, { passive: true });
  addEventListener("pointerleave", () => { pointerX = pointerY = null; });

  /* ---------- 7. Cinematic boot intro ---------- */
  const intro = document.getElementById("intro");
  const heroTitle = document.querySelector(".hero-title");
  let introDone = false;
  function endIntro() {
    if (introDone || !intro) return;
    introDone = true;
    intro.classList.add("done");
    if (heroTitle) setTimeout(() => decrypt(heroTitle), 350);
    setTimeout(() => intro.remove(), 1000);
  }
  if (intro) {
    if (reduceMotion) { endIntro(); }
    else {
      const auto = setTimeout(endIntro, 3200);
      intro.addEventListener("click", () => { clearTimeout(auto); endIntro(); });
      addEventListener("wheel", () => { clearTimeout(auto); endIntro(); }, { once: true, passive: true });
    }
  }
})();
