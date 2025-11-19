import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-slate-600">© {new Date().getFullYear()} Kalindi. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-slate-600 text-sm sm:justify-end">
            <Link to="/?to=packages" className="hover:text-emerald-700">Packages</Link>
            <Link to="/" className="hover:text-emerald-700">About</Link>
            <Link to="/?to=contact" className="hover:text-emerald-700">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
