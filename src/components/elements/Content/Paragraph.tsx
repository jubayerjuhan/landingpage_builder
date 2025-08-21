import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface ParagraphProps {
  element: BuilderElement;
}

export const Paragraph: React.FC<ParagraphProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const paragraphStyles: React.CSSProperties = {
    margin: '0 0 1rem 0',
    lineHeight: '1.6',
    color: '#666',
    fontSize: '1rem',
    ...styles,
  };
  
  const text = content.text || 'Add your paragraph content here. You can write as much text as you need.';
  
  return (
    <ElementWrapper element={element}>
      <p style={paragraphStyles}>
        {text}
      </p>
    </ElementWrapper>
  );
};