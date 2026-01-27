import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-24 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 pb-20 border-b border-white/10">
          <div>
            <h2 className="serif text-6xl md:text-8xl tracking-tighter mb-10">KALINDI</h2>
            <p className="max-w-xs text-white/50 text-xs font-bold uppercase tracking-[0.2em] leading-loose">
              Exquisite Kerala Trails. <br />
              Deeply Rooted, <br />
              Wanderer Focused.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/60">Navigation</span>
              {['Home', 'Packages', 'About', 'Contact'].map(link => (
                <Link key={link} to={link === 'Home' ? '/' : `/?to=${link.toLowerCase()}`} className="text-sm font-light hover:text-accent transition-colors w-fit">
                  {link}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/60">Legal</span>
              <Link to="/" className="text-sm font-light hover:text-accent transition-colors w-fit">Privacy Policy</Link>
              <Link to="/" className="text-sm font-light hover:text-accent transition-colors w-fit">Terms of Service</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          <p>© {new Date().getFullYear()} Kalindi Collective</p>
          <div className="flex gap-10">
            <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-white transition-colors cursor-pointer">LinkedIn</span>
          </div>
          <p>Handcrafted by Enthusiasts</p>
        </div>
      </div>
    </footer>
  );
}
