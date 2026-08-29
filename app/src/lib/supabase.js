import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Both env vars are absent until someone runs the setup in db/schema.sql
// and adds the two keys (see README.md). Until then the app runs in
// local-only mode — see store.js — instead of crashing on missing config.
export const hasBackend = Boolean(url && key);
export const supabase = hasBackend ? createClient(url, key) : null;
