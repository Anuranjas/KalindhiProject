import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/kalindi-logo.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkUser = () => {
    try {
      const u = localStorage.getItem('auth_user');
      setUser(u ? JSON.parse(u) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const displayName = user?.name || user?.email || 'User';
  const avatarUrl = (user && user.avatarUrl) ? user.avatarUrl : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundType=gradientLinear&fontWeight=700`;

  return (
    <header className="fixed top-0 z-50 w-full transition-all duration-300 bg-white/50 backdrop-blur-md border-b border-primary/5">
      <nav className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group z-50" onClick={() => setIsMenuOpen(false)}>
            <div className="relative">
              <img src={logo} alt="Kalindi" className="h-9 w-9 transition-transform duration-500 group-hover:rotate-180" />
            </div>
            <span className="serif text-2xl tracking-widest uppercase font-semibold text-primary">Kalindi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {['Home', 'Packages', 'About', 'Contact'].map((item) => (
              <Link 
                key={item}
                to={item === 'Home' ? '/' : `/?to=${item.toLowerCase()}`} 
                className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70 hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
            {!user ? (
              <Link to="/login" className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70 hover:text-primary transition-colors">Login</Link>
            ) : (
              <button onClick={logout} className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70 hover:text-primary cursor-pointer transition-colors">Logout</button>
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {!user && (
              <Link to="/signup" className="hidden sm:inline-block text-xs font-bold uppercase tracking-[0.2em] border-b border-primary py-1 hover:text-accent hover:border-accent transition-all">Sign Up</Link>
            )}
            {user && (
              <Link to="/profile" className="relative group/avatar z-50">
                <div className="absolute -inset-2 bg-accent/20 rounded-full scale-0 group-hover/avatar:scale-100 transition-transform duration-500"></div>
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="relative h-9 w-9 md:h-10 md:w-10 rounded-full grayscale hover:grayscale-0 transition-all ring-1 ring-primary/10 shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </Link>
            )}
            
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-50 flex flex-col gap-1.5 p-2"
              aria-label="Toggle Menu"
            >
              <div className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-primary transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
              <div className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-sand transition-transform duration-500 ease-soft-bezier md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-32 px-12 gap-12">
          {['Home', 'Packages', 'About', 'Contact'].map((item, idx) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : `/?to=${item.toLowerCase()}`} 
              onClick={() => setIsMenuOpen(false)}
              className="serif text-4xl text-primary lowercase hover:pl-4 transition-all duration-500"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <span className="text-accent italic mr-4 text-2xl font-serif">0{idx + 1}</span>
              {item}
            </Link>
          ))}
          
          <div className="mt-auto pb-12 space-y-8">
            <div className="h-px bg-primary/10 w-full"></div>
            {!user ? (
              <div className="flex flex-col gap-6">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Login</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Sign Up</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Profile</Link>
                <button onClick={logout} className="text-left text-xs font-bold uppercase tracking-[0.3em] text-red-500/60 cursor-pointer">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
