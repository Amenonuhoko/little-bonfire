import { hasBackend, supabase } from './supabase';
import { KINDLING, KINDLING_IDS, INITIAL_USED } from '../data';
import { getClientToken } from './clientToken';

// Everything the app needs from persistence, behind one small async
// interface — `fetchState`, `dropMessage`, `markHelped` — so App.jsx never
// has to know whether it's talking to Supabase or to the in-memory
// fallback below. Swapping backends is swapping which of these two
// objects `store` points to, nothing else.

// ---------------------------------------------------------------------
// Local fallback — used whenever VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY
// aren't set (see supabase.js). Reproduces the app's original in-memory
// behavior: a handful of seed messages, nothing persisted across reloads,
// nothing shared between visitors. This keeps the site fully working the
// moment it's deployed, before anyone has set up a database.
// ---------------------------------------------------------------------
let localSeq = 0;
let localMessages = [];

function seedLocal() {
  localMessages = [];
  localSeq = 0;
  for (const id of KINDLING_IDS) {
    const live = KINDLING[id].live;
    for (let i = 0; i < INITIAL_USED[id]; i++) {
      localMessages.push({ id: `local-${localSeq}`, kindlingId: id, text: live[localSeq % live.length].t });
      localSeq++;
    }
  }
}
seedLocal();

const localStore = {
  async fetchState() {
    return { messages: localMessages.slice(), helpedCount: 0 };
  },
  async dropMessage(kindlingId, text) {
    const message = { id: `local-${localSeq++}`, kindlingId, text };
    localMessages.push(message);
    return message;
  },
  async markHelped(id) {
    localMessages = localMessages.filter((m) => m.id !== id);
  },
};

async function postJson(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${path} failed (${res.status})`);
  return data;
}

// ---------------------------------------------------------------------
// Remote (Supabase) implementation. Reads go straight to Supabase with
// the public anon key (see db/schema.sql — reads are the one thing RLS
// leaves open to everyone, since none of this is sensitive). Writes go
// through the /api/drop and /api/help serverless functions instead of
// an anon insert/update, so the service-role key they use never has to
// exist in the browser — see db/schema.sql's RLS comment for why that
// matters and app/api/*.js for the functions themselves.
// ---------------------------------------------------------------------
const remoteStore = {
  async fetchState() {
    const [{ data: rows, error: rowsError }, { count, error: countError }] = await Promise.all([
      supabase.from('live_messages').select('id, kindling_id, text'),
      supabase.from('messages').select('id', { count: 'exact', head: true }).not('helped_at', 'is', null),
    ]);
    if (rowsError) throw rowsError;
    if (countError) throw countError;
    return {
      messages: rows.map((r) => ({ id: r.id, kindlingId: r.kindling_id, text: r.text })),
      helpedCount: count || 0,
    };
  },
  async dropMessage(kindlingId, text) {
    const data = await postJson('/api/drop', { kindlingId, text, clientToken: getClientToken() });
    return { id: data.id, kindlingId: data.kindlingId, text: data.text };
  },
  async markHelped(id) {
    await postJson('/api/help', { id });
  },
};

export const store = hasBackend ? remoteStore : localStore;
