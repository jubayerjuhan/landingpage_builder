import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface GalleryProps {
  element: BuilderElement;
}

export const Gallery: React.FC<GalleryProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  
  const galleryStyles: React.CSSProperties = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...styles,
  };
  
  // Get images from properties
  const images = (element.properties?.component as any)?.images || [
    { src: 'https://via.placeholder.com/300x200?text=Image+1', alt: 'Gallery image 1' },
    { src: 'https://via.placeholder.com/300x200?text=Image+2', alt: 'Gallery image 2' },
    { src: 'https://via.placeholder.com/300x200?text=Image+3', alt: 'Gallery image 3' },
    { src: 'https://via.placeholder.com/300x200?text=Image+4', alt: 'Gallery image 4' },
  ];
  
  const columns = (element.properties?.component as any)?.columns || 'auto';
  
  if (columns !== 'auto') {
    galleryStyles.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
  
  return (
    <ElementWrapper element={element}>
      <div style={galleryStyles}>
        {images.map((image: any, index: number) => (
          <div 
            key={index}
            style={{
              aspectRatio: '3/2',
              overflow: 'hidden',
              borderRadius: '8px'
            }}
          >
            <img
              src={image.src}
              alt={image.alt || `Gallery image ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLImageElement).style.transform = 'scale(1)';
              }}
            />
          </div>
        ))}
      </div>
    </ElementWrapper>
  );
};