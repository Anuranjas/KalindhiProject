import { useMemo, useState } from 'react';
import { packages as allPackages, allDistricts } from '../../data/packages';
import PackageCard from "./PackageCard";
import BookingModal from "../BookingModal";

export default function PackagesSection() {
  const [district, setDistrict] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('');

  const filtered = useMemo(() => {
    if (!district) return [];
    return allPackages.filter(p => (p.districts || []).includes(district));
  }, [district]);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Packages</h2>
          <p className="mt-3 text-slate-600">
            Explore our curated Kerala tour packages. Select a district to see trips available in that region.
          </p>
          <p className="mt-2 text-slate-600">
            Each itinerary blends must-see highlights with local gems, comfortable stays, and reliable transport — tailored for couples, families, and groups.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-center"
            >
              {/* Placeholder option so nothing shows until a district is selected */}
              <option value="" disabled>Select district</option>
              {allDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {/* Book Packages button removed as per request */}
          </div>
        </div>

        {/* Grid of packages (filtered) */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(pkg => (
            <PackageCard
              key={pkg.id}
              {...pkg}
              onBook={({ id }) => { setSelectedPackageId(id); setShowBooking(true); }}
            />
          ))}
        </div>

        {!district && (
          <p className="mt-6 text-slate-600 text-center">Select a district to view available packages.</p>
        )}
        {district && filtered.length === 0 && (
          <p className="mt-6 text-slate-600 text-center">No packages found for the selected district.</p>
        )}

        <BookingModal
          open={showBooking}
          onClose={() => setShowBooking(false)}
          selectedDistrict={district}
          initialPackageId={selectedPackageId}
        />
      </div>
    </section>
  );
}