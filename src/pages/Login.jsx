import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';
import logo from '../assets/kalindi-logo.svg';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('login'); // 'login' or 'verify'
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await api('/api/auth/login', { method: 'POST', body: form });
      
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      window.dispatchEvent(new Event('storage'));
      const params = new URLSearchParams(location.search);
      const next = params.get('next');
      navigate(next || '/');
    } catch (err) {
      if (err.requiresVerification) {
        setStep('verify');
      } else {
        setError(err.message);
      }
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
      const params = new URLSearchParams(location.search);
      const next = params.get('next');
      navigate(next || '/');
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
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-sand px-6 py-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="serif text-4xl font-semibold text-primary">Verify Access.</h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Enter the security code sent to your registered contact to verify your account</p>
          </div>

          <form className="space-y-10" onSubmit={onVerify}>
            <div className="group border-b border-primary/20 py-2 focus-within:border-accent transition-colors">
              <label htmlFor="otp" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 group-focus-within:text-accent transition-colors">Security Code</label>
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
              {loading ? 'Authenticating...' : 'Confirm Identity'}
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
            Lost the code? {' '}
            <button onClick={onResend} className="text-primary hover:text-accent border-b border-primary/20 pb-0.5 ml-1">Resend Security Code</button>
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-sand px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <img src={logo} alt="Kalindi" className="h-12 w-12 mx-auto" />
          </Link>
          <h1 className="serif text-4xl font-semibold text-primary">Welcome Back.</h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Enter your credentials to continue</p>
        </div>

        <form className="space-y-10" onSubmit={onSubmit}>
          <div className="group border-b border-primary/20 py-2 focus-within:border-accent transition-colors">
            <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 group-focus-within:text-accent transition-colors">Email Address</label>
            <input id="email" name="email" value={form.email} onChange={onChange} type="email" required className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/30" placeholder="guest@example.com" />
          </div>
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
            <input 
              id="password" 
              name="password" 
              value={form.password} 
              onChange={onChange} 
              type={showPassword ? 'text' : 'password'} 
              required 
              className="block w-full bg-transparent pt-2 pb-1 text-lg serif outline-none placeholder:text-primary/30" 
              placeholder="••••••••" 
            />
          </div>
          
          {error && <p className="text-[11px] font-bold uppercase tracking-wider text-red-500/80 text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-accent disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
          New to the collective? {' '}
          <Link to="/signup" className="text-primary hover:text-accent border-b border-primary/20 pb-0.5 ml-1">Create Access</Link>
        </p>
      </div>
    </div>
  );
}
