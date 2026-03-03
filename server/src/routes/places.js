import { Router } from 'express';
import { getPool } from '../mysql.js';

const router = Router();

// Get all places grouped by district, or just a list of places
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM places ORDER BY district ASC, name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get places by district
router.get('/:district', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM places WHERE district = ? ORDER BY name ASC', [req.params.district]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get list of districts
router.get('/districts/list', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT DISTINCT district FROM places ORDER BY district ASC');
    res.json(rows.map(row => row.district));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
