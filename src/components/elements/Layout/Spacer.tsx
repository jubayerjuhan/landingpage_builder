import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface SpacerProps {
  element: BuilderElement;
}

export const Spacer: React.FC<SpacerProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  
  const spacerStyles: React.CSSProperties = {
    width: '100%',
    height: '2rem',
    minHeight: '1rem',
    ...styles,
  };
  
  // In edit mode, show a visual indicator
  if (previewMode === 'edit') {
    spacerStyles.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    spacerStyles.border = '1px dashed rgba(59, 130, 246, 0.3)';
    spacerStyles.position = 'relative';
  }
  
  return (
    <div style={spacerStyles} data-element-id={element.id} data-element-type={element.type}>
      {previewMode === 'edit' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#3b82f6',
          fontSize: '12px',
          fontWeight: '500',
          pointerEvents: 'none'
        }}>
          Spacer
        </div>
      )}
    </div>
  );
};