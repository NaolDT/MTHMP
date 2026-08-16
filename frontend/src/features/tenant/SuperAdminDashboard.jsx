import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import ResponsiveTable from '../../shared/components/ResponsiveTable';
import StatCard from '../../shared/components/StatCard';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import { fetchTenants, createTenant, setTenantActive } from '../../api/tenant.api';
import { fetchPlatformOverview } from '../../api/analytics.api';
import { useFormValidation } from '../../shared/hooks/useFormValidation';
import { required, email as emailRule, passwordStrength, compose } from '../../shared/utils/validators';
import PageHeader from '../../shared/components/PageHeader';


const navItems = [
  { to: '/super-admin', label: 'Hospitals' },
  { to: '/super-admin/pending-reviews', label: 'Pending Reviews' },
];

const tenantValidators = {
  name: required('Hospital name'),
  adminFirstName: required('First name'),
  adminLastName: required('Last name'),
  adminEmail: compose(required('Admin email'), emailRule),
  adminPassword: compose(required('Admin password'), passwordStrength),
};

const emptyForm = {
  name: '', timezone: 'UTC', adminEmail: '', adminPassword: '', adminFirstName: '', adminLastName: '',
};

export default function SuperAdminDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, validateAll, reset } = useFormValidation(
    emptyForm,
    tenantValidators
  );

  const { data: overview } = useQuery({ queryKey: ['analytics', 'platform-overview'], queryFn: fetchPlatformOverview });
  const { data: tenants, isLoading } = useQuery({ queryKey: ['tenants'], queryFn: () => fetchTenants() });

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'platform-overview'] });
      setIsModalOpen(false);
      reset(emptyForm);
    },
    onError: (err) => setSubmitError(err.response?.data?.message || 'Failed to create hospital'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => setTenantActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'platform-overview'] });
    },
  });

  function openModal() {
    reset(emptyForm);
    setSubmitError('');
    setIsModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validateAll()) return;
    createMutation.mutate(values);
  }

  const columns = [
    { key: 'name', label: 'Hospital' },
    { key: 'slug', label: 'Slug' },
    { key: 'plan', label: 'Plan' },
    { key: 'status', label: 'Status', render: (row) => <Badge active={row.isActive} /> },
    { key: 'created', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <AppLayout navItems={navItems} title="Super Admin">
     <PageHeader
  title="Hospitals"
  subtitle="Manage every hospital on the platform"
  actions={<Button onClick={openModal}>+ Add Hospital</Button>}
/>

      {overview && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Hospitals" value={overview.totalTenants} />
          <StatCard label="Active" value={overview.activeTenants} />
          <StatCard label="Inactive" value={overview.inactiveTenants} />
          <StatCard label="Total Users" value={Object.values(overview.usersByRole).reduce((a, b) => a + b, 0)} />
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <ResponsiveTable
            columns={columns}
            rows={tenants}
            emptyMessage="No hospitals yet — add the first one above."
            actions={(row) => (
              <button
                onClick={() => toggleActiveMutation.mutate({ id: row._id, isActive: !row.isActive })}
                className="text-xs font-medium text-slate-500 hover:underline"
              >
                {row.isActive ? 'Suspend' : 'Reactivate'}
              </button>
            )}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Hospital">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="name"
            name="name"
            label="Hospital Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : null}
          />
          <Input
            id="timezone"
            name="timezone"
            label="Timezone (IANA name)"
            placeholder="e.g. Africa/Addis_Ababa"
            value={values.timezone}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <p className="text-xs uppercase text-slate-400 pt-2">First Hospital Admin</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="adminFirstName"
              name="adminFirstName"
              label="First Name"
              value={values.adminFirstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.adminFirstName ? errors.adminFirstName : null}
            />
            <Input
              id="adminLastName"
              name="adminLastName"
              label="Last Name"
              value={values.adminLastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.adminLastName ? errors.adminLastName : null}
            />
          </div>
          <Input
            id="adminEmail"
            name="adminEmail"
            type="email"
            label="Admin Email"
            value={values.adminEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.adminEmail ? errors.adminEmail : null}
          />
          <div>
            <Input
              id="adminPassword"
              name="adminPassword"
              type="password"
              label="Admin Temporary Password"
              value={values.adminPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.adminPassword ? errors.adminPassword : null}
            />
            {!errors.adminPassword && (
              <p className="text-xs text-slate-400 mt-1.5">
                At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
              </p>
            )}
          </div>

          {submitError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{submitError}</p>}
          <Button type="submit" isLoading={createMutation.isPending}>Create Hospital</Button>
        </form>
      </Modal>
    </AppLayout>
  );
}