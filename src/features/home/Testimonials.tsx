import { homeContent } from '@/content/home';
export function Testimonials() {
  const { testimonials } = homeContent;
  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center">
          <span className="text-primary fw-bold fs-7">{testimonials.eyebrow}</span>
          <h2 className="section-title mt-1">{testimonials.title}</h2>
          <p className="section-subtitle">{testimonials.subtitle}</p>
        </div>
        <div className="row g-4">
          {testimonials.items.map((item) => (
            <div className="col-12 col-md-4" key={item.title}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none color-inherit"
              >
                <div className="review-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-danger">최초 합격</span>
                  </div>
                  <h5 className="fw-bold fs-6 text-dark">{item.title}</h5>
                  <p className="text-primary fw-bold small">{item.student}</p>
                  <p className="text-secondary small mb-0">{item.text}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
