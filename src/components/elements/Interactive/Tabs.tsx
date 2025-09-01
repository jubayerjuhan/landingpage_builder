import React, { useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface TabsProps {
  element: BuilderElement;
}

export const Tabs: React.FC<TabsProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = (element.properties?.component as any)?.tabs || [
    { title: 'Tab 1', content: 'This is the content for tab 1.' },
    { title: 'Tab 2', content: 'This is the content for tab 2.' },
    { title: 'Tab 3', content: 'This is the content for tab 3.' },
  ];
  
  const tabsStyles: React.CSSProperties = {
    width: '100%',
    ...styles,
  };
  
  return (
    <ElementWrapper element={element}>
      <div style={tabsStyles}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '1rem'
        }}>
          {tabs.map((tab: any, index: number) => (
            <button
              key={index}
              onClick={() => previewMode === 'preview' && setActiveTab(index)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === index ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === index ? '#3b82f6' : '#6b7280',
                cursor: previewMode === 'preview' ? 'pointer' : 'default',
                fontWeight: activeTab === index ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>
        
        <div style={{
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          color: '#374151',
          lineHeight: '1.6'
        }}>
          {tabs[activeTab]?.content}
        </div>
      </div>
    </ElementWrapper>
  );
};