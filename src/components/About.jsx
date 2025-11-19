export default function About() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">About Kerala Trails</h2>
            <p className="mt-4 text-slate-700">
              We’re a locally-rooted travel company crafting authentic Kerala experiences — from tranquil
              backwater cruises to mist-laden tea hills and sun-kissed beaches. Our small, passionate team works
              with licensed guides, reliable transport, and handpicked stays to ensure comfort, safety, and real
              connection to Kerala’s culture and nature.
            </p>
            <ul className="mt-6 space-y-3 text-slate-700 text-sm">
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Tailor-made itineraries for couples, families, and groups</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Verified partners and comfortable category stays</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Transparent pricing with dedicated trip coordinator</li>
              <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Responsible travel: supporting local communities & eco efforts</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#packages" className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">Explore Packages</a>
              <a href="#contact" className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">Talk to an Expert</a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2 overflow-hidden rounded-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop"
                alt="Houseboat on Kerala backwaters"
                className="h-56 w-full object-cover sm:h-72 md:h-80"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1565106430487-53a9490cbda4?q=80&w=1200&auto=format&fit=crop"
                alt="Munnar tea plantations"
                className="h-32 w-full object-cover sm:h-40 md:h-44"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1587922445839-1d8033b1bced?q=80&w=1200&auto=format&fit=crop"
                alt="Kovalam beach at sunset"
                className="h-32 w-full object-cover sm:h-40 md:h-44"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
