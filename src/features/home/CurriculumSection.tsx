'use client';
import { track } from '@/analytics';
import { homeContent } from '@/content/home';
export function CurriculumSection() {
  const { curriculum } = homeContent;
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center">
          <span className="text-primary fw-bold fs-7">{curriculum.eyebrow}</span>
          <h2 className="section-title mt-1">{curriculum.title}</h2>
          <p className="section-subtitle">{curriculum.subtitle}</p>
        </div>
        <div className="row g-4">
          {curriculum.items.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.title}>
              <div className="course-card">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`badge bg-${item.variant} px-3 py-2`}>{item.category}</span>
                    <small className="text-muted fw-bold">{item.duration}</small>
                  </div>
                  <h4 className="fw-bold fs-5 mb-2">{item.title}</h4>
                  <p className="text-muted small mb-3">{item.description}</p>
                  <ul className="list-unstyled small text-secondary mb-4">
                    {item.points.map((point) => (
                      <li className="mb-2" key={point}>
                        ✓ {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={item.href}
                  className={`btn btn-outline-${item.variant} w-100 rounded-pill fw-bold`}
                  onClick={() =>
                    track('cta_click', { label: '강좌 상세 보기', destination: item.href })
                  }
                >
                  강좌 상세 보기
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
