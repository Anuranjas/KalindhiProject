import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';
import { packages as allPackages } from '../data/packages';

export default function BookingModal({ open, onClose, selectedDistrict, initialPackageId = '' }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const closeTimer = useRef(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('auth_user');
      setUser(u ? JSON.parse(u) : null);
    } catch {}
  }, [open]);

  const districtPackages = useMemo(() => {
    if (!selectedDistrict) return [];
    return allPackages.filter(p => (p.districts || []).includes(selectedDistrict));
  }, [selectedDistrict]);

  const [form, setForm] = useState({
    applicant_name: '',
    email: '',
    people_count: 2,
    transport_mode: 'Car',
    package_date: '',
    package_id: '',
  });

  useEffect(() => {
    if (open) {
      const preferred = initialPackageId || districtPackages[0]?.id || '';
      setForm(f => ({
        ...f,
        applicant_name: user?.name || '',
        email: user?.email || '',
        package_id: preferred,
      }));
      setError('');
      setSuccess('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user, selectedDistrict, districtPackages.length, initialPackageId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'people_count' ? Number(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const pkg = districtPackages.find(p => p.id === form.package_id);
      const payload = {
        applicant_name: form.applicant_name?.trim(),
        email: form.email?.trim(),
        people_count: Number(form.people_count) || 1,
        transport_mode: form.transport_mode,
        package_date: form.package_date,
        package_id: form.package_id,
        package_name: pkg?.name || '',
      };
      await api('/api/bookings', { method: 'POST', body: payload });
      setSuccess('Your booking was submitted successfully!');
      // Auto-close shortly after success so user sees feedback
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
        <div className="relative mt-8 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <button onClick={handleClose} aria-label="Close" className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">×</button>
          <h2 className="text-xl font-bold tracking-tight">Book Packages</h2>
          <p className="mt-1 text-sm text-slate-600">Selected district: <span className="font-medium">{selectedDistrict || '—'}</span></p>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
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
              <div>
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

            <div>
              <label className="block text-sm font-medium text-slate-700">Package</label>
              <select name="package_id" value={form.package_id} onChange={onChange} required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                {districtPackages.length === 0 && <option value="">No packages for this district</option>}
                {districtPackages.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Booking'}
              </button>
              <button type="button" onClick={handleClose} className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
