import Image from 'next/image';

import { staticPagesContent } from '@/content/static-pages';
import { legacyAssetUrl } from '@/legacy';

export function CorrectionPageContent() {
  const { correction } = staticPagesContent;
  return (
    <div className="correction-wrap">
      <div className="position-relative overflow-hidden text-center text-white py-5 mb-5 correction-hero">
        <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 opacity-25 pointer-events-none correction-hero-glow" />
        <div className="container position-relative z-1 py-4" data-aos="fade-up">
          <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill fs-7 text-uppercase mb-3 shadow-sm">
            {correction.hero.badge}
          </span>
          <h1 className="display-5 fw-extrabold mt-2 mb-3 text-white">
            {correction.hero.titleBefore}
            <span className="correction-hero-accent">{correction.hero.titleAccent}</span>
          </h1>
          <p className="fs-6 text-light opacity-75 max-w-2xl mx-auto mb-0 correction-keep-all">
            {correction.hero.description}
          </p>
        </div>
      </div>
      <div className="container">
        <div className="my-5 pt-2" data-aos="fade-up">
          <div className="text-center mb-4">
            <span className="badge-primary-soft">NONSUL - LEARN</span>
            <h2 className="section-title">
              논술런은 <span className="text-accent">어떻게 다른가요?</span>
            </h2>
            <p className="section-subtitle">빠르고 정확하게, 대치동 시스템 그대로 제공합니다.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {correction.strengths.map((item) => (
              <div className="col-12 col-md-4" key={item.number}>
                <div className="correction-card">
                  <div className="step-number" style={{ background: item.color }}>
                    {item.number}
                  </div>
                  <h3 className="fs-4 fw-bold text-white mb-1">{item.title}</h3>
                  <p className="text-accent fw-bold fs-6 mb-3">{item.subtitle}</p>
                  <p className="text-secondary small mb-3">
                    {item.description}
                    {item.note === undefined ? null : (
                      <>
                        <br />
                        {item.note}
                      </>
                    )}
                  </p>
                  {item.chips === undefined ? null : (
                    <div className="mb-3">
                      {item.chips.map((chip) => (
                        <span className="info-chip" key={chip}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="sub-info-box">
                    <strong className="text-white d-block mb-1">{item.box}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-5 border-secondary opacity-25" />
        <div className="my-5 pt-3" data-aos="fade-up">
          <div className="text-center mb-4">
            <span className="badge-primary-soft">PROCESS</span>
            <h2 className="section-title">
              첨삭 <span className="text-accent">진행방식</span>
            </h2>
            <p className="section-subtitle">간편한 업로드부터 1:1 질문/답변까지 3단계 프로세스</p>
          </div>
          <div className="row g-4 justify-content-center">
            {correction.process.map((item) => (
              <div className="col-12 col-md-4 step-arrow-col" key={item.number}>
                <div className="correction-card text-center py-4">
                  <div
                    className="step-number mx-auto"
                    style={item.color === undefined ? undefined : { background: item.color }}
                  >
                    {item.number}
                  </div>
                  <div className="my-3">
                    <i className={`${item.icon} fs-1 text-warning`} />
                  </div>
                  <h4 className="fs-5 fw-bold text-white mb-2">{item.title}</h4>
                  <p className="text-secondary small mb-0">
                    {item.description}
                    {item.note === undefined ? null : (
                      <>
                        <br />
                        <span className="text-muted">{item.note}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutPageContent() {
  const { about } = staticPagesContent;
  return (
    <div className="nonsul-about-wrap">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="badge-primary-soft">NONSUL - LEARN 2026 VISION</span>
          <h1 className="section-title">
            논술, 이제
            <br />
            <span className="text-accent">시작과 끝을 한 곳에서.</span>
          </h1>
          <p className="section-subtitle">
            합격으로 가는 가장 확실하고 정확한 이정표, 논술런이 함께합니다.
          </p>
          <div className="row g-3 justify-content-center mt-4">
            {about.stats.map(([number, label]) => (
              <div className="col-6 col-md-3" key={label}>
                <div className="stat-card">
                  <div className="stat-number">{number}</div>
                  <div className="stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="my-5 pt-4" data-aos="fade-up">
          <div className="text-center mb-4">
            <span className="badge-primary-soft">WHY NONSUL-LEARN</span>
            <h2 className="section-title">
              논술런만의 <span className="text-accent">4가지 차별점</span>
            </h2>
          </div>
          <div className="row g-4">
            {about.differences.map(([number, title, description, chips]) => (
              <div className="col-12 col-md-6" key={number}>
                <div className="nonsul-card">
                  <div className="num-badge">{number}</div>
                  <h4 className="fw-bold text-white fs-5">{title}</h4>
                  <p className="text-secondary small mt-2">{description}</p>
                  <div className="mt-3">
                    {chips.map((chip) => (
                      <span className="chip" key={chip}>
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AboutLegacySections />
      </div>
    </div>
  );
}

function AboutLegacySections() {
  return (
    <>
      <div className="my-5 pt-4" data-aos="fade-up">
        <div className="nonsul-card">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <span className="badge-primary-soft">REAL TIME SYSTEM</span>
              <h3 className="section-title fs-2">
                &quot;대치동 학원의 열기를
                <br />
                <span className="text-accent">방 안에서 그대로.&quot;</span>
              </h3>
              <p className="text-secondary mt-3">
                현장의 긴장감과 집중력을 그대로 집으로 옮겨왔습니다. 시간 관리부터 답안 제출,
                피드백까지 대치동 시스템을 온전히 경험하세요.
              </p>
              <ul className="list-unstyled text-light mt-4 space-y-2">
                <li className="mb-2">
                  <i className="fa-solid fa-circle-check text-warning me-2" /> 실전 시험과 동일한
                  제한시간 모의고사 진행
                </li>
                <li className="mb-2">
                  <i className="fa-solid fa-circle-check text-warning me-2" /> 대치동 전담 첨삭진의
                  1:1 서면/음성 피드백
                </li>
                <li className="mb-2">
                  <i className="fa-solid fa-circle-check text-warning me-2" /> 모바일, 태블릿 완벽
                  지원으로 언제 어디서나 수강
                </li>
              </ul>
            </div>
            <div className="col-12 col-lg-6">
              <div className="p-4 rounded-4 about-status-panel">
                <div className="space-y-3">
                  <div className="p-3 rounded-3 about-status-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-white">연세대 인문논술 1차 답안</span>
                      <span className="badge bg-success">첨삭완료</span>
                    </div>
                    <p className="small text-secondary mb-0 mt-1">
                      24시간 이내 피드백 완료 (채점표 첨부)
                    </p>
                  </div>
                  <div className="p-3 rounded-3 mt-2 about-status-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-white">고려대 미디어학과</span>
                      <span className="badge bg-warning text-dark">첨삭진행중</span>
                    </div>
                    <p className="small text-secondary mb-0 mt-1">대치동 전담 첨삭진 배정 완료</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5 pt-4 text-center" data-aos="fade-up">
        <span className="badge-primary-soft">SUCCESS PROOF</span>
        <h2 className="section-title">
          &quot;수많은 합격자들이 증명한 논술의 정석,
          <br />
          <span className="text-accent">다음 주인공은 당신입니다.&quot;</span>
        </h2>
        <div className="row g-4 mt-3">
          <AboutProof number="4,005명" label="전체 누적 합격생" />
          <AboutProof number="SKY / 학" label="상위권 대학 다수 합격" />
          <AboutProof number="98%" label="수강생 만족도 및 추천율" />
        </div>
      </div>
      <div className="footer-hero" data-aos="fade-up">
        <span className="badge-primary-soft">NONSUL-LEARN PHILOSOPHY</span>
        <h2 className="section-title mt-2">
          &quot;논술은 운이 아니라,
          <br />
          <span className="text-accent">실력입니다.&quot;</span>
        </h2>
        <p className="text-secondary mt-3">
          여러분의 합격을 향한 RUN,
          <br />
          논술런이 처음부터 끝까지 함께하겠습니다.
        </p>
        <div className="row g-3 justify-content-center mt-4">
          <div className="col-auto">
            <span className="fs-5 fw-bold text-white">20년+</span>{' '}
            <span className="text-secondary small">축적된 노하우</span>
          </div>
          <div className="col-auto text-secondary">•</div>
          <div className="col-auto">
            <span className="fs-5 fw-bold text-white">100%</span>{' '}
            <span className="text-secondary small">대치동 시스템</span>
          </div>
          <div className="col-auto text-secondary">•</div>
          <div className="col-auto">
            <span className="fs-5 fw-bold text-white">24h</span>{' '}
            <span className="text-secondary small">정밀 첨삭</span>
          </div>
        </div>
      </div>
    </>
  );
}

function AboutProof({ number, label }: { number: string; label: string }) {
  return (
    <div className="col-12 col-md-4">
      <div className="nonsul-card text-center">
        <div className="stat-number">{number}</div>
        <p className="text-light fw-bold mt-2 mb-0">{label}</p>
      </div>
    </div>
  );
}

export function CompanyPageContent() {
  const { company } = staticPagesContent;
  return (
    <Image
      src={legacyAssetUrl(company.image)}
      alt={company.imageAlt}
      width={600}
      height={800}
      unoptimized
      priority
    />
  );
}
