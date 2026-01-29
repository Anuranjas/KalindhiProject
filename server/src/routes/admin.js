import { Router } from 'express';
import { getPool } from '../mysql.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from '../lib/mailer.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images (jpg, png, webp) are allowed'));
  }
});

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
    req.adminEmail = decoded.email;
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
    if (!admin.is_approved) {
      return res.status(403).json({ error: 'Access Denied: Your admin account is pending approval by the administrator.' });
    }

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

router.post('/request-access', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });

    const pool = await getPool();
    const [existing] = await pool.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ error: 'An account with this email already exists' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO admins (name, email, phone, password_hash, is_approved) VALUES (?, ?, ?, ?, 0)', [name, email, phone, hash]);

    // Notify the Super Admin
    await sendMail({
      to: process.env.ADMIN_EMAIL || 'kalinditouristpackages@gmail.com',
      subject: 'New Admin Access Request',
      html: `
        <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px;">
          <h2 style="color: #0d9488;">New Admin Request</h2>
          <p>A new user has requested administrative access to the Kalindi Dashboard.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          </div>
          <p>To approve this user, please update their status in the database manually or use the admin management tools.</p>
        </div>
      `
    });

    res.json({ message: 'Request submitted successfully! Please wait for administrator approval.' });
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

// Endpoint for image uploads
router.post('/upload', adminAuthenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Admin Management (Self-service/Team)
router.get('/team', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [admins] = await pool.query('SELECT id, name, email, phone, is_approved, created_at FROM admins ORDER BY created_at DESC');
    res.json(admins);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/team/:id/approve', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('UPDATE admins SET is_approved = 1 WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/team/:id', adminAuthenticate, async (req, res) => {
  try {
    const MAIN_ADMIN = 'kalinditouristpackages@gmail.com';
    if (req.adminEmail !== MAIN_ADMIN) {
      return res.status(403).json({ error: 'Permission denied: Only the Main Administrator can remove staff members.' });
    }

    const pool = await getPool();
    
    // Safety: Prevent the Main Admin from deleting themselves
    const [target] = await pool.query('SELECT email FROM admins WHERE id = ?', [req.params.id]);
    if (target.length > 0 && target[0].email === MAIN_ADMIN) {
      return res.status(400).json({ error: 'Safety Violation: The Main Administrator account cannot be deleted.' });
    }

    await pool.query('DELETE FROM admins WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
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

const DEFAULT_PKG_IMAGE = 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=300';

router.post('/packages', adminAuthenticate, async (req, res) => {
  try {
    const { id, name, price, duration, districts, features, highlight, image, description } = req.body;
    if (!id || !name || !price || !duration) {
      return res.status(400).json({ error: 'Missing required fields (id, name, price, duration)' });
    }

    const pool = await getPool();
    
    // Check for duplicate ID
    const [existing] = await pool.query('SELECT id FROM packages WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Package ID (slug) already exists. Please use a unique identifier.' });
    }

    await pool.query(
      'INSERT INTO packages (id, name, price, duration, districts_json, features_json, description, highlight, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id.trim().toLowerCase().replace(/\s+/g, '-'), 
        name, 
        price, 
        duration, 
        JSON.stringify(districts || []), 
        JSON.stringify(features || []), 
        description || '',
        highlight ? 1 : 0, 
        image || DEFAULT_PKG_IMAGE
      ]
    );

    res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[ADMIN_CREATE_PACKAGE] Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

router.delete('/packages/:id', adminAuthenticate, async (req, res) => {
  try {
    const pkgId = req.params.id;
    const pool = await getPool();
    console.log(`[ADMIN] Request to delete package: "${pkgId}"`);
    
    // 1. Verify existence
    const [existing] = await pool.query('SELECT id, name FROM packages WHERE id = ?', [pkgId]);
    if (existing.length === 0) {
      console.warn(`[ADMIN] Delete failed: Package "${pkgId}" not found`);
      return res.status(404).json({ error: 'Package not found in inventory' });
    }

    const packageName = existing[0].name;

    // 2. Perform deletion (Foreign keys will cascade to bookings)
    const [result] = await pool.query('DELETE FROM packages WHERE id = ?', [pkgId]);
    
    if (result.affectedRows === 0) {
      console.error(`[ADMIN] Delete failed: No rows affected for ID "${pkgId}"`);
      throw new Error('Database accepted command but no records were removed');
    }

    console.log(`[ADMIN] Successfully purged package: "${packageName}" (${pkgId})`);
    res.json({ ok: true, message: `Package "${packageName}" has been removed.` });
  } catch (e) {
    console.error(`[ADMIN] Package Purge Error:`, e.stack);
    res.status(500).json({ error: `Internal Server Error: ${e.message}` });
  }
});

router.put('/packages/:id', adminAuthenticate, async (req, res) => {
  try {
    const { name, price, duration, districts, features, highlight, image, description } = req.body;
    const pool = await getPool();
    await pool.query(
      'UPDATE packages SET name = ?, price = ?, duration = ?, districts_json = ?, features_json = ?, description = ?, highlight = ?, image = ? WHERE id = ?',
      [
        name, 
        price, 
        duration, 
        JSON.stringify(districts || []), 
        JSON.stringify(features || []), 
        description || '',
        highlight ? 1 : 0,
        image, 
        req.params.id
      ]
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

// --- Places Management (For Custom Packages) ---

router.get('/places', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM places ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/places', adminAuthenticate, async (req, res) => {
  try {
    const { name, district, description, image, price_per_person } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const pool = await getPool();
    await pool.query(
      'INSERT INTO places (name, district, description, image, price_per_person) VALUES (?, ?, ?, ?, ?)',
      [name, district || '', description || '', image || '', price_per_person || 0]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/places/:id', adminAuthenticate, async (req, res) => {
  try {
    const { name, district, description, image, price_per_person } = req.body;
    const pool = await getPool();
    await pool.query(
      'UPDATE places SET name = ?, district = ?, description = ?, image = ?, price_per_person = ? WHERE id = ?',
      [name, district, description, image, price_per_person, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/places/:id', adminAuthenticate, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM places WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
