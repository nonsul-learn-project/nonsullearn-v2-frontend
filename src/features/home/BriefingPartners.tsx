import { homeContent } from '@/content/home';
export function BriefingPartners() {
  const { partners } = homeContent;
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center">
          <span className="text-primary fw-bold fs-7">{partners.eyebrow}</span>
          <h2 className="section-title mt-1">{partners.title}</h2>
          <p className="section-subtitle">{partners.subtitle}</p>
        </div>
        <div className="row g-3 justify-content-center">
          {partners.items.map((item) => (
            <div className="col-12 col-md-4" key={item.title}>
              <div className="partner-box text-center">
                <h5 className="fw-bold text-dark mb-1">{item.title}</h5>
                <p className="text-muted small mb-0">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
