// A random per-browser token, persisted in localStorage, sent with every
// drop so the database can apply a light per-device rate limit (see
// enforce_rate_limit in db/schema.sql). Not an identity — nothing about
// a message is ever readable back to a particular token — and clearing
// storage resets it, so this is a speed bump against accidental
// double-taps and naive spam scripts, not real abuse protection.
const KEY = 'dead-drop-client-token';

export function getClientToken() {
  try {
    let token = localStorage.getItem(KEY);
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem(KEY, token);
    }
    return token;
  } catch {
    // storage blocked (private mode, locked-down browser, etc.) — still
    // usable, just without the rate-limit benefit across reloads
    return crypto.randomUUID();
  }
}
