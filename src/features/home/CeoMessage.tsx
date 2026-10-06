import { homeContent } from '@/content/home';
export function CeoMessage() {
  const { ceo } = homeContent;
  return (
    <section className="py-5">
      <div className="container">
        <div className="ceo-box">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-primary mb-3">{ceo.eyebrow}</span>
              <h3 className="fw-bold mb-3">{ceo.title}</h3>
              <p className="text-light opacity-75 mb-0 fs-6">{ceo.description}</p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <div className="p-3 border border-secondary rounded-3 d-inline-block text-center">
                <div className="fw-bold">{ceo.credential}</div>
                <small className="text-secondary">{ceo.proof}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
