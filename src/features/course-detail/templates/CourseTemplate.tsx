import type { CourseTemplateContent } from '@/content/course-templates';
import type { CourseFull, CourseQuestionsState, CourseReviewsState } from '@/legacy';
import { sanitizeLegacyHtml } from '@/lib/sanitize-legacy-html';

import { CourseInfoTabs } from '../CourseInfoTabs';
import { CourseOrderForm } from '../CourseOrderForm';

import './course-template.css';

interface CourseTemplateProps {
  course: CourseFull;
  content: CourseTemplateContent;
  siblings: { previous: string | null; next: string | null };
  reviews: CourseReviewsState;
  questions: CourseQuestionsState;
}

const problemCopy = {
  humanities: ['무엇을 써야 할지 막막하다', '문장으로 옮기면 논리가 흐려진다', '비교 기준을 잡기 어렵다', '근거가 약해진다'],
  math: ['조건 해석', '풀이 전개', '서술과 검토'],
  'short-answer': ['핵심 개념', '문항 해석', '답안 서술', '시간과 검토'],
} as const;

export function CourseTemplate({ course, content, siblings, reviews, questions }: CourseTemplateProps) {
  const { item } = course;
  const visible = (id: string) => content.sections.find((section) => section.id === id)?.visible === true;
  const descriptionHtml = sanitizeLegacyHtml(item.descriptionHtml);
  const headHtml = sanitizeLegacyHtml(item.headHtml);
  const tailHtml = sanitizeLegacyHtml(item.tailHtml);
  const problems = problemCopy[content.templateType];

  return (
    <main className="ct-root" data-course-theme={content.templateType}>
      {content.contentMetadata.legacyHtml === 'visible' && headHtml !== '' && <div className="ct-legacy" dangerouslySetInnerHTML={{ __html: headHtml }} />}
      <section className="ct-hero">
        <p className="ct-headline">{content.hero.marketingHeadline}</p>
        <h1>{item.name}</h1>
        {(content.hero.summary ?? item.basic) !== '' && <p className="ct-summary">{content.hero.summary ?? item.basic}</p>}
        {content.hero.keywords !== undefined && <p className="ct-keywords">{content.hero.keywords}</p>}
        <a className="ct-button" href="#enroll">{content.hero.ctaLabel}</a>
      </section>
      {visible('problem') && <section className="ct-section ct-problem"><h2>답안이 되기까지 필요한 과정</h2><ol>{problems.map((problem, index) => <li key={problem}><span>{String(index + 1).padStart(2, '0')}</span>{problem}</li>)}</ol></section>}
      {visible('method') && content.learningSystem?.steps !== undefined && <section className="ct-section"><h2>학습 방법</h2><div className="ct-steps">{content.learningSystem.steps.map((step, index) => <article key={step.title}><b>{String(index + 1).padStart(2, '0')}</b><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></section>}
      {visible('curriculum') && content.curriculum?.lessons !== undefined && <section id="curriculum" className="ct-section"><h2>커리큘럼</h2>{content.curriculum.lessons.map((lesson, index) => <article className="ct-lesson" key={lesson.title}><b>{String(index + 1).padStart(2, '0')}</b><div><h3>{lesson.title}</h3><p>{lesson.description}</p></div>{lesson.duration !== undefined && <span>{lesson.duration}</span>}</article>)}</section>}
      {visible('proof') && content.proof?.brandStats !== undefined && <section className="ct-section"><h2>논술런을 믿어야 하는 이유</h2><div className="ct-stats">{content.proof.brandStats.map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.basis}</small></article>)}</div></section>}
      {visible('enroll') && <section id="enroll" className="ct-enroll"><h2>수강 신청</h2><CourseOrderForm course={course} siblings={siblings} /></section>}
      {visible('community') && <CourseInfoTabs courseId={item.id} information={item.information} descriptionHtml={descriptionHtml} reviews={reviews} questions={questions} />}
      {visible('faq') && content.faq !== undefined && <section id="faq" className="ct-section"><h2>자주 묻는 질문</h2>{content.faq.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>}
      {content.contentMetadata.legacyHtml === 'visible' && tailHtml !== '' && <div className="ct-legacy" dangerouslySetInnerHTML={{ __html: tailHtml }} />}
    </main>
  );
}
