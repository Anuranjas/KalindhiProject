import { Router } from 'express';
import { getPool } from '../mysql.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { applicant_name, email, people_count, transport_mode, package_date, package_id, package_name } = req.body || {};
    if (!applicant_name || !email || !people_count || !transport_mode || !package_date || !package_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const count = Number(people_count);
    if (!Number.isInteger(count) || count <= 0) {
      return res.status(400).json({ error: 'people_count must be a positive integer' });
    }

    const pool = await getPool();
    // Validate package exists to provide a friendly error before FK fails
    const [pkgRows] = await pool.query('SELECT id, name FROM packages WHERE id = ?', [package_id]);
    if (!pkgRows.length) {
      return res.status(400).json({ error: 'Invalid package selected' });
    }
    const pkgName = package_name || pkgRows[0].name;
    await pool.query(
      'INSERT INTO bookings (applicant_name, email, people_count, transport_mode, package_id, package_name, package_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [applicant_name, email, count, transport_mode, package_id, pkgName, package_date]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
