import { homeContent } from '@/content/home';
export function CompareTable() {
  const { compare } = homeContent;
  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center">
          <span className="text-primary fw-bold fs-7">{compare.eyebrow}</span>
          <h2 className="section-title mt-1">{compare.title}</h2>
          <p className="section-subtitle">{compare.subtitle}</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="compare-table-wrapper">
              <div className="table-responsive">
                <table className="table table-hover align-middle text-center compare-table mb-0">
                  <thead className="table-dark">
                    <tr>
                      {compare.headings.map((heading, index) => (
                        <th
                          key={heading}
                          style={{ width: index === 0 ? '22%' : index === 1 ? '38%' : '40%' }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compare.rows.map(([label, ordinary, premium]) => (
                      <tr key={label}>
                        <td className="fw-bold bg-light">{label}</td>
                        <td className="text-muted">{ordinary}</td>
                        <td className="fw-bold text-primary">{premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
