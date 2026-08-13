import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';
import HeroSection from './HeroSection';
import PlatformOverview from './PlatformOverview';
import HowItWorks from './HowItWorks';
import { useScrollToHash } from '../../shared/hooks/useScrollToHash';

export default function HomePage() {
  useScrollToHash();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <HeroSection />
      <PlatformOverview />
      <HowItWorks />

      <section className="bg-white border-t border-slate-200 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark">Running a hospital or clinic?</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            MTHMP gives your hospital its own private space on the platform —
            manage departments, doctors, and patients, with nothing ever
            visible to any other hospital.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            Hospital accounts are provisioned by the MTHMP team — contact us to get started.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}