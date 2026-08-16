import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import ResponsiveTable from '../../shared/components/ResponsiveTable';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { fetchAppointments, cancelAppointment } from '../../api/appointment.api';
import PageHeader from '../../shared/components/PageHeader';


const statusColors = {
  booked: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-100 text-slate-500',
  'no-show': 'bg-amber-100 text-amber-700',
};

function StatusPill({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>{status}</span>;
}

export default function AppointmentsPage({ navItems, title = 'Hospital Admin' })  {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', statusFilter],
    queryFn: () => fetchAppointments(statusFilter ? { status: statusFilter } : {}),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setCancelTarget(null);
      setReason('');
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to cancel appointment'),
  });

  function handleCancelSubmit(e) {
    e.preventDefault();
    setError('');
    cancelMutation.mutate({ id: cancelTarget._id, reason });
  }

  const columns = [
    { key: 'patient', label: 'Patient', render: (row) => `${row.patientId?.userId?.firstName || ''} ${row.patientId?.userId?.lastName || ''}` },
    { key: 'doctor', label: 'Doctor', render: (row) => `Dr. ${row.doctorId?.userId?.firstName || ''} ${row.doctorId?.userId?.lastName || ''}` },
    { key: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    { key: 'time', label: 'Time', render: (row) => `${row.startTime} – ${row.endTime}` },
    { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <AppLayout navItems={navItems} title={title}>
     <PageHeader
  title="Appointments"
  subtitle="View and manage all appointments"
  actions={
    <select
      className="w-full sm:w-auto rounded-lg border border-slate-300 px-3 py-2 text-sm"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
          <option value="">All statuses</option>
          <option value="booked">Booked</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
    </select>
  }
/>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <ResponsiveTable
            columns={columns}
            rows={appointments}
            emptyMessage="No appointments found."
            actions={(row) =>
              row.status === 'booked' ? (
                <button
                  onClick={() => { setCancelTarget(row); setReason(''); setError(''); }}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Cancel
                </button>
              ) : (
                <span className="text-xs text-slate-300">—</span>
              )
            }
          />
        )}
      </div>

      <Modal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Appointment">
        <form onSubmit={handleCancelSubmit} className="space-y-4">
          <p className="text-sm text-slate-500">
            Cancelling appointment for{' '}
            <strong>{cancelTarget?.patientId?.userId?.firstName} {cancelTarget?.patientId?.userId?.lastName}</strong>{' '}
            on {cancelTarget && new Date(cancelTarget.date).toLocaleDateString()} at {cancelTarget?.startTime}.
          </p>
          <Input
            id="reason"
            label="Reason (required if cancelling within 24 hours)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" variant="danger" isLoading={cancelMutation.isPending}>
              Confirm Cancellation
            </Button>
            <Button type="button" variant="secondary" onClick={() => setCancelTarget(null)}>
              Back
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}