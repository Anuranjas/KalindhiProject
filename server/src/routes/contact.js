import { Router } from 'express';
import { getPool } from '../mysql.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    if (String(name).length > 120 || String(email).length > 191) {
      return res.status(400).json({ error: 'Name or email too long' });
    }

    const pool = await getPool();
    await pool.query(
      'INSERT INTO enquiries (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
