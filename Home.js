/**
 * KonnCafe — Home.js  (v2 — Brand Guide Aligned)
 * "Modern Diaspora Minimalist" Landing Page
 *
 * Changes v2:
 *  - Real product image: /images/bag-konncafe-v0.png  (copy the PNG to /public/images/)
 *  - Price: $13.99
 *  - Phone: +1 (203) 626-4931
 *  - Brand Guide §6 copy applied verbatim
 *  - Interactive Coffee-Bean Snake Game section
 *
 * Framework : Next.js (Pages Router) — also works standalone with React
 * Styling   : Tailwind CSS (requires tailwind.config.js with KonnCafe theme)
 * Fonts     : Bebas Neue + Lato via Google Fonts
 *
 * [LEGAL] compliance notes are annotated inline
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";

/* ─── FONT LOADER ───────────────────────────────────────────────────────── */
const FontLoader = () => (
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&display=swap" rel="stylesheet" />
  </Head>
);

/* ─── INTERSECTION OBSERVER HOOK ────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── SHARED STYLE TOKENS ───────────────────────────────────────────────── */
const S = {
  heading: "font-['Bebas_Neue'] uppercase tracking-[0.04em]",
  body:    "font-['Lato'] text-[16px] leading-[1.7]",
  min:     "font-['Lato'] text-[14px] leading-[1.6]",
  rule:    "h-px w-full bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent",
  reveal:  "transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
  hidden:  "opacity-0 translate-y-8",
  shown:   "opacity-100 translate-y-0",
};

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────── */
const GoldRule = ({ className = "" }) => (
  <div className={`${S.rule} ${className}`} aria-hidden="true" />
);

const DiamondSep = () => (
  <span className="text-[#C8A97E] mx-3 text-[9px]" aria-hidden="true">◆</span>
);

const RevealSection = ({ children, className = "", delay = 0 }) => {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`${S.reveal} ${vis ? S.shown : S.hidden} ${className}`}>
      {children}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   COFFEE-BEAN SNAKE GAME
   • Snake body segments = hand-drawn coffee beans
   • Food = glowing coffee bean
   • Game-over = snake head transforms into animated KonnCafe cup
════════════════════════════════════════════════════════════════════════ */
const CELL = 22, COLS = 24, ROWS = 18;
const W = CELL * COLS, H = CELL * ROWS;
const GOLD = "#C8A97E", BEAN_DARK = "#3D1F0A", SAND = "#E8D8C4", DARK = "#111";
const DIR_MAP = {
  ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0],
  w:[0,-1], s:[0,1], a:[-1,0], d:[1,0],
};

function drawBean(ctx, cx, cy, r, angle = 0, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.54, r * 0.37, 0, 0, Math.PI * 2);
  ctx.fillStyle = BEAN_DARK;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-r * 0.1, -r * 0.09, r * 0.11, r * 0.07, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-r * 0.41, 0);
  ctx.bezierCurveTo(-r * 0.14, -r * 0.22, r * 0.14, -r * 0.22, r * 0.41, 0);
  ctx.bezierCurveTo(r * 0.14, r * 0.22, -r * 0.14, r * 0.22, -r * 0.41, 0);
  ctx.strokeStyle = "#1a0800";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawKonnCup(ctx, cx, cy, pct) {
  const h  = CELL * 3.2 * pct;
  const bw = CELL * 2.2;
  const tw = CELL * 2.8;
  ctx.save();
  ctx.globalAlpha = pct * 0.95;
  // saucer
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.52, tw * 0.6, h * 0.09, 0, 0, Math.PI * 2);
  ctx.fillStyle = SAND;
  ctx.fill();
  // body
  ctx.beginPath();
  ctx.moveTo(cx - bw / 2, cy - h * 0.42);
  ctx.lineTo(cx + bw / 2, cy - h * 0.42);
  ctx.lineTo(cx + tw / 2, cy + h * 0.38);
  ctx.lineTo(cx - tw / 2, cy + h * 0.38);
  ctx.closePath();
  ctx.fillStyle = DARK;
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  // handle
  ctx.beginPath();
  ctx.arc(cx + tw / 2 + h * 0.22, cy + h * 0.02, h * 0.22, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();
  // logo text
  const fs = Math.max(6, h * 0.21);
  ctx.font = `bold ${fs}px Bebas Neue, Impact, sans-serif`;
  ctx.fillStyle = GOLD;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("KONNCAFE", cx, cy + h * 0.02);
  // steam
  if (pct > 0.55) {
    const sp = (pct - 0.55) / 0.45;
    [-0.28, 0, 0.28].forEach(ox => {
      ctx.beginPath();
      ctx.moveTo(cx + ox * h, cy - h * 0.42);
      ctx.bezierCurveTo(cx + ox * h + h * 0.1, cy - h * 0.75, cx + ox * h - h * 0.1, cy - h, cx + ox * h, cy - h * 1.3);
      ctx.strokeStyle = `rgba(200,169,126,${sp * 0.45})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });
  }
  ctx.restore();
}

function SnakeGame() {
  const canvasRef  = useRef(null);
  const stateRef   = useRef(null);
  const rafRef     = useRef(null);
  const [score,    setScore]    = useState(0);
  const [best,     setBest]     = useState(0);
  const [over,     setOver]     = useState(false);
  const [started,  setStarted]  = useState(false);

  const rp = () => ({ x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) });

  const init = useCallback(() => ({
    snake:   [{ x:12, y:9 }, { x:11, y:9 }, { x:10, y:9 }],
    dir:     { x:1, y:0 }, nextDir: { x:1, y:0 },
    food:    rp(),
    score:   0, over: false, cupAnim: 0,
    lastTime: 0, speed: 130, accum: 0,
  }), []);

  const draw = useCallback((s) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0e0e0e";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(200,169,126,0.045)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }
    if (!s) return;

    if (s.over && s.cupAnim > 0) {
      const hd = s.snake[0];
      s.snake.forEach((seg, i) => {
        if (i === 0) return;
        drawBean(ctx, seg.x*CELL+CELL/2, seg.y*CELL+CELL/2, CELL*0.46, i*0.4, Math.max(0, 1 - s.cupAnim * 3));
      });
      drawKonnCup(ctx, hd.x*CELL+CELL/2, hd.y*CELL+CELL/2, s.cupAnim);
      return;
    }

    // Food
    const fp = s.food;
    const pulse = 0.54 + Math.sin(Date.now() * 0.006) * 0.14;
    ctx.save(); ctx.shadowColor = GOLD; ctx.shadowBlur = 14 * pulse;
    drawBean(ctx, fp.x*CELL+CELL/2, fp.y*CELL+CELL/2, CELL * 0.48 * pulse, Date.now() * 0.002);
    ctx.restore();

    // Snake
    s.snake.forEach((seg, i) => {
      drawBean(ctx, seg.x*CELL+CELL/2, seg.y*CELL+CELL/2, CELL*0.46, i*0.38, Math.max(0.42, 1-i*0.04));
      if (i === 0) {
        ctx.save(); ctx.fillStyle = GOLD;
        ctx.beginPath(); ctx.arc(seg.x*CELL+CELL/2+s.dir.x*4, seg.y*CELL+CELL/2+s.dir.y*4, 2.5, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    });

    // HUD
    ctx.font = "bold 12px 'Bebas Neue', Impact, sans-serif";
    ctx.fillStyle = GOLD; ctx.textAlign = "right"; ctx.textBaseline = "top";
    ctx.fillText(`SCORE  ${s.score}`, W-10, 8);
  }, []);

  const tick = useCallback((ts) => {
    const s = stateRef.current;
    if (!s || s.over) return;
    const dt = Math.min(ts - s.lastTime, 200);
    s.lastTime = ts;
    s.accum += dt;
    if (s.accum >= s.speed) {
      s.accum -= s.speed;
      s.dir = { ...s.nextDir };
      const hd = { x:(s.snake[0].x+s.dir.x+COLS)%COLS, y:(s.snake[0].y+s.dir.y+ROWS)%ROWS };
      if (s.snake.some(sg => sg.x===hd.x && sg.y===hd.y)) {
        s.over = true;
        setOver(true);
        setBest(p => Math.max(p, s.score));
        return;
      }
      const atFood = hd.x===s.food.x && hd.y===s.food.y;
      s.snake.unshift(hd);
      if (atFood) {
        s.score += 10; s.speed = Math.max(52, s.speed - 2);
        setScore(s.score);
        let nf; do { nf = rp(); } while (s.snake.some(sg => sg.x===nf.x && sg.y===nf.y));
        s.food = nf;
      } else { s.snake.pop(); }
    }
    draw(s);
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  // Cup animation on game-over
  useEffect(() => {
    if (!over) return;
    let t0 = null; const dur = 1900;
    const s = stateRef.current;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts-t0)/dur);
      if (s) s.cupAnim = p;
      draw(s);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [over, draw]);

  const start = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const s = init();
    s.lastTime = performance.now();
    stateRef.current = s;
    setScore(0); setOver(false); setStarted(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [init, tick]);

  // Keyboard
  useEffect(() => {
    const fn = e => {
      const d = DIR_MAP[e.key] || DIR_MAP[e.key.toLowerCase()];
      if (!d) return; e.preventDefault();
      const s = stateRef.current; if (!s) return;
      if (d[0]!==0 && s.dir.x!==0) return;
      if (d[1]!==0 && s.dir.y!==0) return;
      s.nextDir = { x:d[0], y:d[1] };
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // Touch swipe
  const t0 = useRef(null);
  const onTS = e => { t0.current = { x:e.touches[0].clientX, y:e.touches[0].clientY }; };
  const onTE = e => {
    if (!t0.current) return;
    const dx = e.changedTouches[0].clientX - t0.current.x;
    const dy = e.changedTouches[0].clientY - t0.current.y;
    const s  = stateRef.current; if (!s) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (s.dir.x!==0) return; s.nextDir = { x:dx>0?1:-1, y:0 };
    } else {
      if (s.dir.y!==0) return; s.nextDir = { x:0, y:dy>0?1:-1 };
    }
    t0.current = null;
  };

  // Idle frame
  useEffect(() => { const s = init(); s.snake=[{x:12,y:9}]; draw(s); }, [init, draw]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ border:"1px solid rgba(200,169,126,0.3)", boxShadow:"0 0 40px rgba(200,169,126,0.07)" }}
        onTouchStart={onTS} onTouchEnd={onTE}>
        <canvas ref={canvasRef} width={W} height={H} className="block max-w-full" />

        {(!started || over) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background:"rgba(10,10,10,0.82)", backdropFilter:"blur(4px)" }}>
            {over ? (
              <>
                <p className={`${S.heading} text-[38px] text-[#F5F5F5] mb-1`}>GAME OVER</p>
                <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.22em] mb-1`}>Score: {score}</p>
                <p className={`${S.min} text-[#F5F5F5]/40 uppercase tracking-[0.18em] mb-7`}>Best: {best}</p>
              </>
            ) : (
              <>
                <p className={`${S.heading} text-[30px] text-[#F5F5F5] mb-2`}>COFFEE BEAN SNAKE</p>
                <p className={`${S.min} text-[#F5F5F5]/50 uppercase tracking-[0.16em] mb-7`}>Arrow Keys · WASD · Swipe</p>
              </>
            )}
            <button onClick={start}
              className={`${S.min} uppercase tracking-[0.22em] font-bold bg-[#C8A97E] text-[#1A1A1A] px-10 py-3 hover:bg-[#DFC49A] transition-colors duration-300`}>
              {over ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
      </div>

      {started && !over && (
        <p className={`${S.min} text-[#F5F5F5]/45 uppercase tracking-[0.2em]`}>
          Score: <span className="text-[#C8A97E] font-bold">{score}</span>
          &nbsp;&nbsp;Best: <span className="text-[#F5F5F5]/60">{best}</span>
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE SECTIONS
════════════════════════════════════════════════════════════════════════ */

/* ─── HEADER ─────────────────────────────────────────────────────────── */
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[rgba(200,169,126,0.15)]" : "py-6 bg-transparent"}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
        <a href="#" aria-label="KonnCafe Home">
          <span className={`${S.heading} text-[30px] md:text-[36px] text-[#F5F5F5] hover:text-[#C8A97E] transition-colors duration-300 tracking-[0.12em]`}>KONNCAFE</span>
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {["Story","Product","Game","Roots","Contact"].map(item=>(
            <a key={item} href={`#${item.toLowerCase()}`}
              className={`${S.min} text-[#F5F5F5]/65 uppercase tracking-[0.15em] hover:text-[#C8A97E] transition-colors duration-300`}>{item}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-5">
          <a href="tel:+12036264931" className={`${S.min} text-[#C8A97E]/65 hover:text-[#C8A97E] transition-colors duration-300 tracking-[0.03em]`}>
            +1 (203) 626-4931
          </a>
          <a href="#product" className={`border border-[#C8A97E] text-[#C8A97E] ${S.min} uppercase tracking-[0.14em] px-6 py-2.5 hover:bg-[#C8A97E] hover:text-[#1A1A1A] transition-all duration-300`}>
            Shop Now
          </a>
        </div>
        <button className="md:hidden text-[#F5F5F5] hover:text-[#C8A97E] transition-colors" aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="7"  x2="21" y2="7"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="9" y1="17" x2="21" y2="17" />
          </svg>
        </button>
      </div>
    </header>
  );
};

/* ─── HERO ───────────────────────────────────────────────────────────── */
const Hero = () => (
  <section id="hero" aria-label="Hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1A1A1A]">
    <div aria-hidden="true" className="absolute inset-0"
      style={{ background:"radial-gradient(ellipse 80% 60% at 70% 40%,rgba(200,169,126,0.12) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 30% 70%,rgba(232,216,196,0.06) 0%,transparent 50%),radial-gradient(ellipse 100% 100% at 50% 50%,transparent 40%,#1A1A1A 100%)" }}
    />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.04]"
      style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:"256px 256px" }}
    />
    <div aria-hidden="true" className="absolute left-[5%] md:left-[8%] top-[20%] bottom-[20%] w-px"
      style={{ background:"linear-gradient(to bottom,transparent,rgba(200,169,126,0.4),transparent)" }}
    />
    <div className="relative z-10 text-center px-6 max-w-[900px] mx-auto">
      <div className={`mb-8 ${S.min} text-[#C8A97E] uppercase tracking-[0.35em] animate-[fadeIn_1s_ease-out_0.2s_both]`}>Small-Batch · Specialty Coffee</div>
      <h1 className={`${S.heading} text-[72px] sm:text-[96px] md:text-[120px] lg:text-[144px] text-[#F5F5F5] leading-[0.88] mb-6 animate-[fadeUp_1s_ease-out_0.4s_both]`}>
        Haitian Roots.<br /><span className="text-[#E8D8C4]">Bold Flavor.</span>
      </h1>
      <div className="my-8 animate-[fadeIn_1s_ease-out_0.8s_both]"><GoldRule /></div>
      <div className={`${S.min} text-[#F5F5F5]/70 uppercase tracking-[0.15em] animate-[fadeIn_1s_ease-out_1s_both] flex flex-wrap items-center justify-center gap-y-2`}>
        <span className="hover:text-[#C8A97E] transition-colors duration-300 cursor-default">Discover the Legendary Taste</span>
        <DiamondSep />
        <span className="hover:text-[#C8A97E] transition-colors duration-300 cursor-default">Awaken Your Senses</span>
        <DiamondSep />
        <span className="hover:text-[#C8A97E] transition-colors duration-300 cursor-default">Rooted in Mystique</span>
      </div>
      <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeUp_1s_ease-out_1.2s_both]">
        <a href="#product" className={`${S.min} uppercase tracking-[0.2em] bg-[#C8A97E] text-[#1A1A1A] font-bold px-10 py-4 hover:bg-[#DFC49A] transition-all duration-300 shadow-[0_0_40px_rgba(200,169,126,0.3)]`}>Shop the Collection</a>
        <a href="#story" className={`${S.min} uppercase tracking-[0.2em] border border-[#F5F5F5]/30 text-[#F5F5F5]/70 px-10 py-4 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-all duration-300`}>Our Story</a>
      </div>
    </div>
    <div aria-hidden="true" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-[fadeIn_1s_ease-out_2s_both]">
      <span className={`${S.min} text-[#F5F5F5]/30 uppercase tracking-[0.2em] text-[11px]`}>Scroll</span>
      <div className="w-px h-12 bg-gradient-to-b from-[#C8A97E]/60 to-transparent" />
    </div>
  </section>
);

/* ─── MARQUEE STRIP ──────────────────────────────────────────────────── */
const IntroStrip = () => (
  <section className="bg-[#E8D8C4] py-5 overflow-hidden">
    <div className="flex items-center whitespace-nowrap" style={{ animation:"kcMq 24s linear infinite" }}>
      {[...Array(6)].map((_,i)=>(
        <span key={i} className={`${S.heading} text-[17px] text-[#1A1A1A] tracking-[0.18em] flex items-center gap-10 px-8`}>
          HAITIAN-INSPIRED <span className="text-[#C8A97E] text-[8px]">◆</span>
          LATIN AMERICAN BEANS <span className="text-[#C8A97E] text-[8px]">◆</span>
          CRAFTED IN CONNECTICUT, USA <span className="text-[#C8A97E] text-[8px]">◆</span>
          SMALL-BATCH ROASTED <span className="text-[#C8A97E] text-[8px]">◆</span>
        </span>
      ))}
    </div>
    <style jsx>{`@keyframes kcMq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
  </section>
);

/* ─── PRODUCT SECTION ────────────────────────────────────────────────── */
const ProductSection = () => {
  const [tab, setTab] = useState("notes");

  const TABS = [
    { id:"notes",   label:"Treasured Notes"    }, // [LEGAL] NEVER "Flavor Notes"
    { id:"brewing", label:"Unlock the Richness" }, // [LEGAL] NEVER "Brewing Suggestions"
    { id:"origin",  label:"Origins"             },
  ];

  const CONTENT = {
    notes: (
      <ul className="space-y-4">
        {[
          { n:"Brown Sugar",    d:"A warm, comforting sweetness — a taste of pure indulgence." },
          { n:"Caramel",        d:"Smooth, buttery richness that unfolds mid-palate." },
          { n:"Dark Chocolate", d:"Deep, bittersweet undertones that linger after the last sip." },
          { n:"Smoky Cedar",    d:"A whisper of woodsmoke giving this espresso its bold backbone." },
        ].map(({ n, d }) => (
          <li key={n} className="flex gap-4 items-start">
            <span className="mt-1 text-[#C8A97E] text-[9px] flex-shrink-0">◆</span>
            <span>
              <span className={`${S.heading} text-[18px] text-[#F5F5F5] block`}>{n}</span>
              <span className={`${S.min} text-[#F5F5F5]/60`}>{d}</span>
            </span>
          </li>
        ))}
      </ul>
    ),
    brewing: (
      <ol className="space-y-4">
        {[
          { s:"01", t:"French Press", d:"Coarse grind. 2 tbsp per 6 oz. Steep 4 min. Press slow and deliberate." },
          { s:"02", t:"Drip",         d:"Medium grind. Standard ratio. Clean, consistent extraction every time." },
          { s:"03", t:"Espresso",     d:"Fine grind, 18–20g. Target 25–30 sec pull. Watch for mahogany crema." },
        ].map(({ s, t, d }) => (
          <li key={s} className="flex gap-6 items-start">
            <span className={`${S.heading} text-[30px] text-[#C8A97E]/30 flex-shrink-0 leading-none`}>{s}</span>
            <span>
              <span className={`${S.heading} text-[15px] text-[#C8A97E] block tracking-[0.1em]`}>Unlock the Richness — {t}</span>
              <span className={`${S.min} text-[#F5F5F5]/60`}>{d}</span>
            </span>
          </li>
        ))}
      </ol>
    ),
    origin: (
      <div className="space-y-5">
        {/* [LEGAL] Approved origin language */}
        <p className={`${S.body} text-[#F5F5F5]/70`}>
          Finest Latin American beans, roasted to perfection. Handpicked from the highlands
          of Latin America — journey to the source of bold flavor.
        </p>
        <p className={`${S.body} text-[#F5F5F5]/70`}>
          Each micro-lot is selected for density, moisture, and cup profile before arriving
          at our Connecticut roastery for small-batch roasting that preserves every expressive note.
        </p>
        {/* [LEGAL] Mandatory disclosure */}
        <div className="border-l-2 border-[#C8A97E] pl-4 py-1">
          <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.15em]`}>Crafted in Connecticut, USA</p>
        </div>
      </div>
    ),
  };

  return (
    <section id="product" className="bg-[#1A1A1A] py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <RevealSection>
          <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.3em] mb-4`}>The Collection</p>
          <GoldRule className="mb-16" />
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* ── PRODUCT IMAGE ── */}
          <RevealSection delay={100}>
            <div className="relative">
              <div className="relative aspect-[4/5] flex items-center justify-center overflow-hidden"
                style={{ background:"radial-gradient(ellipse 80% 80% at 50% 40%,rgba(200,169,126,0.12) 0%,rgba(26,26,26,0.6) 60%,#111 100%)", border:"1px solid rgba(200,169,126,0.2)" }}>
                {["top-3 left-3 border-t border-l","top-3 right-3 border-t border-r","bottom-3 left-3 border-b border-l","bottom-3 right-3 border-b border-r"].map(p=>(
                  <div key={p} aria-hidden="true" className={`absolute w-6 h-6 border-[#C8A97E]/50 ${p}`} />
                ))}

                {/* ── Real product image ──
                    Place /public/images/bag-konncafe-v0.png before deploying */}
                <div className="relative w-3/5 max-w-[240px] aspect-[3/4]">
                  <Image
                    src="/images/bag-konncafe-v0.png"
                    alt="KonnCafe Espresso Ground 8 oz — Crafted in Connecticut, USA"
                    fill
                    className="object-contain drop-shadow-[0_20px_48px_rgba(0,0,0,0.85)]"
                    sizes="(max-width:768px) 50vw, 25vw"
                    priority
                  />
                </div>

                <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-0 w-1/4"
                  style={{ background:"linear-gradient(to left,rgba(200,169,126,0.08),transparent)" }} />
              </div>

              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full flex flex-col items-center justify-center text-center"
                style={{ background:"#C8A97E", boxShadow:"0 8px 32px rgba(200,169,126,0.4)" }}>
                <span className={`${S.heading} text-[11px] text-[#1A1A1A] tracking-[0.1em] leading-none`}>SMALL<br />BATCH</span>
                <span className={`${S.min} text-[9px] text-[#1A1A1A]/70 mt-1`}>Roasted</span>
              </div>
            </div>
          </RevealSection>

          {/* ── PRODUCT INFO ── */}
          <RevealSection delay={200}>
            <div className="lg:pt-4">
              <h2 className={`${S.heading} text-[56px] md:text-[72px] text-[#F5F5F5] leading-[0.9] mb-2`}>Espresso</h2>
              <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.3em] mb-8`}>Ground · 8 oz</p>
              <GoldRule className="mb-8" />

              {/* Price — $13.99 */}
              <div className="flex items-end gap-6 mb-10">
                <span className={`${S.heading} text-[40px] text-[#F5F5F5]`}>$13.99</span>
                <span className={`${S.min} text-[#F5F5F5]/35 mb-2 line-through`}>$18.00</span>
              </div>

              <button type="button"
                className={`w-full ${S.min} uppercase tracking-[0.2em] font-bold bg-[#C8A97E] text-[#1A1A1A] py-4 mb-4 hover:bg-[#DFC49A] active:scale-[0.98] transition-all duration-300 shadow-[0_0_40px_rgba(200,169,126,0.25)]`}>
                Add to Cart — 8 oz · $13.99
              </button>
              <button type="button"
                className={`w-full ${S.min} uppercase tracking-[0.2em] border border-[#F5F5F5]/20 text-[#F5F5F5]/60 py-4 mb-10 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-all duration-300`}>
                Subscribe &amp; Save 15%
              </button>

              {/* Tabs */}
              <div className="flex border-b border-[rgba(245,245,245,0.1)] mb-8">
                {TABS.map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)}
                    className={`pb-3 mr-7 ${S.min} uppercase tracking-[0.12em] transition-all duration-300 border-b-2 -mb-px ${tab===t.id ? "text-[#C8A97E] border-[#C8A97E]" : "text-[#F5F5F5]/40 border-transparent hover:text-[#F5F5F5]/70"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div key={tab} className="animate-[fadeIn_0.4s_ease-out]">
                {CONTENT[tab]}
              </div>

              {/* [LEGAL] Product-level disclosure */}
              <div className="mt-10 pt-6 border-t border-[rgba(200,169,126,0.2)]">
                <p className={`${S.min} text-[#C8A97E]/55 uppercase tracking-[0.18em]`}>Crafted in Connecticut, USA</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
};

/* ─── STORY SECTION ──────────────────────────────────────────────────── */
const StorySection = () => (
  <section id="story" className="relative bg-[#1A1A1A] py-32 px-6 md:px-12 overflow-hidden">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0"
      style={{ background:"radial-gradient(ellipse 70% 50% at 20% 60%,rgba(200,169,126,0.07) 0%,transparent 60%)" }}
    />
    <div className="relative z-10 max-w-[1400px] mx-auto">
      <RevealSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.3em] mb-4`}>The Story</p>
            <h2 className={`${S.heading} text-[64px] md:text-[88px] text-[#F5F5F5] leading-[0.9] mb-8`}>
              More Than<br /><span className="text-[#E8D8C4]">a Cup.</span>
            </h2>
            <GoldRule className="mb-8" />
            {/* [LEGAL] Verbatim approved story — Brand Guide §6 */}
            <div className="space-y-5">
              <p className={`${S.body} text-[#F5F5F5]/70`}>
                Inspired by the rich heritage of Haiti, we craft our coffee with passion and
                care right here in Connecticut. Every cup is a tribute to tradition — bold,
                honest, and made with purpose.
              </p>
              <p className={`${S.body} text-[#F5F5F5]/70`}>
                We don't over-explain where we come from. We let the coffee speak — in the
                first scent of freshly ground beans, in the velvet weight of a perfect pull,
                in the warmth that spreads through you on the first sip.
              </p>
            </div>
            <div className="mt-10">
              <a href="#roots" className={`inline-flex items-center gap-3 ${S.min} text-[#C8A97E] uppercase tracking-[0.2em] hover:gap-5 transition-all duration-300 group`}>
                Explore Our Roots
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { icon:"◈", title:"Heritage",  text:"Haitian-inspired recipes and rituals passed down through generations." },
              { icon:"◉", title:"Precision",  text:"Each roast is calibrated to the gram, the degree, the second." },
              { icon:"◇", title:"Place",      text:"Born in Connecticut. Informed by the world." },
            ].map(({ icon, title, text }, i) => (
              <RevealSection key={title} delay={i*100+200}>
                <div className="flex gap-6 p-6 group hover:bg-[#2E2E2E]/40 transition-all duration-300"
                  style={{ borderLeft:"2px solid rgba(200,169,126,0.25)" }}>
                  <span className="text-[#C8A97E] text-[22px] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">{icon}</span>
                  <div>
                    <h3 className={`${S.heading} text-[22px] text-[#F5F5F5] tracking-[0.06em] mb-2`}>{title}</h3>
                    <p className={`${S.min} text-[#F5F5F5]/60`}>{text}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </RevealSection>
    </div>
  </section>
);

/* ─── SNAKE GAME SECTION ─────────────────────────────────────────────── */
const GameSection = () => (
  <section id="game" className="bg-[#111] py-24 px-6 md:px-12 border-t border-[rgba(200,169,126,0.1)]">
    <div className="max-w-[1400px] mx-auto">
      <RevealSection>
        <div className="text-center mb-12">
          <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.3em] mb-4`}>Take a Break</p>
          <h2 className={`${S.heading} text-[56px] md:text-[72px] text-[#F5F5F5] leading-[0.9] mb-4`}>
            Coffee Bean<br /><span className="text-[#C8A97E]">Snake</span>
          </h2>
          <GoldRule className="max-w-[400px] mx-auto mb-6" />
          <p className={`${S.body} text-[#F5F5F5]/50 max-w-[520px] mx-auto`}>
            Swallow every bean — grow stronger. Lose yourself, and the snake
            transforms into a steaming KonnCafe cup.
          </p>
        </div>
        <div className="flex justify-center">
          <SnakeGame />
        </div>
      </RevealSection>
    </div>
  </section>
);

/* ─── ROOTS SECTION ──────────────────────────────────────────────────── */
const RootsSection = () => (
  <section id="roots" className="relative bg-[#111] py-32 px-6 md:px-12 overflow-hidden">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{ backgroundImage:"repeating-linear-gradient(45deg,#C8A97E 0,#C8A97E 1px,transparent 0,transparent 60px)" }}
    />
    <div className="relative z-10 max-w-[900px] mx-auto text-center">
      <RevealSection>
        <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.3em] mb-6`}>Rooted in Mystique</p>
        <h2 className={`${S.heading} text-[56px] md:text-[80px] text-[#F5F5F5] leading-[0.9] mb-8`}>
          Where Identity<br /><span className="text-[#C8A97E]">Meets the Cup</span>
        </h2>
        <GoldRule className="mb-12" />
        <p className={`${S.body} text-[#F5F5F5]/65 max-w-[600px] mx-auto mb-12`}>
          KonnCafe exists at the intersection of two worlds — the Haitian-inspired warmth of
          our founding vision, and the precision of a modern American craft roastery.
        </p>
        <div className="grid grid-cols-3 gap-8 mb-14">
          {[
            { num:"100%",  label:"Latin American Beans"  }, // [LEGAL]
            { num:"Small", label:"Batch Roasted"         },
            { num:"CT",    label:"Crafted in Connecticut" }, // [LEGAL]
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className={`${S.heading} text-[40px] md:text-[52px] text-[#C8A97E] leading-none`}>{num}</div>
              <div className={`${S.min} text-[#F5F5F5]/50 uppercase tracking-[0.15em] mt-2`}>{label}</div>
            </div>
          ))}
        </div>
        <a href="#product"
          className={`inline-flex items-center gap-3 border border-[#C8A97E] text-[#C8A97E] ${S.min} uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#C8A97E] hover:text-[#1A1A1A] transition-all duration-300`}>
          Discover the Taste
        </a>
      </RevealSection>
    </div>
  </section>
);

/* ─── NEWSLETTER ─────────────────────────────────────────────────────── */
const Newsletter = () => {
  const [email, setEmail]    = useState("");
  const [done,  setDone]     = useState(false);
  return (
    <section className="bg-[#1A1A1A] py-24 px-6 md:px-12 border-t border-[rgba(200,169,126,0.12)]">
      <div className="max-w-[600px] mx-auto text-center">
        <RevealSection>
          <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.3em] mb-4`}>Stay Connected</p>
          <h2 className={`${S.heading} text-[48px] md:text-[60px] text-[#F5F5F5] mb-4`}>Be First to Know</h2>
          <p className={`${S.body} text-[#F5F5F5]/50 mb-10`}>New roasts, limited drops, and the occasional origin story. No noise. No spam.</p>
          {done ? (
            <div className="border border-[#C8A97E]/40 p-6">
              <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.2em]`}>◆ You&apos;re in. Welcome to the circle.</p>
            </div>
          ) : (
            <form onSubmit={e=>{e.preventDefault();if(email)setDone(true);}} className="flex flex-col sm:flex-row gap-0">
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required aria-label="Email address"
                className={`flex-1 bg-[#2E2E2E] border border-[rgba(245,245,245,0.1)] border-r-0 text-[#F5F5F5] placeholder-[#F5F5F5]/30 ${S.min} px-6 py-4 focus:outline-none focus:border-[#C8A97E] transition-colors duration-300`}
              />
              <button type="submit"
                className={`${S.min} uppercase tracking-[0.2em] font-bold bg-[#C8A97E] text-[#1A1A1A] px-8 py-4 hover:bg-[#DFC49A] transition-colors duration-300 flex-shrink-0`}>
                Subscribe
              </button>
            </form>
          )}
        </RevealSection>
      </div>
    </section>
  );
};

/* ─── FOOTER ─────────────────────────────────────────────────────────── */
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="bg-[#111] pt-16 pb-10 px-6 md:px-12 border-t border-[rgba(200,169,126,0.12)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className={`${S.heading} text-[34px] text-[#F5F5F5] tracking-[0.12em] block mb-3`}>KONNCAFE</span>
            <p className={`${S.body} text-[#F5F5F5]/50 max-w-[300px] mb-5`}>
              Haitian-inspired specialty coffee roasted with intention and care in Connecticut.
            </p>
            {/* [LEGAL] Footer disclosure */}
            <p className={`${S.min} text-[#C8A97E] uppercase tracking-[0.2em]`}>Crafted in Connecticut, USA</p>
          </div>

          {/* Nav */}
          <div>
            <h3 className={`${S.heading} text-[15px] text-[#C8A97E] tracking-[0.2em] mb-5`}>Navigate</h3>
            <ul className="space-y-3">
              {["Story","Product","Game","Roots","Contact"].map(item=>(
                <li key={item}><a href={`#${item.toLowerCase()}`} className={`${S.min} text-[#F5F5F5]/50 hover:text-[#C8A97E] transition-colors duration-300`}>{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`${S.heading} text-[15px] text-[#C8A97E] tracking-[0.2em] mb-5`}>Contact</h3>
            <ul className="space-y-3">
              {/* Phone */}
              <li><a href="tel:+12036264931" className={`${S.min} text-[#F5F5F5]/50 hover:text-[#C8A97E] transition-colors duration-300`}>+1 (203) 626-4931</a></li>
              <li><a href="mailto:hello@konncafe.com" className={`${S.min} text-[#F5F5F5]/50 hover:text-[#C8A97E] transition-colors duration-300`}>hello@konncafe.com</a></li>
              {["Privacy Policy","Terms of Service","Shipping Info"].map(item=>(
                <li key={item}><a href="#" className={`${S.min} text-[#F5F5F5]/50 hover:text-[#C8A97E] transition-colors duration-300`}>{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <GoldRule className="mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`${S.min} text-[#F5F5F5]/30`}>© {year} KonnCafe. All rights reserved.</p>
          {/* [LEGAL] Double disclosure */}
          <p className={`${S.min} text-[#F5F5F5]/30 text-center`}>
            Crafted in Connecticut, USA · Finest Latin American beans, roasted to perfection.
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ─── PAGE ROOT ───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <FontLoader />
      <Head>
        <title>KonnCafe — Haitian Roots. Bold Flavor.</title>
        <meta name="description" content="KonnCafe — Haitian-inspired specialty coffee crafted in Connecticut, USA. Finest Latin American beans, roasted to perfection." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title"       content="KonnCafe — Haitian Roots. Bold Flavor." />
        <meta property="og:description" content="Small-batch specialty espresso. Crafted in Connecticut, USA." />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://www.konncafe.com" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          @keyframes fadeUp { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
          @keyframes fadeIn { 0%{opacity:0} 100%{opacity:1} }
        `}</style>
      </Head>

      <div className="bg-[#1A1A1A] text-[#F5F5F5] min-h-screen overflow-x-hidden font-['Lato',sans-serif]">
        <Header />
        <main>
          <Hero />
          <IntroStrip />
          <ProductSection />
          <StorySection />
          <GameSection />
          <RootsSection />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </>
  );
}
