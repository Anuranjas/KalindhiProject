import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          setUser(u);
          setFormData({
            name: u.name,
            email: u.email,
            password: '',
            confirmPassword: ''
          });

          // Fetch bookings
          try {
            const data = await api('/api/bookings/my');
            setBookings(data);
          } catch (e) { console.error('Failed to load bookings'); }
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndBookings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const res = await api('/api/auth/profile', {
        method: 'PUT',
        body: formData
      });
      
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      setUser(res.user);
      setSuccess('Profile updated successfully');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      
      // Dispatch storage event to notify Navbar
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand">
      <div className="w-12 h-12 border-4 border-primary/10 border-t-accent rounded-full animate-spin"></div>
    </div>
  );

  const displayName = user?.name || user?.email || 'Guest';
  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundType=gradientLinear&fontWeight=700`;

  return (
    <main className="min-h-screen bg-sand pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/80 block mb-6">Your Sanctuary</span>
          <h1 className="serif text-5xl md:text-7xl text-primary lowercase leading-tight">Identity <span className="italic">&</span> Essence.</h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-20">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 text-center">
              <div className="relative inline-block mb-10">
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  className="w-48 h-48 rounded-full shadow-2xl ring-1 ring-primary/10 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute -bottom-2 -right-2 bg-accent text-white p-3 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5l5 5v11a2 2 0 0 1-2 2z"/><circle cx="12" cy="13" r="3"/></svg>
                </div>
              </div>
              <h2 className="serif text-2xl text-primary">{displayName}</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mt-2">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleUpdate} className="space-y-12">
              <div className="space-y-10">
                <div className="group border-b border-primary/10 py-2 focus-within:border-accent transition-colors">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 group-focus-within:text-accent transition-colors">Legal Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full bg-transparent pt-2 pb-1 text-xl serif outline-none placeholder:text-primary/10" 
                  />
                </div>

                <div className="group border-b border-primary/10 py-2 transition-colors opacity-60">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Email Address (Registry)</label>
                  <input 
                    disabled
                    value={formData.email}
                    className="block w-full bg-transparent pt-2 pb-1 text-xl serif outline-none cursor-not-allowed" 
                  />
                  <p className="text-[9px] mt-1 font-medium tracking-wider uppercase text-primary/20 italic">Primary identity cannot be altered</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="group border-b border-primary/10 py-2 focus-within:border-accent transition-colors">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 group-focus-within:text-accent transition-colors">New Security Code</label>
                    <input 
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      className="block w-full bg-transparent pt-2 pb-1 text-xl serif outline-none placeholder:text-primary/10" 
                    />
                  </div>
                  <div className="group border-b border-primary/10 py-2 focus-within:border-accent transition-colors">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 group-focus-within:text-accent transition-colors">Confirm New Code</label>
                    <input 
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full bg-transparent pt-2 pb-1 text-xl serif outline-none placeholder:text-primary/10" 
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-xs font-bold uppercase tracking-widest text-red-500/80">{error}</p>}
              {success && <p className="text-xs font-bold uppercase tracking-widest text-green-600/80">{success}</p>}

              <button 
                type="submit" 
                disabled={saving}
                className="group flex items-center gap-6 px-12 py-5 bg-primary text-white rounded-full transition-all hover:bg-accent disabled:opacity-50"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.3em]">{saving ? 'Preserving...' : 'Save Profile'}</span>
                {!saving && <span className="text-xl transition-transform group-hover:translate-x-1">→</span>}
              </button>
            </form>

            <div className="mt-24 pt-12 border-t border-primary/5">
              <h3 className="serif text-3xl text-primary mb-12">Your Reserved Journeys</h3>
              
              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <div className="p-12 text-center border border-primary/5 rounded-2xl bg-white/50">
                    <p className="serif text-lg italic text-primary/30 mb-2">No expeditions found.</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary/20">Your collection will appear here once you begin.</p>
                  </div>
                ) : (
                  bookings.map(b => (
                    <div key={b.id} className="bg-white p-8 border border-primary/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/20 transition-all duration-500">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Confirmed Expedition</div>
                        <h4 className="serif text-2xl text-primary lowercase">{b.package_name}</h4>
                        <div className="flex gap-4 mt-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">{new Date(b.package_date).toLocaleDateString()}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">•</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40 leading-none">{b.transport_mode}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${b.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                            {b.payment_status === 'paid' ? 'Paid & Verified' : 'Pending Verification'}
                          </div>
                          <div className="text-[10px] font-bold text-primary/20 uppercase tracking-widest italic">{b.people_count} {b.people_count > 1 ? 'Travelers' : 'Traveler'}</div>
                        </div>
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-sand text-primary opacity-20 group-hover:opacity-100 group-hover:bg-accent group-hover:text-white transition-all cursor-pointer">
                          <span className="text-lg">↓</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-24 pt-12 border-t border-primary/5">
              <h3 className="serif text-xl text-primary mb-4 italic">Privacy & Security</h3>
              <p className="text-sm text-primary/60 font-light leading-relaxed max-w-lg">
                Your digital signature and curated data are stored within our private collective. We ensure your journey credentials remain as unique as your footprints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
