import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import contactRouter from './routes/contact.js';
import bookingsRouter from './routes/bookings.js';
import { getPool } from './mysql.js';

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    const pool = await getPool();
    const [[dbRow]] = await pool.query('SELECT DATABASE() AS db');
    const [[verRow]] = await pool.query('SELECT VERSION() AS version');
    res.json({ ok: true, database: dbRow?.db || null, version: verRow?.version || null });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/bookings', bookingsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  (async () => {
    try {
      const pool = await getPool();
      const [rows] = await pool.query('SELECT DATABASE() AS db');
      console.log(`MySQL connected. Using database: ${rows?.[0]?.db || 'unknown'}`);
    } catch (err) {
      console.error('MySQL connection failed:', err.message);
    }
  })();
});
