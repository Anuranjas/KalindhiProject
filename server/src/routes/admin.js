import { Router } from 'express';
import { getPool } from '../mysql.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from '../lib/mailer.js';

const router = Router();

// Middleware to verify admin token
const adminAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Admin access denied' });
    }
    req.adminId = decoded.sub;
    next();
  } catch (error) {
    console.error('Admin Auth Error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

async function sendAdminOTP(email, code) {
  await sendMail({
    to: email,
    subject: 'Admin Dashboard Access Code',
    html: `
      <div style="font-family: sans-serif; padding: 40px; background-color: #1a2e1a; color: white; border-radius: 8px;">
        <h2 style="color: #c5a059;">Security Verification</h2>
        <p>You requested access to the Kalindi Admin Dashboard. Use the following code to authorize your session:</p>
        <div style="font-size: 32px; letter-spacing: 12px; font-weight: bold; margin: 30px 0; color: #c5a059;">${code}</div>
        <p style="font-size: 12px; opacity: 0.6;">Expires in 10 minutes. If this wasn't you, please change the admin password immediately.</p>
      </div>
    `
  });
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await getPool();
    const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (!admins.length) return res.status(401).json({ error: 'Unauthorized credentials (email)' });

    const admin = admins[0];
    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ error: 'Unauthorized credentials (password)' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query('DELETE FROM user_otps WHERE user_email = ?', [email]);
    await pool.query('INSERT INTO user_otps (user_email, otp_code, expires_at) VALUES (?, ?, ?)', [email, code, expires]);

    await sendAdminOTP(email, code);

    res.json({ message: 'OTP sent', email });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    const pool = await getPool();
    const [otps] = await pool.query('SELECT * FROM user_otps WHERE user_email = ? AND otp_code = ? AND expires_at > NOW()', [email, code]);
    
    if (!otps.length) return res.status(400).json({ error: 'Invalid or expired code' });

    const [admins] = await pool.query('SELECT id, name, email FROM admins WHERE email = ?', [email]);
    const admin = admins[0];

    const token = jwt.sign({ sub: admin.id, email: admin.email, isAdmin: true }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1d' });
    await pool.query('DELETE FROM user_otps WHERE user_email = ?', [email]);

    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all bookings for traveler management
router.get('/bookings', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [bookings] = await pool.query(`
      SELECT b.*, p.name as package_name, p.price as package_price
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      ORDER BY b.created_at DESC
    `);
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/stats', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    
    // Core Counts
    const [[{ user_count }]] = await pool.query('SELECT COUNT(*) as user_count FROM users');
    const [[{ booking_count }]] = await pool.query('SELECT COUNT(*) as booking_count FROM bookings');
    const [[{ package_count }]] = await pool.query('SELECT COUNT(*) as package_count FROM packages');
    const [[{ enquiry_count }]] = await pool.query('SELECT COUNT(*) as enquiry_count FROM enquiries WHERE is_archived = 0');
    
    // Detailed Metrics
    const [[{ total_travelers }]] = await pool.query('SELECT SUM(people_count) as total_travelers FROM bookings');
    const [[{ revenue }]] = await pool.query(`
      SELECT SUM(p.price * b.people_count) as revenue 
      FROM bookings b 
      JOIN packages p ON b.package_id = p.id
    `);

    // Recent Activity Log
    const [recent] = await pool.query(`
      SELECT b.*, p.name as package_name 
      FROM bookings b 
      JOIN packages p ON b.package_id = p.id 
      ORDER BY b.created_at DESC 
      LIMIT 10
    `);

    res.json({
      stats: {
        travelers: total_travelers || 0,
        bookings: booking_count,
        revenue: revenue || 0,
        enquiries: enquiry_count,
        packages: package_count,
        members: user_count
      },
      recentBookings: recent
    });
  } catch (e) {
    console.error('[ADMIN_STATS] Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

router.get('/users', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT id, name, email, is_verified, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/enquiries', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/enquiries/:id/read', adminAuthenticate, async (req, res) => {
  try {
    const { is_read } = req.body;
    const pool = await getPool();
    await pool.query('UPDATE enquiries SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/enquiries/:id/archive', adminAuthenticate, async (req, res) => {
  try {
    const { is_archived } = req.body;
    const pool = await getPool();
    await pool.query('UPDATE enquiries SET is_archived = ? WHERE id = ?', [is_archived ? 1 : 0, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/enquiries/:id', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/packages', adminAuthenticate, async (req, res) => {
  try {
    const { id, name, price, duration, districts, features, highlight, image } = req.body;
    if (!id || !name || !price || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await getPool();
    await pool.query(
      'INSERT INTO packages (id, name, price, duration, districts_json, features_json, highlight, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, price, duration, JSON.stringify(districts || []), JSON.stringify(features || []), highlight ? 1 : 0, image]
    );

    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/packages/:id', adminAuthenticate, async (req, res) => {
  try {
    const pkgId = req.params.id;
    const pool = await getPool();
    console.log(`[ADMIN] Deleting package: ${pkgId}`);
    
    // Check if package exists first for better error messages
    const [existing] = await pool.query('SELECT name FROM packages WHERE id = ?', [pkgId]);
    if (existing.length === 0) {
      console.warn(`[ADMIN] Attempted to delete non-existent package: ${pkgId}`);
      return res.status(404).json({ error: 'Package not found in registry' });
    }

    const [result] = await pool.query('DELETE FROM packages WHERE id = ?', [pkgId]);
    
    if (result.affectedRows === 0) {
      throw new Error('Failed to remove package from database');
    }

    console.log(`[ADMIN] Successfully deleted package: ${pkgId} (${existing[0].name})`);
    res.json({ ok: true });
  } catch (e) {
    console.error(`[ADMIN] Delete package error:`, e.message);
    res.status(500).json({ error: e.message });
  }
});

router.put('/packages/:id', adminAuthenticate, async (req, res) => {
  try {
    const { name, price, duration, districts, features, image } = req.body;
    const pool = await getPool();
    await pool.query(
      'UPDATE packages SET name = ?, price = ?, duration = ?, districts_json = ?, features_json = ?, image = ? WHERE id = ?',
      [name, price, duration, JSON.stringify(districts || []), JSON.stringify(features || []), image, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/users/:id', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/bookings/:id', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
