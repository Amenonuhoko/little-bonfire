import { getSupabaseAdmin } from './_supabaseAdmin.js';

// Marks one message helped, via the mark_helped() DB function — see
// db/schema.sql for why that function exists instead of a raw UPDATE.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return res.status(503).json({ error: 'Backend not configured' });

  const { id } = req.body || {};
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { error } = await admin.rpc('mark_helped', { target_id: id });
  if (error) {
    console.error('mark_helped failed:', error.message);
    return res.status(500).json({ error: 'Could not update the message' });
  }

  return res.status(200).json({ ok: true });
}
