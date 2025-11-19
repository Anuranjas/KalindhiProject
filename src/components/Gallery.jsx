import { places } from "../data/places";

export default function Gallery() {
  const images = places.map((p) => ({ src: p.image, alt: p.name }));

  return (
    <section aria-labelledby="gallery-title" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 id="gallery-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Kerala In Pictures
          </h2>
          <p className="hidden sm:block text-sm text-slate-600">A glimpse of what awaits you</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {images.map((img, i) => (
            <div key={i} className={`overflow-hidden rounded-xl border border-slate-200 bg-white ${i % 5 === 0 ? 'col-span-2 md:col-span-2' : ''}`}>
              <img
                src={img.src}
                alt={img.alt}
                className="h-40 w-full object-cover sm:h-56 md:h-64 hover:scale-105 transition-transform duration-300 ease-out"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
