import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface TextProps {
  element: BuilderElement;
}

export const Text: React.FC<TextProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const textStyles: React.CSSProperties = {
    display: 'inline',
    ...styles,
  };
  
  const text = content.text || 'Text content';
  
  return (
    <ElementWrapper element={element}>
      <span style={textStyles}>
        {text}
      </span>
    </ElementWrapper>
  );
};