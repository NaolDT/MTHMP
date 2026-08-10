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

const navItems = [{ to: '/super-admin', label: 'Hospitals' }];

const emptyForm = {
  name: '', timezone: 'UTC', adminEmail: '', adminPassword: '', adminFirstName: '', adminLastName: '',
};

export default function SuperAdminDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const { data: overview } = useQuery({ queryKey: ['analytics', 'platform-overview'], queryFn: fetchPlatformOverview });
  const { data: tenants, isLoading } = useQuery({ queryKey: ['tenants'], queryFn: () => fetchTenants() });

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'platform-overview'] });
      setIsModalOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to create hospital'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => setTenantActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'platform-overview'] });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    createMutation.mutate(form);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark">Hospitals</h1>
          <p className="text-sm text-slate-500 mt-1">Manage every hospital on the platform</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setError(''); setIsModalOpen(true); }}>
          + Add Hospital
        </Button>
      </div>

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="name" label="Hospital Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input id="timezone" label="Timezone (IANA name)" placeholder="e.g. Africa/Addis_Ababa" value={form.timezone} onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))} />

          <p className="text-xs uppercase text-slate-400 pt-2">First Hospital Admin</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="adminFirstName" label="First Name" value={form.adminFirstName} onChange={(e) => setForm((p) => ({ ...p, adminFirstName: e.target.value }))} required />
            <Input id="adminLastName" label="Last Name" value={form.adminLastName} onChange={(e) => setForm((p) => ({ ...p, adminLastName: e.target.value }))} required />
          </div>
          <Input id="adminEmail" type="email" label="Admin Email" value={form.adminEmail} onChange={(e) => setForm((p) => ({ ...p, adminEmail: e.target.value }))} required />
          <Input id="adminPassword" type="password" label="Admin Temporary Password" value={form.adminPassword} onChange={(e) => setForm((p) => ({ ...p, adminPassword: e.target.value }))} required />

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <Button type="submit" isLoading={createMutation.isPending}>Create Hospital</Button>
        </form>
      </Modal>
    </AppLayout>
  );
}