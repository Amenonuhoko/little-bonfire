import { createHash } from 'node:crypto';
import { getSupabaseAdmin, getClientIp } from './_supabaseAdmin.js';
import { KINDLING_IDS } from '../src/data.js';

// The only way a message ever gets written — see db/schema.sql's RLS
// comment for why this exists instead of letting the browser insert
// directly with the anon key.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return res.status(503).json({ error: 'Backend not configured' });

  const { kindlingId, text, clientToken } = req.body || {};
  if (!KINDLING_IDS.includes(kindlingId)) {
    return res.status(400).json({ error: 'Invalid kindling' });
  }
  if (typeof text !== 'string' || text.length < 10 || text.length > 500) {
    return res.status(400).json({ error: 'Invalid message length' });
  }
  if (typeof clientToken !== 'string' || clientToken.length < 8 || clientToken.length > 100) {
    return res.status(400).json({ error: 'Invalid client token' });
  }

  const ip = getClientIp(req);
  const ipHash = ip ? createHash('sha256').update(ip).digest('hex') : null;

  const { data, error } = await admin
    .from('messages')
    .insert({ kindling_id: kindlingId, text, client_token: clientToken, ip_hash: ipHash })
    .select('id, kindling_id, text')
    .single();

  if (error) {
    if (error.message?.includes('Slow down')) {
      return res.status(429).json({ error: 'Slow down — try again in a moment.' });
    }
    console.error('drop insert failed:', error.message);
    return res.status(500).json({ error: 'Could not save the message' });
  }

  return res.status(200).json({ id: data.id, kindlingId: data.kindling_id, text: data.text });
}
