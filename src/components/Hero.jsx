import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://wallpapercave.com/wp/wp8050512.jpg" 
          alt="Kerala Landscape" 
          className="h-full w-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-brightness-[0.85]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 lg:px-12 text-center">
        <div className="overflow-hidden mb-4">
          <p className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/80 animate-fade-in-up">
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
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-[1px] h-12 bg-linear-to-b from-white/0 to-white/60" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 vertical-rl">Scroll</span>
      </div>
    </section>
  );
}
