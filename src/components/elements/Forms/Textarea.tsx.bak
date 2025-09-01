import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface TextareaProps {
  element: BuilderElement;
}

export const Textarea: React.FC<TextareaProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const rows = (element.properties?.component as any)?.rows || 4;
  const required = (element.properties?.form as any)?.required || false;
  
  const textareaStyles: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    ...styles,
  };
  
  return (
    <ElementWrapper element={element}>
      <textarea
        placeholder={content.placeholder || 'Enter your message...'}
        required={required}
        rows={rows}
        style={textareaStyles}
        readOnly
      />
    </ElementWrapper>
  );
};