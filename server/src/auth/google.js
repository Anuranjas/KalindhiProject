import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getPool } from '../mysql.js';

export function configureGoogleStrategy() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL = '/api/auth/google/callback',
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('[auth] Google OAuth not configured — missing env vars');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          const name = profile.displayName || (profile.name && `${profile.name.givenName||''} ${profile.name.familyName||''}`.trim()) || 'Google User';
          if (!email) return done(null, false, { message: 'Email not available from Google' });

          const pool = await getPool();
          const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
          let user;
          if (rows.length) {
            user = rows[0];
          } else {
            const [result] = await pool.query(
              'INSERT INTO users (name, email, password_hash, provider, provider_id) VALUES (?, ?, ?, ?, ?)',
              [name, email, null, 'google', profile.id]
            );
            const [created] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = created[0];
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

export default passport;
