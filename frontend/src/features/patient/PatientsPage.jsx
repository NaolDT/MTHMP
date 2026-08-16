import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import ResponsiveTable from '../../shared/components/ResponsiveTable';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { fetchPatients, registerPatient } from '../../api/patient.api';
import { useFormValidation } from '../../shared/hooks/useFormValidation';
import { required, email as emailRule, passwordStrength, pastDate, compose } from '../../shared/utils/validators';
import PageHeader from '../../shared/components/PageHeader';

const validators = {
  firstName: required('First name'),
  lastName: required('Last name'),
  email: compose(required('Email'), emailRule),
  password: compose(required('Password'), passwordStrength),
  phone: required('Phone'),
  dateOfBirth: compose(required('Date of birth'), pastDate('Date of birth')),
};

const emptyForm = { email: '', password: '', firstName: '', lastName: '', phone: '', dateOfBirth: '', gender: 'prefer-not-to-say' };

export default function PatientsPage({ navItems, title = 'Hospital Admin' }) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, validateAll, reset } = useFormValidation(
    emptyForm,
    validators
  );

  const { data: patients, isLoading } = useQuery({ queryKey: ['patients'], queryFn: () => fetchPatients() });

  const registerMutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsModalOpen(false);
      reset(emptyForm);
    },
    onError: (err) => setSubmitError(err.response?.data?.message || 'Failed to register patient'),
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
    registerMutation.mutate(values);
  }

  const columns = [
    { key: 'name', label: 'Name', render: (row) => `${row.userId?.firstName} ${row.userId?.lastName}` },
    { key: 'email', label: 'Email', render: (row) => row.userId?.email },
    { key: 'phone', label: 'Phone' },
    { key: 'dob', label: 'Date of Birth', render: (row) => new Date(row.dateOfBirth).toLocaleDateString() },
  ];

  return (
    <AppLayout navItems={navItems} title={title}>
     <PageHeader
  title="Patients"
  subtitle="Register walk-in patients and view records"
  actions={<Button onClick={openModal}>+ Register Patient</Button>}
/>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <ResponsiveTable columns={columns} rows={patients} emptyMessage="No patients registered yet." />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Patient">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="firstName" name="firstName" label="First Name"
              value={values.firstName} onChange={handleChange} onBlur={handleBlur}
              error={touched.firstName ? errors.firstName : null}
            />
            <Input
              id="lastName" name="lastName" label="Last Name"
              value={values.lastName} onChange={handleChange} onBlur={handleBlur}
              error={touched.lastName ? errors.lastName : null}
            />
          </div>
          <Input
            id="email" name="email" type="email" label="Email"
            value={values.email} onChange={handleChange} onBlur={handleBlur}
            error={touched.email ? errors.email : null}
          />
          <div>
            <Input
              id="password" name="password" type="password" label="Temporary Password"
              value={values.password} onChange={handleChange} onBlur={handleBlur}
              error={touched.password ? errors.password : null}
            />
            {!errors.password && (
              <p className="text-xs text-slate-400 mt-1.5">At least 8 characters, uppercase, lowercase, and a number.</p>
            )}
          </div>
          <Input
            id="phone" name="phone" label="Phone"
            value={values.phone} onChange={handleChange} onBlur={handleBlur}
            error={touched.phone ? errors.phone : null}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="dateOfBirth" name="dateOfBirth" type="date" label="Date of Birth"
              value={values.dateOfBirth} onChange={handleChange} onBlur={handleBlur}
              error={touched.dateOfBirth ? errors.dateOfBirth : null}
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand"
                value={values.gender}
                onChange={(e) => setFieldValue('gender', e.target.value)}
              >
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          {submitError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{submitError}</p>}
          <Button type="submit" isLoading={registerMutation.isPending}>Register Patient</Button>
        </form>
      </Modal>
    </AppLayout>
  );
}