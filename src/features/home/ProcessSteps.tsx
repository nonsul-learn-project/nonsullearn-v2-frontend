import { homeContent } from '@/content/home';
export function ProcessSteps() {
  const { process } = homeContent;
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center">
          <span className="text-primary fw-bold fs-7">{process.eyebrow}</span>
          <h2 className="section-title mt-1">{process.title}</h2>
          <p className="section-subtitle">{process.subtitle}</p>
        </div>
        <div className="row g-3 g-md-4 justify-content-center">
          {process.items.map((item, index) => (
            <div className="col-12 col-md-4" key={item.title}>
              <div className="process-card text-center">
                <span className="process-step-badge">STEP {index + 1}</span>
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
