import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { fetchPublicTenants } from '../../api/tenant.api';
import { registerPatientRequest } from '../../api/auth.api';

const emptyForm = {
  email: '', password: '', firstName: '', lastName: '', phone: '',
  dateOfBirth: '', gender: 'prefer-not-to-say',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = pick hospital, 2 = personal details
  const [search, setSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants', 'public'],
    queryFn: fetchPublicTenants,
  });

  const filteredTenants = useMemo(() => {
    if (!tenants) return [];
    const q = search.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter((t) => t.name.toLowerCase().includes(q));
  }, [tenants, search]);

  function selectTenant(tenant) {
    setSelectedTenant(tenant);
    setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerPatientRequest({ ...form, tenantSlug: selectedTenant.slug });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <PublicHeader />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-sm">
            <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark">Account created!</h1>
            <p className="mt-2 text-sm text-slate-500">
              Your account at {selectedTenant.name} is ready. Log in to book your first appointment.
            </p>
            <Button className="mt-6" onClick={() => navigate('/login')}>Go to Log In</Button>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />

      <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full sm:max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">
            {step === 1 ? 'Find Your Hospital' : 'Create Your Account'}
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            {step === 1 ? 'Search for the hospital you\'d like to register with' : `Registering with ${selectedTenant?.name}`}
          </p>

          {step === 1 && (
            <div className="mt-6">
              <Input
                id="search"
                placeholder="Search hospitals…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="mt-4 space-y-2 max-h-72 overflow-y-auto">
                {tenantsLoading ? (
                  <p className="text-sm text-slate-400 text-center py-4">Loading hospitals…</p>
                ) : filteredTenants.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No hospitals found.</p>
                ) : (
                  filteredTenants.map((tenant) => (
                    <button
                      key={tenant._id}
                      onClick={() => selectTenant(tenant)}
                      className="w-full text-left rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-brand hover:bg-blue-50 transition-colors"
                    >
                      {tenant.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-medium text-brand hover:underline"
              >
                ← Change hospital
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="firstName" label="First Name" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} required />
                <Input id="lastName" label="Last Name" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} required />
              </div>
              <Input id="email" type="email" label="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
              <Input id="password" type="password" label="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
              <Input id="phone" label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="dateOfBirth" type="date" label="Date of Birth" value={form.dateOfBirth} onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))} required />
                <div className="w-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    value={form.gender}
                    onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                  >
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-brand hover:underline">Terms &amp; Conditions</Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="text-brand hover:underline">Privacy Policy</Link>
                </span>
              </label>

              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

              <Button type="submit" isLoading={isSubmitting} className="w-full">Create Account</Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-brand hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}