import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';
import HeroSection from './HeroSection';
import PlatformOverview from './PlatformOverview';
import HowItWorks from './HowItWorks';
import PlatformFeatures from './PlatformFeatures';
import PatientExperience from './PatientExperience';
import HospitalSection from './HospitalSection';
import SecuritySection from './SecuritySection';
import HealthResources from './HealthResources';
import { useScrollToHash } from '../../shared/hooks/useScrollToHash';

export default function HomePage() {
  useScrollToHash();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <HeroSection />
      <PlatformOverview />
      <HowItWorks />
      <PlatformFeatures />
      <PatientExperience />
      <SecuritySection />
      <HealthResources />
      <HospitalSection />

      <PublicFooter />
    </div>
  );
}