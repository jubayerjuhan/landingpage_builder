import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface LinkProps {
  element: BuilderElement;
}

export const Link: React.FC<LinkProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const normalizeHref = (raw?: string) => {
    const trimmed = (raw || '').trim();
    if (!trimmed) return '#';

    const lower = trimmed.toLowerCase();
    if (
      lower.startsWith('http://') ||
      lower.startsWith('https://') ||
      lower.startsWith('mailto:') ||
      lower.startsWith('tel:')
    ) {
      return trimmed;
    }

    if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
      return trimmed;
    }

    return `https://${trimmed}`;
  };

  const linkStyles: React.CSSProperties = {
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: previewMode === 'preview' ? 'pointer' : 'default',
    transition: 'color 0.2s ease',
    ...styles,
  };
  
  const text = content.text || 'Link text';
  const href = normalizeHref(content.href);
  const target = content.target || '_self';
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
  
  const handleClick = (e: React.MouseEvent) => {
    if (previewMode === 'edit') {
      e.preventDefault();
    }
  };
  
  return (
    <ElementWrapper element={element}>
      <a
        href={href}
        target={target}
        rel={rel}
        style={linkStyles}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (previewMode === 'preview') {
            (e.target as HTMLElement).style.color = '#1d4ed8';
          }
        }}
        onMouseLeave={(e) => {
          if (previewMode === 'preview') {
            (e.target as HTMLElement).style.color = styles.color || '#3b82f6';
          }
        }}
      >
        {text}
      </a>
    </ElementWrapper>
  );
};
