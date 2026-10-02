// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import legal from '../fixtures/footer-legal.json';
import links from '../fixtures/header-links.json';
import { DesktopNav } from '@/features/site-shell/DesktopNav';
import { MobileNav } from '@/features/site-shell/MobileNav';
import { SiteFooter } from '@/features/site-shell/SiteFooter';
import { siteContent } from '@/content/site';
import { ViewerProvider } from '@/legacy';

describe('site shell legacy parity', () => {
  it('renders footer legal copy character-for-character', () => {
    render(<SiteFooter />);
    const text = screen.getByRole('contentinfo').textContent ?? '';
    legal.values.forEach((value) => expect(text).toContain(value));
  });
  it('contains every legacy header menu label', () => {
    render(<DesktopNav menus={siteContent.headerMenus} />);
    links.labels.forEach((label) => expect(screen.getAllByText(label).length).toBeGreaterThan(0));
  });
  it('desktop dropdown synchronizes state and Escape', async () => {
    const user = userEvent.setup();
    render(<DesktopNav menus={siteContent.headerMenus} />);
    const trigger = screen.getByText('논술런');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
  it('mobile menu opens, expands accordion, and closes with Escape', async () => {
    const user = userEvent.setup();
    render(
      <ViewerProvider>
        <MobileNav menus={siteContent.headerMenus} logo="/logo.png" brand="논술런" />
      </ViewerProvider>,
    );
    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    const accordion = screen.getByRole('button', { name: '논술런' });
    await user.click(accordion);
    expect(accordion).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
