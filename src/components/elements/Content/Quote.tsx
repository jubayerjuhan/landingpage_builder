import React, { useEffect, useRef, useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import useElementStore from '../../../stores/elementStore';

interface QuoteProps {
  element: BuilderElement;
}

export const Quote: React.FC<QuoteProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const { updateElement } = useElementStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

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
  const author = (element.properties?.component as { author?: string })?.author || '';

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (previewMode === 'preview') return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    const newText =
      editableRef.current?.querySelector('[data-field="quote-text"]')?.textContent || text;
    const newAuthor =
      editableRef.current?.querySelector('[data-field="quote-author"]')?.textContent || author;
    updateElement(element.id, {
      content: newText,
      properties: {
        ...element.properties,
        component: {
          ...(element.properties?.component as Record<string, unknown>),
          author: newAuthor,
        },
      },
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <ElementWrapper element={element}>
        <blockquote
          ref={editableRef}
          style={{
            ...quoteStyles,
            outline: '1px dashed rgba(84, 87, 255, 0.5)',
            outlineOffset: '0px',
          }}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        >
          <div
            contentEditable
            suppressContentEditableWarning
            data-field="quote-text"
            style={{ marginBottom: author ? '0.5rem' : '0' }}
          >
            {text}
          </div>
          <cite
            contentEditable
            suppressContentEditableWarning
            data-field="quote-author"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontStyle: 'normal',
              color: '#6b7280',
              textAlign: 'right',
            }}
          >
            {author ? `— ${author}` : ''}
          </cite>
        </blockquote>
      </ElementWrapper>
    );
  }

  return (
    <ElementWrapper element={element}>
      <blockquote
        style={quoteStyles}
        onDoubleClick={handleDoubleClick}
        title={previewMode === 'edit' ? 'Double-click to edit' : undefined}
      >
        <div style={{ marginBottom: author ? '0.5rem' : '0' }}>{text}</div>
        {author && (
          <cite
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontStyle: 'normal',
              color: '#6b7280',
              textAlign: 'right',
            }}
          >
            — {author}
          </cite>
        )}
      </blockquote>
    </ElementWrapper>
  );
};
