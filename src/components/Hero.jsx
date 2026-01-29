import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import img1 from '../assets/hero/backwaters.jpg';
import img2 from '../assets/hero/waterfalls.jpg';
import img3 from '../assets/hero/cultural.jpg';

const HERO_IMAGES = [img1, img2, img3,];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, i) => (
          <div 
            key={src}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={src} 
              alt="Kerala Landscape" 
              className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-linear ${i === index ? 'scale-110' : 'scale-100'}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-primary/40 backdrop-brightness-[0.7] z-10" />
      </div>

      <div className="relative z-20 w-full max-w-7xl px-6 lg:px-12 text-center">
        <div className="overflow-hidden mb-4">
          <p className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white animate-fade-in-up">
            Authentic Experiences &bull; Curated Trails
          </p>
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:heading-lg serif text-white text-balance drop-shadow-2xl">
          Soul of <br className="hidden md:block" />
          <span className="italic font-normal">the Tropics.</span>
        </h1>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
          <Link 
            to="/?to=packages" 
            className="group relative w-full sm:w-auto px-10 py-4 overflow-hidden rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white hover:text-primary active:scale-95"
          >
            <span className="relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Explore the Trails</span>
          </Link>
          <Link 
            to="/?to=contact" 
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-2 hover:text-accent hover:border-accent transition-all"
          >
            Personal Inquiry
          </Link>
        </div>

        <div className="mt-16 flex justify-center gap-3">
          {HERO_IMAGES.map((_, i) => (
            <button 
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <div className="w-[1px] h-12 bg-linear-to-b from-white/0 to-white/60" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 vertical-rl">Scroll</span>
      </div>
    </section>
  );
}
