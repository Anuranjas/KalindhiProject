import { packages } from "../../data/packages";
import PackageCard from "./PackageCard";

export default function PackagesSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Kerala Tour Packages
          </h2>
          <p className="mt-3 text-slate-600">
            Choose from handpicked itineraries, crafted for comfort and authentic experiences.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {packages.map((p) => (
            <PackageCard key={p.id} {...p} />
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Why travel with us?</h3>
            <ul className="mt-4 space-y-2 text-slate-700 text-sm">
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Local experts & licensed guides</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Flexible dates and customizations</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Comfort stays and verified partners</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Transparent pricing — no hidden costs</li>
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img
              alt="Kerala backwaters"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
