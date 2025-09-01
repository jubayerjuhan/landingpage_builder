import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface RowProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

export const Row: React.FC<RowProps> = ({ element, children }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  
  const rowStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    width: '100%',
    minHeight: '60px',
    ...styles,
  };
  
  return (
    <ElementWrapper element={element}>
      <div style={rowStyles} data-element-id={element.id} data-element-type={element.type}>
        {children || (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60px',
            width: '100%',
            color: '#9ca3af',
            fontSize: '14px',
            border: '2px dashed #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            Add columns here
          </div>
        )}
      </div>
    </ElementWrapper>
  );
};