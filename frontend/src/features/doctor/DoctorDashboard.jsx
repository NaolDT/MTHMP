import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import { fetchAppointments, updateAppointmentStatus } from '../../api/appointment.api';
import PageHeader from '../../shared/components/PageHeader';


const navItems = [
  { to: '/doctor', label: 'My Schedule' },
  { to: '/doctor/profile', label: 'My Profile' },
];
const statusColors = {
  booked: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-100 text-slate-500',
  'no-show': 'bg-amber-100 text-amber-700',
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function DoctorDashboard() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(today());
  const [error, setError] = useState('');

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', 'doctor', date],
    queryFn: () => fetchAppointments({ date }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateAppointmentStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments', 'doctor', date] }),
    onError: (err) => setError(err.response?.data?.message || 'Failed to update appointment'),
  });

  return (
    <AppLayout navItems={navItems} title="Doctor">
     <PageHeader
  title="My Schedule"
  subtitle="Your appointments for the selected day"
  actions={
    <input
          type="date"
          className="w-full sm:w-auto rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={date}
         onChange={(e) => setDate(e.target.value)}
        />
      }
/>

      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : appointments?.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">No appointments on this date.</p>
        ) : (
          appointments
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {appt.startTime}–{appt.endTime} · {appt.patientId?.userId?.firstName} {appt.patientId?.userId?.lastName}
                  </p>
                  {appt.reasonForVisit && (
                    <p className="text-sm text-slate-500 mt-0.5">{appt.reasonForVisit}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[appt.status]}`}>
                    {appt.status}
                  </span>
                  {appt.status === 'booked' && (
                    <>
                      <button
                        onClick={() => statusMutation.mutate({ id: appt._id, status: 'completed' })}
                        className="text-xs font-medium text-green-600 hover:underline"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => statusMutation.mutate({ id: appt._id, status: 'no-show' })}
                        className="text-xs font-medium text-amber-600 hover:underline"
                      >
                        No-show
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </AppLayout>
  );
}