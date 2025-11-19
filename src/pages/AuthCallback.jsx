import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const name = decodeURIComponent(params.get('name') || '');
    const email = decodeURIComponent(params.get('email') || '');
    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify({ name, email }));
      navigate('/');
    } else {
      navigate('/login?error=callback');
    }
  }, [params, navigate]);

  return (
    <main className="min-h-[calc(100vh-4rem)] grid place-items-center p-8">
      <p className="text-slate-600">Signing you in…</p>
    </main>
  );
}
