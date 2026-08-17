import { useQuery } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import { fetchMyTenantHospitalData } from '../../api/hospitalProfile.api';
import { fetchDepartments } from '../../api/department.api';
import { fetchDoctors } from '../../api/doctor.api';
import HospitalHero from './HospitalHero';
import HospitalAbout from './HospitalAbout';
import HospitalServices from './HospitalServices';
import HospitalDepartments from './HospitalDepartments';
import HospitalDoctors from './HospitalDoctors';
import HospitalFacilities from './HospitalFacilities';
import HospitalGallery from './HospitalGallery';
import HospitalWorkingHours from './HospitalWorkingHours';
import HospitalContact from './HospitalContact';

const navItems = [
  { to: '/patient/home', label: 'Home' },
  { to: '/patient', label: 'My Appointments' },
  { to: '/patient/book', label: 'Book Appointment' },
];

export default function PatientHomePage() {
  const { data, isLoading } = useQuery({ queryKey: ['hospital-experience', 'mine'], queryFn: fetchMyTenantHospitalData });
  const { data: departments } = useQuery({ queryKey: ['departments', 'active'], queryFn: () => fetchDepartments({ activeOnly: 'true' }) });
  const { data: doctors } = useQuery({ queryKey: ['doctors', 'active'], queryFn: () => fetchDoctors({ activeOnly: 'true' }) });

  if (isLoading || !data) {
    return (
      <AppLayout navItems={navItems} title="My Account">
        <p className="text-sm text-slate-400">Loading…</p>
      </AppLayout>
    );
  }

  const { tenant, profile } = data;

  return (
    <AppLayout navItems={navItems} title="My Account">
      <div className="-m-4 sm:-m-6 lg:-m-8">
        
        <HospitalHero tenant={tenant} profile={profile} />
        <HospitalAbout profile={profile} />
        {departments && <HospitalServices departments={departments} />}
        {departments && <HospitalDepartments departments={departments} />}
        {doctors && <HospitalDoctors doctors={doctors} tenantSlug={tenant.slug} />}
        <HospitalFacilities facilities={profile.facilities || []} />
        <HospitalGallery gallery={profile.gallery} />
        <HospitalWorkingHours workingHours={profile.workingHours} />
        <HospitalContact contactAddress={profile.contactAddress} />
      </div>
    </AppLayout>
  );
}