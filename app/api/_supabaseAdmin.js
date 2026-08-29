import { createClient } from '@supabase/supabase-js';

// Server-only client, used exclusively by the functions in this
// directory. SUPABASE_SERVICE_ROLE_KEY is deliberately NOT prefixed
// VITE_ — Vite only ever inlines VITE_-prefixed vars into the browser
// bundle, so this one never leaves the server. (Files starting with
// `_` are ignored by Vercel's file-based routing, so this isn't itself
// callable as an endpoint.)
let admin = null;

export function getSupabaseAdmin() {
  if (admin) return admin;
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  return admin;
}

// Real client IP, as Vercel sees it — used only to compute ip_hash
// (see db/schema.sql), never stored or logged raw.
export function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || '';
}
