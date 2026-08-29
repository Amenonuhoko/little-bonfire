import { KINDLING_IDS, KINDLING, totalFor } from '../data';

// Grace has no cap, so — same as the canvas's shoreline mapping — its
// fill reads against a soft reference instead of a hard total.
function fillFrac(id, used, total) {
  const cap = total > 0 ? total : 50;
  return Math.max(0, Math.min(1, (used[id] || 0) / cap));
}

export default function KindlingScreen({ mode, used, activeKindling, onBack, onPick }) {
  const title = mode === 'drop' ? 'What is this?' : 'What do you need?';
  const sub =
    mode === 'drop'
      ? 'The word decides the template. Pick the one that stings, not the one that flatters.'
      : 'One message, drawn at random from the kindling. No feed, no next.';

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,11,13,.86),rgba(10,11,13,.97) 40%)', display: 'flex', flexDirection: 'column', padding: '64px 0 40px', animation: 'ddIn .35s ease' }}>
      <div style={{ padding: '0 24px 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div onClick={onBack} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(230,221,203,.4)', cursor: 'pointer' }}>
          ← back to the fire
        </div>
        <div style={{ fontFamily: "'Young Serif',serif", fontSize: 25, color: '#e6ddcb' }}>{title}</div>
        <div style={{ fontFamily: 'Newsreader,serif', fontSize: 14, lineHeight: 1.5, color: 'rgba(230,221,203,.5)', maxWidth: '32ch' }}>{sub}</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 24px 0', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {KINDLING_IDS.map((id) => {
          const b = KINDLING[id];
          const total = totalFor(id);
          const full = total > 0 && used[id] >= total;
          const isActive = id === activeKindling;
          const disabled = mode === 'drop' && full;
          const frac = fillFrac(id, used, total);
          return (
            <div
              key={id}
              onClick={() => onPick(id)}
              style={{
                position: 'relative', padding: '16px 17px', overflow: 'hidden',
                border: `1px solid ${isActive ? 'rgba(194,161,115,0.4)' : 'rgba(230,221,203,0.11)'}`,
                borderLeft: `3px solid ${b.color}`,
                background: isActive ? 'rgba(194,161,115,0.07)' : 'rgba(230,221,203,0.025)',
                display: 'flex', flexDirection: 'column', gap: 11, cursor: 'pointer',
                opacity: disabled ? 0.55 : 1,
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
              <div style={{ position: 'relative', fontFamily: 'Newsreader,serif', fontSize: 13.5, lineHeight: 1.45, color: 'rgba(230,221,203,.58)' }}>{b.blurb}</div>
            </div>
          );
        })}
        <div style={{ height: 14 }} />
      </div>
    </div>
  );
}
