import { BUCKETS } from '../data';

export default function ComposeScreen({ bucketId, picks, slot, onBack, onSelectSlot, onChoose, onDrop }) {
  const b = BUCKETS[bucketId];
  const slotIdxs = b.parts.map((p, i) => (p.opts ? i : -1)).filter((i) => i >= 0);
  const allPicked = slotIdxs.every((i) => picks[i] !== undefined);
  const slotOpts = (b.parts[slot] && b.parts[slot].opts) || [];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(9,10,12,.9),rgba(9,10,12,.98))', display: 'flex', flexDirection: 'column', padding: '64px 0 34px', animation: 'ddIn .35s ease' }}>
      <div style={{ padding: '0 24px 16px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div onClick={onBack} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(230,221,203,.4)', cursor: 'pointer' }}>
            ← buckets
          </div>
          <div style={{ fontFamily: "'Young Serif',serif", fontSize: 24, color: b.color }}>{b.name}</div>
        </div>
      </div>

      <div style={{ padding: '0 24px', borderTop: '1px solid rgba(230,221,203,.1)', borderBottom: '1px solid rgba(230,221,203,.1)' }}>
        <div style={{ padding: '22px 0', fontFamily: 'Newsreader,serif', fontSize: 20.5, lineHeight: 1.72, color: '#e8dcc4', letterSpacing: '.005em' }}>
          {b.parts.map((p, i) => {
            if (!p.opts) return <span key={i}>{p.lit}</span>;
            const val = picks[i];
            const active = slot === i;
            return (
              <span
                key={i}
                onClick={() => onSelectSlot(i)}
                style={{
                  cursor: 'pointer', padding: '1px 5px', margin: '0 1px',
                  color: val ? '#f4e6c9' : 'rgba(230,221,203,.35)',
                  borderBottom: `1px solid ${active ? '#c2a173' : val ? 'rgba(194,161,115,.35)' : 'rgba(230,221,203,.2)'}`,
                  background: active ? 'rgba(194,161,115,.12)' : 'transparent',
                }}
              >
                {val || '——————'}
              </span>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(230,221,203,.35)' }}>
          choose · slot {Math.max(0, slotIdxs.indexOf(slot)) + 1} of {slotIdxs.length}
        </div>
        {slotOpts.map((o) => {
          const chosen = picks[slot] === o;
          return (
            <div
              key={o}
              onClick={() => onChoose(slot, o)}
              style={{
                padding: '13px 15px',
                border: `1px solid ${chosen ? 'rgba(194,161,115,.7)' : 'rgba(230,221,203,.12)'}`,
                background: chosen ? 'rgba(194,161,115,.1)' : 'rgba(230,221,203,.02)',
                fontFamily: 'Newsreader,serif', fontSize: 15, lineHeight: 1.4,
                color: chosen ? '#f4e6c9' : 'rgba(230,221,203,.75)', cursor: 'pointer',
              }}
            >
              {o}
            </div>
          );
        })}
        <div style={{ height: 8 }} />
      </div>

      <div style={{ padding: '14px 24px 0', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div
          onClick={() => allPicked && onDrop()}
          style={{
            flex: 1, padding: 16, textAlign: 'center',
            border: `1px solid ${allPicked ? 'rgba(194,161,115,.85)' : 'rgba(230,221,203,.12)'}`,
            background: allPicked ? 'linear-gradient(180deg,rgba(194,161,115,.26),rgba(194,161,115,.08))' : 'transparent',
            color: allPicked ? '#f4e6c9' : 'rgba(230,221,203,.3)',
            fontSize: 13.5, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase',
            fontFamily: 'Archivo,sans-serif', cursor: allPicked ? 'pointer' : 'default',
          }}
        >
          {allPicked ? `Drop into ${b.name}` : 'Fill every slot'}
        </div>
      </div>
    </div>
  );
}
