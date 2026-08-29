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

// ---------------------------------------------------------------------
// Remote (Supabase) implementation. See db/schema.sql for the table,
// the `live_messages` view (excludes helped and aged-out rows), and the
// `mark_helped` function this calls into instead of an open UPDATE grant.
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
    const { data, error } = await supabase
      .from('messages')
      .insert({ kindling_id: kindlingId, text, client_token: getClientToken() })
      .select('id, kindling_id, text')
      .single();
    if (error) throw error;
    return { id: data.id, kindlingId: data.kindling_id, text: data.text };
  },
  async markHelped(id) {
    const { error } = await supabase.rpc('mark_helped', { target_id: id });
    if (error) throw error;
  },
};

export const store = hasBackend ? remoteStore : localStore;
