import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60 border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-emerald-700">
            <span className="inline-block h-8 w-8 rounded-full bg-emerald-600"></span>
            <span>Kerala Trails</span>
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
            <Link to={user ? '/' : '/signup'} className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {user ? 'My Account' : 'Book Now'}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
