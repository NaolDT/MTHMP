import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';
import HeroSection from './HeroSection';
import PlatformOverview from './PlatformOverview';
import HowItWorks from './HowItWorks';
import PlatformFeatures from './PlatformFeatures';
import PatientExperience from './PatientExperience';
import SecuritySection from './SecuritySection';
import HealthResources from './HealthResources';
import HospitalSection from './HospitalSection';
import FAQSection from './FAQSection';
import FinalCTA from './FinalCTA';
import { useScrollToHash } from '../../shared/hooks/useScrollToHash';
import { useDocumentMeta } from '../../shared/hooks/useDocumentMeta';

export default function HomePage() {
  useScrollToHash();
  useDocumentMeta(
    'MTHMP — Healthcare Management & Appointment Platform',
    'MTHMP is a multi-tenant healthcare management platform connecting patients with participating healthcare organizations for simpler appointment management and digital healthcare operations.'
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main>
        <HeroSection />
        <PlatformOverview />
        <HowItWorks />
        <PlatformFeatures />
        <PatientExperience />
        <SecuritySection />
        <HealthResources />
        <HospitalSection />
        <FAQSection />
      </main>

      <FinalCTA />
      <PublicFooter />
    </div>
  );
}