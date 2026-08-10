import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import ResponsiveTable from '../../shared/components/ResponsiveTable';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import { fetchDoctors, createDoctor, setDoctorActive, setDoctorAvailability } from '../../api/doctor.api';
import { fetchDepartments } from '../../api/department.api';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/departments', label: 'Departments' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/patients', label: 'Patients' },
  { to: '/admin/appointments', label: 'Appointments' },
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const emptyDoctorForm = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  departmentId: '',
  specialization: '',
  experience: 0,
  consultationDuration: 30,
};

export default function DoctorsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [availabilityDoctor, setAvailabilityDoctor] = useState(null);
  const [form, setForm] = useState(emptyDoctorForm);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');

  const { data: doctors, isLoading } = useQuery({ queryKey: ['doctors'], queryFn: () => fetchDoctors() });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: () => fetchDepartments() });

  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setIsCreateOpen(false);
      setForm(emptyDoctorForm);
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to create doctor'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => setDoctorActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctors'] }),
  });

  const availabilityMutation = useMutation({
    mutationFn: ({ id, availability }) => setDoctorAvailability(id, availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setAvailabilityDoctor(null);
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to update availability'),
  });

  function openAvailabilityModal(doctor) {
    setAvailabilityDoctor(doctor);
    setAvailability(doctor.availability?.length ? doctor.availability : []);
    setError('');
  }

  function addAvailabilityRow() {
    setAvailability((prev) => [...prev, { day: 'monday', startTime: '09:00', endTime: '13:00', isAvailable: true }]);
  }

  function updateAvailabilityRow(index, field, value) {
    setAvailability((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function removeAvailabilityRow(index) {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCreateSubmit(e) {
    e.preventDefault();
    setError('');
    createMutation.mutate(form);
  }

  function handleAvailabilitySubmit(e) {
    e.preventDefault();
    setError('');
    availabilityMutation.mutate({ id: availabilityDoctor._id, availability });
  }

  const columns = [
    { key: 'name', label: 'Name', render: (row) => `${row.userId?.firstName} ${row.userId?.lastName}` },
    { key: 'specialization', label: 'Specialization' },
    { key: 'department', label: 'Department', render: (row) => row.departmentId?.name || '—' },
    { key: 'status', label: 'Status', render: (row) => <Badge active={row.isActive} /> },
  ];

  return (
    <AppLayout navItems={navItems} title="Hospital Admin">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark">Doctors</h1>
          <p className="text-sm text-slate-500 mt-1">Manage doctor profiles and availability</p>
        </div>
        <Button onClick={() => { setForm(emptyDoctorForm); setError(''); setIsCreateOpen(true); }}>
          + Add Doctor
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <ResponsiveTable
            columns={columns}
            rows={doctors}
            emptyMessage="No doctors yet — add your first one above."
            actions={(row) => (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => openAvailabilityModal(row)}
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Set Availability
                </button>
                <button
                  onClick={() => toggleActiveMutation.mutate({ id: row._id, isActive: !row.isActive })}
                  className="text-xs font-medium text-slate-500 hover:underline"
                >
                  {row.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            )}
          />
        )}
      </div>

      {/* Create Doctor modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Doctor">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="firstName" label="First Name" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} required />
            <Input id="lastName" label="Last Name" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} required />
          </div>
          <Input id="email" type="email" label="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <Input id="password" type="password" label="Temporary Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          <Input id="phone" label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />

          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand"
              value={form.departmentId}
              onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))}
              required
            >
              <option value="">Select a department</option>
              {departments?.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <Input id="specialization" label="Specialization" value={form.specialization} onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="experience" type="number" min="0" label="Years of Experience" value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: Number(e.target.value) }))} />
            <Input id="consultationDuration" type="number" min="5" label="Consultation Duration (min)" value={form.consultationDuration} onChange={(e) => setForm((p) => ({ ...p, consultationDuration: Number(e.target.value) }))} />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <Button type="submit" isLoading={createMutation.isPending}>Create Doctor</Button>
        </form>
      </Modal>

      {/* Availability modal */}
      <Modal
        isOpen={!!availabilityDoctor}
        onClose={() => setAvailabilityDoctor(null)}
        title={`Availability — Dr. ${availabilityDoctor?.userId?.firstName || ''} ${availabilityDoctor?.userId?.lastName || ''}`}
      >
        <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
          <p className="text-xs text-slate-400">Max 8 hours total per day (BR-005) — the server will reject anything over that.</p>

          <div className="space-y-3">
            {availability.map((row, index) => (
              <div key={index} className="flex flex-wrap items-end gap-2 border border-slate-100 rounded-lg p-3">
                <div className="flex-1 min-w-[110px]">
                  <label className="block text-xs text-slate-500 mb-1">Day</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={row.day}
                    onChange={(e) => updateAvailabilityRow(index, 'day', e.target.value)}
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[90px]">
                  <label className="block text-xs text-slate-500 mb-1">Start</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={row.startTime}
                    onChange={(e) => updateAvailabilityRow(index, 'startTime', e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[90px]">
                  <label className="block text-xs text-slate-500 mb-1">End</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={row.endTime}
                    onChange={(e) => updateAvailabilityRow(index, 'endTime', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAvailabilityRow(index)}
                  className="text-red-500 text-xs font-medium px-2 py-1.5"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addAvailabilityRow}
            className="text-sm font-medium text-brand hover:underline"
          >
            + Add time slot
          </button>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <Button type="submit" isLoading={availabilityMutation.isPending}>Save Availability</Button>
        </form>
      </Modal>
    </AppLayout>
  );
}