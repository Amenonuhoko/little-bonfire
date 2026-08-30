import { useEffect, useRef, useState } from 'react';

// How tall each row is, and how many are visible at once (the center
// selection plus a partial row peeking in above and below) — together
// these set the reel's total height.
const ROW_H = 44;
const VISIBLE_ROWS = 3;
const REEL_H = ROW_H * VISIBLE_ROWS;
// How long to wait after the last scroll movement before treating the
// gesture as settled and actually committing the selection — short enough
// to feel responsive, long enough that a still-moving reel doesn't fire
// a dozen intermediate selections on its way past them.
const SETTLE_MS = 110;

// A vertical, scroll-snapped "rolodex" for picking a kindling's flavor —
// rows tumble past with a slight 3D tilt and fade the further they sit
// from center, and either scrolling or tapping a row selects it. Visually
// distinct from (and replaces) the old horizontal pill scroller.
export default function TemplateRolodex({ templates, activeIdx, accentColor, onSelect }) {
  const scrollerRef = useRef(null);
  const settleTimer = useRef(null);
  const activeIdxRef = useRef(activeIdx);
  activeIdxRef.current = activeIdx;
  // the continuous, unrounded scroll position — drives the live tumble
  // (opacity/scale/tilt) frame by frame; `activeIdx` only updates once a
  // scroll gesture actually settles, see the debounce below
  const [visualPos, setVisualPos] = useState(activeIdx);

  // snaps the reel to the right spot without animating whenever the
  // template *set* changes underneath it (switching kindling resets to
  // its first template) — a fresh array identity is the signal for that,
  // since within one kindling the array reference stays the same
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = activeIdx * ROW_H;
    setVisualPos(activeIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setVisualPos(el.scrollTop / ROW_H);
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const idx = Math.max(0, Math.min(templates.length - 1, Math.round(el.scrollTop / ROW_H)));
      if (idx !== activeIdxRef.current) onSelect(idx);
    }, SETTLE_MS);
  };

  const jumpTo = (i) => {
    scrollerRef.current?.scrollTo({ top: i * ROW_H, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', height: REEL_H, perspective: 480 }}>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        style={{
          height: '100%', overflowY: 'auto', scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch', padding: `${ROW_H}px 0`,
        }}
      >
        {templates.map((t, i) => {
          const d = i - visualPos; // signed distance from center, fractional while scrolling
          const ad = Math.abs(d);
          const opacity = Math.max(0.12, 1 - ad * 0.62);
          const scale = Math.max(0.72, 1 - ad * 0.16);
          return (
            <div
              key={t.key}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => { e.stopPropagation(); jumpTo(i); }}
              style={{
                height: ROW_H, scrollSnapAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 14.5, letterSpacing: '.04em',
                color: ad < 0.4 ? '#f4e6c9' : 'rgba(230,221,203,.7)',
                opacity,
                transform: `rotateX(${d * -26}deg) scale(${scale})`,
                cursor: 'pointer', userSelect: 'none',
              }}
            >
              {t.label}
            </div>
          );
        })}
      </div>
      {/* a thin band marking the selection slot, plus top/bottom fades so
          rows visibly emerge from and recede into the dark — the "reel"
          look, rather than just a plain list that happens to scroll */}
      <div
        aria-hidden
        style={{
          position: 'absolute', left: 4, right: 4, top: ROW_H, height: ROW_H,
          borderTop: `1px solid ${accentColor}50`, borderBottom: `1px solid ${accentColor}50`,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(9,10,12,.98), transparent 42%, transparent 58%, rgba(9,10,12,.98))',
        }}
      />
    </div>
  );
}
