import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface QuoteProps {
  element: BuilderElement;
}

export const Quote: React.FC<QuoteProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const quoteStyles: React.CSSProperties = {
    margin: '1.5rem 0',
    padding: '1rem 1.5rem',
    borderLeft: '4px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    fontStyle: 'italic',
    fontSize: '1.125rem',
    lineHeight: '1.7',
    color: '#374151',
    ...styles,
  };
  
  const text = content.text || '"This is a quote or testimonial."';
  const author = (element.properties?.component as any)?.author || '';
  
  return (
    <ElementWrapper element={element}>
      <blockquote style={quoteStyles}>
        <div style={{ marginBottom: author ? '0.5rem' : '0' }}>
          {text}
        </div>
        {author && (
          <cite style={{
            display: 'block',
            fontSize: '0.875rem',
            fontStyle: 'normal',
            color: '#6b7280',
            textAlign: 'right'
          }}>
            — {author}
          </cite>
        )}
      </blockquote>
    </ElementWrapper>
  );
};