import React, { useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import { X } from 'lucide-react';

interface ModalProps {
  element: BuilderElement;
}

export const Modal: React.FC<ModalProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const [isOpen, setIsOpen] = useState(false);
  
  const triggerText = (element.properties?.component as any)?.triggerText || 'Open Modal';
  const title = (element.properties?.component as any)?.title || 'Modal Title';
  const content = (element.properties?.component as any)?.content || 'This is modal content.';
  
  const modalStyles: React.CSSProperties = {
    ...styles,
  };
  
  return (
    <ElementWrapper element={element}>
      <div style={modalStyles}>
        <button
          onClick={() => previewMode === 'preview' && setIsOpen(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: previewMode === 'preview' ? 'pointer' : 'default',
            fontWeight: '500'
          }}
        >
          {triggerText}
        </button>
        
        {isOpen && previewMode === 'preview' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setIsOpen(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90%',
                overflow: 'auto',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={20} color="#6b7280" />
              </button>
              
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827'
              }}>
                {title}
              </h3>
              
              <div style={{
                color: '#374151',
                lineHeight: '1.6'
              }}>
                {content}
              </div>
            </div>
          </div>
        )}
      </div>
    </ElementWrapper>
  );
};