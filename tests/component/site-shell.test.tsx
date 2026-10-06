// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import legal from '../fixtures/footer-legal.json';
import links from '../fixtures/header-links.json';
import { DesktopNav } from '@/features/site-shell/DesktopNav';
import { MobileNav } from '@/features/site-shell/MobileNav';
import { SiteFooter } from '@/features/site-shell/SiteFooter';
import { SiteHeader } from '@/features/site-shell/SiteHeader';
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
  it('uses the supplied logo asset in the shared shell', () => {
    render(
      <ViewerProvider>
        <SiteHeader />
        <SiteFooter />
      </ViewerProvider>,
    );
    expect(screen.getAllByAltText(siteContent.brand.label)).toHaveLength(3);
    expect(screen.getAllByAltText(siteContent.brand.label)[0]).toHaveAttribute(
      'src',
      'https://nonsul-learn.com/src/nonsul-learn/img/logo2.png',
    );
  });
  it('matches Legacy footer links and opens family sites in a separate safe window', async () => {
    const user = userEvent.setup();
    const popup = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<SiteFooter />);

    expect(screen.getByRole('link', { name: '[정보조회]' })).toHaveAttribute(
      'href',
      'https://nonsul-learn.com/kyhinfo.php',
    );
    expect(screen.getByRole('link', { name: '이용약관' })).toHaveAttribute(
      'href',
      'https://nonsul-learn.com/bbs/content.php?co_id=provision',
    );
    expect(screen.getByRole('link', { name: '개인정보처리방침' })).toHaveAttribute(
      'href',
      'https://nonsul-learn.com/bbs/content.php?co_id=privacy',
    );

    await user.selectOptions(
      screen.getByLabelText('패밀리사이트 바로가기'),
      'http://www.pogara.com',
    );
    expect(popup).toHaveBeenCalledWith('http://www.pogara.com', '_blank', 'noopener,noreferrer');
    popup.mockRestore();
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
