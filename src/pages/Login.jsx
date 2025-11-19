import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { token, user } = await api('/api/auth/login', { method: 'POST', body: form });
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Log in</h1>
          <p className="mt-2 text-sm text-slate-600">Welcome back to Kerala Trails.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input name="email" value={form.email} onChange={onChange} type="email" className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-emerald-700 hover:underline">Forgot?</a>
              </div>
              <input name="password" value={form.password} onChange={onChange} type="password" className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={loading} type="submit" className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60">{loading ? 'Signing in...' : 'Log in'}</button>
          </form>

          <div className="mt-4">
            <a href={`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/auth/google`} className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.49,6.053,28.973,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.35,16.282,18.824,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.49,6.053,28.973,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.196l-6.19-5.238C29.077,35.091,26.66,36,24,36 c-5.202,0-9.619-3.317-11.277-7.952l-6.545,5.036C9.493,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.301,4.165-4.222,5.566 c0.001-0.001,0.003-0.002,0.004-0.003l6.19,5.238C36.956,40.889,44,36,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
              Continue with Google
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-600">Don't have an account? <Link to="/signup" className="text-emerald-700 hover:underline">Sign up</Link></p>
          <div className="mt-6 text-center text-xs text-slate-500">
            <Link to="/" className="hover:underline">Back to home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
