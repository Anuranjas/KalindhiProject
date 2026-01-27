import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import PackagesSection from './components/Packages/PackagesSection'
import Footer from './components/Footer'
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BookPackage from './pages/BookPackage'
import Profile from './pages/Profile'
import AdminLogin from './pages/AdminLogin'
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

const Home = ({ packagesRef, contactRef, aboutRef }) => (
  <>
    <Hero />
    <div ref={aboutRef}>
      <About />
    </div>
    <div ref={packagesRef}>
      <PackagesSection />
    </div>
    <section ref={contactRef} className="py-24 md:py-40 bg-sand">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-20 lg:grid-cols-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/80 block mb-6">Connect</span>
            <h2 className="heading-md serif text-primary mb-12">Ready to <span className="italic">begin</span> your <br />story?</h2>
            
            <div className="space-y-12">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4">Direct Message</h4>
                <p className="text-xl serif italic text-primary">+91-90000-00000</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4">Electronic Mail</h4>
                <p className="text-xl serif italic text-primary">concierge@kalindi.trail</p>
              </div>
              <div className="max-w-sm">
                <p className="text-sm text-primary/60 font-light leading-relaxed">
                  Our consultants typically respond within 24 hours to craft your definitive itinerary.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = Object.fromEntries(new FormData(form));
              import('./lib/api').then(({ api }) =>
                api('/api/contact', { method: 'POST', body: { name: data.name, email: data.email, message: data.message } })
              ).then(() => {
                alert('We have received your request. A consultant will be in touch shortly.');
                form.reset();
              }).catch((err) => alert(err.message));
            }}
            className="flex flex-col gap-10"
          >
            <div className="space-y-10">
              <div className="group relative border-b border-primary/10 py-2 focus-within:border-accent transition-colors">
                <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 group-focus-within:text-accent transition-colors">Full Name</label>
                <input id="contact-name" name="name" required className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/10" placeholder="Aiden Smith" />
              </div>
              <div className="group relative border-b border-primary/10 py-2 focus-within:border-accent transition-colors">
                <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 group-focus-within:text-accent transition-colors">Email Address</label>
                <input id="contact-email" name="email" type="email" required className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/10" placeholder="aiden@example.com" />
              </div>
              <div className="group relative border-b border-primary/10 py-2 focus-within:border-accent transition-colors">
                <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 group-focus-within:text-accent transition-colors">Your Preferences</label>
                <textarea id="contact-message" name="message" rows="2" required className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none resize-none placeholder:text-primary/10" placeholder="Let us know your interests..." />
              </div>
            </div>
            
            <button type="submit" className="self-start group flex items-center gap-6 px-12 py-5 bg-primary text-white rounded-full transition-all hover:bg-accent hover:-translate-y-1 active:translate-y-0">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Send Inquiry</span>
              <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  </>
);

function App() {
  const packagesRef = useRef(null);
  const contactRef = useRef(null);
  const aboutRef = useRef(null);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin-login');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const to = params.get('to');
    let el = null;
    if (to === 'packages') el = packagesRef.current;
    if (to === 'contact') el = contactRef.current;
    if (to === 'about') el = aboutRef.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      <Routes>
        <Route element={<><Navbar /><main className="grow"><Outlet /></main><Footer /></>}>
          <Route path="/" element={<Home packagesRef={packagesRef} contactRef={contactRef} aboutRef={aboutRef} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/book" element={<BookPackage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </div>
  )
}

export default App