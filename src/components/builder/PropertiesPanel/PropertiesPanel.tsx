import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Type, 
  Palette, 
  Box, 
  ChevronDown,
  Copy,
  Trash2,
  Move,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Eye
} from 'lucide-react';
import useElementStore from '../../../stores/elementStore';
import useCanvasStore from '../../../stores/canvasStore';
import { PropertyFieldRenderer } from '../PropertyFieldRenderer/PropertyFieldRenderer';
import { COMPONENT_DEFINITIONS } from '../../definitions/componentDefinitions';
import type { 
  BuilderElement, 
  ComponentType,
  PropertySchema,
  ViewportMode 
} from '../../../types/builder';
import styles from './PropertiesPanel.module.scss';

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
      {!isCollapsed && (
        <div className={styles.sectionContent}>
          {children}
        </div>
      )}
    </div>
  );
};

export const PropertiesPanel: React.FC = () => {
  const { selectedElementIds, elements, updateElement, deleteElement, duplicateElement } = useElementStore();
  const { viewportMode, setViewportMode } = useCanvasStore();
  const [activeViewport, setActiveViewport] = useState<ViewportMode>(viewportMode);
  
  // Get the first selected element (single selection for now)
  const selectedElementId = selectedElementIds.length > 0 ? selectedElementIds[0] : null;
  const selectedElement = selectedElementId 
    ? elements.find(el => el.id === selectedElementId)
    : null;

  // Get component definition for the selected element
  const componentDef = selectedElement 
    ? COMPONENT_DEFINITIONS[selectedElement.type as ComponentType]
    : null;

  useEffect(() => {
    setActiveViewport(viewportMode);
  }, [viewportMode]);

  const handlePropertyChange = (groupKey: string, fieldKey: string, value: any) => {
    if (!selectedElement) return;

    // Handle special cases
    if (groupKey === 'content' && fieldKey === 'text') {
      // Update content directly
      updateElement(selectedElement.id, { content: value });
    } else {
      // Update properties
      const currentProps = selectedElement.properties || {};
      updateElement(selectedElement.id, {
        properties: {
          ...currentProps,
          [fieldKey]: value
        }
      });
    }
  };

  const handleStyleChange = (groupKey: string, fieldKey: string, value: any) => {
    if (!selectedElement) return;

    const currentStyles = selectedElement.styles || {};
    const viewportStyles = currentStyles[activeViewport] || {};
    
    updateElement(selectedElement.id, {
      styles: {
        ...currentStyles,
        [activeViewport]: {
          ...viewportStyles,
          [fieldKey]: value
        }
      }
    });
  };

  const handleDeleteElement = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  const handleDuplicateElement = () => {
    if (selectedElementId) {
      duplicateElement(selectedElementId);
    }
  };

  const getPropertyValue = (groupKey: string, fieldKey: string) => {
    if (!selectedElement) return undefined;

    // Special case for content
    if (groupKey === 'content' && fieldKey === 'text') {
      return selectedElement.content;
    }

    // Check styles for style-related properties
    const styleGroups = ['appearance', 'spacing', 'typography', 'layout', 'effects'];
    if (styleGroups.includes(groupKey)) {
      const currentStyles = selectedElement.styles || {};
      const viewportStyles = currentStyles[activeViewport] || {};
      return viewportStyles[fieldKey];
    }

    // Otherwise check properties
    return selectedElement.properties?.[fieldKey];
  };

  const renderPropertyGroup = (groupKey: string, group: any) => {
    const Icon = group.icon || Settings;
    
    return (
      <CollapsibleSection
        key={groupKey}
        title={group.label}
        icon={<Icon size={16} />}
        defaultCollapsed={group.defaultCollapsed}
      >
        <div className={styles.propertyGroup}>
          {Object.entries(group.fields || {}).map(([fieldKey, field]: [string, any]) => {
            const value = getPropertyValue(groupKey, fieldKey);
            const isStyleField = ['appearance', 'spacing', 'typography', 'layout', 'effects'].includes(groupKey);
            
            return (
              <PropertyFieldRenderer
                key={fieldKey}
                field={field}
                value={value}
                onChange={(val) => {
                  if (isStyleField) {
                    handleStyleChange(groupKey, fieldKey, val);
                  } else {
                    handlePropertyChange(groupKey, fieldKey, val);
                  }
                }}
                label={field.label}
                elementType={selectedElement?.type}
              />
            );
          })}
        </div>
      </CollapsibleSection>
    );
  };

  if (!selectedElement || !componentDef) {
    return (
      <div className={styles.propertiesPanel}>
        <div className={styles.header}>
          <Settings size={16} />
          <h3>Properties</h3>
        </div>
        <div className={styles.empty}>
          <Layers size={48} className={styles.emptyIcon} />
          <h4>No Element Selected</h4>
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.propertiesPanel}>
      <div className={styles.header}>
        <Settings size={16} />
        <h3>Properties</h3>
      </div>
      
      <div className={styles.content}>
        {/* Viewport Selector */}
        <div className={styles.viewportSelector}>
          <button
            className={`${styles.viewportBtn} ${activeViewport === 'desktop' ? styles.active : ''}`}
            onClick={() => {
              setActiveViewport('desktop');
              setViewportMode('desktop');
            }}
            title="Desktop"
          >
            <Monitor size={16} />
          </button>
          <button
            className={`${styles.viewportBtn} ${activeViewport === 'tablet' ? styles.active : ''}`}
            onClick={() => {
              setActiveViewport('tablet');
              setViewportMode('tablet');
            }}
            title="Tablet"
          >
            <Tablet size={16} />
          </button>
          <button
            className={`${styles.viewportBtn} ${activeViewport === 'mobile' ? styles.active : ''}`}
            onClick={() => {
              setActiveViewport('mobile');
              setViewportMode('mobile');
            }}
            title="Mobile"
          >
            <Smartphone size={16} />
          </button>
        </div>

        {/* Element Info & Actions */}
        <div className={styles.elementInfo}>
          <div className={styles.elementInfoMain}>
            <div className={styles.elementIcon}>
              {React.createElement(componentDef.icon || Layers, { size: 16 })}
            </div>
            <div className={styles.elementDetails}>
              <div className={styles.elementName}>{componentDef.name}</div>
              <div className={styles.elementType}>{selectedElement.type}</div>
            </div>
          </div>
          <div className={styles.elementActions}>
            <button 
              className={styles.actionBtn} 
              title="Duplicate" 
              onClick={handleDuplicateElement}
            >
              <Copy size={14} />
            </button>
            <button 
              className={`${styles.actionBtn} ${styles.danger}`} 
              title="Delete" 
              onClick={handleDeleteElement}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Dynamic Property Groups from Component Definition */}
        {componentDef.properties && Object.entries(componentDef.properties).map(([groupKey, group]) => 
          renderPropertyGroup(groupKey, group)
        )}

        {/* Visibility Control */}
        <CollapsibleSection
          title="Visibility"
          icon={<Eye size={16} />}
          defaultCollapsed={true}
        >
          <div className={styles.propertyGroup}>
            <PropertyFieldRenderer
              field={{
                type: 'toggle',
                label: 'Visible',
                defaultValue: true
              }}
              value={selectedElement.properties?.visible !== false}
              onChange={(val) => handlePropertyChange('visibility', 'visible', val)}
              label="Show Element"
            />
            <div className={styles.viewportVisibility}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedElement.properties?.hideOnMobile !== true}
                  onChange={(e) => handlePropertyChange('visibility', 'hideOnMobile', !e.target.checked)}
                />
                <span>Show on Mobile</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedElement.properties?.hideOnTablet !== true}
                  onChange={(e) => handlePropertyChange('visibility', 'hideOnTablet', !e.target.checked)}
                />
                <span>Show on Tablet</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedElement.properties?.hideOnDesktop !== true}
                  onChange={(e) => handlePropertyChange('visibility', 'hideOnDesktop', !e.target.checked)}
                />
                <span>Show on Desktop</span>
              </label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Advanced Settings */}
        <CollapsibleSection
          title="Advanced"
          icon={<Settings size={16} />}
          defaultCollapsed={true}
        >
          <div className={styles.propertyGroup}>
            <PropertyFieldRenderer
              field={{
                type: 'text',
                label: 'Element ID',
                placeholder: 'custom-id'
              }}
              value={selectedElement.properties?.customId || ''}
              onChange={(val) => handlePropertyChange('advanced', 'customId', val)}
              label="Custom ID"
            />
            <PropertyFieldRenderer
              field={{
                type: 'text',
                label: 'CSS Classes',
                placeholder: 'class1 class2'
              }}
              value={selectedElement.properties?.customClasses || ''}
              onChange={(val) => handlePropertyChange('advanced', 'customClasses', val)}
              label="Additional Classes"
            />
            <PropertyFieldRenderer
              field={{
                type: 'customCss',
                label: 'Custom CSS',
                placeholder: '/* Add custom styles */',
                rows: 4
              }}
              value={selectedElement.properties?.customCss || ''}
              onChange={(val) => handlePropertyChange('advanced', 'customCss', val)}
              label="Custom CSS"
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};