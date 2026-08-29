import { KINDLING_IDS, KINDLING, totalFor } from '../data';

// Grace has no cap, so — same as the canvas's shoreline mapping — its
// fill reads against a soft reference instead of a hard total.
function fillFrac(id, used, total) {
  const cap = total > 0 ? total : 50;
  return Math.max(0, Math.min(1, (used[id] || 0) / cap));
}

// Only used to pick which kindling to drop a message into — reading now
// happens via a random ember on the fire, not through this screen.
export default function KindlingScreen({ used, activeKindling, onBack, onPick }) {
  const title = 'What is this?';
  const sub = 'The word decides the template. Pick the one that stings, not the one that flatters.';
  // buttons get their own pointer handlers (with stopPropagation) instead
  // of onClick — a plain click here can otherwise land on this screen a
  // beat after the button that opened it, matching whatever card ends up
  // under the same coordinates once the screen underneath has changed
  const stop = (e) => e.stopPropagation();

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,11,13,.86),rgba(10,11,13,.97) 40%)', display: 'flex', flexDirection: 'column', padding: '64px 0 40px', animation: 'ddIn .6s cubic-bezier(.16,1,.3,1)' }}>
      <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div
          onPointerDown={stop}
          onPointerUp={(e) => { stop(e); onBack(); }}
          style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(230,221,203,.4)', cursor: 'pointer' }}
        >
          ← back to the fire
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* a slow, steady ember standing in for every word this screen
              isn't saying about taking your time — see the cards' own
              unhurried, staggered entrance below for the rest of it */}
          <div aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8a165', boxShadow: '0 0 10px 2px rgba(232,161,101,.6)', animation: 'ddGlow 4.5s ease-in-out infinite' }} />
          <div style={{ fontFamily: "'Young Serif',serif", fontSize: 25, color: '#e6ddcb' }}>{title}</div>
        </div>
        <div style={{ fontFamily: 'Newsreader,serif', fontSize: 14, lineHeight: 1.5, color: 'rgba(230,221,203,.5)', maxWidth: '32ch' }}>{sub}</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 24px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {KINDLING_IDS.map((id, i) => {
          const b = KINDLING[id];
          const total = totalFor(id);
          const full = total > 0 && used[id] >= total;
          const isActive = id === activeKindling;
          const disabled = full;
          const frac = fillFrac(id, used, total);
          return (
            <div
              key={id}
              onPointerDown={stop}
              onPointerUp={(e) => { stop(e); onPick(id); }}
              style={{
                position: 'relative', padding: '22px 20px', overflow: 'hidden',
                border: `1px solid ${isActive ? 'rgba(194,161,115,0.4)' : 'rgba(230,221,203,0.11)'}`,
                borderLeft: `3px solid ${b.color}`,
                background: isActive ? 'rgba(194,161,115,0.07)' : 'rgba(230,221,203,0.025)',
                display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer',
                opacity: disabled ? 0.55 : 1,
                transition: 'border-color .4s ease, background .4s ease',
                // each card settles into place a beat after the last —
                // nothing on this screen should feel like it's rushing you
                animation: `ddIn .6s cubic-bezier(.16,1,.3,1) both`,
                animationDelay: `${120 + i * 90}ms`,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute', inset: 0, width: `${frac * 100}%`,
                  background: `linear-gradient(90deg, ${b.color}30, ${b.color}14)`,
                  transition: 'width .4s ease',
                }}
              />
              <div style={{ position: 'relative', fontFamily: "'Young Serif',serif", fontSize: 19.5, color: '#e6ddcb', letterSpacing: '.01em' }}>{b.name}</div>
              <div style={{ position: 'relative', fontFamily: 'Newsreader,serif', fontSize: 13.5, lineHeight: 1.55, color: 'rgba(230,221,203,.58)' }}>{b.blurb}</div>
            </div>
          );
        })}
        <div style={{ height: 14 }} />
      </div>
    </div>
  );
}
