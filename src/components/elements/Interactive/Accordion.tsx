import React, { useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  element: BuilderElement;
}

export const Accordion: React.FC<AccordionProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  
  const items = (element.properties?.component as any)?.items || [
    { title: 'Accordion Item 1', content: 'This is the content for the first accordion item.' },
    { title: 'Accordion Item 2', content: 'This is the content for the second accordion item.' },
    { title: 'Accordion Item 3', content: 'This is the content for the third accordion item.' },
  ];
  
  const allowMultiple = (element.properties?.component as any)?.allowMultiple !== false;
  
  const accordionStyles: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    ...styles,
  };
  
  const toggleItem = (index: number) => {
    if (previewMode === 'edit') return;
    
    const newOpenItems = new Set(openItems);
    
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(index);
    }
    
    setOpenItems(newOpenItems);
  };
  
  return (
    <ElementWrapper element={element}>
      <div style={accordionStyles}>
        {items.map((item: any, index: number) => {
          const isOpen = openItems.has(index);
          
          return (
            <div key={index}>
              <button
                onClick={() => toggleItem(index)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  textAlign: 'left',
                  backgroundColor: 'white',
                  border: 'none',
                  borderBottom: index < items.length - 1 || isOpen ? '1px solid #e5e7eb' : 'none',
                  cursor: previewMode === 'preview' ? 'pointer' : 'default',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (previewMode === 'preview') {
                    (e.target as HTMLElement).style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (previewMode === 'preview') {
                    (e.target as HTMLElement).style.backgroundColor = 'white';
                  }
                }}
              >
                <span>{item.title}</span>
                <ChevronDown
                  size={20}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: '#6b7280'
                  }}
                />
              </button>
              
              {isOpen && (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderBottom: index < items.length - 1 ? '1px solid #e5e7eb' : 'none',
                    color: '#374151',
                    lineHeight: '1.6'
                  }}
                >
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ElementWrapper>
  );
};