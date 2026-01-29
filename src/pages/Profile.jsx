import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
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

  const today = new Date().toISOString().split('T')[0];
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const upcomingBookings = safeBookings.filter(b => b.package_date >= today);
  const pastBookings = safeBookings.filter(b => b.package_date < today);
  const activeBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

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
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mt-2">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'the Beginning'}
              </p>
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
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h3 className="serif text-3xl text-primary lowercase tracking-tight">Your Reserved Journeys</h3>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/30 mt-1">A chronicle of your escapes</p>
                </div>
                
                <div className="flex bg-primary/5 p-1 rounded-full">
                  <button 
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'}`}
                  >
                    Upcoming ({upcomingBookings.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('previous')}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'previous' ? 'bg-primary text-white shadow-lg' : 'text-primary/40 hover:text-primary'}`}
                  >
                    Previous ({pastBookings.length})
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {activeBookings.length === 0 ? (
                  <div className="p-16 text-center border border-dashed border-primary/10 rounded-3xl bg-white/30 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary/20 text-2xl">
                      {activeTab === 'upcoming' ? '⛰️' : '📜'}
                    </div>
                    <p className="serif text-xl italic text-primary/40 mb-2">
                      {activeTab === 'upcoming' ? 'The horizon is clear.' : 'The archives are empty.'}
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary/20 max-w-[200px] mx-auto leading-relaxed">
                      {activeTab === 'upcoming' ? 'No future expeditions currently scheduled in your ledger.' : 'Your previous footprints have not been recorded yet.'}
                    </p>
                  </div>
                ) : (
                  activeBookings.map(b => (
                    <div key={b.id} className="relative overflow-hidden bg-white p-8 border border-primary/5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-accent/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700">
                      {/* Decorative accent for previous bookings */}
                      {activeTab === 'previous' && (
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                      )}
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${activeTab === 'upcoming' ? 'bg-accent/10 text-accent' : 'bg-primary/5 text-primary/40'}`}>
                            {activeTab === 'upcoming' ? 'Active Expedition' : 'Past Journey'}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/20">Ref: KLN-{b.id.toString().padStart(4, '0')}</span>
                        </div>
                        
                        <h4 className="serif text-2xl text-primary lowercase group-hover:text-accent transition-colors duration-500">{b.package_name}</h4>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-6 mt-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50">{new Date(b.package_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50 leading-none">{b.transport_mode}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-10 w-full md:w-auto relative z-10">
                        <div className="text-left md:text-right flex-1 md:flex-initial">
                          <div className="text-lg font-bold text-primary mb-1">
                            ₹{b.total_price?.toLocaleString() || '—'}
                          </div>
                          <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${b.payment_status === 'paid' ? 'text-green-600/70' : 'text-amber-600/70'}`}>
                            {b.payment_status === 'paid' ? 'Settled & Verified' : 'Awaiting Audit'}
                          </div>
                          <div className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">{b.people_count} {b.people_count > 1 ? 'Travelers' : 'Traveler'}</div>
                        </div>
                        
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${activeTab === 'upcoming' ? 'bg-primary text-white scale-100' : 'bg-sand text-primary/20 group-hover:bg-accent group-hover:text-white'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
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
