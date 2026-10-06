'use client';
import { useState } from 'react';
import { homeContent } from '@/content/home';
export function FaqAccordion() {
  const { faq } = homeContent;
  const [open, setOpen] = useState(0);
  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center">
          <span className="text-primary fw-bold fs-7">{faq.eyebrow}</span>
          <h2 className="section-title mt-1">{faq.title}</h2>
          <p className="section-subtitle">{faq.subtitle}</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="accordion faq-accordion" id="faqAccordion">
              {faq.items.map(([question, answer], index) => (
                <div className="accordion-item" key={question}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button${open === index ? '' : ' collapsed'}`}
                      type="button"
                      aria-expanded={open === index}
                      onClick={() => setOpen(open === index ? -1 : index)}
                    >
                      <span className="faq-q-badge">Q{index + 1}.</span>
                      {question}
                    </button>
                  </h2>
                  <div
                    className={`accordion-collapse collapse${open === index ? ' show' : ''}`}
                    hidden={open !== index}
                  >
                    <div className="accordion-body">{answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
