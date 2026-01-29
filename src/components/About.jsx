import { Link } from 'react-router-dom';
import backwaters from '../assets/hero/backwaters.jpg';
import cultural from '../assets/hero/cultural.jpg';
import waterfalls from '../assets/hero/waterfalls.jpg';

export default function About() {
  return (
    <section className="py-24 md:py-40 bg-sand overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/10 bg-primary/5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Our Legacy</span>
            </div>
            
            <h2 className="text-4xl md:heading-md serif text-primary mb-10 drop-shadow-sm">
              Crafting <span className="italic">Timeless</span> Stories in God's Own Country.
            </h2>
            
            <div className="space-y-6 text-primary leading-relaxed font-normal">
              <p className="text-base md:text-lg italic serif text-primary/90">
                "We don't just plan trips; we curate moments that transcend the ordinary."
              </p>
              <p>
                Rooted in the lush soul of Kerala, Kalindi is a boutique travel collective dedicated to the art of slow travel. We believe in the quiet ripple of a houseboat on the backwaters, the scent of fresh cardamom in the mist-laden hills, and the rhythmic chant of the ocean.
              </p>
              <p>
                Our philosophy is simple: authentic connection. We skip the crowded tourist paths to lead you into the heart of local life—where every spice garden has a story and every sunset feels like a personal gift.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6">
              {[
                { label: 'Curated Trails', desc: 'Bespoke itineraries for the wandering soul.' },
                { label: 'Local Soul', desc: 'Deeply rooted connections with native guides.' },
                { label: 'Conscious Luxury', desc: 'Handpicked stays that honor the earth.' },
                { label: 'Pure Serenity', desc: 'Seamless logistics for total peace of mind.' }
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 group-hover:text-accent transition-colors">{item.label}</h4>
                  <p className="text-[13px] text-primary/80 leading-tight font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <Link to="/?to=packages" className="group flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                  <span className="text-primary group-hover:text-white transition-colors">→</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary group-hover:translate-x-2 transition-transform duration-500">Explore the Collection</span>
              </Link>
            </div>
          </div>

          {/* Visual Content - Editorial Grid */}
          <div className="w-full lg:w-1/2 relative">
            <div className="grid grid-cols-12 grid-rows-12 h-[500px] md:h-[700px] gap-4">
              <div className="col-span-8 row-span-8 overflow-hidden rounded-sm shadow-2xl">
                <img
                  src={backwaters}
                  alt="Backwaters"
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
                />
              </div>
              <div className="col-span-4 row-span-5 col-start-9 row-start-3 overflow-hidden rounded-sm shadow-xl">
                <img
                  src={waterfalls}
                  alt="Munnar"
                  className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="col-span-12 row-span-4 col-start-1 row-start-9 overflow-hidden rounded-sm shadow-xl mt-4">
                <img
                  src={cultural}
                  alt="Culture"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            
            {/* Absolute Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
