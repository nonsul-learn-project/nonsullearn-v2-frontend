'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { track } from '@/analytics';
import { homeContent } from '@/content/home';
import { legacyAssetUrl } from '@/legacy';

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
    <div id="heroCarousel" className="carousel slide hero-carousel" aria-roledescription="carousel">
      <div className="carousel-indicators">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Slide ${index + 1}`}
            aria-current={active === index || undefined}
            className={active === index ? 'active' : ''}
            onClick={() => select(index)}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`carousel-item hero-slide-${index + 1}${active === index ? ' active' : ''}`}
            aria-hidden={active !== index}
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-12 col-lg-7 hero-text-align">
                  <span className="hero-badge">{slide.badge}</span>
                  <h1 className="hero-title">
                    {slide.title.split('\n').map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </h1>
                  <p className="hero-desc">
                    {slide.description.split('\n').map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <div className="hero-btn-wrapper">
                    <a
                      href={slide.href}
                      className={`btn btn-${slide.button} btn-lg rounded-pill px-4 ${slide.button === 'light' || slide.button === 'warning' ? 'fw-bold' : 'shadow-sm'}`}
                      onClick={() =>
                        track('cta_click', { label: slide.label, destination: slide.href })
                      }
                    >
                      {slide.label}
                    </a>
                  </div>
                </div>
                <div className="col-12 col-lg-5">
                  <div className="instructor-single-box position-relative overflow-hidden rounded-4 shadow">
                    {'image' in slide && slide.image ? (
                      <>
                        <Image
                          src={legacyAssetUrl(slide.image)}
                          alt="대치동 대표 강사"
                          fill
                          sizes="(max-width: 991px) 240px, 300px"
                          style={{ objectFit: 'cover', zIndex: 1 }}
                          priority
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
                      <div className="instructor-avatar-icon">{slide.instructor.icon}</div>
                    )}
                    <div
                      className="instructor-info text-center text-white p-4 w-100"
                      style={{ position: 'relative', zIndex: 3, marginTop: 'auto' }}
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
        ))}
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
