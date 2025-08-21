import React, { useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface PopupProps {
  element: BuilderElement;
}

export const Popup: React.FC<PopupProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const [isVisible, setIsVisible] = useState(false);
  
  const triggerText = (element.properties?.component as any)?.triggerText || 'Show Popup';
  const content = (element.properties?.component as any)?.content || 'This is a popup message!';
  const position = (element.properties?.component as any)?.position || 'top';
  
  const popupStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...styles,
  };
  
  const tooltipStyles: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    zIndex: 10,
    opacity: isVisible ? 1 : 0,
    transform: `translateY(${position === 'top' ? '-100%' : '100%'})`,
    [position === 'top' ? 'bottom' : 'top']: '100%',
    left: '50%',
    marginLeft: '-50%',
    transition: 'opacity 0.2s ease',
    pointerEvents: 'none'
  };
  
  return (
    <ElementWrapper element={element}>
      <div style={popupStyles}>
        <button
          onMouseEnter={() => previewMode === 'preview' && setIsVisible(true)}
          onMouseLeave={() => previewMode === 'preview' && setIsVisible(false)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: previewMode === 'preview' ? 'pointer' : 'default'
          }}
        >
          {triggerText}
        </button>
        
        <div style={tooltipStyles}>
          {content}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              marginLeft: '-5px',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              [position === 'top' ? 'top' : 'bottom']: '100%',
              [position === 'top' ? 'borderBottom' : 'borderTop']: '5px solid #1f2937'
            }}
          />
        </div>
      </div>
    </ElementWrapper>
  );
};