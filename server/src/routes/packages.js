import { Router } from 'express';
import { getPool } from '../mysql.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM packages');
    const packages = rows.map(pkg => ({
      ...pkg,
      districts: pkg.districts_json,
      features: pkg.features_json,
      description: pkg.description,
      highlight: !!pkg.highlight
    }));
    res.json(packages);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
