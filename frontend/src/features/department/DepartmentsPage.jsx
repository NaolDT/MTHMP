import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import ResponsiveTable from '../../shared/components/ResponsiveTable';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import { fetchDepartments, createDepartment, updateDepartment, setDepartmentActive } from '../../api/department.api';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/departments', label: 'Departments' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/patients', label: 'Patients' },
  { to: '/admin/appointments', label: 'Appointments' },
];

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => fetchDepartments(),
  });

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      closeModal();
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to create department'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      closeModal();
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to update department'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => setDepartmentActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });

  function openCreateModal() {
    setEditingDept(null);
    setForm({ name: '', description: '' });
    setError('');
    setIsModalOpen(true);
  }

  function openEditModal(dept) {
    setEditingDept(dept);
    setForm({ name: dept.name, description: dept.description });
    setError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingDept) {
      updateMutation.mutate({ id: editingDept._id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status', render: (row) => <Badge active={row.isActive} /> },
  ];

  return (
    <AppLayout navItems={navItems} title="Hospital Admin">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark">Departments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your hospital's departments</p>
        </div>
        <Button onClick={openCreateModal} className="sm:w-auto">
          + Add Department
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <ResponsiveTable
            columns={columns}
            rows={departments}
            emptyMessage="No departments yet — add your first one above."
            actions={(row) => (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => openEditModal(row)}
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Edit
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingDept ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <Input
            id="description"
            label="Description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
            {editingDept ? 'Save Changes' : 'Create Department'}
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
}