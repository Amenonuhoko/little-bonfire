import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { KINDLING_IDS, KINDLING, totalFor } from './data';

// How close a tap needs to land to an ember to read it — shared by the
// hit test and the visible tap-area guide so they never disagree.
const EMBER_TAP_RADIUS = 26;

// Ported from the Claude Design prototype's canvas draw loop — the bonfire,
// its embers (live messages) and stars (spent/"this helped" messages).
// `messages` is the source of truth for which embers exist ([{id,
// kindlingId, text}], owned by App.jsx / the data store) — this component
// only owns how they're placed and animated, syncing to that list below
// rather than generating or removing embers on its own.
const BonfireCanvas = forwardRef(function BonfireCanvas({ screen, sky, revealed, used, activeEmberId, messages }, ref) {
  const canvasElRef = useRef(null);
  const s = useRef(null); // mutable animation state, lives outside React render cycle
  const screenRef = useRef(screen);
  const skyRef = useRef(sky);
  const revealedRef = useRef(revealed);
  const usedRef = useRef(used);
  const activeEmberIdRef = useRef(activeEmberId);

  screenRef.current = screen;
  skyRef.current = sky;
  revealedRef.current = revealed;
  usedRef.current = used;
  activeEmberIdRef.current = activeEmberId;

  useImperativeHandle(ref, () => ({
    flare() { if (s.current) s.current.flare = 1; },
    addStar() {
      if (!s.current) return;
      s.current.stars.push({ x: Math.random(), y: 0.2 + Math.random() * 0.5, likes: 18, b: 0.55, tw: 0 });
    },
    // finds the ember (if any) whose fixed clickable zone contains
    // (px, py), in canvas-local coordinates. Tested against the ember's
    // rest point, not its swaying on-screen position, so the tap target
    // stays put even while the ember visibly drifts within that zone.
    hitTestEmber(px, py) {
      const st = s.current;
      if (!st || !st.w) return null;
      let best = null, bestD = EMBER_TAP_RADIUS;
      for (const e of st.embers) {
        const d = Math.hypot(px - e.x * st.w, py - e.y);
        if (d < bestD) { bestD = d; best = e; }
      }
      return best ? { id: best.id, name: best.name, color: best.c, text: best.text, kindlingId: best.kindlingId } : null;
    },
  }));

  useEffect(() => {
    const canvas = canvasElRef.current;
    const ctx = canvas.getContext('2d');
    const st = {
      ctx, w: 0, h: 0, cam: 0, flare: 0, t: 0,
      embers: [], stars: [], tufts: [], sparks: [], smoke: [], noisePattern: null, raf: 0,
      milkyway: [], fireflies: [], pebbles: [], farTrees: [], nearTrees: [],
    };
    s.current = st;

    const onResize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.w = r.width;
      st.h = r.height;
    };
    onResize();
    window.addEventListener('resize', onResize);
    const resizeTimer = setTimeout(onResize, 250);

    st.noisePattern = makeNoisePattern(ctx);

    for (let i = 0; i < 46; i++) {
      st.tufts.push({ x: Math.random(), y: Math.random(), h: 4 + Math.random() * 9, l: (Math.random() - 0.5) * 5 });
    }
    for (let i = 0; i < 150; i++) {
      const likes = Math.round(6 + Math.pow(Math.random(), 2.6) * 240);
      st.stars.push({ x: Math.random(), y: Math.random(), likes, b: Math.min(1, Math.pow(likes / 220, 0.7)), tw: Math.random() * 6.28 });
    }
    for (let i = 0; i < 20; i++) st.sparks.push(mkSpark(true));
    for (let i = 0; i < 5; i++) st.smoke.push(mkSmoke(true));

    // a soft diagonal haze of denser starlight — cached so it doesn't reshuffle every frame
    for (let i = 0; i < 90; i++) {
      const f = Math.random();
      const perp = (Math.random() - 0.5) * (1 - Math.abs(f - 0.5) * 0.7);
      st.milkyway.push({
        x: 0.08 + f * 0.86 + perp * 0.16,
        y: -0.62 + f * 1.55 + perp * 0.5,
        r: 10 + Math.random() * 34,
        a: 0.02 + Math.random() * 0.05,
      });
    }
    // fireflies drifting low over the ground, away from the fire itself
    for (let i = 0; i < 9; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      st.fireflies.push({
        bx: 0.5 + side * (0.28 + Math.random() * 0.34),
        by: 0.55 + Math.random() * 0.4,
        r: 5 + Math.random() * 10,
        sp: 0.15 + Math.random() * 0.2,
        ph: Math.random() * 6.28,
        ph2: Math.random() * 6.28,
      });
    }
    // small ground texture — pebbles and fallen leaves
    for (let i = 0; i < 34; i++) {
      st.pebbles.push({ x: Math.random(), y: Math.random(), r: 0.8 + Math.random() * 1.8, w: Math.random() < 0.4 });
    }
    // distant pine silhouettes lining the far shore
    for (let i = 0; i < 22; i++) {
      const x = i / 21 + (Math.random() - 0.5) * 0.03;
      st.farTrees.push({ x, hh: 0.5 + Math.random() * 0.9, w: 0.55 + Math.random() * 0.5 });
    }
    // pines and low bushes framing the campsite at each screen edge — an
    // even mix reads more like undergrowth than a wall of identical trees
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const frac = 0.02 + i * 0.05 + Math.random() * 0.025;
        const x = side < 0 ? frac : 1 - frac;
        const type = Math.random() < 0.45 ? 'bush' : 'pine';
        st.nearTrees.push({ x, hh: 0.6 + Math.random() * 0.5, depth: i, type });
      }
    }

    const loop = () => {
      st.raf = requestAnimationFrame(loop);
      st.t += 0.016;
      draw(st, screenRef.current, skyRef.current, revealedRef.current, usedRef.current, activeEmberIdRef.current);
    };
    loop();

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(st.raf);
    };
  }, []);

  // keeps the rendered embers in sync with the `messages` prop: new
  // messages get placed (via mkEmber, which avoids the flame), messages
  // that are gone get dropped, and everything else keeps its existing
  // position/sway untouched so a refetch doesn't reshuffle the fire.
  // Runs after the effect above, so s.current already exists by the
  // time this first fires on mount.
  useEffect(() => {
    const st = s.current;
    if (!st) return;
    const incomingIds = new Set(messages.map((m) => m.id));
    st.embers = st.embers.filter((e) => incomingIds.has(e.id));
    const existingIds = new Set(st.embers.map((e) => e.id));
    for (const m of messages) {
      if (!existingIds.has(m.id)) st.embers.push(mkEmber(st, m));
    }
  }, [messages]);

  return (
    <canvas
      ref={canvasElRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
});

export default BonfireCanvas;

// How wide the flame's own silhouette is at a given height, with a margin
// added on top for the embers' sway/drift — not just their spawn point, so
// resting embers never end up appearing to burn inside the fire itself.
function flameHalfWidthAt(y, fy) {
  if (y > fy + 15 || y < fy - 370) return 0;
  const heightFrac = Math.max(0, Math.min(1, (fy - y) / 360));
  return 46 * (1 - heightFrac) + 26;
}

// Every ember is a real message — none are decorative. Placement (this
// function) is the only thing owned here; identity and text always come
// from the `message` object the caller already has.
function mkEmber(st, message) {
  const { id, kindlingId, text } = message;
  const h = st.h || 860, w = st.w || 402;
  const fy = h * 0.68;
  let ex, ey, tries = 0;
  do {
    const ang = Math.random() * 6.2832;
    const r = Math.pow(Math.random(), 0.55);
    ex = 0.5 + Math.cos(ang) * r * 0.46;
    // spread from low near the rocks (r≈0) up into the tall dome (r≈1),
    // instead of only ever floating high above the fire
    ey = fy + 22 - Math.abs(Math.sin(ang)) * r * h * 0.48 - r * 58;
    tries++;
  } while (Math.abs(ex * w - w / 2) < flameHalfWidthAt(ey, fy) && tries < 25);
  const clearHalf = flameHalfWidthAt(ey, fy);
  if (Math.abs(ex * w - w / 2) < clearHalf) {
    // ran out of tries right in the flame's shadow — push it clear outright
    ex = (ex < 0.5 ? w / 2 - clearHalf : w / 2 + clearHalf) / w;
  }
  return {
    id,
    kindlingId,
    c: KINDLING[kindlingId].color,
    name: KINDLING[kindlingId].name,
    text,
    x: Math.max(0.04, Math.min(0.96, ex)),
    y: ey,
    // sway amplitude is kept well under EMBER_TAP_RADIUS so the ember's
    // drift always stays inside its own tap zone, never wandering out of
    // the fixed spot a tap actually registers against
    ax: 8 + Math.random() * 8, ay: 6 + Math.random() * 6,
    sp: 0.05 + Math.random() * 0.1, ph: Math.random() * 6.28,
    r: 1.5 + Math.random() * 2, a: 0.55 + Math.random() * 0.4,
  };
}

// A quick-rising spark thrown off by the flame — distinct from the slow,
// floating "embers" (which represent live messages, not fire physics).
function mkSpark(fresh) {
  return {
    x: 0.5 + (Math.random() - 0.5) * 0.05,
    rise: fresh ? Math.random() : 0,
    speed: 0.35 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 26,
    wobPh: Math.random() * 6.28,
    life: fresh ? Math.random() : 1,
    hue: Math.random(),
  };
}

// A soft wisp of smoke drifting up above the flame tip.
function mkSmoke(fresh) {
  return {
    x: 0.5 + (Math.random() - 0.5) * 0.18,
    rise: fresh ? Math.random() : 0,
    speed: 0.06 + Math.random() * 0.05,
    drift: (Math.random() - 0.5) * 40,
    size: 20 + Math.random() * 26,
    ph: Math.random() * 6.28,
  };
}

// Precomputed grain tile, blended over every frame at low opacity so the
// gradients read as painted rather than as a flat digital glow.
function makeNoisePattern(ctx) {
  const n = document.createElement('canvas');
  n.width = 96; n.height = 96;
  const nctx = n.getContext('2d');
  const img = nctx.createImageData(96, 96);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 255;
    const a = Math.random() * 22;
    img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = a;
  }
  nctx.putImageData(img, 0, 0);
  return ctx.createPattern(n, 'repeat');
}

// How full a kindling reads, 0..1, for the shoreline/skyline mapping below.
// Grace has no cap, so it's judged against a soft reference instead.
function kindlingFillFrac(id, used) {
  if (!used) return 0.5;
  const total = totalFor(id);
  const cap = total > 0 ? total : 50;
  return Math.max(0, Math.min(1, (used[id] || 0) / cap));
}

// Fill at an arbitrary x fraction (0..1), linearly interpolated between the
// five kindling's center points (in their fixed disgrace->grace order).
function fillAtX(xFrac, used) {
  const n = KINDLING_IDS.length;
  const centers = KINDLING_IDS.map((_, i) => (i + 0.5) / n);
  const fills = KINDLING_IDS.map((id) => kindlingFillFrac(id, used));
  if (xFrac <= centers[0]) return fills[0];
  if (xFrac >= centers[n - 1]) return fills[n - 1];
  for (let i = 0; i < n - 1; i++) {
    if (xFrac >= centers[i] && xFrac <= centers[i + 1]) {
      const t = (xFrac - centers[i]) / (centers[i + 1] - centers[i]);
      return fills[i] + (fills[i + 1] - fills[i]) * t;
    }
  }
  return 0.5;
}

// The fuller a kindling, the further its stretch of shoreline recedes from
// the camera. Only ever recedes (moves up) from the baseline — it never
// dips below it, so the tree line can't end up looking like it's standing
// in the water.
const SHORE_RECEDE_MAX = 10;
function shoreRecede(xFrac, used) {
  return fillAtX(xFrac, used) * SHORE_RECEDE_MAX;
}

function draw(st, screen, sky, revealed, used, activeEmberId) {
  const { ctx, w, h } = st;
  if (!ctx || !w) return;
  const target = screen === 'home' ? sky : 0;
  st.cam += (target - st.cam) * 0.16;
  st.flare *= 0.955;
  const camY = st.cam * h * 0.85;
  // bank sits well above fy so the whole rock ring (which reaches above fy
  // on its far side) stays on the ground instead of poking into the lake
  const fx = w / 2, fy = h * 0.68, bank = fy - 34, waterTop = h * 0.24;
  const flick = 1 + Math.sin(st.t * 7) * 0.05 + Math.sin(st.t * 3.3) * 0.06 + st.flare * 0.9;

  ctx.clearRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#05050d'); g.addColorStop(0.32, '#0a0a16');
  g.addColorStop(0.62, '#100e14'); g.addColorStop(0.82, '#161010');
  g.addColorStop(1, '#0a0c11');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

  ctx.save(); ctx.translate(0, camY);

  // milky way: a soft cached haze of denser starlight, behind everything
  ctx.globalCompositeOperation = 'lighter';
  for (const m of st.milkyway) {
    const mx = m.x * w, my = -h * 0.5 + m.y * h * 1.4;
    const tw = 0.75 + 0.25 * Math.sin(st.t * 0.15 + m.x * 20);
    const mg = ctx.createRadialGradient(mx, my, 0, mx, my, m.r);
    mg.addColorStop(0, `rgba(196,190,225,${(m.a * tw).toFixed(3)})`);
    mg.addColorStop(1, 'rgba(196,190,225,0)');
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(mx, my, m.r, 0, 6.2832); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  // the moon — sits low over the campsite; fades out as the camera climbs
  // toward the far sky so it never lingers over the star-count footer
  const moonA = Math.max(0, 1 - sky * 2.2);
  if (moonA > 0.01) {
    const mx = w * 0.76, my = h * 0.1;
    ctx.globalAlpha = moonA;
    const halo = ctx.createRadialGradient(mx, my, 0, mx, my, 70);
    halo.addColorStop(0, 'rgba(226,228,238,0.16)');
    halo.addColorStop(1, 'rgba(226,228,238,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(mx, my, 70, 0, 6.2832); ctx.fill();
    const body = ctx.createRadialGradient(mx - 5, my - 5, 1, mx, my, 17);
    body.addColorStop(0, '#f6f4ee');
    body.addColorStop(0.6, '#dcdce4');
    body.addColorStop(1, '#b7bccb');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(mx, my, 17, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = moonA * 0.16; ctx.fillStyle = '#9298ab';
    ctx.beginPath(); ctx.arc(mx - 6, my + 4, 4.2, 0, 6.2832); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 5, my - 6, 2.6, 0, 6.2832); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 2, my + 7, 2, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // stars: spent messages. brightness = how many people spent them, nudged
  // a little brighter over whichever kindling's zone is currently fullest —
  // the skyline echoing the same state as the shoreline below it
  for (const st_ of st.stars) {
    const y = -h * 0.95 + st_.y * (waterTop + h * 0.95);
    const skyBoost = 0.84 + 0.32 * fillAtX(st_.x, used);
    const b = Math.min(1, st_.b * skyBoost);
    const tw = 0.72 + 0.28 * Math.sin(st.t * (0.5 + b) + st_.tw);
    ctx.globalAlpha = (0.13 + 0.72 * b * b) * tw;
    ctx.fillStyle = b > 0.62 ? '#fdf3dc' : b > 0.3 ? '#e8dcc4' : '#b9b2a3';
    const r = 0.45 + 1.5 * b;
    ctx.beginPath(); ctx.arc(st_.x * w, y, r, 0, 6.2832); ctx.fill();
    if (b > 0.55) {
      ctx.globalAlpha = (0.05 + 0.14 * b) * tw;
      ctx.beginPath(); ctx.arc(st_.x * w, y, r * 3.2, 0, 6.2832); ctx.fill();
    }
    if (b > 0.82) {
      ctx.globalAlpha = 0.16 * tw;
      ctx.lineWidth = 0.6; ctx.strokeStyle = '#fdf3dc';
      ctx.beginPath();
      ctx.moveTo(st_.x * w - r * 3.4, y); ctx.lineTo(st_.x * w + r * 3.4, y);
      ctx.moveTo(st_.x * w, y - r * 3.4); ctx.lineTo(st_.x * w, y + r * 3.4);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // distant mountains — a soft, hazy ridge well behind the tree line, faded
  // at both edges so it dissolves into the sky rather than reading as a cutout
  ctx.save();
  ctx.filter = 'blur(3px)';
  const mtnPts = [];
  for (let x = -10; x <= w + 10; x += 24) {
    const recede = shoreRecede(Math.max(0, Math.min(1, x / w)), used);
    mtnPts.push([x, waterTop - 30 - Math.abs(Math.sin(x * 0.006 + 2)) * 26 - Math.sin(x * 0.014) * 10 - recede]);
  }
  const mtnTopY = Math.min(...mtnPts.map((p) => p[1]));
  const mg2 = ctx.createLinearGradient(0, mtnTopY, 0, waterTop + 6);
  mg2.addColorStop(0, 'rgba(13,16,24,0)');
  mg2.addColorStop(0.35, 'rgba(13,16,24,0.45)');
  mg2.addColorStop(1, 'rgba(13,16,24,0.6)');
  ctx.fillStyle = mg2;
  ctx.beginPath(); ctx.moveTo(-10, waterTop + 6);
  for (const p of mtnPts) ctx.lineTo(p[0], p[1]);
  ctx.lineTo(w + 10, waterTop + 6); ctx.closePath(); ctx.fill();
  ctx.restore();

  // the shore's own waterline — the actual land/water boundary, not just the
  // trees planted on it, follows the same recede curve so the terrain itself
  // visibly changes instead of just the tree line floating above flat water
  const shorePts = [];
  for (let x = -10; x <= w + 10; x += 20) {
    shorePts.push([x, waterTop - shoreRecede(Math.max(0, Math.min(1, x / w)), used)]);
  }
  if (shorePts[shorePts.length - 1][0] < w + 10) {
    shorePts.push([w + 10, waterTop - shoreRecede(1, used)]);
  }
  const traceShoreTop = (dy) => {
    ctx.moveTo(shorePts[0][0], shorePts[0][1] + dy);
    for (const p of shorePts) ctx.lineTo(p[0], p[1] + dy);
  };

  // far shore — a tree line of small pine silhouettes, softened at the base
  ctx.save();
  ctx.filter = 'blur(0.6px)';
  ctx.fillStyle = '#080b10';
  ctx.beginPath(); ctx.moveTo(-10, waterTop + 4);
  for (const ft of st.farTrees) {
    const x = ft.x * w, ph = waterTop - 3 - shoreRecede(ft.x, used);
    const th = 10 + ft.hh * 16, tw2 = 7 * ft.w;
    ctx.lineTo(x - tw2, ph);
    ctx.lineTo(x, ph - th);
    ctx.lineTo(x + tw2, ph);
  }
  ctx.lineTo(w + 10, waterTop + 4); ctx.closePath(); ctx.fill();
  ctx.restore();

  // atmospheric haze: blends the shoreline into the water instead of a hard cut
  const haze = ctx.createLinearGradient(0, waterTop - 10, 0, waterTop + 46);
  haze.addColorStop(0, 'rgba(150,148,168,0.22)');
  haze.addColorStop(0.4, 'rgba(120,120,140,0.1)');
  haze.addColorStop(1, 'rgba(120,120,140,0)');
  ctx.fillStyle = haze;
  ctx.beginPath();
  traceShoreTop(-10);
  for (let i = shorePts.length - 1; i >= 0; i--) ctx.lineTo(shorePts[i][0], shorePts[i][1] + 46);
  ctx.closePath(); ctx.fill();

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = 'rgba(190,140,86,0.25)';
  ctx.beginPath();
  traceShoreTop(-1);
  for (let i = shorePts.length - 1; i >= 0; i--) ctx.lineTo(shorePts[i][0], shorePts[i][1] + 0.2);
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;

  // the lake — its top edge is the same receding waterline, so a fuller
  // kindling's stretch of water genuinely widens instead of just its trees
  // drifting upward over an unchanged lake
  const wg = ctx.createLinearGradient(0, waterTop, 0, bank);
  wg.addColorStop(0, '#12141c'); wg.addColorStop(0.18, '#080b11');
  wg.addColorStop(0.55, '#06080d'); wg.addColorStop(1, '#04060a');
  ctx.fillStyle = wg;
  ctx.beginPath();
  traceShoreTop(0);
  ctx.lineTo(w + 10, bank); ctx.lineTo(-10, bank); ctx.closePath(); ctx.fill();

  ctx.save();
  ctx.beginPath();
  traceShoreTop(0);
  ctx.lineTo(w + 10, bank); ctx.lineTo(-10, bank); ctx.closePath(); ctx.clip();

  const rTop = bank - (bank - waterTop) * 0.62;
  const refl = ctx.createLinearGradient(0, bank, 0, rTop);
  refl.addColorStop(0, 'rgba(255,140,50,0.22)');
  refl.addColorStop(0.35, 'rgba(226,106,34,0.08)');
  refl.addColorStop(1, 'rgba(200,88,28,0)');
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(fx - 38 * flick, bank);
  ctx.quadraticCurveTo(fx - 22, rTop + 30, fx - 7, rTop);
  ctx.lineTo(fx + 7, rTop);
  ctx.quadraticCurveTo(fx + 22, rTop + 30, fx + 38 * flick, bank);
  ctx.closePath(); ctx.clip();
  ctx.fillStyle = refl; ctx.fillRect(fx - 70, rTop, 140, bank - rTop);
  ctx.restore();
  for (let i = 0; i < 14; i++) {
    const f = (i + 0.5) / 14;
    const y = bank - 3 - f * (bank - rTop);
    const wob = Math.sin(st.t * 1.1 + f * 7.5) * (3 + f * 13);
    const halfW = (34 + Math.sin(i * 2.3) * 16) * flick * (1 - f * 0.55);
    ctx.globalAlpha = (0.17 - f * 0.15) * flick;
    ctx.fillStyle = f < 0.3 ? 'rgba(255,198,124,0.85)' : 'rgba(240,126,44,0.5)';
    ctx.fillRect(fx - halfW / 2 + wob, y, halfW, 1.1);
  }
  ctx.save();
  ctx.filter = 'blur(1.4px)';
  for (const st_ of st.stars) {
    if (st_.b < 0.5) continue;
    const y = bank - 4 - ((st_.x * 7919) % 1000) / 1000 * (bank - waterTop) * 0.8;
    ctx.globalAlpha = 0.1 + 0.22 * st_.b;
    ctx.fillStyle = '#e9dcc0';
    ctx.fillRect(st_.x * w - 3 + Math.sin(st.t * 1.1 + st_.tw) * 3, y, 6, 1.1);
  }
  ctx.restore();
  for (let i = 0; i < 26; i++) {
    const f = i / 26;
    const y = waterTop + 6 + f * (bank - waterTop - 6);
    const off = Math.sin(st.t * 0.5 + i * 1.7) * 40;
    const sgw = w * (0.35 + 0.5 * Math.abs(Math.sin(i * 1.3)));
    const sx = fx + off - sgw / 2;
    const sh = ctx.createLinearGradient(sx, 0, sx + sgw, 0);
    const sa = (0.03 + 0.07 * (1 - f)).toFixed(3);
    sh.addColorStop(0, 'rgba(159,176,196,0)');
    sh.addColorStop(0.5, 'rgba(159,176,196,' + sa + ')');
    sh.addColorStop(1, 'rgba(159,176,196,0)');
    ctx.globalAlpha = 1; ctx.fillStyle = sh;
    ctx.fillRect(sx, y, sgw, 0.8);
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  // near bank
  const bg2 = ctx.createLinearGradient(0, bank - 4, 0, h + 80);
  bg2.addColorStop(0, '#0b0a09'); bg2.addColorStop(1, '#040404');
  ctx.fillStyle = bg2; ctx.fillRect(-10, bank - 4, w + 20, h - bank + 90);
  const wl = ctx.createLinearGradient(0, 0, w, 0);
  wl.addColorStop(0, 'rgba(196,150,96,0.04)');
  wl.addColorStop(0.5, 'rgba(255,168,88,' + (0.22 * flick).toFixed(3) + ')');
  wl.addColorStop(1, 'rgba(196,150,96,0.04)');
  ctx.fillStyle = wl; ctx.fillRect(-10, bank - 5, w + 20, 1.4);
  ctx.save();
  ctx.beginPath(); ctx.rect(-10, bank - 4, w + 20, h - bank + 90); ctx.clip();
  const jx = Math.sin(st.t * 3.1) * 1.6, jy = Math.cos(st.t * 2.3) * 1.2;
  const lit = ctx.createRadialGradient(fx + jx, bank + 6 + jy, 4, fx + jx, bank + 6 + jy, 330 * flick);
  lit.addColorStop(0, 'rgba(240,134,50,0.13)'); lit.addColorStop(0.3, 'rgba(196,96,32,0.06)'); lit.addColorStop(0.62, 'rgba(150,70,22,0.02)');
  lit.addColorStop(1, 'rgba(120,80,40,0)');
  ctx.fillStyle = lit; ctx.fillRect(-10, bank - 4, w + 20, h - bank + 90);
  ctx.restore();

  // pines and low bushes framing the campsite — closer ones are bigger and darker
  for (const tr of st.nearTrees) {
    const tx = tr.x * w;
    if (tx < -80 || tx > w + 80) continue;
    const scale = 1.5 - tr.depth * 0.24;
    const baseY = bank + 22;
    const shade = Math.max(0, 1 - Math.abs(tx - fx) / (w * 0.9));
    const bodyColor = `rgba(${10 + shade * 26},${8 + shade * 16},${7 + shade * 9},${Math.max(0.4, 0.95 - tr.depth * 0.13)})`;

    if (tr.type === 'bush') {
      const bw = 15 * scale, bh = 11 * tr.hh * scale;
      const sway = Math.sin(st.t * 0.4 + tr.x * 11) * 1.2 * scale;
      ctx.fillStyle = bodyColor;
      for (const [dx, dy2, r] of [[-bw * 0.55, -bh * 0.3, bw * 0.62], [bw * 0.5, -bh * 0.22, bw * 0.58], [0, -bh * 0.7, bw * 0.66]]) {
        ctx.beginPath();
        ctx.ellipse(tx + dx + sway, baseY + dy2, r, r * 0.82, 0, 0, 6.2832);
        ctx.fill();
      }
      if (shade > 0.06) {
        ctx.globalAlpha = shade * 0.28;
        ctx.fillStyle = 'rgba(224,140,64,1)';
        ctx.beginPath();
        ctx.ellipse(tx + (tx < fx ? bw * 0.4 : -bw * 0.4) + sway, baseY - bh * 0.55, bw * 0.4, bw * 0.34, 0, 0, 6.2832);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      continue;
    }

    const th = 150 * tr.hh * scale, tw2 = 17 * scale;
    const sway = Math.sin(st.t * 0.35 + tr.x * 9) * 2 * scale;
    ctx.fillStyle = bodyColor;
    for (let tier = 0; tier < 3; tier++) {
      const ty = baseY - tier * th * 0.32;
      const tierW = tw2 * (1 - tier * 0.22);
      const tierH = th * 0.42;
      ctx.beginPath();
      ctx.moveTo(tx + sway * (tier + 1) * 0.3 - tierW, ty);
      ctx.lineTo(tx + sway * (tier + 1) * 0.5, ty - tierH);
      ctx.lineTo(tx + sway * (tier + 1) * 0.3 + tierW, ty);
      ctx.closePath(); ctx.fill();
    }
    if (shade > 0.08) {
      ctx.globalAlpha = shade * 0.2;
      ctx.fillStyle = 'rgba(224,132,58,1)';
      ctx.beginPath();
      ctx.moveTo(tx + (tx < fx ? tw2 * 0.5 : -tw2 * 0.5), baseY);
      ctx.lineTo(tx + sway * 1.5, baseY - th * 0.9);
      ctx.lineTo(tx + (tx < fx ? tw2 * 0.2 : -tw2 * 0.2), baseY);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (const tuft of st.tufts) {
    const gy = bank + 4 + tuft.y * (h - bank) * 0.98;
    const d = 1 - Math.min(1, Math.abs(tuft.x * w - fx) / (w * 0.7));
    ctx.strokeStyle = 'rgba(196,134,72,' + (0.05 + 0.2 * d) + ')'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(tuft.x * w, gy); ctx.lineTo(tuft.x * w + tuft.l, gy - tuft.h); ctx.stroke();
  }
  // small stones and fallen leaves scattered near the fire
  for (const pb of st.pebbles) {
    const px = pb.x * w, py = bank + 6 + pb.y * (h - bank) * 0.9;
    const d = 1 - Math.min(1, Math.abs(px - fx) / (w * 0.6));
    ctx.globalAlpha = 0.25 + 0.35 * d;
    ctx.fillStyle = pb.w ? 'rgba(190,110,60,0.5)' : 'rgba(70,64,58,0.8)';
    ctx.beginPath(); ctx.ellipse(px, py, pb.r * 1.6, pb.r, 0, 0, 6.2832); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // rocks ringing the fire pit — shaded and shadowed like rounded stones,
  // with rocks lower in the ring (nearer the "camera") reading bigger
  for (let k = 0; k < 11; k++) {
    const a2 = (k / 11) * 6.2832 + 0.35;
    const rx0 = 66 + ((k * 29) % 13), ry0 = 21 + ((k * 17) % 7);
    const near = (Math.sin(a2) + 1) / 2; // 0 = far side of ring, 1 = near side
    const scale = 0.82 + near * 0.42;
    const sx0 = fx + Math.cos(a2) * rx0, sy0 = fy + 16 + Math.sin(a2) * ry0;
    const rw = (9.5 + ((k * 13) % 5) * 1.2) * scale, rh = (5.8 + ((k * 7) % 3) * 1.1) * scale;
    const rot = Math.sin(k) * 0.4;
    const angFromFire = Math.atan2(sy0 - fy, sx0 - fx);

    // contact shadow — always straight down onto the ground, never radial
    // (a radial offset pushed far-side rocks' shadows above them, making
    // them look like they were floating instead of resting on the ground)
    ctx.globalAlpha = 0.4 + near * 0.15;
    ctx.fillStyle = 'rgba(6,5,5,0.9)';
    ctx.beginPath(); ctx.ellipse(sx0, sy0 + rh * 0.65 + 1.5, rw * 0.95, rh * 0.5, 0, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = 1;

    // rock body — a gradient from lit (fire-facing side) to shadowed (outward) side
    const face = 1 - Math.min(1, Math.hypot(sx0 - fx, (sy0 - fy) * 1.8) / 110);
    const litDx = -Math.cos(angFromFire), litDy = -Math.sin(angFromFire); // points back toward the fire
    const lit = ctx.createLinearGradient(sx0 - litDx * rw, sy0 - litDy * rh, sx0 + litDx * rw, sy0 + litDy * rh);
    lit.addColorStop(0, `rgba(${64 + face * 90},${44 + face * 52},${30 + face * 22},1)`);
    lit.addColorStop(0.55, 'rgba(28,25,23,1)');
    lit.addColorStop(1, 'rgba(14,12,11,1)');
    ctx.beginPath();
    ctx.ellipse(sx0, sy0, rw, rh, rot, 0, 6.2832);
    ctx.fillStyle = lit; ctx.fill();

    // a soft rounded highlight where the firelight catches the near side
    ctx.beginPath();
    ctx.ellipse(sx0 + litDx * rw * 0.4, sy0 + litDy * rh * 0.4 - rh * 0.25, rw * 0.5, rh * 0.32, rot, 0, 6.2832);
    ctx.fillStyle = `rgba(240,168,90,${(0.05 + 0.28 * face).toFixed(3)})`;
    ctx.fill();
  }

  // fireflies drifting low over the ground, well away from the fire itself
  ctx.globalCompositeOperation = 'lighter';
  for (const fl of st.fireflies) {
    const fx2 = fl.bx * w + Math.sin(st.t * fl.sp + fl.ph) * fl.r * 2.4;
    const fy2 = fl.by * h + Math.cos(st.t * fl.sp * 0.7 + fl.ph2) * fl.r;
    const pulse = 0.3 + 0.7 * Math.max(0, Math.sin(st.t * (0.8 + fl.sp) + fl.ph));
    ctx.globalAlpha = pulse * 0.55;
    ctx.fillStyle = '#d9e07a';
    ctx.beginPath(); ctx.arc(fx2, fy2, 1.1, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = pulse * 0.14;
    ctx.beginPath(); ctx.arc(fx2, fy2, 4.2, 0, 6.2832); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  // embers: live messages, drifting gently in place within a fixed tap
  // zone — a touch bolder once the fire has been touched once, rewarding
  // the tap with a clearer ember field
  const emberBoost = revealed ? 1.55 : 1;
  for (const e of st.embers) {
    const bx = e.x * w, by = e.y;
    const x = bx + Math.sin(st.t * e.sp + e.ph) * e.ax;
    const y = by + Math.cos(st.t * e.sp * 0.78 + e.ph * 1.6) * e.ay;
    const a = Math.min(1, e.a * (0.62 + 0.38 * Math.sin(st.t * 0.42 + e.ph)) * emberBoost);
    const r = e.r * emberBoost;
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = e.c;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = Math.max(0, a * (revealed ? 0.22 : 0.14));
    ctx.beginPath(); ctx.arc(x, y, r * 3.8, 0, 6.2832); ctx.fill();

    // a faint dashed guide around the ember's fixed rest point — exactly
    // where a tap lands and still counts, regardless of the drift above
    if (revealed) {
      ctx.globalAlpha = Math.max(0, a * 0.16);
      ctx.strokeStyle = e.c; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.arc(bx, by, EMBER_TAP_RADIUS, 0, 6.2832); ctx.stroke();
      ctx.setLineDash([]);
    }

    // a clear, bright ring on whichever ember is actually being read
    if (e.id === activeEmberId) {
      const pulse = 0.6 + 0.4 * Math.sin(st.t * 3);
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = '#fdf3dc'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(x, y, EMBER_TAP_RADIUS * 0.72, 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 0.35 * pulse;
      ctx.beginPath(); ctx.arc(x, y, EMBER_TAP_RADIUS * (0.85 + 0.1 * pulse), 0, 6.2832); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // the fire — ambient orange bloom
  const R = 215 * flick;
  const rg = ctx.createRadialGradient(fx, fy - 30, 2, fx, fy - 30, R);
  rg.addColorStop(0, 'rgba(255,164,72,0.34)');
  rg.addColorStop(0.09, 'rgba(255,128,38,0.2)');
  rg.addColorStop(0.24, 'rgba(212,98,28,0.1)');
  rg.addColorStop(0.5, 'rgba(162,74,22,0.04)');
  rg.addColorStop(0.76, 'rgba(140,64,18,0.015)');
  rg.addColorStop(1, 'rgba(140,64,18,0)');
  ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(fx, fy - 30, R, 0, 6.2832); ctx.fill();

  // ash pile and half-burnt logs, built up as a rounded mound with real shadow
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = 'rgba(5,4,4,0.9)';
  ctx.beginPath(); ctx.ellipse(fx, fy + 19, 54, 11, 0, 0, 6.2832); ctx.fill();
  ctx.globalAlpha = 1;

  const ashG = ctx.createRadialGradient(fx, fy + 10, 3, fx, fy + 16, 46);
  ashG.addColorStop(0, 'rgba(74,64,56,0.95)');
  ashG.addColorStop(0.5, 'rgba(46,40,36,0.95)');
  ashG.addColorStop(1, 'rgba(26,23,21,0.9)');
  ctx.fillStyle = ashG;
  ctx.beginPath(); ctx.ellipse(fx, fy + 15, 44, 10, 0, 0, 6.2832); ctx.fill();

  // two half-burnt logs, drawn as shaded capsules for a rounded, lying-down volume
  for (const log of [
    { x1: fx - 33, y1: fy + 17, x2: fx + 18, y2: fy + 6, w: 5.4 },
    { x1: fx + 31, y1: fy + 17, x2: fx - 16, y2: fy + 6, w: 5 },
  ]) {
    const dx = log.x2 - log.x1, dy = log.y2 - log.y1, len = Math.hypot(dx, dy);
    const nx = -dy / len, ny = dx / len;
    const lg = ctx.createLinearGradient(log.x1 + nx * log.w, log.y1 + ny * log.w, log.x1 - nx * log.w, log.y1 - ny * log.w);
    lg.addColorStop(0, 'rgba(58,42,34,0.97)');
    lg.addColorStop(0.45, 'rgba(30,24,21,0.97)');
    lg.addColorStop(1, 'rgba(12,10,9,0.97)');
    ctx.strokeStyle = lg; ctx.lineWidth = log.w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(log.x1, log.y1); ctx.lineTo(log.x2, log.y2); ctx.stroke();
    // a thin glowing charred edge along the top of the log, toward the fire
    ctx.strokeStyle = 'rgba(255,120,40,0.35)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(log.x1 + nx * log.w * 0.6, log.y1 + ny * log.w * 0.6);
    ctx.lineTo(log.x2 + nx * log.w * 0.6, log.y2 + ny * log.w * 0.6);
    ctx.stroke();
  }

  for (let k = 0; k < 8; k++) {
    const cx = fx + Math.sin(k * 2.7) * 30, cy = fy + 9 + Math.cos(k * 1.9) * 4;
    ctx.globalAlpha = 0.2 + 0.35 * Math.abs(Math.sin(st.t * 1.8 + k));
    ctx.fillStyle = '#ff8f2e';
    ctx.beginPath(); ctx.arc(cx, cy, 1.7, 0, 6.2832); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // smoke: soft wisps drifting up above the flame, ahead of the ribbons
  ctx.globalCompositeOperation = 'source-over';
  for (const sm of st.smoke) {
    sm.rise += 0.0032 * sm.speed;
    if (sm.rise > 1) { Object.assign(sm, mkSmoke(false)); }
    const rise = sm.rise;
    const sy = fy - 40 - rise * h * 0.5;
    const sx = fx + sm.drift * rise + Math.sin(st.t * 0.25 + sm.ph) * 14 * rise;
    const size = sm.size * (0.5 + rise * 1.6);
    const a = Math.sin(rise * Math.PI) * 0.09;
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, size);
    sg.addColorStop(0, `rgba(150,150,160,${a.toFixed(3)})`);
    sg.addColorStop(1, 'rgba(150,150,160,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(sx, sy, size, 0, 6.2832); ctx.fill();
  }

  // undertone: a deep ember-crimson glow beneath the flame for painterly depth
  ctx.globalCompositeOperation = 'lighter';
  const Hu = 200 * (0.9 + 0.12 * Math.sin(st.t * 1.7)) * (1 + st.flare * 0.3);
  const ug = ctx.createLinearGradient(0, fy + 8, 0, fy + 8 - Hu);
  ug.addColorStop(0, 'rgba(196,40,58,0.32)');
  ug.addColorStop(0.3, 'rgba(168,32,70,0.18)');
  ug.addColorStop(1, 'rgba(120,24,80,0)');
  ctx.fillStyle = ug;
  ctx.beginPath();
  ctx.ellipse(fx, fy + 4 - Hu * 0.36, 26 * flick, Hu * 0.42, 0, 0, 6.2832);
  ctx.fill();

  // ribbons of flame, climbing like vines — each one's foot follows the
  // ash mound's own curve and tapers to a point instead of a flat-cut
  // rectangle, so the fire licks up out of the wood rather than sitting
  // on it like a block
  const H = 320 * (0.92 + 0.14 * Math.sin(st.t * 2.1)) * (1 + st.flare * 0.4);
  for (let r0 = 0; r0 < 11; r0++) {
    const ph = r0 * 1.9, sp = 1.25 + r0 * 0.27, sway = 0.4 + (r0 % 3) * 0.45;
    const hgt = H * (0.4 + 0.6 * (((r0 * 37) % 11) / 10));
    const wb = 4.4 + (r0 % 3) * 2.8;
    const bx = fx + (r0 - 5) * 4.2;
    const dxAsh = bx - fx;
    // each ribbon roots at a slightly different depth in the log pile,
    // not one smooth shared line — a stable per-ribbon hash, not per-frame
    // noise, so the unevenness reads as texture rather than a flicker
    const hash = Math.sin(r0 * 12.9898) * 43758.5453;
    const baseJitter = (hash - Math.floor(hash) - 0.5) * 22;
    const baseY = fy + 15 - 10 * Math.sqrt(Math.max(0, 1 - (dxAsh / 44) ** 2)) - 9 + baseJitter;
    const pts = [], N = 18;
    for (let i = 0; i <= N; i++) {
      const f = i / N;
      const x = bx + Math.sin(st.t * sp + f * 5.1 + ph) * (2 + f * f * 34) * sway;
      const taper = Math.min(1, f * 5.5) * Math.pow(1 - f, 1.15);
      pts.push([x, baseY - f * hgt, wb * taper + 0.35]);
    }
    const grd = ctx.createLinearGradient(0, baseY, 0, baseY - hgt);
    grd.addColorStop(0, 'rgba(255,88,24,0.52)');
    grd.addColorStop(0.16, 'rgba(255,138,30,0.46)');
    grd.addColorStop(0.5, 'rgba(255,96,26,0.26)');
    grd.addColorStop(0.8, 'rgba(255,70,40,0.12)');
    grd.addColorStop(1, 'rgba(255,58,10,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(pts[0][0] - pts[0][2], pts[0][1]);
    for (const p of pts) ctx.lineTo(p[0] - p[2], p[1]);
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0] + pts[i][2], pts[i][1]);
    ctx.closePath(); ctx.fill();
    const cg = ctx.createLinearGradient(0, baseY, 0, baseY - hgt * 0.72);
    cg.addColorStop(0, 'rgba(255,228,152,0.55)');
    cg.addColorStop(0.38, 'rgba(255,196,88,0.3)');
    cg.addColorStop(1, 'rgba(255,168,56,0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.moveTo(pts[0][0] - pts[0][2] * 0.34, pts[0][1]);
    for (const p of pts) ctx.lineTo(p[0] - p[2] * 0.34, p[1]);
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0] + pts[i][2] * 0.34, pts[i][1]);
    ctx.closePath(); ctx.fill();
  }
  const bb = ctx.createRadialGradient(fx, fy + 2, 1, fx, fy + 2, 58 * flick);
  bb.addColorStop(0, 'rgba(255,216,144,0.46)');
  bb.addColorStop(0.38, 'rgba(255,140,44,0.2)');
  bb.addColorStop(1, 'rgba(255,110,30,0)');
  ctx.fillStyle = bb; ctx.beginPath(); ctx.arc(fx, fy + 2, 58 * flick, 0, 6.2832); ctx.fill();

  // sparks: quick bright motes thrown up off the flame
  for (const sp of st.sparks) {
    sp.rise += 0.016 * sp.speed;
    sp.life -= 0.016 * sp.speed * 0.55;
    if (sp.life <= 0 || sp.rise > 1.15) Object.assign(sp, mkSpark(false));
    const rise = sp.rise;
    const py = fy + 4 - rise * (170 + st.flare * 60);
    const px = fx + sp.drift * rise + Math.sin(st.t * 4 + sp.wobPh) * 6 * rise;
    const a = Math.max(0, Math.sin(rise * Math.PI) * sp.life);
    ctx.globalAlpha = a;
    ctx.fillStyle = sp.hue > 0.5 ? '#ffe6ad' : '#ff9a44';
    ctx.beginPath(); ctx.arc(px, py, 0.9 + sp.hue * 0.6, 0, 6.2832); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.restore();

  // grain: keeps the gradients feeling painted rather than digitally flat
  if (st.noisePattern) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = st.noisePattern;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }

  // vignette: frames the scene and keeps the eye on the fire
  const vg = ctx.createRadialGradient(w / 2, h * 0.62, h * 0.25, w / 2, h * 0.62, h * 0.78);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(0.75, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
}
