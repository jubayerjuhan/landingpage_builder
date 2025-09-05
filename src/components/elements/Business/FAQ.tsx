import React, { useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { ChevronDown, HelpCircle } from 'lucide-react';
import useCanvasStore from '../../../stores/canvasStore';
import styles from './FAQ.module.scss';

interface FAQProps {
  element: BuilderElement;
}

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC<FAQProps> = ({ element }) => {
  const { previewMode } = useCanvasStore();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const defaultFAQs: FAQItem[] = [
    {
      question: "What is your refund policy?",
      answer: "We offer a 30-day money-back guarantee on all our plans. If you're not satisfied with our service, you can request a full refund within 30 days of purchase."
    },
    {
      question: "How do I upgrade my plan?",
      answer: "You can upgrade your plan at any time from your account dashboard. Go to Settings > Billing and select the plan you'd like to upgrade to. Changes take effect immediately."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
    },
    {
      question: "Do you offer technical support?",
      answer: "We provide 24/7 technical support for all paid plans. Basic plan users get email support, while Professional and Enterprise users get priority phone and chat support."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All data is encrypted both in transit and at rest. We comply with GDPR and other major data protection regulations."
    }
  ];

  const faqs = (element.properties?.faqs as FAQItem[]) || defaultFAQs;
  const expandBehavior = element.properties?.expandBehavior || 'single'; // single or multiple
  const showIcon = element.properties?.showIcon !== false;

  const handleToggle = (index: number) => {
    if (previewMode !== 'preview') return; // Only work in preview mode

    if (expandBehavior === 'single') {
      setOpenItems(openItems.includes(index) ? [] : [index]);
    } else {
      setOpenItems(
        openItems.includes(index)
          ? openItems.filter(i => i !== index)
          : [...openItems, index]
      );
    }
  };

  return (
    <ElementWrapper element={element}>
      <div className={styles.faq}>
        <div className={styles.faqList}>
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openItems.includes(index) ? styles.open : ''}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => handleToggle(index)}
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <div className={styles.questionContent}>
                  {showIcon && (
                    <HelpCircle size={20} className={styles.questionIcon} />
                  )}
                  <span>{item.question}</span>
                </div>
                <ChevronDown 
                  size={20} 
                  className={styles.chevron}
                />
              </button>
              
              <div
                id={`faq-answer-${index}`}
                className={styles.faqAnswer}
                aria-hidden={!openItems.includes(index)}
              >
                <div className={styles.answerContent}>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ElementWrapper>
  );
};