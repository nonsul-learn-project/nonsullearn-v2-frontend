'use client';

import { useEffect, useRef, useState } from 'react';
import type { MenuGroup } from '@/content/site';
import { AuthArea } from '@/features/header/AuthArea';
import Link from 'next/link';

export function MobileNav({
  menus,
  logo,
  brand,
}: {
  menus: readonly MenuGroup[];
  logo: string;
  brand: string;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', escape);
    panel.current?.querySelector<HTMLElement>('button, a')?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return (
    <>
      <button
        className="navbar-toggler p-2"
        type="button"
        aria-label="메뉴 열기"
        aria-controls="offcanvasNavbar"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div
        ref={panel}
        className={`offcanvas offcanvas-end d-lg-none${open ? ' show' : ''}`}
        tabIndex={-1}
        id="offcanvasNavbar"
        aria-modal="true"
        role="dialog"
        style={open ? { visibility: 'visible' } : undefined}
      >
        <div className="offcanvas-header border-bottom">
          <Link href="/">
            <img src={logo} alt={brand} className="offcanvas-logo" />
          </Link>
          <button
            type="button"
            className="btn-close text-reset"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <div className="accordion accordion-flush" id="mobileMenuAccordion">
            {menus.map((menu, index) => (
              <div className="accordion-item border-0" key={menu.label}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button fs-6 fw-bold py-3 d-flex align-items-center${expanded === index ? '' : ' collapsed'}`}
                    type="button"
                    aria-expanded={expanded === index}
                    aria-controls={`menu${index + 1}`}
                    onClick={() => setExpanded(expanded === index ? null : index)}
                  >
                    {menu.label}
                  </button>
                </h2>
                <div
                  id={`menu${index + 1}`}
                  className={`accordion-collapse collapse${expanded === index ? ' show' : ''}`}
                >
                  <div className="accordion-body bg-light ps-4">
                    {menu.items.map((item) => (
                      <a
                        href={item.href}
                        className="d-block py-2 text-secondary text-decoration-none"
                        key={item.label}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 mt-auto border-top d-flex justify-content-center align-items-center gap-3">
            <AuthArea mobile />
          </div>
        </div>
      </div>
      {open ? (
        <div className="offcanvas-backdrop fade show" onClick={() => setOpen(false)} />
      ) : null}
    </>
  );
}
