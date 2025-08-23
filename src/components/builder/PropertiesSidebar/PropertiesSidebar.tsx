import React from 'react';
import { Settings, Type, Palette, Box } from 'lucide-react';
import { useBuilderStore } from '../../../stores/builderStore';
import styles from './PropertiesSidebar.module.scss';

export const PropertiesSidebar: React.FC = () => {
  const { selectedElementId, elements, updateElement } = useBuilderStore();
  
  const selectedElement = selectedElementId 
    ? elements.find(el => el.id === selectedElementId)
    : null;

  if (!selectedElement) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Settings size={18} />
          <span>Properties</span>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <Box size={48} />
            <h3>No Element Selected</h3>
            <p>Select an element to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateElement(selectedElement.id, { [property]: value });
  };

  const handleStyleChange = (styleProperty: string, value: string) => {
    const currentStyles = selectedElement.styles || {};
    updateElement(selectedElement.id, {
      styles: { ...currentStyles, [styleProperty]: value }
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Settings size={18} />
        <span>Properties</span>
      </div>

      <div className={styles.sidebarContent}>
        {/* Element Info */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Box size={16} />
            <span>Element</span>
          </div>
          <div className={styles.elementInfo}>
            <div className={styles.elementType}>
              {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
            </div>
            <div className={styles.elementId}>ID: {selectedElement.id.slice(-8)}</div>
          </div>
        </div>

        {/* Content Properties */}
        {['heading', 'paragraph', 'text', 'button'].includes(selectedElement.type) && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Type size={16} />
              <span>Content</span>
            </div>
            <div className={styles.field}>
              <label>Text Content</label>
              <textarea
                value={selectedElement.content}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Typography Properties */}
        {['heading', 'paragraph', 'text'].includes(selectedElement.type) && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Type size={16} />
              <span>Typography</span>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label>Font Size</label>
                <input
                  type="number"
                  value={selectedElement.styles?.fontSize?.replace('px', '') || ''}
                  onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                  className={styles.input}
                  placeholder="16"
                />
              </div>
              <div className={styles.field}>
                <label>Font Weight</label>
                <select
                  value={selectedElement.styles?.fontWeight || 'normal'}
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  className={styles.select}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="600">Semi Bold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label>Text Color</label>
              <input
                type="color"
                value={selectedElement.styles?.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className={styles.colorInput}
              />
            </div>
          </div>
        )}

        {/* Spacing Properties */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Box size={16} />
            <span>Spacing</span>
          </div>
          <div className={styles.spacingGrid}>
            <div className={styles.field}>
              <label>Margin Top</label>
              <input
                type="number"
                value={selectedElement.styles?.marginTop?.replace('px', '') || ''}
                onChange={(e) => handleStyleChange('marginTop', `${e.target.value}px`)}
                className={styles.input}
                placeholder="0"
              />
            </div>
            <div className={styles.field}>
              <label>Margin Bottom</label>
              <input
                type="number"
                value={selectedElement.styles?.marginBottom?.replace('px', '') || ''}
                onChange={(e) => handleStyleChange('marginBottom', `${e.target.value}px`)}
                className={styles.input}
                placeholder="0"
              />
            </div>
            <div className={styles.field}>
              <label>Padding Top</label>
              <input
                type="number"
                value={selectedElement.styles?.paddingTop?.replace('px', '') || ''}
                onChange={(e) => handleStyleChange('paddingTop', `${e.target.value}px`)}
                className={styles.input}
                placeholder="0"
              />
            </div>
            <div className={styles.field}>
              <label>Padding Bottom</label>
              <input
                type="number"
                value={selectedElement.styles?.paddingBottom?.replace('px', '') || ''}
                onChange={(e) => handleStyleChange('paddingBottom', `${e.target.value}px`)}
                className={styles.input}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Background Properties */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Palette size={16} />
            <span>Background</span>
          </div>
          <div className={styles.field}>
            <label>Background Color</label>
            <input
              type="color"
              value={selectedElement.styles?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className={styles.colorInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};