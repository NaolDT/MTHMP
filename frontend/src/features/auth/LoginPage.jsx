import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', tenantSlug: '' });
  const [isSuperAdminLogin, setIsSuperAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login({
        email: form.email,
        password: form.password,
        tenantSlug: isSuperAdminLogin ? undefined : form.tenantSlug,
      });
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">
          MTHMP Login
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Multi-Tenant Healthcare Management Platform
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          {!isSuperAdminLogin && (
            <Input
              id="tenantSlug"
              name="tenantSlug"
              type="text"
              label="Hospital"
              placeholder="e.g. st-mary-hospital"
              value={form.tenantSlug}
              onChange={handleChange}
              required={!isSuperAdminLogin}
            />
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full">
            Log In
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSuperAdminLogin}
              onChange={(e) => setIsSuperAdminLogin(e.target.checked)}
              className="rounded border-slate-300"
            />
            Super Admin login
          </label>
        </div>
      </div>
    </div>
  );
}