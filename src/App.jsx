import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import PackagesSection from './components/Packages/PackagesSection'
import Footer from './components/Footer'
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useEffect, useRef } from 'react'

function ProtectedLayout() {
  const location = useLocation();
  let authed = false;
  try {
    authed = !!localStorage.getItem('auth_user');
  } catch {}
  if (!authed) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return (
    <div className="min-h-full bg-white text-slate-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const packagesRef = useRef(null);
  const contactRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const to = params.get('to');
    let el = null;
    if (to === 'packages') el = packagesRef.current;
    if (to === 'contact') el = contactRef.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.search]);
  const Home = () => (
    <>
      <Hero />
      <About />
      <div ref={packagesRef}>
        <PackagesSection />
      </div>
      <section ref={contactRef} className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact us</h2>
              <p className="mt-3 text-slate-600">Tell us your travel dates and preferences — we’ll share a custom itinerary and transparent quote.</p>
              <p className="mt-2 text-slate-600">Our team usually replies within a few hours during business days. Share as many details as you can for a faster, accurate plan.</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>WhatsApp: +91-90000-00000</li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Email: hello@keralatrails.example</li>
              </ul>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = Object.fromEntries(new FormData(form));
                import('./lib/api').then(({ api }) =>
                  api('/api/contact', { method: 'POST', body: { name: data.name, email: data.email, message: data.message } })
                ).then(() => {
                  alert('Thanks! We will get back to you soon.');
                  form.reset();
                }).catch((err) => alert(err.message));
              }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700">Name</label>
                  <input name="name" required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Your name" />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input name="email" type="email" required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="you@example.com" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Message</label>
                <textarea name="message" rows="4" required className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Share preferences or questions..." />
              </div>
              <button type="submit" className="mt-6 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                Send enquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App