import { BONE } from '../data';

export default function HomeScreen({
  quiet, revealed, skyMode, liveCountLabel, starCountLabel,
  onWheel, onDown, onMove, onUp, onDrop, onRead,
}) {
  return (
    <div
      onWheel={onWheel}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '66px 24px 44px',
        cursor: 'pointer',
        touchAction: 'none',
      }}
    >
      <div style={{ height: 2 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {quiet && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, animation: 'ddIn .6s ease' }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(230,221,203,.34)' }}>
              {liveCountLabel}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(230,221,203,.26)', animation: 'ddPulse 3.4s ease-in-out infinite' }}>
              touch the fire
            </div>
          </div>
        )}

        {revealed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'ddIn .4s ease' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(230,221,203,.4)' }}>
                {liveCountLabel}
              </div>
              <div style={{ fontFamily: "'Young Serif',serif", fontSize: 21, color: BONE }}>Someone left a fire burning.</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
              <div
                onClick={(e) => { e.stopPropagation(); onDrop(); }}
                style={{
                  flex: 1, padding: '15px 18px', borderRadius: 2,
                  border: '1px solid rgba(194,161,115,.45)',
                  background: 'linear-gradient(180deg,rgba(194,161,115,.18),rgba(194,161,115,.05))',
                  color: '#e8dcc4', fontSize: 13.5, fontWeight: 500, letterSpacing: '.03em', textAlign: 'center',
                }}
              >
                Drop a message
              </div>
              <div
                onClick={(e) => { e.stopPropagation(); onRead(); }}
                style={{
                  padding: '15px 18px', border: '1px solid rgba(230,221,203,.16)',
                  color: 'rgba(230,221,203,.75)', fontSize: 13.5, letterSpacing: '.03em',
                  display: 'flex', alignItems: 'center',
                }}
              >
                Read one
              </div>
            </div>
            <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(230,221,203,.28)' }}>
              scroll up toward what worked
            </div>
          </div>
        )}

        {skyMode && (
          <div style={{ animation: 'ddIn .5s ease', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(230,221,203,.32)' }}>
            {starCountLabel}
          </div>
        )}
      </div>
    </div>
  );
}
