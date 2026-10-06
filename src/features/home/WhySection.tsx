import { homeContent } from '@/content/home';
export function WhySection() {
  const { why } = homeContent;
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center">
          <span className="text-primary fw-bold fs-7">{why.eyebrow}</span>
          <h2 className="section-title mt-1">{why.title}</h2>
          <p className="section-subtitle">{why.subtitle}</p>
        </div>
        <div className="row g-4">
          {why.items.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={item.title}>
              <div className="why-card">
                <div className="why-num">{String(index + 1).padStart(2, '0')}</div>
                <h5 className="fw-bold fs-6 mb-2">{item.title}</h5>
                <p className="text-muted small mb-0">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
