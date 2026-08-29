import { BONE } from '../data';

export default function HomeScreen({
  quiet, revealed, skyMode, liveCountLabel, starCountLabel,
  readingEmber, onDismissEmber, onHelpedEmber,
  moonSeat, onDismissMoon,
  onWheel, onDown, onMove, onUp, onDrop, onRead,
}) {
  // buttons get their own pointer handlers (with stopPropagation) instead
  // of onClick — the trailing click event otherwise loses a race against
  // the outer onPointerUp (dismiss) below and silently never fires
  const stop = (e) => e.stopPropagation();

  // a little Easter egg: tapping the moon (see BonfireCanvas's hitTestMoon)
  // surfaces this instead of the usual reveal/dismiss toggle
  if (moonSeat) {
    return (
      <div
        onPointerUp={onDismissMoon}
        style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '64px 26px 52px', cursor: 'pointer', animation: 'ddIn .4s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: "'Young Serif',serif", fontSize: 17, color: BONE }}>
            There's a seat up there.
          </div>
          <div style={{ fontFamily: 'Newsreader,serif', fontSize: 16.5, lineHeight: 1.65, color: '#f0e2c8', textShadow: '0 0 34px rgba(194,161,115,.3)' }}>
            Someone's keeping it warm for whoever's ready to take it. If you'd like to help them get there —
          </div>
          <a
            href="https://paypal.me/skytale"
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={stop}
            onPointerUp={stop}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              padding: 15, textDecoration: 'none', borderRadius: 2,
              border: '1px solid rgba(194,161,115,.45)',
              background: 'linear-gradient(180deg,rgba(194,161,115,.18),rgba(194,161,115,.05))',
              color: '#e8dcc4', fontSize: 13.5, fontWeight: 500, letterSpacing: '.03em',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
              <path d="M7.5 3h6.7c3.2 0 5.4 1.9 5.4 5 0 4-2.9 6.6-7.1 6.6h-2.7L8.6 21H4.8L7.5 3Z" fill="currentColor" opacity=".55" />
              <path d="M9.7 6.2h6.1c1 1 1.5 2.3 1.2 3.9-.5 3-3 4.9-6.5 4.9H8.2l-1 6.4H3.4L6.1 3.6h4.1c2.6 0 4.4 1 4.8 2.9" fill="currentColor" opacity=".9" />
            </svg>
            Support me on PayPal
          </a>
          <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(230,221,203,.3)' }}>
            touch anywhere to return
          </div>
        </div>
      </div>
    );
  }

  if (readingEmber) {
    return (
      <div
        onPointerUp={onDismissEmber}
        style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '64px 26px 52px', cursor: 'pointer', animation: 'ddIn .4s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: readingEmber.color, boxShadow: `0 0 12px ${readingEmber.color}` }} />
            <div style={{ fontFamily: "'Young Serif',serif", fontSize: 16, color: BONE }}>{readingEmber.name}</div>
          </div>
          <div style={{ fontFamily: 'Newsreader,serif', fontSize: 19, lineHeight: 1.65, color: '#f0e2c8', textShadow: '0 0 34px rgba(194,161,115,.3)' }}>
            {readingEmber.text}
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg,rgba(194,161,115,.5),transparent)' }} />
          <div style={{ display: 'flex', gap: 9 }}>
            <div
              onPointerDown={stop}
              onPointerUp={(e) => { stop(e); onHelpedEmber(); }}
              style={{ flex: 1, padding: 15, textAlign: 'center', border: '1px solid rgba(194,161,115,.45)', background: 'linear-gradient(180deg,rgba(194,161,115,.14),transparent)', color: '#e8dcc4', fontSize: 12.5, letterSpacing: '.05em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              This helped
            </div>
            <div
              onPointerDown={stop}
              onPointerUp={(e) => { stop(e); onDismissEmber(); }}
              style={{ flex: 1, padding: 15, textAlign: 'center', border: '1px solid rgba(230,221,203,.14)', color: 'rgba(230,221,203,.55)', fontSize: 12.5, letterSpacing: '.05em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Not this
            </div>
          </div>
          <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(230,221,203,.3)' }}>
            touch anywhere to return
          </div>
        </div>
      </div>
    );
  }

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
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => { e.stopPropagation(); onDrop(); }}
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
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => { e.stopPropagation(); onRead(); }}
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
