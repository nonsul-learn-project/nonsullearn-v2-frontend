'use client';

import { useEffect, useRef, useState } from 'react';
import type { MenuGroup } from '@/content/site';

export function DesktopNav({ menus }: { menus: readonly MenuGroup[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <ul
      ref={ref}
      className="navbar-nav mx-auto"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(null);
      }}
    >
      {menus.map((menu, index) => (
        <li className={`nav-item dropdown${open === index ? ' show' : ''}`} key={menu.label}>
          <a
            className="nav-link dropdown-toggle fw-bold"
            href={menu.href}
            aria-expanded={open === index}
            onClick={(event) => {
              event.preventDefault();
              setOpen(open === index ? null : index);
            }}
          >
            {menu.label}
          </a>
          <ul className={`dropdown-menu${open === index ? ' show' : ''}`}>
            {menu.items.map((item) => (
              <li key={item.label}>
                <a className="dropdown-item" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
