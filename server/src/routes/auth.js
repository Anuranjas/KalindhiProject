import { Router } from 'express';
import { getPool } from '../mysql.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from '../lib/mailer.js';

const router = Router();

// Middleware to verify token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

function toPublicUser(u) {
  return { id: u.id, name: u.name, email: u.email, isVerified: !!u.is_verified, createdAt: u.created_at };
}

async function sendOTP(email, code, phone = null) {
  // 1. Send Email OTP
  try {
    await sendMail({
      to: email,
      subject: 'Verify your Kalindi account',
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: serif; color: #1a2e1a; padding: 40px; background-color: #fdfaf5; border: 1px solid #c5a059;">
          <h1 style="font-size: 24px;">Verification code</h1>
          <p style="font-size: 16px; margin-top: 20px;">Welcome to the Kalindi Collective.</p>
          <p style="font-size: 14px; color: rgba(26,46,26,0.6); margin-bottom: 30px;">Enter the following code to authenticate your access:</p>
          <div style="font-size: 40px; letter-spacing: 12px; font-weight: bold; margin-bottom: 30px; text-align: center;">${code}</div>
          <p style="font-size: 12px; color: rgba(26,46,26,0.3);">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `
    });
  } catch (err) {
    console.warn(`Fallback to console: [OTP Email] To: ${email}, Code: ${code}`);
  }

  // 2. Send SMS OTP (Placeholder for SMS Service like Twilio)
  if (phone) {
    console.log(`[SMS_GATEWAY] Sending OTP ${code} to phone: ${phone}`);
    // Example: twilio.messages.create({ body: `Your Kalindi OTP is ${code}`, from: '+123456789', to: phone });
  }
}

async function generateAndSendOTP(pool, email, phone = null) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await pool.query('DELETE FROM user_otps WHERE user_email = ?', [email]);
  await pool.query(
    'INSERT INTO user_otps (user_email, otp_code, expires_at) VALUES (?, ?, ?)',
    [email, code, expires]
  );

  await sendOTP(email, code, phone);
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const pool = await getPool();
    const [found] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (found.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, is_verified) VALUES (?, ?, ?, ?, 0)',
      [name, email, phone || null, hash]
    );

    await generateAndSendOTP(pool, email, phone);

    res.status(201).json({ 
      message: 'Registration successful. Please verify your OTP.',
      email 
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.is_verified) {
      await generateAndSendOTP(pool, email, user.phone);
      return res.status(403).json({ 
        error: 'Account not verified', 
        requiresVerification: true,
        email 
      });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.json({ token, user: toPublicUser(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: 'Email and OTP code are required' });

    const pool = await getPool();
    const [otps] = await pool.query(
      'SELECT * FROM user_otps WHERE user_email = ? AND otp_code = ? AND expires_at > NOW()',
      [email, code]
    );

    if (!otps.length) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await pool.query('UPDATE users SET is_verified = 1 WHERE email = ?', [email]);
    await pool.query('DELETE FROM user_otps WHERE user_email = ?', [email]);

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.json({ message: 'Verification successful', token, user: toPublicUser(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const pool = await getPool();
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!users.length) return res.status(404).json({ error: 'User not found' });

    await generateAndSendOTP(pool, email);
    res.json({ message: 'New OTP sent successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ user: toPublicUser(rows[0]) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, password } = req.body || {};
    const pool = await getPool();

    if (name) {
      await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, req.userId]);
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.userId]);
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    res.json({ message: 'Profile updated', user: toPublicUser(rows[0]) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
