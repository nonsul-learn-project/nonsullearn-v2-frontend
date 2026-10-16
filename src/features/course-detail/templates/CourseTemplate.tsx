import type { CourseTemplateContent, TemplateType } from '@/content/course-templates';
import type { CourseFull, CourseQuestionsState, CourseReviewsState } from '@/legacy';
import { formatPrice } from '@/lib/format';
import { sanitizeLegacyHtml } from '@/lib/sanitize-legacy-html';

import { CourseInfoTabs } from '../CourseInfoTabs';
import { CourseOrderForm } from '../CourseOrderForm';

import './course-template.css';

interface CourseTemplateProps { course: CourseFull; content: CourseTemplateContent; siblings: { previous: string | null; next: string | null }; reviews: CourseReviewsState; questions: CourseQuestionsState; }
type FixedCopy = { problemTitle: string; problemLead: string; problems: readonly { title: string; description: string }[]; outcomesPromise: string; outcomes: readonly { before: string; after: string }[]; methodTitle: string; methodSteps: readonly string[]; enrollTitle: string; };

/** Common, non-course-specific copy transcribed from the three source copy documents. */
const fixedCopy: Record<TemplateType, FixedCopy> = {
  humanities: {
    problemTitle: '논술은 읽고 이해하는 것만으로 답안이 되지 않습니다.', problemLead: '그래서 이 강좌는 설명만 듣고 끝나지 않습니다.',
    problems: [{ title: '제시문을 읽었는데 무엇을 써야 할지 막막하다.', description: '' }, { title: '알고 있는 내용을 문장으로 옮기면 논리가 흐려진다.', description: '' }, { title: '요약은 했지만 비교 기준을 못 잡는다.', description: '' }, { title: '주장은 있지만 근거가 약해진다.', description: '' }],
    outcomesPromise: '합격을 약속하지 않습니다. 대신 실제로 쓰고 점검한 답안이 남습니다.', outcomes: [{ before: '무엇을 써야 할지 막막함', after: '논제 요구에 맞춰 답안의 방향과 순서를 정리' }, { before: '제시문을 읽고도 근거를 놓침', after: '필요한 내용을 선별하고 답안에 연결' }, { before: '내 답안의 약점을 모름', after: '해설·첨삭 기준에 따라 보완할 지점을 확인' }],
    methodTitle: '답안 작성의 기본 루프를 경험합니다.', methodSteps: ['합격답안으로 기준을 봅니다.', '배운 내용을 직접 씁니다.', '해설과 첨삭으로 다음 과제를 찾습니다.'], enrollTitle: '이번엔 강의를 듣는 데서 끝내지 말고, 내 답안을 써서 확인해 보세요.',
  },
  math: {
    problemTitle: '수리논술은 답을 구하는 것만으로 답안이 되지 않습니다.', problemLead: '그래서 이 강좌는 설명만 듣고 끝나지 않습니다.',
    problems: [{ title: '조건 해석', description: '주어진 조건을 어떤 순서로 활용할지 정하기 어렵다.' }, { title: '풀이 전개', description: '답은 떠올랐는데 단계 사이의 논리 연결이 흔들린다.' }, { title: '서술과 검토', description: '풀이를 문장으로 옮기면 빠진 근거를 점검하기 어렵다.' }],
    outcomesPromise: '합격을 약속하지 않습니다. 대신 실제로 풀고 서술하고 점검한 답안이 남습니다.', outcomes: [{ before: '조건은 읽었지만 풀이 순서가 막막함', after: '조건을 정리하고 풀이의 방향과 순서를 세움' }, { before: '답은 맞았지만 근거 서술이 빠짐', after: '각 단계가 성립하는 근거를 답안에 연결' }, { before: '내 풀이 답안의 약점을 모름', after: '해설·첨삭 기준에 따라 보완할 지점을 확인' }],
    methodTitle: '풀이 답안 작성의 기본 루프를 경험합니다.', methodSteps: ['합격답안으로 기준을 봅니다.', '배운 풀이를 직접 씁니다.', '해설과 첨삭으로 다음 과제를 찾습니다.'], enrollTitle: '이번엔 풀이를 보는 데서 끝내지 말고, 내 답안으로 써서 확인해 보세요.',
  },
  'short-answer': {
    problemTitle: '답을 알고 있어도, 요구에 맞게 쓰는 것은 다릅니다.', problemLead: '그래서 이 강좌는 개념 설명만 듣고 끝나지 않습니다.',
    problems: [{ title: '핵심 개념', description: '개념은 익숙한데 어떤 개념을 적용할지 헷갈린다.' }, { title: '문항 해석', description: '문제에서 요구하는 조건과 답안의 범위를 놓친다.' }, { title: '답안 서술', description: '무엇을 얼마나 써야 하는지 판단하기 어렵다.' }, { title: '시간과 검토', description: '제한된 시간에 답안을 완성하고 오류를 확인하기 어렵다.' }],
    outcomesPromise: '합격을 약속하지 않습니다. 대신 개념을 적용하고 답안을 점검하는 연습을 남깁니다.', outcomes: [{ before: '문제를 보면 어떤 개념부터 써야 할지 막막함', after: '문항의 조건과 관련 개념을 구분하고 접근 순서를 정리' }, { before: '답은 떠올라도 서술 범위가 불분명함', after: '요구된 풀이·근거를 필요한 범위에서 명확히 서술' }, { before: '제출 후 어디가 부족한지 모르겠음', after: '해설·첨삭 기준으로 누락·오류·표현을 확인' }],
    methodTitle: '개념을 이해하고, 답안으로 옮기는 과정을 연습합니다.', methodSteps: ['개념과 출제 기준을 확인합니다.', '요구에 맞는 답안을 직접 씁니다.', '해설과 첨삭으로 부족한 점을 확인합니다.'], enrollTitle: '이번엔 정답을 확인하는 데서 끝내지 말고, 내 답안으로 점검해 보세요.',
  },
};

export function CourseTemplate({ course, content, siblings, reviews, questions }: CourseTemplateProps) {
  const { item } = course;
  const copy = fixedCopy[content.templateType];
  const visible = (id: string) => content.sections.find((section) => section.id === id)?.visible === true;
  const descriptionHtml = sanitizeLegacyHtml(item.descriptionHtml);
  const headHtml = sanitizeLegacyHtml(item.headHtml);
  const tailHtml = sanitizeLegacyHtml(item.tailHtml);
  const lessonCount = item.extra[5];
  const duration = item.extra[2];
  return <main className="ct-root" data-course-theme={content.templateType}>
    <nav className="ct-sticky-bar" aria-label="강좌 신청"><a className="ct-sticky-brand" href="#top">논술런</a><span className="ct-sticky-title">{item.name}</span><span className="ct-sticky-price">{item.priceOnInquiry ? '전화 문의' : formatPrice(item.price)}</span><a className="ct-sticky-cta" href="#enroll">수강 신청하기 <span aria-hidden="true">→</span></a></nav>
    {content.contentMetadata.legacyHtml === 'visible' && headHtml !== '' && <div className="ct-legacy" dangerouslySetInnerHTML={{ __html: headHtml }} />}
    <section id="top" className="ct-hero"><div className="ct-hero-copy"><p className="ct-headline">{content.hero.marketingHeadline}</p><h1>{item.name}</h1>{content.hero.keywords !== undefined && <p className="ct-keywords">{content.hero.keywords}</p>}{(content.hero.summary ?? item.basic) !== '' && <p className="ct-summary">{content.hero.summary ?? item.basic}</p>}<a className="ct-button" href={visible('curriculum') ? '#curriculum' : '#enroll'}>{content.hero.ctaLabel} <span aria-hidden="true">↓</span></a></div><aside className="ct-hero-card" aria-label="강좌 정보"><strong>{item.name}</strong>{content.hero.target !== undefined && <p>{content.hero.target}</p>}{content.hero.target === undefined && item.information.product_name !== undefined && <p>{item.information.product_name}</p>}{lessonCount !== undefined && <small>총 {lessonCount}강</small>}</aside></section>
    {visible('problem') && <section className="ct-problem-band"><div className="ct-section ct-problem"><p className="ct-section-index">01</p><h2>{copy.problemTitle}</h2><div className="ct-problem-grid">{copy.problems.map((problem, index) => <article key={problem.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{problem.title}</h3>{problem.description !== '' && <p>{problem.description}</p>}</article>)}</div><p className="ct-transition">{copy.problemLead}{content.learningSystem?.methodLine !== undefined && <> <strong>{content.learningSystem.methodLine}</strong></>}</p></div></section>}
    {visible('outcomes') && <section className="ct-section ct-outcomes"><p className="ct-section-index">02</p><h2>수강 후 기대할 학습 결과</h2><p className="ct-promise">{content.learningSystem?.promise ?? copy.outcomesPromise}</p><dl>{copy.outcomes.map((outcome) => <div key={outcome.before}><dt>{outcome.before}</dt><dd>{outcome.after}</dd></div>)}</dl></section>}
    {visible('proof') && content.proof?.brandStats !== undefined && <section className="ct-section ct-proof"><p className="ct-section-index">03</p><h2>논술런을 믿어야 하는 이유</h2><div className="ct-stats">{content.proof.brandStats.map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.basis}</small></article>)}</div></section>}
    {visible('method') && <section className="ct-method-band"><div className="ct-section ct-method"><p className="ct-section-index">04</p><h2>{copy.methodTitle}</h2><div className="ct-steps">{copy.methodSteps.map((title, index) => { const detail = content.learningSystem?.steps?.[index]; return <article key={title}><b>{String(index + 1).padStart(2, '0')}</b><h3>{detail?.title ?? title}</h3>{detail?.description !== undefined && <p>{detail.description}</p>}</article>; })}</div></div></section>}
    {visible('curriculum') && content.curriculum?.lessons !== undefined && <section id="curriculum" className="ct-section ct-curriculum"><p className="ct-section-index">05</p><h2>커리큘럼</h2>{content.curriculum.introduction !== undefined && <p className="ct-curriculum-intro">{content.curriculum.introduction}</p>}{lessonCount !== undefined && <p className="ct-count">총 {lessonCount}강</p>}{content.curriculum.lessons.map((lesson, index) => <article className="ct-lesson" key={lesson.title}><b>{String(index + 1).padStart(2, '0')}</b><div><h3>{lesson.title}</h3><p>{lesson.description}</p></div>{lesson.duration !== undefined && <span>{lesson.duration}</span>}</article>)}</section>}
    {visible('course-info') && <section className="ct-section ct-course-info"><h2>수강 전에 확인해 주세요</h2><div>{lessonCount !== undefined && <p><b>강의</b> 총 {lessonCount}강</p>}{duration !== undefined && <p><b>수강 기간</b> {duration}</p>}<p><b>안내</b> 대학·전형별 출제 범위와 시험 방식은 최신 공식 모집요강에서 확인해 주세요.</p></div></section>}
    {visible('enroll') && <section id="enroll" className="ct-enroll"><div className="ct-enroll-heading"><p className="ct-section-index">07</p><h2>{copy.enrollTitle}</h2></div><CourseOrderForm course={course} siblings={siblings} /></section>}
    {visible('community') && <CourseInfoTabs courseId={item.id} information={item.information} descriptionHtml={descriptionHtml} reviews={reviews} questions={questions} />}
    {visible('faq') && content.faq !== undefined && <section id="faq" className="ct-section"><h2>자주 묻는 질문</h2>{content.faq.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>}
    {content.contentMetadata.legacyHtml === 'visible' && tailHtml !== '' && <div className="ct-legacy" dangerouslySetInnerHTML={{ __html: tailHtml }} />}
  </main>;
}
