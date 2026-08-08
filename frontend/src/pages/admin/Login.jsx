import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Seo from '../../components/common/Seo';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-2 px-4 font-sans">
      <Seo title="Admin Login" />
      <div className="w-full max-w-sm bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <img src="/legacy/logo.png" alt="" className="mx-auto mb-3 h-16 w-16 rounded-full object-cover" />
          <h1 className="font-serif text-2xl text-forest">Admin Login</h1>
          <p className="mt-1 text-xs text-text-muted">Himalayan Swoniga Harvest</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-forest/15 px-4 py-3 text-sm outline-none focus:border-forest-mid"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-forest/15 px-4 py-3 text-sm outline-none focus:border-forest-mid"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-forest py-3 text-xs font-semibold uppercase tracking-widest text-cream transition hover:bg-forest-mid disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
