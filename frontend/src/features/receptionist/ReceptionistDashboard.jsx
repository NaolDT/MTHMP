import { Link } from 'react-router-dom';
import AppLayout from '../../shared/components/AppLayout';

const navItems = [
  { to: '/receptionist', label: 'Dashboard' },
  { to: '/receptionist/patients', label: 'Patients' },
  { to: '/receptionist/appointments', label: 'Appointments' },
];

export default function ReceptionistDashboard() {
  return (
    <AppLayout navItems={navItems} title="Receptionist">
      <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark">Front Desk</h1>
      <p className="text-sm text-slate-500 mt-1">Register patients and manage today's appointments</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <Link
          to="/receptionist/patients"
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-brand transition-colors"
        >
          <p className="font-medium text-slate-800">Patients</p>
          <p className="text-sm text-slate-500 mt-1">Register walk-ins, view records</p>
        </Link>
        <Link
          to="/receptionist/appointments"
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-brand transition-colors"
        >
          <p className="font-medium text-slate-800">Appointments</p>
          <p className="text-sm text-slate-500 mt-1">View, book, and cancel appointments</p>
        </Link>
      </div>
    </AppLayout>
  );
}