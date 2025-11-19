import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/kalindi-logo.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const u = localStorage.getItem('auth_user');
      setUser(u ? JSON.parse(u) : null);
    } catch {}
  }, []);
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    navigate('/');
  };
  const displayName = user?.name || user?.email || 'User';
  const avatarUrl = (user && user.avatarUrl) ? user.avatarUrl : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundType=gradientLinear&fontWeight=700`;
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60 border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-2xl uppercase text-emerald-700">
            <img src={logo} alt="Kalindi" className="h-8 w-8" />
            <span>Kalindi</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-slate-700">
            <Link to="/" className="hover:text-emerald-700">Home</Link>
            <Link to="/" className="hover:text-emerald-700">Packages</Link>
            <Link to="/" className="hover:text-emerald-700">About</Link>
            <Link to="/" className="hover:text-emerald-700">Contact</Link>
            {!user ? (
              <Link to="/login" className="hover:text-emerald-700">Login</Link>
            ) : (
              <button onClick={logout} className="text-left hover:text-emerald-700">Logout</button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!user && (
              <Link to="/signup" className="hidden sm:inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-slate-700 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">Sign Up</Link>
            )}
            {user && (
              <Link to="/" className="inline-flex items-center">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
