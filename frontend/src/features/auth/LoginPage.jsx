import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { useFormValidation } from '../../shared/hooks/useFormValidation';
import { required, email as emailRule, compose } from '../../shared/utils/validators';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSuperAdminLogin, setIsSuperAdminLogin] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validators = {
    email: compose(required('Email'), emailRule),
    password: required('Password'),
    tenantSlug: (value) => (isSuperAdminLogin ? null : required('Hospital')(value)),
  };

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    { email: '', password: '', tenantSlug: '' },
    validators
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validateAll()) return;

    setIsLoading(true);
    try {
      const user = await login({
        email: values.email,
        password: values.password,
        tenantSlug: isSuperAdminLogin ? undefined : values.tenantSlug,
      });
      navigate(`/${user.role}`);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">MTHMP Login</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Multi-Tenant Healthcare Management Platform</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : null}
          />

          <div>
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : null}
            />
            <div className="text-right mt-1.5">
              <Link to="/forgot-password" className="text-xs font-medium text-brand hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {!isSuperAdminLogin && (
            <Input
              id="tenantSlug"
              name="tenantSlug"
              type="text"
              label="Hospital"
              placeholder="e.g. st-mary-hospital"
              value={values.tenantSlug}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.tenantSlug ? errors.tenantSlug : null}
            />
          )}

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{submitError}</p>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full">Log In</Button>
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

        <p className="mt-4 text-center text-sm text-slate-500">
          New patient? <Link to="/register" className="text-brand hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}