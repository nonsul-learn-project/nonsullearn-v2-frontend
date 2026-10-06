import { SiteShell } from '@/features/site-shell/SiteShell';
import { HomeSections } from '@/features/home/HomeSections';

export default function HomePage() {
  return (
    <SiteShell>
      <HomeSections />
    </SiteShell>
  );
}
