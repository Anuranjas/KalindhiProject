import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">© {new Date().getFullYear()} Kerala Trails. All rights reserved.</p>
          <div className="flex gap-6 text-slate-600 text-sm">
            <Link to="/" className="hover:text-emerald-700">Packages</Link>
            <Link to="/" className="hover:text-emerald-700">About</Link>
            <Link to="/" className="hover:text-emerald-700">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
