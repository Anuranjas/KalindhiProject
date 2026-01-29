import { useEffect, useMemo, useState } from 'react';
import PackageCard from "./PackageCard";
import BookingModal from "../BookingModal";
import { api } from '../../lib/api';

export default function PackagesSection() {
  const [packages, setPackages] = useState([]);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [district, setDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('');

  useEffect(() => {
    api('/api/packages')
      .then(setPackages)
      .catch(console.error);

    api('/api/packages/places')
      .then(setAvailablePlaces)
      .catch(console.error);
  }, []);

  const availableDistricts = useMemo(() => {
    const districtsList = new Set();
    
    // 1. Get districts from packages
    if (Array.isArray(packages)) {
      packages.forEach(p => {
        const rawDistricts = p.districts || p.districts_json;
        if (!rawDistricts) return;
        try {
          const parsed = typeof rawDistricts === 'string' ? JSON.parse(rawDistricts) : rawDistricts;
          if (Array.isArray(parsed)) parsed.forEach(d => d && districtsList.add(d));
          else if (typeof parsed === 'string') districtsList.add(parsed);
        } catch (e) {
          if (typeof rawDistricts === 'string') districtsList.add(rawDistricts);
        }
      });
    }

    // 2. Get districts from custom places (so users can find custom booking options)
    if (Array.isArray(availablePlaces)) {
      availablePlaces.forEach(p => {
        if (p.district) districtsList.add(p.district);
      });
    }

    const result = Array.from(districtsList).filter(Boolean).sort();
    return result;
  }, [packages, availablePlaces]);

  const filtered = useMemo(() => {
    let result = Array.isArray(packages) ? packages : [];

    // 1. Filter by District
    if (district) {
      result = result.filter(p => {
        const rawDistricts = p.districts || p.districts_json;
        if (!rawDistricts) return false;
        try {
          const parsed = typeof rawDistricts === 'string' ? JSON.parse(rawDistricts) : rawDistricts;
          return Array.isArray(parsed) ? parsed.includes(district) : parsed === district;
        } catch (e) {
          return rawDistricts === district;
        }
      });

      // Ensure 'custom' package is included if there are custom places in that district
      const customPkg = Array.isArray(packages) ? packages.find(p => p.id === 'custom') : null;
      if (customPkg && !result.some(p => p.id === 'custom')) {
        const hasPlaces = Array.isArray(availablePlaces) && availablePlaces.some(plc => plc.district === district);
        if (hasPlaces) result = [...result, customPkg];
      }
    }

    // 2. Search Filter (by name, description, or district)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const dists = p.districts || p.districts_json || '';
        const distMatch = dists.toString().toLowerCase().includes(q);
        return nameMatch || descMatch || distMatch;
      });
    }

    return result;
  }, [district, searchQuery, packages, availablePlaces]);

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-primary/10 pb-16">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/80 block mb-6 px-4 py-1 border border-accent/20 rounded-full w-fit">The Collection</span>
            <h2 className="heading-md serif text-primary">Discover your <br /> <span className="italic">perfect escape.</span></h2>
            <p className="mt-8 text-primary/60 font-light leading-relaxed">
              From the emerald backwaters to the misty peaks of the Western Ghats, each trail is a deliberate selection of the finest stays and most authentic encounters.
            </p>
          </div>

          <div className="flex flex-col gap-6 min-w-[320px]">
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search destinations or packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-3.5 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="relative group">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="appearance-none w-full bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full cursor-pointer transition-all hover:bg-black text-center outline-none ring-2 ring-primary/5 focus:ring-accent/40"
                >
                  <option value="" className="bg-white text-primary text-left font-bold py-4">All Destinations</option>
                  {availableDistricts.map(d => (
                    <option key={d} value={d} className="bg-white text-primary py-4">{d}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 group-hover:text-white transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-primary/5">
            {filtered.map((pkg) => (
              <div key={pkg.id} className="bg-white p-[0.5px]">
                <PackageCard
                  {...pkg}
                  onBook={({ id }) => { 
                    setSelectedPackageId(id); 
                    setShowBooking(true); 
                    setDistrict(pkg.districts?.[0] || ''); // Set district for modal context
                  }}
                />
              </div>
            ))}
          </div>
          
          {filtered.length === 0 && (
            <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-primary/10 rounded-sm">
              <span className="serif text-3xl italic text-primary/20">The trails are waiting.</span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">No journeys currently available in this realm.</p>
            </div>
          )}
        </div>

        <BookingModal
          open={showBooking}
          onClose={() => setShowBooking(false)}
          selectedDistrict={district}
          initialPackageId={selectedPackageId}
          availablePackages={packages}
        />
      </div>
    </section>
  );
}