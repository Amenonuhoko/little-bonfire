import { KINDLING } from '../data';

export default function ReadScreen({ kindlingId, readIdx, feedback, feedbackTone, onBack, onHelped, onNotThis }) {
  const b = KINDLING[kindlingId];
  const msg = b.live[readIdx % b.live.length] || b.live[0];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(9,10,12,.5),rgba(9,10,12,.9) 55%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 26px 40px', animation: 'ddIn .4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div onClick={onBack} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(230,221,203,.4)', cursor: 'pointer' }}>
          ← kindling
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.1em', color: 'rgba(230,221,203,.4)' }}>
          {readIdx % b.live.length + 1} / {b.live.length} · drawn at random
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: b.color, boxShadow: `0 0 12px ${b.color}` }} />
          <div style={{ fontFamily: "'Young Serif',serif", fontSize: 16, color: '#e6ddcb' }}>{b.name}</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.12em', color: 'rgba(230,221,203,.35)' }}>{msg.age}</div>
        </div>
        <div style={{ fontFamily: 'Newsreader,serif', fontSize: 21, lineHeight: 1.7, color: '#f0e2c8', textShadow: '0 0 34px rgba(194,161,115,.3)' }}>
          {msg.t}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ display: 'flex', gap: 9 }}>
          <div
            onClick={onHelped}
            style={{ flex: 1, padding: 15, textAlign: 'center', border: '1px solid rgba(194,161,115,.45)', background: 'linear-gradient(180deg,rgba(194,161,115,.14),transparent)', color: '#e8dcc4', fontSize: 12.5, letterSpacing: '.05em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            This helped
          </div>
          <div
            onClick={onNotThis}
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
