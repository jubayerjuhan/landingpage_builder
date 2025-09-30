import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import { useBuilderStore } from '../../../stores/builderStore';

interface TabsProps {
  element: BuilderElement;
}

export const Tabs: React.FC<TabsProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const { selectElement } = useBuilderStore();
  const styles = getElementStyles(element, viewportMode);
  const componentConfig = (element.properties?.component || {}) as Record<string, unknown>;

  const tabs = useMemo(() => {
    const rawTabs = componentConfig.tabs;
    if (Array.isArray(rawTabs) && rawTabs.length > 0) {
      return rawTabs as Array<{ title?: string; content?: string }>;
    }

    return [
      { title: 'Tab 1', content: 'This is the content for tab 1.' },
      { title: 'Tab 2', content: 'This is the content for tab 2.' },
      { title: 'Tab 3', content: 'This is the content for tab 3.' }
    ];
  }, [componentConfig.tabs]);

  const clampIndex = useCallback((value: number) => {
    if (!Number.isInteger(value)) {
      return 0;
    }
    return Math.min(Math.max(value, 0), Math.max(tabs.length - 1, 0));
  }, [tabs.length]);

  const defaultActive = useMemo(() => {
    const raw = componentConfig.defaultActive;
    if (typeof raw === 'number') {
      return clampIndex(raw);
    }
    return 0;
  }, [clampIndex, componentConfig.defaultActive]);

  const [activeTab, setActiveTab] = useState(() => clampIndex(defaultActive));
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setActiveTab(clampIndex(defaultActive));
  }, [clampIndex, defaultActive, tabs.length]);
  
  const tabsStyles: React.CSSProperties = {
    width: '100%',
    ...styles,
  };

  const isPreviewMode = previewMode === 'preview';

  const handleSelect = useCallback((index: number) => {
    setActiveTab(clampIndex(index));
    if (!isPreviewMode) {
      selectElement(element.id);
    }
  }, [clampIndex, element.id, isPreviewMode, selectElement]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    handleSelect(index);
  }, [handleSelect]);

  const focusTab = useCallback((index: number) => {
    const button = tabRefs.current[index];
    if (button) {
      button.focus();
    }
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      handleSelect(index);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = clampIndex(index + delta);
      handleSelect(nextIndex);
      focusTab(nextIndex);
    }
  }, [clampIndex, focusTab, handleSelect]);
  
  return (
    <ElementWrapper element={element}>
      <div style={tabsStyles}>
        <div
          role="tablist"
          aria-orientation="horizontal"
          style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '1rem'
          }}
        >
          {tabs.map((tab: any, index: number) => (
            <button
              key={index}
              ref={el => {
                tabRefs.current[index] = el;
              }}
              onClick={event => handleClick(event, index)}
              onKeyDown={event => handleKeyDown(event, index)}
              role="tab"
              id={`${element.id}-tab-${index}`}
              aria-controls={`${element.id}-panel-${index}`}
              aria-selected={activeTab === index}
              tabIndex={activeTab === index ? 0 : -1}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === index ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === index ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontWeight: activeTab === index ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>
        
        <div
          role="tabpanel"
          id={`${element.id}-panel-${activeTab}`}
          aria-labelledby={`${element.id}-tab-${activeTab}`}
          style={{
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            color: '#374151',
            lineHeight: '1.6'
          }}
        >
          {tabs[activeTab]?.content}
        </div>
      </div>
    </ElementWrapper>
  );
};
