import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface InputProps {
  element: BuilderElement;
}

export const Input: React.FC<InputProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const inputType = (element.properties?.form as any)?.type || 'text';
  const required = (element.properties?.form as any)?.required || false;
  const disabled = (element.properties?.form as any)?.disabled || false;
  
  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: disabled ? '#f9fafb' : 'white',
    ...styles,
  };
  
  return (
    <ElementWrapper element={element}>
      <input
        type={inputType}
        placeholder={content.placeholder || 'Enter text...'}
        required={required}
        disabled={disabled}
        style={inputStyles}
        readOnly
      />
    </ElementWrapper>
  );
};