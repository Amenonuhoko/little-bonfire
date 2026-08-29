import { useRef, useState } from 'react';
import { KINDLING, INITIAL_USED, totalFor } from './data';
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

export default function App() {
  const [screen, setScreen] = useState('home'); // home | pick | compose | confirm | read
  const [kindling, setKindling] = useState('vigil');
  const [template, setTemplate] = useState(0); // which flavor of the kindling is active
  const [revealed, setRevealed] = useState(false);
  const [sky, setSky] = useState(0); // 0 = at the fire, 1 = up in the sky
  const [picks, setPicks] = useState({});
  const [slot, setSlot] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackTone, setFeedbackTone] = useState('n');
  const [used, setUsed] = useState(INITIAL_USED);
  const [dropped, setDropped] = useState('');
  const [starCount, setStarCount] = useState(150);

  const [readingEmber, setReadingEmber] = useState(null);
  const [viewEmber, setViewEmber] = useState(null); // the ember shown on the dedicated read screen

  const fireRef = useRef(null);
  const dragRef = useRef(null);
  const seenIdsRef = useRef(new Set()); // embers already surfaced in this browse, so swiping doesn't repeat

  const liveTotal = Object.values(used).reduce((a, x) => a + x, 0);
  const liveCountLabel = `${liveTotal} embers live`;

  const goHome = () => { setScreen('home'); setFeedback(''); setRevealed(false); };
  const tapFire = () => setRevealed((r) => !r);
  const goPickDrop = () => setScreen('pick');
  const dismissEmber = () => setReadingEmber(null);

  // draws a random ember, avoiding ones already seen this browse unless
  // every ember has been shown, in which case it cycles back around
  const pickRandomEmber = () => {
    const e = fireRef.current?.randomEmber([...seenIdsRef.current]);
    if (!e) return null;
    if (seenIdsRef.current.has(e.id)) seenIdsRef.current = new Set([e.id]);
    else seenIdsRef.current.add(e.id);
    return e;
  };

  const goViewEmbers = () => {
    seenIdsRef.current = new Set();
    const e = pickRandomEmber();
    if (!e) return;
    setViewEmber(e);
    setFeedback('');
    setScreen('read');
  };

  const swipeNextEmber = () => {
    const e = pickRandomEmber();
    if (e) { setViewEmber(e); setFeedback(''); } else goHome();
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
      const hit = fireRef.current?.hitTestEmber(d.x - rect.left, d.y - rect.top);
      if (hit) setReadingEmber(hit);
      else tapFire();
    } else setSky((v) => (v > 0.4 ? 1 : 0));
  };

  const pickKindling = (id) => {
    const total = totalFor(id);
    const full = total > 0 && used[id] >= total;
    if (full) { setKindling(id); setFeedback(''); return; }
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
    const total = totalFor(kindling);
    const text = composeText(kindling, template, picks);
    setUsed((u) => ({ ...u, [kindling]: total > 0 ? Math.min(total, u[kindling] + 1) : u[kindling] + 1 }));
    setDropped(text);
    setScreen('confirm');
    fireRef.current?.flare();
    fireRef.current?.addEmber(kindling, text);
  };

  const helpedEmber = () => {
    if (!viewEmber) return;
    const total = totalFor(viewEmber.kindlingId);
    if (total > 0) setUsed((u) => ({ ...u, [viewEmber.kindlingId]: Math.max(0, u[viewEmber.kindlingId] - 1) }));
    fireRef.current?.removeEmberById(viewEmber.id);
    fireRef.current?.addStar();
    setStarCount((n) => n + 1);
    setFeedback('Risen. It joined the sky — a slot opened because it worked.');
    setFeedbackTone('g');
    const next = pickRandomEmber();
    if (next) setViewEmber(next); else goHome();
  };

  const notThisEmber = () => {
    setFeedback('Logged. A few more of those and it retires quietly.');
    setFeedbackTone('n');
    const next = pickRandomEmber();
    if (next) setViewEmber(next); else goHome();
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
            feedback={feedback}
            feedbackTone={feedbackTone}
            onBack={goHome}
            onHelped={helpedEmber}
            onNotThis={notThisEmber}
            onSwipeNext={swipeNextEmber}
          />
        )}
      </div>
    </div>
  );
}
