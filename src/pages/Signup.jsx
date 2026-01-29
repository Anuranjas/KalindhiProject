import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('signup'); // 'signup' or 'verify'
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields are required'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    try {
      setLoading(true);
      await api('/api/auth/signup', { method: 'POST', body: { name: form.name, email: form.email, phone: form.phone, password: form.password } });
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { token, user } = await api('/api/auth/verify-otp', { method: 'POST', body: { email: form.email, code: otp } });
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError('');
    try {
      await api('/api/auth/resend-otp', { method: 'POST', body: { email: form.email } });
      alert('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (step === 'verify') {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-sand px-6 py-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="serif text-4xl font-semibold text-primary">Verify Identity.</h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Enter the 6-digit code sent to your registered contact</p>
          </div>

          <form className="space-y-10" onSubmit={onVerify}>
            <div className="group border-b border-primary/20 py-2 focus-within:border-accent transition-colors">
              <label htmlFor="otp" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 group-focus-within:text-accent transition-colors">OTP Code</label>
              <input 
                id="otp"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                maxLength={6}
                className="block w-full bg-transparent pt-2 pb-1 text-3xl tracking-[0.5em] serif text-center outline-none placeholder:text-primary/20" 
                placeholder="000000" 
              />
            </div>
            
            {error && <p className="text-[11px] font-bold uppercase tracking-wider text-red-500/80 text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-accent disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Complete Registration'}
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
            Didn't receive code? {' '}
            <button onClick={onResend} className="text-primary hover:text-accent border-b border-primary/20 pb-0.5 ml-1">Resend Code</button>
          </p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-sand px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="serif text-4xl font-semibold text-primary">Join the Collective.</h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Register for exclusive access to curated trails</p>
        </div>

        <form className="space-y-10" onSubmit={onSubmit}>
          <div className="group border-b border-primary/20 py-2 focus-within:border-accent transition-colors">
            <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 group-focus-within:text-accent transition-colors">Legal Name</label>
            <input id="name" name="name" value={form.name} onChange={onChange} required className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/30" placeholder="Elias Thorne" />
          </div>
          <div className="group border-b border-primary/20 py-2 focus-within:border-accent transition-colors">
            <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 group-focus-within:text-accent transition-colors">Email Address</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} required className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/30" placeholder="elias@example.com" />
          </div>
          <div className="group border-b border-primary/20 py-2 focus-within:border-accent transition-colors">
            <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 group-focus-within:text-accent transition-colors">Phone Number</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={onChange} className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/30" placeholder="+91 98765 43210" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group border-b border-primary/20 py-2 focus-within:border-accent transition-colors">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 group-focus-within:text-accent transition-colors">Security Code</label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[9px] font-bold uppercase tracking-widest text-primary/60 hover:text-accent transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={onChange} required className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/30" placeholder="••••••••" />
            </div>
            <div className="group border-b border-primary/20 py-2 focus-within:border-accent transition-colors">
              <label htmlFor="confirm" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 group-focus-within:text-accent transition-colors">Verification</label>
              <input id="confirm" name="confirm" type={showPassword ? 'text' : 'password'} value={form.confirm} onChange={onChange} required className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/30" placeholder="••••••••" />
            </div>
          </div>
          
          {error && <p className="text-[11px] font-bold uppercase tracking-wider text-red-500/80 text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-accent disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Create Access'}
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
          Already registered? {' '}
          <Link to="/login" className="text-primary hover:text-accent border-b border-primary/20 pb-0.5 ml-1">Authenticate</Link>
        </p>

        <div className="mt-12 text-center">
            <Link to="/" className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/20 hover:text-primary transition-colors">Back to Sanctuary</Link>
        </div>
      </div>
    </main>
  );
}
