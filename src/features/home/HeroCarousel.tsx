'use client';

import Image from 'next/image';
import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { track } from '@/analytics';
import { homeContent } from '@/content/home';
import { legacyAssetUrl } from '@/legacy';
import styles from './HeroCarousel.module.css';

/**
 * Legacy index.php의 슬라이드별 CTA 버튼 클래스/인라인 스타일을 그대로 재현한다.
 * 클래스가 하나 빠지면 Bootstrap 선택자가 달리 적용돼 버튼 크기까지 달라진다
 * (슬라이드 1은 `border: none` 때문에 legacy 높이가 46px, border가 남으면 48px).
 */
const heroButtons: Record<
  'primary' | 'light' | 'warning',
  { className: string; style?: CSSProperties }
> = {
  primary: {
    className: 'btn btn-primary btn-lg rounded-pill px-4 shadow-sm',
    style: { background: 'var(--nonsul-color-accent)', border: 'none' },
  },
  light: { className: 'btn btn-light btn-lg rounded-pill px-4 text-primary fw-bold' },
  warning: { className: 'btn btn-warning btn-lg rounded-pill px-4 fw-bold' },
};

/**
 * Legacy는 `텍스트<br>텍스트`로 줄을 나눈다. 줄마다 `<span>`으로 감싸면 DOM 계층이 달라지고
 * 마지막 줄 뒤에 `<br>`이 하나 더 붙으므로, 줄 사이에만 `<br>`을 넣어 같은 구조로 만든다.
 */
function legacyLines(text: string): ReactNode[] {
  return text.split('\n').map((line, index) => (
    <Fragment key={line}>
      {index === 0 ? null : <br />}
      {line}
    </Fragment>
  ));
}

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const slides = homeContent.heroSlides;
  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [slides.length]);
  const select = (index: number) => setActive((index + slides.length) % slides.length);
  return (
    <div
      id="heroCarousel"
      className={`carousel slide hero-carousel ${styles.root}`}
      aria-roledescription="carousel"
    >
      <div className="carousel-indicators">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={index}
            aria-label={`Slide ${index + 1}`}
            aria-current={active === index || undefined}
            className={active === index ? 'active' : ''}
            onClick={() => select(index)}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, index) => {
          const button = heroButtons[slide.button];
          /**
           * 사진 슬라이드만 Legacy가 카드에 유틸 클래스와 flex 인라인 스타일을 얹고
           * `.instructor-info`를 `margin-top: auto`로 카드 하단에 붙인다. 아이콘 슬라이드는
           * `.instructor-single-box`의 `justify-content: center`로 한 덩어리가 가운데 모인다.
           */
          const hasPhoto = 'image' in slide && slide.image !== undefined;
          return (
            <div
              key={slide.title}
              className={`carousel-item hero-slide-${index + 1} ${styles.slide}${active === index ? ' active' : ''}`}
              aria-hidden={active !== index}
            >
              <div className={styles.background} aria-hidden="true">
                <Image
                  src={legacyAssetUrl(slide.backgroundImage)}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  unoptimized
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className={styles.overlay} aria-hidden="true" />
              <div className={`container ${styles.content}`}>
                <div className="row align-items-center">
                  <div className="col-12 col-lg-7 hero-text-align">
                    <span className="hero-badge">
                      <i className={`${slide.badgeIcon} text-warning`} aria-hidden="true" />{' '}
                      {slide.badge}
                    </span>
                    <h1 className="hero-title">{legacyLines(slide.title)}</h1>
                    <p className="hero-desc">{legacyLines(slide.description)}</p>
                    <div className="hero-btn-wrapper">
                      <a
                        href={slide.href}
                        className={button.className}
                        {...(button.style === undefined ? {} : { style: button.style })}
                        onClick={() =>
                          track('cta_click', { label: slide.label, destination: slide.href })
                        }
                      >
                        {slide.label}
                      </a>
                    </div>
                  </div>
                  <div className="col-12 col-lg-5">
                    <div
                      className={
                        hasPhoto
                          ? 'instructor-single-box position-relative overflow-hidden rounded-4 shadow'
                          : 'instructor-single-box'
                      }
                      style={
                        hasPhoto
                          ? { minHeight: '280px', display: 'flex', alignItems: 'flex-end' }
                          : undefined
                      }
                    >
                      {'image' in slide && slide.image ? (
                        <>
                          <Image
                            src={legacyAssetUrl(slide.image)}
                            alt="대치동 대표 강사"
                            fill
                            sizes="(max-width: 991px) 240px, 300px"
                            unoptimized
                            style={{ objectFit: 'cover', zIndex: 1 }}
                          />
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                              background:
                                'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
                              zIndex: 2,
                            }}
                          />
                        </>
                      ) : (
                        <div className="instructor-avatar-icon">
                          <i className={slide.instructor.iconClass} aria-hidden="true" />
                        </div>
                      )}
                      <div
                        className={
                          hasPhoto
                            ? 'instructor-info text-center text-white p-4 w-100'
                            : 'instructor-info text-center text-white'
                        }
                        style={
                          hasPhoto
                            ? { position: 'relative', zIndex: 3, marginTop: 'auto' }
                            : undefined
                        }
                      >
                        <h4 className="fw-bold mb-1">{slide.instructor.title}</h4>
                        {slide.instructor.description ? (
                          <p className="text-info small mb-2">{slide.instructor.description}</p>
                        ) : null}
                        <span className="badge bg-light text-dark px-3 py-2 rounded-pill small">
                          {slide.instructor.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        aria-label="Previous"
        onClick={() => select(active - 1)}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
      </button>
      <button
        className="carousel-control-next"
        type="button"
        aria-label="Next"
        onClick={() => select(active + 1)}
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
      </button>
    </div>
  );
}
