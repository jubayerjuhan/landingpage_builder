import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { Star, Quote } from 'lucide-react';
import styles from './Testimonial.module.scss';

interface TestimonialProps {
  element: BuilderElement;
}

export const Testimonial: React.FC<TestimonialProps> = ({ element }) => {
  const {
    quote = "This product has completely transformed how we work. The results have been incredible and our team couldn't be happier.",
    author = "Jane Smith",
    role = "CEO",
    company = "Tech Company",
    rating = 5,
    avatarUrl = "",
    layout = "card", // card, minimal, side
    showQuoteIcon = true
  } = element.properties || {};

  const renderStars = () => {
    return (
      <div className={styles.rating}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={`${styles.star} ${index < rating ? styles.filled : ''}`}
          />
        ))}
      </div>
    );
  };

  const renderAvatar = () => {
    if (avatarUrl) {
      return (
        <img 
          src={avatarUrl} 
          alt={`${author}`}
          className={styles.avatar}
        />
      );
    }
    return (
      <div className={styles.avatarPlaceholder}>
        {author?.charAt(0).toUpperCase()}
      </div>
    );
  };

  if (layout === 'minimal') {
    return (
      <ElementWrapper element={element}>
        <div className={`${styles.testimonial} ${styles.minimal}`}>
          <blockquote className={styles.quote}>{quote}</blockquote>
          <div className={styles.author}>
            <span className={styles.authorName}>{author}</span>
            {role && <span className={styles.separator}>•</span>}
            <span className={styles.authorRole}>{role}</span>
          </div>
        </div>
      </ElementWrapper>
    );
  }

  if (layout === 'side') {
    return (
      <ElementWrapper element={element}>
        <div className={`${styles.testimonial} ${styles.side}`}>
          <div className={styles.avatarSection}>
            {renderAvatar()}
          </div>
          <div className={styles.contentSection}>
            {rating > 0 && renderStars()}
            <blockquote className={styles.quote}>{quote}</blockquote>
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>{author}</div>
              <div className={styles.authorDetails}>
                {role} {company && `at ${company}`}
              </div>
            </div>
          </div>
        </div>
      </ElementWrapper>
    );
  }

  // Default card layout
  return (
    <ElementWrapper element={element}>
      <div className={`${styles.testimonial} ${styles.card}`}>
        {showQuoteIcon && (
          <Quote size={32} className={styles.quoteIcon} />
        )}
        
        {rating > 0 && renderStars()}
        
        <blockquote className={styles.quote}>
          {quote}
        </blockquote>
        
        <div className={styles.authorSection}>
          {renderAvatar()}
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>{author}</div>
            <div className={styles.authorDetails}>
              {role} {company && `at ${company}`}
            </div>
          </div>
        </div>
      </div>
    </ElementWrapper>
  );
};