import { BriefingPartners } from './BriefingPartners';
import { CeoMessage } from './CeoMessage';
import { CompareTable } from './CompareTable';
import { CurriculumSection } from './CurriculumSection';
import { FaqAccordion } from './FaqAccordion';
import { HeroCarousel } from './HeroCarousel';
import { ProcessSteps } from './ProcessSteps';
import { StatsBar } from './StatsBar';
import { Testimonials } from './Testimonials';
import { WhySection } from './WhySection';
export function HomeSections() {
  return (
    <main>
      <HeroCarousel />
      <StatsBar />
      <CurriculumSection />
      <WhySection />
      <CompareTable />
      <ProcessSteps />
      <CeoMessage />
      <BriefingPartners />
      <Testimonials />
      <FaqAccordion />
    </main>
  );
}
