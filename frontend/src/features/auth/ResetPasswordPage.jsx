import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { resetPasswordRequest } from '../../api/auth.api';
import { useFormValidation } from '../../shared/hooks/useFormValidation';
import { passwordStrength, matches, required, compose } from '../../shared/utils/validators';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validators = {
    password: compose(required('Password'), passwordStrength),
    confirmPassword: compose(required('Confirm password'), matches('password', 'Passwords')),
  };

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    { password: '', confirmPassword: '' },
    validators
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await resetPasswordRequest({ token, password: values.password });
      setSuccess(true);
    } catch (err) {
      const details = err.response?.data?.details;
      setSubmitError(Array.isArray(details) ? details.join(' ') : err.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <PublicHeader />
        <div className="flex-1 flex items-center justify-center px-4 text-center">
          <div>
            <p className="text-slate-600">This reset link is missing its token.</p>
            <Link to="/forgot-password" className="mt-3 inline-block text-brand font-medium hover:underline">
              Request a new link
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {success ? (
            <div className="text-center py-4">
              <h1 className="text-xl font-semibold text-brand-dark">Password Updated</h1>
              <p className="mt-2 text-sm text-slate-500">You can now log in with your new password.</p>
              <Button className="mt-6" onClick={() => navigate('/login')}>Go to Log In</Button>
            </div>
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">Set a New Password</h1>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    label="New Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password ? errors.password : null}
                  />
                  {!errors.password && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
                    </p>
                  )}
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword ? errors.confirmPassword : null}
                />
                {submitError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{submitError}</p>}
                <Button type="submit" isLoading={isSubmitting} className="w-full">Reset Password</Button>
              </form>
            </>
          )}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}