import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import ResponsiveTable from '../../shared/components/ResponsiveTable';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { fetchPatients, registerPatient } from '../../api/patient.api';


const emptyForm = {
  email: '', password: '', firstName: '', lastName: '', phone: '',
  dateOfBirth: '', gender: 'prefer-not-to-say',
};

export default function PatientsPage({ navItems, title = 'Hospital Admin' })  {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const { data: patients, isLoading } = useQuery({ queryKey: ['patients'], queryFn: () => fetchPatients() });

  const registerMutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsModalOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to register patient'),
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    registerMutation.mutate(form);
  }

  const columns = [
    { key: 'name', label: 'Name', render: (row) => `${row.userId?.firstName} ${row.userId?.lastName}` },
    { key: 'email', label: 'Email', render: (row) => row.userId?.email },
    { key: 'phone', label: 'Phone' },
    { key: 'dob', label: 'Date of Birth', render: (row) => new Date(row.dateOfBirth).toLocaleDateString() },
  ];

  return (
    <AppLayout  navItems={navItems} title={title}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark">Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Register walk-in patients and view records</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setError(''); setIsModalOpen(true); }}>
          + Register Patient
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <ResponsiveTable columns={columns} rows={patients} emptyMessage="No patients registered yet." />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Patient">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="firstName" label="First Name" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} required />
            <Input id="lastName" label="Last Name" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} required />
          </div>
          <Input id="email" type="email" label="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <Input id="password" type="password" label="Temporary Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          <Input id="phone" label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="dateOfBirth" type="date" label="Date of Birth" value={form.dateOfBirth} onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))} required />
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand"
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
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <Button type="submit" isLoading={registerMutation.isPending}>Register Patient</Button>
        </form>
      </Modal>
    </AppLayout>
  );
}