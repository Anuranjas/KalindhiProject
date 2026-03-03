import { Router } from 'express';
import { getPool } from '../mysql.js';
import { authenticate } from './auth.js';

const router = Router();

// Purchase/Save a route selection linked to a package
router.post('/purchase', authenticate, async (req, res) => {
  try {
    const { packageId, fromLocation, destinationName, destinationLat, destinationLng } = req.body;
    
    if (!packageId || !fromLocation || !destinationName || !destinationLat || !destinationLng) {
      return res.status(400).json({ error: 'Missing required route information' });
    }

    const pool = await getPool();
    
    // Check if package exists
    const [packages] = await pool.query('SELECT id FROM packages WHERE id = ?', [packageId]);
    if (packages.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    await pool.query(
      'INSERT INTO package_purchased_routes (user_id, package_id, from_location, destination_name, destination_lat, destination_lng) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, packageId, fromLocation, destinationName, destinationLat, destinationLng]
    );

    res.status(201).json({ message: 'Package route saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's purchased package routes
router.get('/my-routes', authenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [routes] = await pool.query(
      `SELECT pr.*, p.name as package_name 
       FROM package_purchased_routes pr 
       JOIN packages p ON pr.package_id = p.id 
       WHERE pr.user_id = ? 
       ORDER BY pr.purchased_at DESC`,
      [req.userId]
    );
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
