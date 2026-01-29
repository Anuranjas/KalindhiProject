import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import contactRouter from './routes/contact.js';
import bookingsRouter from './routes/bookings.js';
import packagesRouter from './routes/packages.js';
import { getPool } from './mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Production Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // Increased for development/testing
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Frontend Static Files in Production
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));

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
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/packages', packagesRouter);

// Handle SPA routing - serve index.html for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
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
