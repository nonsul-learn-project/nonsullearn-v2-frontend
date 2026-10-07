'use client';

import Image from 'next/image';
import { useState } from 'react';

import { legacyAssetUrl } from '@/legacy';
import type { Faq, Teacher } from '@/legacy/server';

export function TeachersContent({ teachers }: { teachers: Teacher[] }) {
  return <section className="content_wrap"><div className="content_area clearfix"><div className="txtCon">
    <div className="sub_title"><h2>논술런 강사진</h2><p>핵심을 꿰뚫는 강사들의 집결</p></div>
    <div className="content_area content05 clearfix">{teachers.map((teacher, index) => <div className="photo_box content05 clearfix animate" style={{ transitionDelay: `${(index % 3) * 150}ms` }} key={teacher.id}>
      {teacher.image === null ? null : <div className="img"><Image src={legacyAssetUrl(teacher.image)} alt={teacher.name} width={720} height={480} unoptimized /></div>}
      <div className="txt"><div className="instructor_info"><div className="name_tag"><span className="category_label">{teacher.categoryName.slice(0, 10)}</span><h3 className="instructor_name"><strong>{teacher.name}</strong> 선생님</h3></div>
        <div className="description"><p className="ability">{textWithBreaks(teacher.ability)}</p><p className="career">{textWithBreaks(teacher.career)}</p></div>
      </div></div>
    </div>)}</div>
  </div></div></section>;
}

function textWithBreaks(value: string) { return value.split(/\r?\n/).map((line, index) => <span key={`${line}-${index}`}>{index === 0 ? null : <br />}{line}</span>); }

export function HtmlContent({ id, title, html }: { id: string; title: string; html: string }) {
  return <article id="ctt" className={`ctt_${id}`}><header><h1>{title}</h1></header><div id="ctt_con" dangerouslySetInnerHTML={{ __html: html }} /></article>;
}

export function FaqContent({ faq, headerHtml, footerHtml }: { faq: Faq; headerHtml: string; footerHtml: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return <><div className="position-relative overflow-hidden text-center text-white py-5 mb-5"><div className="position-absolute top-50 start-50 translate-middle w-100 h-100 opacity-25 pointer-events-none" /><div className="container position-relative z-1 py-4"><span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill fs-7 text-uppercase mb-3 shadow-sm">Nonsul-Learn Instructors</span><h1 className="display-5 fw-extrabold mt-2 mb-3 text-white">{faq.title}</h1><p className="fs-6 text-light opacity-75 max-w-2xl mx-auto mb-0">자주하시는 질문과 답변을 편하게 확인하실 수 있습니다.</p></div></div>
    <div className="container py-4">
      {faq.headerImage === null ? null : <div id="faq_himg" className="faq_img mb-4 text-center"><Image src={legacyAssetUrl(faq.headerImage)} alt="" width={1200} height={400} unoptimized /></div>}
      {headerHtml === '' ? null : <div id="faq_hhtml" className="mb-4" dangerouslySetInnerHTML={{ __html: headerHtml }} />}
      <div className="card bg-light border-0 mb-4 p-4 shadow-sm"><form action="/bbs/faq.php" method="get" className="row g-3 justify-content-center align-items:center"><input type="hidden" name="fm_id" value={faq.id} /><div className="col-auto"><span className="fw-bold text-dark">FAQ 검색</span></div><div className="col-md-5 col-sm-8"><label htmlFor="stx" className="visually-hidden">검색어</label><input type="text" name="stx" id="stx" required className="form-control" placeholder="검색어를 입력하세요" /></div><div className="col-auto"><button type="submit" className="btn btn-success px-4">검색</button></div></form></div>
      <ul className="nav nav-pills justify-content-center mb-4 gap-2" id="bo_cate">{faq.masters.map((master) => <li className="nav-item" key={master.id}><a className={`nav-link px-4 py-2 rounded-pill shadow-sm ${master.id === faq.id ? 'active bg-success text-white' : 'bg-white text-secondary border'}`} href={`/faq/${master.id}`}>{master.title}</a></li>)}</ul>
      <div className="accordion mb-5 shadow-sm" id="faqAccordion">{faq.items.length === 0 ? <div className="text-center py-5 text-muted bg-white border rounded shadow-sm">등록된 FAQ가 없습니다.</div> : faq.items.map((item, index) => { const isOpen = open === item.id; return <div className="accordion-item border-0 border-bottom" key={item.id}><h2 className="accordion-header" id={`heading_${index}`}><button className={`accordion-button py-3 px-4 bg-white text-dark fw-semibold shadow-none ${isOpen ? '' : 'collapsed'}`} type="button" aria-expanded={isOpen} aria-controls={`faq_collapse_${index}`} onClick={() => setOpen(isOpen ? null : item.id)}><span className="badge bg-success me-3 px-2 py-1">Q</span><span dangerouslySetInnerHTML={{ __html: item.questionHtml }} /></button></h2><div id={`faq_collapse_${index}`} className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`} aria-labelledby={`heading_${index}`}><div className="accordion-body px-4 py-4 bg-light text-secondary"><div className="d-flex align-items-start gap-3"><span className="badge bg-secondary px-2 py-1 mt-1">A</span><div className="flex-grow-1" dangerouslySetInnerHTML={{ __html: item.answerHtml }} /></div></div></div></div>; })}</div>
      {footerHtml === '' ? null : <div id="faq_thtml" className="mb-4" dangerouslySetInnerHTML={{ __html: footerHtml }} />}
      {faq.footerImage === null ? null : <div id="faq_timg" className="faq_img text-center"><Image src={legacyAssetUrl(faq.footerImage)} alt="" width={1200} height={400} unoptimized /></div>}
    </div></>;
}
