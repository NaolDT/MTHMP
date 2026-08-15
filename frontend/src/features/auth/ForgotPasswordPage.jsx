import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { forgotPasswordRequest } from '../../api/auth.api';
import { useFormValidation } from '../../shared/hooks/useFormValidation';
import { required, email as emailRule, compose } from '../../shared/utils/validators';

export default function ForgotPasswordPage() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validators = {
    email: compose(required('Email'), emailRule),
    tenantSlug: (value) => (isSuperAdmin ? null : required('Hospital')(value)),
  };

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    { email: '', tenantSlug: '' },
    validators
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await forgotPasswordRequest({ email: values.email, tenantSlug: isSuperAdmin ? undefined : values.tenantSlug });
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-4">
              <h1 className="text-xl font-semibold text-brand-dark">Check your email</h1>
              <p className="mt-2 text-sm text-slate-500">
                If an account exists for that email, we've sent a password reset link. It's valid for 1 hour.
              </p>
              <Link to="/login" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
                Back to Log In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">Forgot Password</h1>
              <p className="mt-1 text-center text-sm text-slate-500">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : null}
                />
                {!isSuperAdmin && (
                  <Input
                    id="tenantSlug"
                    name="tenantSlug"
                    label="Hospital"
                    placeholder="e.g. st-mary-hospital"
                    value={values.tenantSlug}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.tenantSlug ? errors.tenantSlug : null}
                  />
                )}
                <Button type="submit" isLoading={isSubmitting} className="w-full">Send Reset Link</Button>
              </form>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSuperAdmin}
                    onChange={(e) => setIsSuperAdmin(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Super Admin account
                </label>
                <Link to="/login" className="text-brand hover:underline">Back to Log In</Link>
              </div>
            </>
          )}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}