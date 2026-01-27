import { Router } from 'express';
import { getPool } from '../mysql.js';
import { sendMail } from '../lib/mailer.js';
import { authenticate } from './auth.js';

const router = Router();

router.get('/my', authenticate, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC', [req.userEmail]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { applicant_name, email, people_count, transport_mode, package_date, package_id, package_name } = req.body || {};
    
    // Ensure we use the authenticated user's email from token
    const userEmail = req.userEmail || email;
    const userName = applicant_name; 

    if (!userName || !userEmail || !people_count || !transport_mode || !package_date || !package_id) {
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
      'INSERT INTO bookings (applicant_name, email, people_count, transport_mode, package_id, package_name, package_date, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userName, userEmail, count, transport_mode, package_id, pkgName, package_date, 'paid']
    );

    // Confirmation Email
    try {
      await sendMail({
        to: userEmail,
        subject: `Booking & Payment Confirmed: ${pkgName} - Kalindi`,
        text: `Hi ${userName},\n\nYour booking and payment for "${pkgName}" is confirmed for ${package_date}.\n\nDetails:\nPackage: ${pkgName}\nDate: ${package_date}\nPeople: ${people_count}\nTransport: ${transport_mode}\nStatus: Paid\n\nOur concierge will contact you with the itinerary details shortly.\n\nWarm regards,\nKalindi Team`,
        html: `
          <div style="font-family: serif; color: #1a2e1a; padding: 40px; background-color: #fdfaf5; border: 1px solid #c5a059; max-width: 600px; margin: 0 auto;">
            <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 10px; margin-bottom: 30px;">Confirmed Reservation & Payment</p>
            <h1 style="font-size: 24px; font-weight: 400; margin-bottom: 20px;">Journey Awaits, ${userName}</h1>
            <p style="line-height: 1.6; margin-bottom: 30px;">We are delighted to confirm your upcoming experience and your payment has been processed successfully.</p>
            
            <div style="background: rgba(197,160,89,0.1); padding: 25px; border-left: 2px solid #c5a059; margin-bottom: 30px;">
              <p style="margin: 5px 0;"><strong>Experience:</strong> ${pkgName}</p>
              <p style="margin: 5px 0;"><strong>Commencement:</strong> ${package_date}</p>
              <p style="margin: 5px 0;"><strong>Travelers:</strong> ${people_count}</p>
              <p style="margin: 5px 0;"><strong>Navigation:</strong> ${transport_mode}</p>
              <p style="margin: 5px 0;"><strong>Payment:</strong> <span style="color: #1a2e1a; font-weight: bold;">Confirmed</span></p>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">Our concierge is currently curating your personal itinerary. A detailed dossier will be sent to your email within 24 hours.</p>
            
            <div style="margin-top: 50px; border-top: 1px solid rgba(197,160,89,0.3); padding-top: 20px; font-size: 12px; font-style: italic;">
              Regards,<br><strong>Kalindi Collective</strong>
            </div>
          </div>
        `
      });
    } catch (error_) {
      console.error('Failed to send booking confirmation email:', error_.message);
    }

    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
