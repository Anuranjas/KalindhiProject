import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative isolate">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://wallpapercave.com/wp/wp8050512.jpg)'
        }}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/40 via-black/30 to-white" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
        <div className="max-w-2xl text-white">
          <p className="text-sm font-semibold tracking-widest uppercase text-emerald-200">God's Own Country</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold leading-tight">
            Discover Kerala: Backwaters, Hills, and Beaches
          </h1>
          <p className="mt-4 text-lg text-emerald-50/90">
            Curated itineraries with houseboats, tea estates, wildlife and culture. Flexible dates, trusted guides, and seamless transfers.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link to="/?to=packages" className="rounded-md bg-emerald-600 px-5 py-3 font-medium text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              Explore Packages
            </Link>
            <Link to="/?to=contact" className="rounded-md bg-white/90 px-5 py-3 font-medium text-emerald-700 shadow hover:bg-white">
              Talk to Experts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
