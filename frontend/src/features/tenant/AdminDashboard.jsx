import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AppLayout from '../../shared/components/AppLayout';
import StatCard from '../../shared/components/StatCard';
import { fetchTenantOverview, fetchAppointmentsTrend } from '../../api/analytics.api';
import PageHeader from '../../shared/components/PageHeader';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
    { to: '/admin/hospital-profile', label: 'Hospital Profile' },

  { to: '/admin/departments', label: 'Departments' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/patients', label: 'Patients' },
  { to: '/admin/appointments', label: 'Appointments' },
];

export default function AdminDashboard() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: fetchTenantOverview,
  });

  const { data: trend, isLoading: trendLoading } = useQuery({
    queryKey: ['analytics', 'trend', 7],
    queryFn: () => fetchAppointmentsTrend(7),
  });

  return (
    <AppLayout navItems={navItems} title="Hospital Admin">
     <PageHeader title="Dashboard" subtitle="Overview of your hospital's activity" />
      {overviewLoading ? (
        <p className="mt-6 text-sm text-slate-400">Loading stats…</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Doctors" value={overview.totalDoctors} />
          <StatCard label="Active Patients" value={overview.totalPatients} />
          <StatCard label="Departments" value={overview.totalDepartments} />
          <StatCard label="Appointments Today" value={overview.appointmentsToday} />
        </div>
      )}

      {overview && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Booked" value={overview.appointmentsByStatus.booked} />
          <StatCard label="Completed" value={overview.appointmentsByStatus.completed} />
          <StatCard label="Cancelled" value={overview.appointmentsByStatus.cancelled} />
          <StatCard label="No-shows" value={overview.appointmentsByStatus['no-show']} />
        </div>
      )}

      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-sm sm:text-base font-medium text-slate-700 mb-4">
          Appointments — last 7 days
        </h2>
        {trendLoading ? (
          <p className="text-sm text-slate-400">Loading chart…</p>
        ) : (
          <div className="h-56 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                <Tooltip />
                <Line type="monotone" dataKey="booked" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cancelled" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}