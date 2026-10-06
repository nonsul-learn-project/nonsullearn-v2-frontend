'use client';

import { siteContent } from '@/content/site';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const { footer, brand } = siteContent;
  return (
    <footer className={styles.footer}>
      <div className="container py-5">
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="mb-3">
              <img
                src={brand.logo}
                alt={brand.label}
                className="footer-logo"
                style={{ maxHeight: '40px' }}
              />
            </div>
            <p className="text-secondary small" style={{ wordBreak: 'keep-all' }}>
              {footer.description}
              <br />
              {footer.descriptionSecond}
            </p>
          </div>
          <FooterList title="강좌 안내" items={footer.courses} />
          <FooterList title="고객센터" items={footer.support} />
          <div className="col-lg-4">
            <h6 className="text-white fw-bold mb-3">상담 및 문의</h6>
            <p className="fs-5 fw-bold text-white mb-1">24시간 첨삭 센터</p>
            <p className="text-secondary small mb-0">대치동 현장 시스템 그대로 온라인 지원</p>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <div className="row g-4 align-items-center mb-4">
          <div className="col-lg-8">
            <address
              className="text-secondary small mb-0"
              style={{ fontStyle: 'normal', lineHeight: 1.6 }}
            >
              {footer.legal.map((legal, index) => (
                <p className="mb-1" key={legal}>
                  {legal}
                  {index === 0 ? (
                    <>
                      {' '}
                      <a
                        href={footer.businessInfo.href}
                        className="text-warning text-decoration-none"
                        onClick={(event) => {
                          event.preventDefault();
                          window.open(
                            footer.businessInfo.href,
                            'kyhinfo',
                            'scrollbars=no,width=600,height=802,top=10,left=20,noopener,noreferrer',
                          );
                        }}
                      >
                        {footer.businessInfo.label}
                      </a>
                    </>
                  ) : null}
                </p>
              ))}
            </address>
          </div>
          <div className="col-lg-4 d-flex flex-column align-items-lg-end gap-3">
            <div className="family_site w-100" style={{ maxWidth: '240px' }}>
              <select
                id="familySite"
                className="form-select form-select-sm bg-dark text-white border-secondary"
                defaultValue=""
                aria-label="패밀리사이트 바로가기"
                onChange={(event) => {
                  if (event.target.value === '') return;
                  window.open(event.target.value, '_blank', 'noopener,noreferrer');
                  event.target.value = '';
                }}
              >
                <option value="">패밀리사이트 바로가기</option>
                {footer.family.map((item) => (
                  <option value={item.href} key={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <hr className="border-secondary my-3" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-2 small text-secondary">
          <p className="mb-2 mb-md-0">
            © 2026 <strong>NONSUL-LEARN</strong>. All Rights Reserved.
          </p>
          <div>
            <a href={footer.terms.href} className="text-secondary text-decoration-none me-3">
              {footer.terms.label}
            </a>
            <a href={footer.privacy.href} className="fw-bold text-white text-decoration-none">
              {footer.privacy.label}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
function FooterList({
  title,
  items,
}: {
  title: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div className="col-6 col-lg-2">
      <h6 className="text-white fw-bold mb-3">{title}</h6>
      <ul className="list-unstyled small">
        {items.map((item) => (
          <li className="mb-2" key={item.label}>
            <a href={item.href} className="text-decoration-none text-secondary">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
