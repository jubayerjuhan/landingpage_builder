import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface ContainerProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ element, children }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minHeight: '60px',
    overflow: 'visible',
    position: 'relative',
    ...styles,
  };
  
  return (
    <ElementWrapper element={element}>
      <div style={containerStyles} data-element-id={element.id} data-element-type={element.type}>
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
      </div>
    </ElementWrapper>
  );
};