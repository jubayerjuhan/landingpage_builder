import React, { useState } from 'react';
import { 
  Settings, 
  Type, 
  Palette, 
  Box, 
  ChevronDown, 
  Eye, 
  Copy,
  Trash2,
  Move,
  Layers,
  Ruler,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import { useBuilderStore } from '../../../stores/builderStore';
import useElementStore from '../../../stores/elementStore';
import { SpacingControl } from '../PropertiesPanel/SpacingControl';
import styles from './PropertiesSidebar.module.scss';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultCollapsed = false 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`${styles.section} ${isCollapsed ? styles.collapsed : ''}`}>
      <div 
        className={styles.sectionHeader}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className={styles.sectionHeaderLeft}>
          <div className={styles.sectionIcon}>
            {icon}
          </div>
          <span className={styles.sectionTitle}>{title}</span>
        </div>
        <ChevronDown size={14} className={styles.toggleIcon} />
      </div>
      <div className={styles.sectionContent}>
        {children}
      </div>
    </div>
  );
};

export const PropertiesSidebar: React.FC = () => {
  const { selectedElementId, elements, updateElement, deleteElement } = useBuilderStore();
  const elementStore = useElementStore();
  
  const selectedElement = selectedElementId 
    ? elements.find(el => el.id === selectedElementId)
    : null;

  if (!selectedElement) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Settings size={18} />
            </div>
            <span className={styles.headerTitle}>Properties</span>
          </div>
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

  const handleDelete = () => {
    if (selectedElement) {
      deleteElement(selectedElement.id);
    }
  };

  const getElementDisplayName = (type: string) => {
    const displayNames: Record<string, string> = {
      'heading': 'Heading',
      'paragraph': 'Paragraph',
      'text': 'Text',
      'button': 'Button',
      'image': 'Image',
      'layout': 'Layout',
      'row': 'Row',
      'column': 'Column'
    };
    return displayNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className={styles.sidebar}>
      {/* Enhanced Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Settings size={18} />
          </div>
          <span className={styles.headerTitle}>Properties</span>
        </div>
        
        <div className={styles.headerActions}>
          <button className={styles.headerButton} title="Duplicate Element">
            <Copy size={14} />
          </button>
          <button className={styles.headerButton} title="Hide Element">
            <Eye size={14} />
          </button>
          <button 
            className={styles.headerButton} 
            onClick={handleDelete}
            title="Delete Element"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className={styles.sidebarContent}>
        {/* Element Info */}
        <CollapsibleSection 
          title="Element Info" 
          icon={<Layers size={16} />}
        >
          <div className={styles.elementInfo}>
            <div className={styles.elementType}>
              {getElementDisplayName(selectedElement.type)}
            </div>
            <div className={styles.elementId}>
              ID: {selectedElement.id.slice(-8)}
            </div>
          </div>
        </CollapsibleSection>

        {/* Content Properties */}
        {['heading', 'paragraph', 'text', 'button'].includes(selectedElement.type) && (
          <CollapsibleSection 
            title="Content" 
            icon={<Type size={16} />}
          >
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Text Content</label>
              <textarea
                value={selectedElement.content}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                className={styles.textarea}
                placeholder="Enter your text here..."
              />
            </div>
          </CollapsibleSection>
        )}

        {/* Typography Properties */}
        {['heading', 'paragraph', 'text', 'button'].includes(selectedElement.type) && (
          <CollapsibleSection 
            title="Typography" 
            icon={<Type size={16} />}
          >
            {/* Font Size and Weight */}
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Font Size</label>
                <input
                  type="number"
                  value={selectedElement.styles?.fontSize?.replace('px', '') || ''}
                  onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                  className={styles.input}
                  placeholder="16"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Font Weight</label>
                <select
                  value={selectedElement.styles?.fontWeight || 'normal'}
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  className={styles.select}
                >
                  <option value="300">Light</option>
                  <option value="normal">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>
            </div>

            {/* Text Color */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Text Color</label>
              <div className={styles.colorField}>
                <div 
                  className={styles.colorPreview}
                  style={{ '--color': selectedElement.styles?.color || '#000000' } as React.CSSProperties}
                />
                <input
                  type="color"
                  value={selectedElement.styles?.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className={styles.colorInput}
                />
              </div>
            </div>

            {/* Text Alignment */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Text Alignment</label>
              <div className={styles.fieldGroupThree}>
                <button 
                  className={`btn btn--ghost ${selectedElement.styles?.textAlign === 'left' ? 'btn--primary' : ''}`}
                  onClick={() => handleStyleChange('textAlign', 'left')}
                  title="Align Left"
                >
                  <AlignLeft size={16} />
                </button>
                <button 
                  className={`btn btn--ghost ${selectedElement.styles?.textAlign === 'center' ? 'btn--primary' : ''}`}
                  onClick={() => handleStyleChange('textAlign', 'center')}
                  title="Align Center"
                >
                  <AlignCenter size={16} />
                </button>
                <button 
                  className={`btn btn--ghost ${selectedElement.styles?.textAlign === 'right' ? 'btn--primary' : ''}`}
                  onClick={() => handleStyleChange('textAlign', 'right')}
                  title="Align Right"
                >
                  <AlignRight size={16} />
                </button>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Layout & Position */}
        <CollapsibleSection 
          title="Layout" 
          icon={<Move size={16} />}
        >
          {/* Dimensions */}
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Width</label>
              <input
                type="text"
                value={selectedElement.styles?.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                className={styles.input}
                placeholder="auto"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Height</label>
              <input
                type="text"
                value={selectedElement.styles?.height || ''}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                className={styles.input}
                placeholder="auto"
              />
            </div>
          </div>

          {/* Display and Position */}
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Display</label>
              <select
                value={selectedElement.styles?.display || 'block'}
                onChange={(e) => handleStyleChange('display', e.target.value)}
                className={styles.select}
              >
                <option value="block">Block</option>
                <option value="inline-block">Inline Block</option>
                <option value="flex">Flex</option>
                <option value="inline-flex">Inline Flex</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Position</label>
              <select
                value={selectedElement.styles?.position || 'static'}
                onChange={(e) => handleStyleChange('position', e.target.value)}
                className={styles.select}
              >
                <option value="static">Static</option>
                <option value="relative">Relative</option>
                <option value="absolute">Absolute</option>
                <option value="fixed">Fixed</option>
                <option value="sticky">Sticky</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* Spacing Properties */}
        <CollapsibleSection 
          title="Spacing" 
          icon={<Ruler size={16} />}
        >
          <SpacingControl
            element={selectedElement}
            onUpdate={(updates) => {
              const currentStyles = selectedElement.styles || {};
              elementStore.updateElement(selectedElement.id, {
                styles: { ...currentStyles, ...updates }
              });
            }}
          />
        </CollapsibleSection>

        {/* Style Properties */}
        <CollapsibleSection 
          title="Appearance" 
          icon={<Palette size={16} />}
        >
          {/* Background */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Background Color</label>
            <div className={styles.colorField}>
              <div 
                className={styles.colorPreview}
                style={{ '--color': selectedElement.styles?.backgroundColor || '#ffffff' } as React.CSSProperties}
              />
              <input
                type="color"
                value={selectedElement.styles?.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className={styles.colorInput}
              />
            </div>
          </div>

          {/* Border */}
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Border Width</label>
              <input
                type="number"
                value={selectedElement.styles?.borderWidth?.replace('px', '') || ''}
                onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
                className={styles.input}
                placeholder="0"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Border Radius</label>
              <input
                type="number"
                value={selectedElement.styles?.borderRadius?.replace('px', '') || ''}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                className={styles.input}
                placeholder="0"
              />
            </div>
          </div>

          {/* Border Color */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Border Color</label>
            <div className={styles.colorField}>
              <div 
                className={styles.colorPreview}
                style={{ '--color': selectedElement.styles?.borderColor || '#e5e7eb' } as React.CSSProperties}
              />
              <input
                type="color"
                value={selectedElement.styles?.borderColor || '#e5e7eb'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className={styles.colorInput}
              />
            </div>
          </div>

          {/* Shadow */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Box Shadow</label>
            <select
              value={selectedElement.styles?.boxShadow || 'none'}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              className={styles.select}
            >
              <option value="none">None</option>
              <option value="0 1px 3px rgba(0,0,0,0.1)">Small</option>
              <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
              <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
              <option value="0 25px 50px rgba(0,0,0,0.25)">Extra Large</option>
            </select>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};