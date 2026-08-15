import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import ResponsiveTable from '../../shared/components/ResponsiveTable';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import { fetchDepartments, createDepartment, updateDepartment, setDepartmentActive } from '../../api/department.api';
import { useFormValidation } from '../../shared/hooks/useFormValidation';
import { required, minLength, compose } from '../../shared/utils/validators';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/departments', label: 'Departments' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/patients', label: 'Patients' },
  { to: '/admin/appointments', label: 'Appointments' },
];

const validators = {
  name: compose(required('Name'), minLength(2, 'Name')),
};

const emptyForm = { name: '', description: '' };

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, validateAll, reset } = useFormValidation(
    emptyForm,
    validators
  );

  const { data: departments, isLoading } = useQuery({ queryKey: ['departments'], queryFn: () => fetchDepartments() });

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      closeModal();
    },
    onError: (err) => setSubmitError(err.response?.data?.message || 'Failed to create department'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      closeModal();
    },
    onError: (err) => setSubmitError(err.response?.data?.message || 'Failed to update department'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => setDepartmentActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });

  function openCreateModal() {
    setEditingDept(null);
    reset(emptyForm);
    setSubmitError('');
    setIsModalOpen(true);
  }

  function openEditModal(dept) {
    setEditingDept(dept);
    reset({ name: dept.name, description: dept.description });
    setSubmitError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validateAll()) return;

    if (editingDept) {
      updateMutation.mutate({ id: editingDept._id, payload: values });
    } else {
      createMutation.mutate(values);
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
        <Button onClick={openCreateModal} className="sm:w-auto">+ Add Department</Button>
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
                <button onClick={() => openEditModal(row)} className="text-xs font-medium text-brand hover:underline">Edit</button>
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
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="name" name="name" label="Name"
            value={values.name} onChange={handleChange} onBlur={handleBlur}
            error={touched.name ? errors.name : null}
          />
          <Input
            id="description" name="description" label="Description"
            value={values.description} onChange={handleChange} onBlur={handleBlur}
          />
          {submitError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{submitError}</p>}
          <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
            {editingDept ? 'Save Changes' : 'Create Department'}
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
}