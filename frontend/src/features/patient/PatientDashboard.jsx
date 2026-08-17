import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AppLayout from '../../shared/components/AppLayout';
import { fetchAppointments } from '../../api/appointment.api';
import PageHeader from '../../shared/components/PageHeader';


const navItems = [
  { to: '/patient/home', label: 'Home' },
  { to: '/patient', label: 'My Appointments' },
  { to: '/patient/book', label: 'Book Appointment' },
];

const statusColors = {
  booked: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-100 text-slate-500',
  'no-show': 'bg-amber-100 text-amber-700',
};

export default function PatientDashboard() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', 'mine'],
    queryFn: () => fetchAppointments(),
  });

  return (
    <AppLayout navItems={navItems} title="My Account">
      <PageHeader
  title="My Appointments"
  actions={
    <Link
      to="/patient/book"
      className="w-full sm:w-auto text-center rounded-lg bg-brand text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700"
    >
      + Book New Appointment
    </Link>
  }
/>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : appointments?.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">You have no appointments yet.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt._id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium text-slate-800">
                  Dr. {appt.doctorId?.userId?.firstName} {appt.doctorId?.userId?.lastName}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(appt.date).toLocaleDateString()} · {appt.startTime}–{appt.endTime}
                </p>
              </div>
              <span className={`self-start sm:self-auto inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[appt.status]}`}>
                {appt.status}
              </span>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}