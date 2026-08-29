import { useEffect, useMemo, useRef, useState } from 'react';
import { KINDLING, KINDLING_IDS, totalFor } from './data';
import { store } from './lib/store';
import { hasBackend } from './lib/supabase';
import BonfireCanvas from './BonfireCanvas';
import HomeScreen from './screens/HomeScreen';
import KindlingScreen from './screens/KindlingScreen';
import ComposeScreen from './screens/ComposeScreen';
import ConfirmScreen from './screens/ConfirmScreen';
import ReadScreen from './screens/ReadScreen';

function slotIdxsFor(kindlingId, templateIdx) {
  return KINDLING[kindlingId].templates[templateIdx].parts
    .map((p, i) => (p.opts ? i : -1))
    .filter((i) => i >= 0);
}

function composeText(kindlingId, templateIdx, picks) {
  return KINDLING[kindlingId].templates[templateIdx].parts
    .map((p, i) => (p.opts ? picks[i] || '' : p.lit))
    .join('')
    .trim();
}

// Ember display fields (color/name) are derived from the kindling, not
// stored per-message — this is the one place that joins the two.
function toViewEmber(message) {
  const b = KINDLING[message.kindlingId];
  return { id: message.id, kindlingId: message.kindlingId, text: message.text, color: b.color, name: b.name };
}

export default function App() {
  const [screen, setScreen] = useState('home'); // home | pick | compose | confirm | read
  const [kindling, setKindling] = useState('vigil');
  const [template, setTemplate] = useState(0); // which flavor of the kindling is active
  const [revealed, setRevealed] = useState(false);
  const [sky, setSky] = useState(0); // 0 = at the fire, 1 = up in the sky
  const [picks, setPicks] = useState({});
  const [slot, setSlot] = useState(0);
  const [dropped, setDropped] = useState('');
  const [starCount, setStarCount] = useState(150);

  // messages is the single source of truth for every live ember — fetched
  // once from the store (local in-memory, or Supabase once configured;
  // see lib/store.js) and kept up to date by drop()/helpedEmber() below.
  const [messages, setMessages] = useState([]);

  const [readingEmber, setReadingEmber] = useState(null);
  const [viewEmber, setViewEmber] = useState(null); // the ember shown on the dedicated read screen
  const [moonSeat, setMoonSeat] = useState(false); // the moon Easter egg card

  const fireRef = useRef(null);
  const dragRef = useRef(null);
  const seenIdsRef = useRef(new Set()); // embers already surfaced in this browse, so swiping doesn't repeat

  useEffect(() => {
    let cancelled = false;
    store.fetchState().then(({ messages: msgs, helpedCount }) => {
      if (cancelled) return;
      setMessages(msgs);
      if (hasBackend) setStarCount((n) => n + helpedCount);
    }).catch((err) => console.error('Failed to load messages:', err));
    return () => { cancelled = true; };
  }, []);

  // how many live messages each kindling has — the scarcity count — is
  // just a tally of `messages`, not separately tracked state
  const used = useMemo(() => {
    const u = {};
    for (const id of KINDLING_IDS) u[id] = 0;
    for (const m of messages) u[m.kindlingId] = (u[m.kindlingId] || 0) + 1;
    return u;
  }, [messages]);

  const liveCountLabel = `${messages.length} embers live`;

  const goHome = () => { setScreen('home'); setRevealed(false); };
  const tapFire = () => setRevealed((r) => !r);
  const goPickDrop = () => setScreen('pick');
  const dismissEmber = () => setReadingEmber(null);
  const dismissMoon = () => setMoonSeat(false);

  // draws a random message, avoiding ones already seen this browse unless
  // every message has been shown, in which case it cycles back around
  const pickRandomMessage = (pool) => {
    if (!pool.length) return null;
    const unseen = pool.filter((m) => !seenIdsRef.current.has(m.id));
    const candidates = unseen.length ? unseen : pool;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    if (seenIdsRef.current.has(pick.id)) seenIdsRef.current = new Set([pick.id]);
    else seenIdsRef.current.add(pick.id);
    return pick;
  };

  const goViewEmbers = () => {
    seenIdsRef.current = new Set();
    const m = pickRandomMessage(messages);
    if (!m) return;
    setViewEmber(toViewEmber(m));
    setScreen('read');
  };

  const swipeNextEmber = () => {
    const m = pickRandomMessage(messages);
    if (m) setViewEmber(toViewEmber(m)); else goHome();
  };

  const onWheel = (e) => {
    const d = e.deltaY;
    setSky((v) => Math.max(0, Math.min(1, v + (d < 0 ? 0.3 : -0.3))));
  };
  const onDown = (e) => { dragRef.current = { x: e.clientX, y: e.clientY, sky, moved: 0 }; };
  const onMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dy = d.y - e.clientY;
    d.moved = Math.max(d.moved, Math.abs(dy));
    setSky(Math.max(0, Math.min(1, d.sky + dy / 260)));
  };
  const onUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && d.moved < 6) {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = d.x - rect.left, py = d.y - rect.top;
      const hit = fireRef.current?.hitTestEmber(px, py);
      if (hit) setReadingEmber(hit);
      else if (fireRef.current?.hitTestMoon(px, py)) setMoonSeat(true);
      else tapFire();
    } else setSky((v) => (v > 0.4 ? 1 : 0));
  };

  const pickKindling = (id) => {
    const total = totalFor(id);
    const full = total > 0 && used[id] >= total;
    if (full) { setKindling(id); return; }
    const idxs = slotIdxsFor(id, 0);
    setKindling(id);
    setTemplate(0);
    setPicks({});
    setSlot(idxs.length ? idxs[0] : 0);
    setScreen('compose');
  };

  const selectSlot = (i) => setSlot(i);

  const selectTemplate = (idx) => {
    const idxs = slotIdxsFor(kindling, idx);
    setTemplate(idx);
    setPicks({});
    setSlot(idxs.length ? idxs[0] : 0);
  };

  const choose = (slotIdx, val) => {
    const nextPicks = { ...picks, [slotIdx]: val };
    setPicks(nextPicks);
    const idxs = slotIdxsFor(kindling, template);
    const next = idxs.find((i) => nextPicks[i] === undefined);
    setSlot(next === undefined ? slotIdx : next);
  };

  const drop = () => {
    if (slotIdxsFor(kindling, template).some((i) => picks[i] === undefined)) return;
    const text = composeText(kindling, template, picks);
    setDropped(text);
    setScreen('confirm');
    fireRef.current?.flare();
    store.dropMessage(kindling, text)
      .then((message) => setMessages((ms) => [...ms, message]))
      .catch((err) => console.error('Failed to save drop:', err));
  };

  // voting lives on the ember you deliberately tapped on the fire, not on
  // the random browse from "Read one" — that's pure discovery, no action
  const helpedReadingEmber = () => {
    if (!readingEmber) return;
    setMessages((ms) => ms.filter((m) => m.id !== readingEmber.id));
    fireRef.current?.addStar();
    setStarCount((n) => n + 1);
    setReadingEmber(null);
    store.markHelped(readingEmber.id).catch((err) => console.error('Failed to save "this helped":', err));
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        background: '#07080a',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          height: '100dvh',
          overflow: 'hidden',
          background: '#0a0b0d',
        }}
      >
        <BonfireCanvas
          ref={fireRef}
          screen={screen}
          sky={sky}
          revealed={revealed}
          used={used}
          activeEmberId={(screen === 'read' ? viewEmber?.id : readingEmber?.id) ?? null}
          messages={messages}
        />

        {screen === 'home' && (
          <HomeScreen
            quiet={!revealed && sky < 0.4}
            revealed={revealed && sky < 0.4}
            skyMode={sky >= 0.4}
            liveCountLabel={liveCountLabel}
            starCountLabel={`${starCount} stars risen`}
            readingEmber={readingEmber}
            onDismissEmber={dismissEmber}
            onHelpedEmber={helpedReadingEmber}
            moonSeat={moonSeat}
            onDismissMoon={dismissMoon}
            onWheel={onWheel}
            onDown={onDown}
            onMove={onMove}
            onUp={onUp}
            onDrop={goPickDrop}
            onRead={goViewEmbers}
          />
        )}

        {screen === 'pick' && (
          <KindlingScreen used={used} activeKindling={kindling} onBack={goHome} onPick={pickKindling} />
        )}

        {screen === 'compose' && (
          <ComposeScreen
            kindlingId={kindling}
            templateIdx={template}
            onSelectTemplate={selectTemplate}
            picks={picks}
            slot={slot}
            onBack={goPickDrop}
            onSelectSlot={selectSlot}
            onChoose={choose}
            onDrop={drop}
          />
        )}

        {screen === 'confirm' && (
          <ConfirmScreen kindlingId={kindling} droppedText={dropped} onDismiss={goHome} />
        )}

        {screen === 'read' && viewEmber && (
          <ReadScreen
            ember={viewEmber}
            onBack={goHome}
            onSwipeNext={swipeNextEmber}
          />
        )}
      </div>
    </div>
  );
}
