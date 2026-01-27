import { useEffect, useMemo, useState } from 'react';
import { allDistricts } from '../../data/packages';
import PackageCard from "./PackageCard";
import BookingModal from "../BookingModal";
import { api } from '../../lib/api';

export default function PackagesSection() {
  const [packages, setPackages] = useState([]);
  const [district, setDistrict] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('');

  useEffect(() => {
    api('/api/packages')
      .then(setPackages)
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    if (!district) return [];
    return packages.filter(p => (p.districts || []).includes(district));
  }, [district, packages]);

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

          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Select a Realm</span>
            <div className="relative group">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="appearance-none bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] px-12 py-5 rounded-full cursor-pointer transition-all hover:bg-primary/90 min-w-60 text-center outline-none ring-offset-2 focus:ring-1 ring-accent/40"
              >
                <option value="" disabled className="bg-white text-primary text-left">Explore Districts</option>
                {allDistricts.map(d => (
                  <option key={d} value={d} className="bg-white text-primary py-4">{d}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 group-hover:text-white transition-colors">
                ↓
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          {!district ? (
            <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-primary/10 rounded-sm">
              <span className="serif text-3xl italic text-primary/20">The trails are waiting.</span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">Please choose a district above to begin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-primary/5">
              {filtered.map((pkg) => (
                <div key={pkg.id} className="bg-white p-[0.5px]">
                  <PackageCard
                    {...pkg}
                    onBook={({ id }) => { 
                      setSelectedPackageId(id); 
                      setShowBooking(true); 
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          {district && filtered.length === 0 && (
            <p className="mt-20 text-center serif italic text-primary/40">No journeys currently available in this realm.</p>
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