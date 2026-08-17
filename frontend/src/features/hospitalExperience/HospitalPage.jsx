import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';
import { fetchPublicHospitalProfile, fetchPublicDepartments, fetchPublicDoctors } from '../../api/hospitalExperience.api';
import HospitalHero from './HospitalHero';
import HospitalAbout from './HospitalAbout';
import HospitalServices from './HospitalServices';
import HospitalDepartments from './HospitalDepartments';
import HospitalDoctors from './HospitalDoctors';
import HospitalFacilities from './HospitalFacilities';
import HospitalGallery from './HospitalGallery';
import HospitalWorkingHours from './HospitalWorkingHours';
import HospitalContact from './HospitalContact';
import { useAuth } from '../auth/AuthContext';

export default function HospitalPage() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hospital-experience', slug],
    queryFn: () => fetchPublicHospitalProfile(slug),
    retry: false,
  });

  const { data: departments } = useQuery({
    queryKey: ['hospital-experience', slug, 'departments'],
    queryFn: () => fetchPublicDepartments(slug),
    enabled: !!data,
  });

  const { data: doctors } = useQuery({
    queryKey: ['hospital-experience', slug, 'doctors'],
    queryFn: () => fetchPublicDoctors(slug),
    enabled: !!data,
  });
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PublicHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-400">Loading hospital…</p>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PublicHeader />
        <div className="flex-1 flex items-center justify-center px-4 text-center">
          <div>
            <p className="text-lg font-semibold text-slate-800">Hospital page not available</p>
            <p className="mt-2 text-sm text-slate-500">
              This hospital hasn't published a public profile yet, or the link is incorrect.
            </p>
            <Link to="/register" className="mt-4 inline-block text-brand font-medium hover:underline">
              Browse hospitals to register
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const { tenant, profile } = data;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <HospitalHero tenant={tenant} profile={profile} />
      <HospitalAbout profile={profile} />
      {departments && <HospitalServices departments={departments} />}
      {departments && <HospitalDepartments departments={departments} />}
      {doctors && <HospitalDoctors doctors={doctors} tenantSlug={tenant.slug} />}
      <HospitalFacilities facilities={profile.facilities || []} />
      <HospitalGallery gallery={profile.gallery} />
      <HospitalWorkingHours workingHours={profile.workingHours} />
      <HospitalContact contactAddress={profile.contactAddress} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 text-center">
  {!user ? (
    <Link
      to={`/register?hospital=${tenant.slug}`}
      className="inline-block rounded-lg bg-brand text-white px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
    >
      Register as a Patient at {tenant.name}
    </Link>
  ) : user.role === 'patient' ? (
    <Link
      to="/patient/book"
      className="inline-block rounded-lg bg-brand text-white px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
    >
      Book an Appointment
    </Link>
  ) : null}
</div>

      <PublicFooter />
    </div>
  );
}