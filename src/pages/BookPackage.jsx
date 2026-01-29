import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function BookPackage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const allDistricts = useMemo(() => {
    const fromPkgs = packages.flatMap(p => {
      if (!p.districts_json) return [];
      try {
        return typeof p.districts_json === 'string' 
          ? JSON.parse(p.districts_json) 
          : p.districts_json;
      } catch (e) {
        return [];
      }
    });
    const fromPlaces = availablePlaces.map(p => p.district).filter(Boolean);
    const unique = [...new Set([...fromPkgs, ...fromPlaces])].filter(Boolean).sort();
    console.log('Detected Districts:', unique);
    return unique;
  }, [packages, availablePlaces]);

  const filteredPackages = useMemo(() => {
    if (districtFilter === 'All') return packages;
    return packages.filter(p => {
      if (!p.districts_json) return false;
      try {
        const districts = typeof p.districts_json === 'string' 
          ? JSON.parse(p.districts_json) 
          : p.districts_json;
        return Array.isArray(districts) && districts.includes(districtFilter);
      } catch (e) {
        return false;
      }
    });
  }, [packages, districtFilter]);

  useEffect(() => {
    api('/api/packages')
      .then(setPackages)
      .catch(console.error);
    
    api('/api/packages/places')
      .then(setAvailablePlaces)
      .catch(console.error);
  }, []);

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
    package_date: '',
    package_id: ''
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
      const pkg = packages.find(p => p.id === form.package_id);
      const payload = {
        applicant_name: form.applicant_name?.trim(),
        email: form.email?.trim(),
        people_count: Number(form.people_count) || 1,
        transport_mode: form.transport_mode,
        package_date: form.package_date,
        package_id: form.package_id,
        package_name: pkg?.name || (form.package_id === 'custom' ? 'Custom Package' : ''),
        selected_places: selectedPlaces.map(p => ({ id: p.id, name: p.name, price: p.price_per_person }))
      };
      await api('/api/bookings', { method: 'POST', body: payload });
      setSuccess('Your booking and payment has been processed successfully! We\'ll contact you soon.');
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
                <label htmlFor="applicant_name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <input id="applicant_name" name="applicant_name" value={form.applicant_name} onChange={onChange} required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                <input id="email" name="email" value={form.email} onChange={onChange} type="email" required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="people_count" className="block text-sm font-medium text-slate-700">People</label>
                <input id="people_count" name="people_count" value={form.people_count} onChange={onChange} type="number" min={1} max={20} className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="transport_mode" className="block text-sm font-medium text-slate-700">Transport</label>
                <select id="transport_mode" name="transport_mode" value={form.transport_mode} onChange={onChange} className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                  <option>Car</option>
                  <option>Bus</option>
                  <option>Train</option>
                  <option>Flight</option>
                  <option>Boat</option>
                </select>
              </div>
              <div>
                <label htmlFor="package_date" className="block text-sm font-medium text-slate-700">Travel Date</label>
                <input id="package_date" name="package_date" value={form.package_date} onChange={onChange} type="date" required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Filter by District (Optional)</label>
                <select 
                  value={districtFilter} 
                  onChange={(e) => {
                    setDistrictFilter(e.target.value);
                    // Reset package if it's not in the new district (unless it's custom)
                    setForm(f => ({ ...f, package_id: '' }));
                  }}
                  className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="All">View All Packages</option>
                  {allDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="package_id" className="block text-sm font-medium text-slate-700">Select Package</label>
                <select id="package_id" name="package_id" value={form.package_id} onChange={onChange} required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                  <option value="" disabled>Choose a package...</option>
                  <option value="custom">Custom Package (Build your own)</option>
                  {filteredPackages.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.duration}</option>
                  ))}
                </select>
              </div>
            </div>

            {form.package_id === 'custom' && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900">Customize Your Itinerary</h3>
                    <p className="text-[11px] text-emerald-700">Select the places you want to visit in {districtFilter === 'All' ? 'Kerala' : districtFilter}.</p>
                  </div>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {availablePlaces
                    .filter(p => districtFilter === 'All' || p.district === districtFilter)
                    .map(place => (
                    <label key={place.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedPlaces.some(p => p.id === place.id) ? 'bg-emerald-100 border-emerald-300 ring-1 ring-emerald-300' : 'bg-white border-slate-200 hover:border-emerald-200'}`}>
                      <input 
                        type="checkbox" 
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        checked={selectedPlaces.some(p => p.id === place.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlaces([...selectedPlaces, place]);
                          } else {
                            setSelectedPlaces(selectedPlaces.filter(p => p.id !== place.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-slate-800">{place.name}</p>
                          {place.district && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold uppercase">{place.district}</span>}
                        </div>
                        {place.price_per_person > 0 && <p className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">₹{place.price_per_person} per person</p>}
                      </div>
                    </label>
                  ))}
                  {availablePlaces.filter(p => districtFilter === 'All' || p.district === districtFilter).length === 0 && (
                    <p className="col-span-full text-center py-6 text-sm text-slate-500">No places found in this district.</p>
                  )}
                </div>

                {selectedPlaces.length > 0 && (
                  <div className="pt-2 border-t border-emerald-100">
                    <p className="text-xs font-medium text-emerald-800">
                      Added {selectedPlaces.length} places to your itinerary
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60">
                {loading ? 'Processing...' : 'Book & Pay Now'}
              </button>
              <button type="button" onClick={() => navigate('/')} className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
