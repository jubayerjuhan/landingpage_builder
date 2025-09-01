import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface ColumnProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({ element, children }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  
  // Filter out styles that are handled by ElementWrapper (padding, margin, visual styles)
  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft,
          margin, marginTop, marginRight, marginBottom, marginLeft,
          backgroundColor, borderRadius, border, boxShadow, ...remainingStyles } = styles;
  
  const columnStyles: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minHeight: '60px',
    overflow: 'visible', // Ensure child elements can show drag handles
    position: 'relative', // Ensure proper stacking context
    ...remainingStyles, // Only apply non-wrapper styles
  };
  
  return (
    <ElementWrapper element={element}>
      <div style={columnStyles} data-element-id={element.id} data-element-type={element.type}>
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