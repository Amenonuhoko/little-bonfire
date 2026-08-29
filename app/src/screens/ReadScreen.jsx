import { useRef } from 'react';

// Distance a horizontal drag needs to cover before it counts as a swipe
// rather than a tap on one of the buttons underneath.
const SWIPE_THRESHOLD = 46;
// Minimum wheel delta before a scroll tick counts as "next" — small trackpad
// noise stays inert. Locked out briefly after firing so one scroll gesture
// (which sends many tiny wheel events) doesn't skip through several embers.
const WHEEL_THRESHOLD = 12;
const WHEEL_LOCK_MS = 450;

export default function ReadScreen({ ember, feedback, feedbackTone, onBack, onHelped, onNotThis, onSwipeNext }) {
  const dragRef = useRef(null);
  const wheelLockRef = useRef(false);

  const onPointerDown = (e) => { dragRef.current = { x: e.clientX, moved: 0 }; };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    d.moved = Math.max(d.moved, Math.abs(e.clientX - d.x));
  };
  const onPointerUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && Math.abs(e.clientX - d.x) > SWIPE_THRESHOLD) onSwipeNext();
  };
  const onWheel = (e) => {
    if (wheelLockRef.current) return;
    if (Math.max(Math.abs(e.deltaY), Math.abs(e.deltaX)) < WHEEL_THRESHOLD) return;
    wheelLockRef.current = true;
    onSwipeNext();
    setTimeout(() => { wheelLockRef.current = false; }, WHEEL_LOCK_MS);
  };

  // buttons get their own pointer handlers (with stopPropagation) instead
  // of onClick — the trailing click event otherwise loses a race against
  // the pointerup above and silently never fires
  const stop = (e) => e.stopPropagation();

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      style={{
        position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(9,10,12,.5),rgba(9,10,12,.9) 55%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 26px 40px',
        animation: 'ddIn .4s ease', touchAction: 'pan-y',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div
          onPointerDown={stop}
          onPointerUp={(e) => { stop(e); onBack(); }}
          style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(230,221,203,.4)', cursor: 'pointer' }}
        >
          ← back to the fire
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.1em', color: 'rgba(230,221,203,.4)' }}>
          drawn at random · swipe or scroll for another
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: ember.color, boxShadow: `0 0 12px ${ember.color}` }} />
          <div style={{ fontFamily: "'Young Serif',serif", fontSize: 16, color: '#e6ddcb' }}>{ember.name}</div>
        </div>
        <div style={{ fontFamily: 'Newsreader,serif', fontSize: 21, lineHeight: 1.7, color: '#f0e2c8', textShadow: '0 0 34px rgba(194,161,115,.3)' }}>
          {ember.text}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ display: 'flex', gap: 9 }}>
          <div
            onPointerDown={stop}
            onPointerUp={(e) => { stop(e); onHelped(); }}
            style={{ flex: 1, padding: 15, textAlign: 'center', border: '1px solid rgba(194,161,115,.45)', background: 'linear-gradient(180deg,rgba(194,161,115,.14),transparent)', color: '#e8dcc4', fontSize: 12.5, letterSpacing: '.05em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            This helped
          </div>
          <div
            onPointerDown={stop}
            onPointerUp={(e) => { stop(e); onNotThis(); }}
            style={{ flex: 1, padding: 15, textAlign: 'center', border: '1px solid rgba(230,221,203,.14)', color: 'rgba(230,221,203,.55)', fontSize: 12.5, letterSpacing: '.05em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Not this
          </div>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, lineHeight: 1.6, letterSpacing: '.08em', color: feedbackTone === 'g' ? 'rgba(203,176,131,.9)' : 'rgba(230,221,203,.4)', minHeight: 26 }}>
          {feedback}
        </div>
      </div>
    </div>
  );
}
