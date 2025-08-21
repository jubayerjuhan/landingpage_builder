import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface HeadingProps {
  element: BuilderElement;
}

export const Heading: React.FC<HeadingProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  // Get heading level from properties or default to H2
  const level = (element.properties?.typography as any)?.level || '2';
  const headingLevel = Math.max(1, Math.min(6, parseInt(level))) as 1 | 2 | 3 | 4 | 5 | 6;
  
  const headingStyles: React.CSSProperties = {
    margin: '0 0 1rem 0',
    fontWeight: 'bold',
    color: '#333',
    ...styles,
  };
  
  const text = content.text || 'Your Heading Here';
  
  const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  
  return (
    <ElementWrapper element={element}>
      <HeadingTag style={headingStyles}>
        {text}
      </HeadingTag>
    </ElementWrapper>
  );
};