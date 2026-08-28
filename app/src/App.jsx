import { useRef, useState } from 'react';
import { BUCKETS, INITIAL_USED, totalFor } from './data';
import BonfireCanvas from './BonfireCanvas';
import HomeScreen from './screens/HomeScreen';
import BucketsScreen from './screens/BucketsScreen';
import ComposeScreen from './screens/ComposeScreen';
import ConfirmScreen from './screens/ConfirmScreen';
import ReadScreen from './screens/ReadScreen';

function slotIdxsFor(bucketId) {
  return BUCKETS[bucketId].parts.map((p, i) => (p.opts ? i : -1)).filter((i) => i >= 0);
}

function composeText(bucketId, picks) {
  return BUCKETS[bucketId].parts
    .map((p, i) => (p.opts ? picks[i] || '' : p.lit))
    .join('')
    .trim();
}

export default function App() {
  const [screen, setScreen] = useState('home'); // home | pick | compose | confirm | read
  const [mode, setMode] = useState('drop'); // drop | read
  const [bucket, setBucket] = useState('vigil');
  const [revealed, setRevealed] = useState(false);
  const [sky, setSky] = useState(0); // 0 = at the fire, 1 = up in the sky
  const [picks, setPicks] = useState({});
  const [slot, setSlot] = useState(0);
  const [readIdx, setReadIdx] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackTone, setFeedbackTone] = useState('n');
  const [used, setUsed] = useState(INITIAL_USED);
  const [dropped, setDropped] = useState('');
  const [starCount, setStarCount] = useState(150);

  const fireRef = useRef(null);
  const dragRef = useRef(null);

  const liveTotal = Object.values(used).reduce((a, x) => a + x, 0);
  const liveCountLabel = `${liveTotal} embers live · 5 buckets`;

  const goHome = () => { setScreen('home'); setFeedback(''); setRevealed(false); };
  const tapFire = () => setRevealed((r) => !r);
  const goPickDrop = () => { setMode('drop'); setScreen('pick'); };
  const goPickRead = () => { setMode('read'); setScreen('pick'); setFeedback(''); };

  const onWheel = (e) => {
    const d = e.deltaY;
    setSky((v) => Math.max(0, Math.min(1, v + (d < 0 ? 0.34 : -0.34))));
  };
  const onDown = (e) => { dragRef.current = { y: e.clientY, sky, moved: 0 }; };
  const onMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dy = d.y - e.clientY;
    d.moved = Math.max(d.moved, Math.abs(dy));
    setSky(Math.max(0, Math.min(1, d.sky + dy / 420)));
  };
  const onUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && d.moved < 6) tapFire();
    else setSky((v) => (v > 0.5 ? 1 : 0));
  };

  const pickBucket = (id) => {
    const total = totalFor(id);
    const full = total > 0 && used[id] >= total;
    if (mode === 'drop' && full) { setBucket(id); setFeedback(''); return; }
    if (mode === 'read') { setBucket(id); setReadIdx(0); setFeedback(''); setScreen('read'); return; }
    const idxs = slotIdxsFor(id);
    setBucket(id);
    setPicks({});
    setSlot(idxs.length ? idxs[0] : 0);
    setScreen('compose');
  };

  const selectSlot = (i) => setSlot(i);

  const choose = (slotIdx, val) => {
    const nextPicks = { ...picks, [slotIdx]: val };
    setPicks(nextPicks);
    const idxs = slotIdxsFor(bucket);
    const next = idxs.find((i) => nextPicks[i] === undefined);
    setSlot(next === undefined ? slotIdx : next);
  };

  const drop = () => {
    if (slotIdxsFor(bucket).some((i) => picks[i] === undefined)) return;
    const total = totalFor(bucket);
    setUsed((u) => ({ ...u, [bucket]: total > 0 ? Math.min(total, u[bucket] + 1) : u[bucket] + 1 }));
    setDropped(composeText(bucket, picks));
    setScreen('confirm');
    fireRef.current?.flare();
    fireRef.current?.addEmber(bucket);
  };

  const helped = () => {
    const total = totalFor(bucket);
    if (total > 0) setUsed((u) => ({ ...u, [bucket]: Math.max(0, u[bucket] - 1) }));
    setFeedback('Spent. It rose to the sky — a slot opened because it worked.');
    setFeedbackTone('g');
    setReadIdx((i) => (i + 1) % BUCKETS[bucket].live.length);
    fireRef.current?.addStar();
    fireRef.current?.removeOldestEmber();
    setStarCount((n) => n + 1);
  };

  const notThis = () => {
    setFeedback('Logged. A few more of those and it retires quietly.');
    setFeedbackTone('n');
    setReadIdx((i) => (i + 1) % BUCKETS[bucket].live.length);
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
        <BonfireCanvas ref={fireRef} screen={screen} sky={sky} />

        {screen === 'home' && (
          <HomeScreen
            quiet={!revealed && sky < 0.4}
            revealed={revealed && sky < 0.4}
            skyMode={sky >= 0.4}
            liveCountLabel={liveCountLabel}
            starCountLabel={`${starCount} stars spent`}
            onWheel={onWheel}
            onDown={onDown}
            onMove={onMove}
            onUp={onUp}
            onDrop={goPickDrop}
            onRead={goPickRead}
          />
        )}

        {screen === 'pick' && (
          <BucketsScreen mode={mode} used={used} activeBucket={bucket} onBack={goHome} onPick={pickBucket} />
        )}

        {screen === 'compose' && (
          <ComposeScreen
            bucketId={bucket}
            picks={picks}
            slot={slot}
            onBack={goPickDrop}
            onSelectSlot={selectSlot}
            onChoose={choose}
            onDrop={drop}
          />
        )}

        {screen === 'confirm' && (
          <ConfirmScreen bucketId={bucket} droppedText={dropped} onDismiss={goHome} />
        )}

        {screen === 'read' && (
          <ReadScreen
            bucketId={bucket}
            readIdx={readIdx}
            feedback={feedback}
            feedbackTone={feedbackTone}
            onBack={goPickRead}
            onHelped={helped}
            onNotThis={notThis}
          />
        )}
      </div>
    </div>
  );
}
