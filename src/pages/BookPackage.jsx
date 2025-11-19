import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function BookPackage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    try {
      const u = localStorage.getItem('auth_user');
      const parsed = u ? JSON.parse(u) : null;
      setUser(parsed);
      if (!parsed) {
        const next = encodeURIComponent('/book');
        navigate(`/login?next=${next}`, { replace: true, state: { from: location } });
      }
    } catch {}
  }, [location, navigate]);

  const initial = useMemo(() => ({
    applicant_name: user?.name || '',
    email: user?.email || '',
    people_count: 2,
    transport_mode: 'Car',
    package_date: ''
  }), [user]);

  const [form, setForm] = useState(initial);
  useEffect(() => setForm(initial), [initial]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'people_count' ? Number(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const payload = {
        applicant_name: form.applicant_name?.trim(),
        email: form.email?.trim(),
        people_count: Number(form.people_count) || 1,
        transport_mode: form.transport_mode,
        package_date: form.package_date,
      };
      await api('/api/bookings', { method: 'POST', body: payload });
      setSuccess('Your booking request has been submitted! We\'ll contact you soon.');
      // Optional: navigate to home or clear form
      // navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Book Your Package</h1>
          <p className="mt-2 text-sm text-slate-600">Fill in your details and preferred travel date. We\'ll confirm availability and pricing.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input name="applicant_name" value={form.applicant_name} onChange={onChange} required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input name="email" value={form.email} onChange={onChange} type="email" required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">People</label>
                <input name="people_count" value={form.people_count} onChange={onChange} type="number" min={1} max={20} className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700">Transport</label>
                <select name="transport_mode" value={form.transport_mode} onChange={onChange} className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                  <option>Car</option>
                  <option>Bus</option>
                  <option>Train</option>
                  <option>Flight</option>
                  <option>Boat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Travel Date</label>
                <input name="package_date" value={form.package_date} onChange={onChange} type="date" required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Booking'}
              </button>
              <button type="button" onClick={() => navigate('/')} className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
