import { siteContent } from '@/content/site';
import { AuthArea } from '@/features/header/AuthArea';
import Link from 'next/link';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export function SiteHeader() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" href="/">
          <img src={siteContent.brand.logo} alt={siteContent.brand.label} className="navbar-logo" />
        </Link>
        <MobileNav
          menus={siteContent.headerMenus}
          logo={siteContent.brand.logo}
          brand={siteContent.brand.label}
        />
        <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
          <DesktopNav menus={siteContent.headerMenus} />
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <AuthArea />
          </div>
        </div>
      </div>
    </nav>
  );
}
