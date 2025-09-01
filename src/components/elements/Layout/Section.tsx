import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface SectionProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ element, children }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  
  const sectionStyles: React.CSSProperties = {
    display: 'block',
    width: '100%',
    minHeight: '60px',
    ...styles,
  };
  
  return (
    <ElementWrapper element={element}>
      <section style={sectionStyles} data-element-id={element.id} data-element-type={element.type}>
        {children || (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60px',
            color: '#9ca3af',
            fontSize: '14px',
            border: '2px dashed #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            Drop components here
          </div>
        )}
      </section>
    </ElementWrapper>
  );
};