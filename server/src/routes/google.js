import { Router } from 'express';
import passport, { configureGoogleStrategy } from '../auth/google.js';
import jwt from 'jsonwebtoken';

configureGoogleStrategy();

const router = Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: (process.env.CLIENT_ORIGIN || 'http://localhost:5173') + '/login?error=google' }),
  (req, res) => {
    const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const user = req.user;
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );
    const url = new URL(CLIENT_ORIGIN + '/auth/callback');
    url.searchParams.set('token', token);
    url.searchParams.set('name', encodeURIComponent(user.name || ''));
    url.searchParams.set('email', encodeURIComponent(user.email || ''));
    res.redirect(url.toString());
  }
);

export default router;
