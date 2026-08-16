import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
import AdminDashboard from '../features/tenant/AdminDashboard';
import DepartmentsPage from '../features/department/DepartmentsPage';
import DoctorsPage from '../features/doctor/DoctorsPage';
import PatientsPage from '../features/patient/PatientsPage';
import AppointmentsPage from '../features/appointment/AppointmentsPage';
import PatientDashboard from '../features/patient/PatientDashboard';
import BookAppointmentPage from '../features/appointment/BookAppointmentPage';
import ReceptionistDashboard from '../features/receptionist/ReceptionistDashboard';
import DoctorDashboard from '../features/doctor/DoctorDashboard';
import SuperAdminDashboard from '../features/tenant/SuperAdminDashboard';
import HomePage from '../features/marketing/HomePage';
import RegisterPage from '../features/auth/RegisterPage';
import TermsPage from '../features/marketing/TermsPage';
import PrivacyPage from '../features/marketing/PrivacyPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import HospitalProfilePage from '../features/hospitalProfile/HospitalProfilePage';
import PendingReviewsPage from '../features/hospitalProfile/PendingReviewsPage';

const receptionistNavItems = [
  { to: '/receptionist', label: 'Dashboard' },
  { to: '/receptionist/patients', label: 'Patients' },
  { to: '/receptionist/appointments', label: 'Appointments' },
];

const adminPatientAppointmentNavItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/hospital-profile', label: 'Hospital Profile' },
  { to: '/admin/departments', label: 'Departments' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/patients', label: 'Patients' },
  { to: '/admin/appointments', label: 'Appointments' },
];
// function PlaceholderDashboard({ label }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
//       <p className="text-lg sm:text-xl text-brand-dark text-center">
//         Logged in as <strong>{label}</strong> — dashboard coming in a later phase.
//       </p>
//     </div>
//   );
// }

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

<Route path="/" element={<HomePage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/terms" element={<TermsPage />} />
<Route path="/privacy" element={<PrivacyPage />} />          
<Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
            
          />
<Route
  path="/admin/departments"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <DepartmentsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/doctors"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <DoctorsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/patients"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PatientsPage navItems={adminPatientAppointmentNavItems} title="Hospital Admin" />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/appointments"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AppointmentsPage navItems={adminPatientAppointmentNavItems} title="Hospital Admin" />
    </ProtectedRoute>
  }
/>

          <Route
  path="/super-admin"
  element={<ProtectedRoute allowedRoles={['super-admin']}><SuperAdminDashboard /></ProtectedRoute>}
/>

          <Route
  path="/doctor"
  element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>}
/>
          <Route
  path="/receptionist"
  element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>}
/>
<Route
  path="/receptionist/patients"
  element={
    <ProtectedRoute allowedRoles={['receptionist']}>
      <PatientsPage navItems={receptionistNavItems} title="Receptionist" />
    </ProtectedRoute>
  }
/>
<Route
  path="/receptionist/appointments"
  element={
    <ProtectedRoute allowedRoles={['receptionist']}>
      <AppointmentsPage navItems={receptionistNavItems} title="Receptionist" />
    </ProtectedRoute>
  }
/>
          <Route
  path="/patient"
  element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>}
/>
<Route
  path="/patient/book"
  element={<ProtectedRoute allowedRoles={['patient']}><BookAppointmentPage /></ProtectedRoute>}
/>
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
<Route
  path="/admin/hospital-profile"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <HospitalProfilePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/super-admin/pending-reviews"
  element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <PendingReviewsPage />
    </ProtectedRoute>
  }
/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}