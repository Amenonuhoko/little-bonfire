import { KINDLING } from '../data';

export default function ConfirmScreen({ kindlingId, droppedText, onDismiss }) {
  const b = KINDLING[kindlingId];
  return (
    <div
      onClick={onDismiss}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '64px 26px 52px', cursor: 'pointer', animation: 'ddIn .5s ease' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: b.color }}>
          ember released · {b.name}
        </div>
        <div style={{ fontFamily: 'Newsreader,serif', fontSize: 19, lineHeight: 1.65, color: '#e8dcc4', textShadow: '0 0 26px rgba(194,161,115,.35)' }}>
          {droppedText}
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg,rgba(194,161,115,.5),transparent)' }} />
        <div style={{ fontFamily: 'Newsreader,serif', fontSize: 14, lineHeight: 1.55, color: 'rgba(230,221,203,.5)', maxWidth: '34ch' }}>
          The fire took it and grew. Your ember joins the field in {b.name}’s colour. It ages out in nine days — unless enough people spend it first.
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(230,221,203,.3)', animation: 'ddPulse 3s ease-in-out infinite' }}>
          touch anywhere to return
        </div>
      </div>
    </div>
  );
}
