import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/auth.service.js';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login, isLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
    </div>
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // POST /login → { message, email }
      const data = await authService.login({ email: form.email, password: form.password });
      // role is hard-coded until the backend /login response includes it
      login({ email: data.email, role: 'ADMIN' });
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-6 font-display">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-4xl">analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight font-headline">Censo Admin</h1>
          <p className="text-sm text-on-surface-variant mt-1">Panel de administración</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full h-14 px-4 rounded-xl border border-primary/20 bg-surface-container text-on-surface focus:ring-2 focus:ring-primary outline-none transition"
              placeholder="admin@censo.gov.co"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full h-14 px-4 rounded-xl border border-primary/20 bg-surface-container text-on-surface focus:ring-2 focus:ring-primary outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="material-symbols-outlined text-rose-500 text-lg shrink-0">error</span>
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95 mt-2 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading
              ? <><span className="material-symbols-outlined animate-spin">sync</span> Ingresando...</>
              : <><span className="material-symbols-outlined">login</span> Ingresar</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
