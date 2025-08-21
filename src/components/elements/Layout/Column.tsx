import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface ColumnProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({ element, children }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  
  const columnStyles: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minHeight: '60px',
    padding: '1rem',
    ...styles,
  };
  
  return (
    <ElementWrapper element={element}>
      <div style={columnStyles}>
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