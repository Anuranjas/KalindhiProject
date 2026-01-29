import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';

export default function BookingModal({ open, onClose, selectedDistrict, initialPackageId = '', availablePackages = [] }) {
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
    const pkgs = Array.isArray(availablePackages) ? availablePackages : [];
    if (!selectedDistrict) return pkgs;
    return pkgs.filter(p => {
      const rawDistricts = p.districts || p.districts_json;
      if (!rawDistricts) return false;
      try {
        const parsed = typeof rawDistricts === 'string' ? JSON.parse(rawDistricts) : rawDistricts;
        return Array.isArray(parsed) ? parsed.includes(selectedDistrict) : parsed === selectedDistrict;
      } catch (e) {
        return rawDistricts === selectedDistrict;
      }
    });
  }, [selectedDistrict, availablePackages]);

  const [form, setForm] = useState({
    applicant_name: '',
    email: '',
    people_count: 2,
    transport_mode: 'Car',
    package_date: '',
    package_id: '',
  });

  const selectedPkg = useMemo(() => {
    return districtPackages.find(p => p.id === form.package_id);
  }, [districtPackages, form.package_id]);

  const totalPrice = useMemo(() => {
    const base = selectedPkg?.price || 0;
    return base * (form.people_count || 1);
  }, [selectedPkg, form.people_count]);

  const transportError = useMemo(() => {
    if (form.people_count > 6 && form.transport_mode === 'Car') {
      return 'Maximum 6 people allowed for Car. Please select Van, Traveller, or Bus.';
    }
    if (form.people_count > 40 && form.transport_mode === 'Bus') {
      return 'Maximum 40 people allowed for a single Bus booking.';
    }
    return '';
  }, [form.people_count, form.transport_mode]);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  }, []);

  const dateError = useMemo(() => {
    if (!form.package_date) return '';
    if (form.package_date < minDate) {
      return 'Packages must be booked at least 5 days in advance.';
    }
    return '';
  }, [form.package_date, minDate]);

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
    
    if (transportError) {
      setError(transportError);
      return;
    }

    if (dateError) {
      setError(dateError);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        applicant_name: form.applicant_name?.trim(),
        email: form.email?.trim(),
        people_count: Number(form.people_count) || 1,
        transport_mode: form.transport_mode,
        package_date: form.package_date,
        package_id: form.package_id,
        package_name: selectedPkg?.name || '',
        total_price: totalPrice,
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
    <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity" 
        onClick={handleClose} 
      />
      
      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="relative transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-white/20"
          style={{
            boxShadow: '0 25px 50px -12px rgba(26, 46, 26, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          }}
        >
          {/* Decorative Header Background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent z-0"></div>
          
          {/* Close Button */}
          <button 
            onClick={handleClose} 
            className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/50 backdrop-blur-sm text-primary/60 hover:bg-white hover:text-primary transition-all duration-200 shadow-sm border border-white/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="relative z-1 px-6 pt-8 pb-6 sm:px-8">
            <div className="mb-8">
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2">Begin Your Journey</span>
              <h2 className="text-3xl font-bold tracking-tight text-primary font-serif">
                Reserve your <span className="italic relative z-10 before:absolute before:-bottom-1 before:left-0 before:h-2 before:w-full before:bg-accent/20 before:-z-10">Escape</span>
              </h2>
              <p className="mt-2 text-primary/60 font-medium tracking-wide text-sm">
                To <span className="text-primary font-bold">{selectedDistrict || 'Kerala'}</span>
              </p>
            </div>

            {!user ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl bg-slate-50/50 border border-slate-100/50">
                <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 text-primary text-2xl">
                  🔒
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2 font-serif">Login Required</h3>
                <p className="mb-8 text-primary/60 text-sm max-w-xs mx-auto">Please sign in to your account to proceed with the booking securely.</p>
                <a 
                  href="/login" 
                  className="group relative inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-xs uppercase tracking-widest font-bold text-white transition-all hover:bg-black hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Sign In to Continue
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5 ml-1">Full Name</label>
                    <input 
                      name="applicant_name" 
                      value={form.applicant_name} 
                      onChange={onChange} 
                      required 
                      className="block w-full rounded-none border-b border-primary/20 bg-transparent p-3 text-primary placeholder:text-primary/30 outline-none transition-all focus:border-accent focus:bg-primary/5" 
                      placeholder="Enter full name" 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5 ml-1">Email Address</label>
                    <input 
                      name="email" 
                      value={form.email} 
                      onChange={onChange} 
                      type="email" 
                      required 
                      className="block w-full rounded-none border-b border-primary/20 bg-transparent p-3 text-primary placeholder:text-primary/30 outline-none transition-all focus:border-accent focus:bg-primary/5" 
                      placeholder="you@example.com" 
                    />
                  </div>
                </div>

                <div className="block p-4 rounded-xl bg-primary/5 border border-primary/10">
                   <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5 ml-1">Travelers</label>
                        <div className="relative">
                           <input 
                            name="people_count" 
                            value={form.people_count} 
                            onChange={onChange} 
                            type="number" 
                            min={1} 
                            max={100} 
                            className="block w-full rounded-lg border-0 bg-white p-2.5 text-primary shadow-sm ring-1 ring-inset ring-primary/10 focus:ring-2 focus:ring-accent sm:text-sm sm:leading-6 text-center font-bold" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5 ml-1">Mode</label>
                        <select 
                          name="transport_mode" 
                          value={form.transport_mode} 
                          onChange={onChange} 
                          className={`block w-full rounded-lg border-0 bg-white p-2.5 text-primary shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 ${transportError ? 'ring-red-500 focus:ring-red-500' : 'ring-primary/10 focus:ring-accent'}`}
                        >
                          <option>Car</option>
                          <option>Van</option>
                          <option>Traveller</option>
                          <option>Bus</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5 ml-1">Date</label>
                        <input 
                          name="package_date" 
                          value={form.package_date} 
                          onChange={onChange} 
                          type="date" 
                          required 
                          min={minDate}
                          className={`block w-full rounded-lg border-0 bg-white p-2.5 text-primary shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 ${dateError ? 'ring-red-500 focus:ring-red-500' : 'ring-primary/10 focus:ring-accent'}`} 
                        />
                      </div>
                   </div>
                   {(transportError || dateError) && (
                     <div className="mt-2 space-y-1">
                        {transportError && (
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter animate-bounce px-1">
                            ⚠️ {transportError}
                          </p>
                        )}
                        {dateError && (
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter px-1">
                            📅 {dateError}
                          </p>
                        )}
                     </div>
                   )}
                </div>

                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5 ml-1">Select Package</label>
                  <div className="relative">
                    <select 
                      name="package_id" 
                      value={form.package_id} 
                      onChange={onChange} 
                      required 
                      className="block w-full appearance-none rounded-xl border border-primary/10 bg-white/50 p-4 pr-8 text-primary outline-none transition-all focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
                    >
                      {districtPackages.length === 0 && <option value="">No packages available</option>}
                      {districtPackages.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — ₹{p.price?.toLocaleString() || 'N/A'}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Pricing Table / Summary */}
                <div className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-primary/5 border-b border-primary/10">
                      <tr>
                        <th className="px-4 py-2 font-bold uppercase tracking-wider text-primary/40">Item</th>
                        <th className="px-4 py-2 font-bold uppercase tracking-wider text-primary/40 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      <tr>
                        <td className="px-4 py-3 text-primary/60">Base Package</td>
                        <td className="px-4 py-3 text-right font-medium text-primary">₹{selectedPkg?.price?.toLocaleString() || '0'} / person</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-primary/60">Headcount</td>
                        <td className="px-4 py-3 text-right font-medium text-primary">{form.people_count} {form.people_count > 1 ? 'People' : 'Person'}</td>
                      </tr>
                      <tr className="bg-accent/5">
                        <td className="px-4 py-4 font-bold text-primary">Total Amount</td>
                        <td className="px-4 py-4 text-right text-lg font-bold text-accent">₹{totalPrice.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {(error || transportError || dateError) && (
                  <div className="rounded-lg bg-red-50 p-4 border border-red-100 text-sm text-red-600 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error || transportError || dateError}
                  </div>
                )}
                {success && (
                  <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-100 text-sm text-emerald-600 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {success}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading || transportError || dateError} 
                    className="flex-1 rounded-full bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-black hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing
                      </span>
                    ) : 'Confirm Booking'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleClose} 
                    className="rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm ring-1 ring-inset ring-primary/10 transition-all hover:bg-primary/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
