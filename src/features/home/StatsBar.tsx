import { homeContent } from '@/content/home';
export function StatsBar() {
  return (
    <section className="stats-bar">
      <div className="container">
        <div className="row text-center g-3">
          {homeContent.stats.map((item) => (
            <div className="col-6 col-md-3" key={item.label}>
              <div className="stat-item-num">{item.value}</div>
              <div className="stat-item-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
