import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import PackagesSection from './components/Packages/PackagesSection'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const Home = () => (
    <>
      <Hero />
      <About />
      <PackagesSection />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact us</h2>
              <p className="mt-3 text-slate-600">Tell us your travel dates and preferences — we’ll share a custom itinerary and quote.</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>WhatsApp: +91-90000-00000</li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"/>Email: hello@keralatrails.example</li>
              </ul>
            </div>
            <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Name</label>
                  <input className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="you@example.com" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Travel dates</label>
                <input className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g., 15–20 Dec" />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Message</label>
                <textarea rows="4" className="mt-1 w-full rounded-md border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Share preferences or questions..." />
              </div>
              <button type="button" className="mt-6 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                Send enquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-full bg-white text-slate-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App