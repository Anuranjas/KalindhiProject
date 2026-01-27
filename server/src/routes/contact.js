import { Router } from 'express';
import { getPool } from '../mysql.js';
import { sendMail } from '../lib/mailer.js';

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

    // Notify Admin
    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Enquiry from ${name}`,
        text: `New contact form submission:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #1a2e1a;">New Enquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="padding: 15px; background: #f9f9f9; border-left: 4px solid #c5a059;">${message}</div>
          </div>
        `
      });
    } catch (mailErr) {
      console.error('Failed to notify admin via email:', mailErr.message);
    }

    // Confirmation to User
    try {
      await sendMail({
        to: email,
        subject: 'We have received your enquiry - Kalindi',
        text: `Hi ${name},\n\nThank you for reaching out to Kalindi. We have received your message and our team will get back to you shortly.\n\nBest regards,\nThe Kalindi Team`,
        html: `
          <div style="font-family: serif; color: #1a2e1a; padding: 40px; background-color: #fdfaf5; border: 1px solid #c5a059;">
            <h1 style="font-size: 20px;">Thank you for your interest</h1>
            <p style="font-size: 14px; line-height: 1.6; margin: 20px 0;">
              Hi ${name},<br><br>
              We have received your enquiry regarding your journey in Kerala. Our travel consultants are reviewing your message and will reach out with a personal response shortly.
            </p>
            <p style="font-size: 12px; font-style: italic; color: rgba(26,46,26,0.6);">
              In the meantime, feel free to explore our collection of curated trails.
            </p>
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid rgba(197,160,89,0.2);">
            <p style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Kalindi Collective</p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error('Failed to send confirmation to user:', mailErr.message);
    }

    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
