import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface ImageProps {
  element: BuilderElement;
}

export const Image: React.FC<ImageProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const imageStyles: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    ...styles,
  };
  
  const src = content.src || 'https://via.placeholder.com/400x300?text=Your+Image';
  const alt = content.alt || 'Image';
  
  return (
    <ElementWrapper element={element}>
      <img 
        src={src} 
        alt={alt} 
        style={imageStyles}
        loading="lazy"
      />
    </ElementWrapper>
  );
};