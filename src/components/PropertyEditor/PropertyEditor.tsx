import React, { useState } from 'react';
import { useBuilderStore } from '../../app/store';
import type { ElementStyles } from '../../app/store';
import { Accordion } from '../shared/Accordion';
import { FormField } from '../ui/FormField';
import { Select } from '../ui/Select';
import { 
  Settings, Trash2, Copy, Type, Layout, Palette, 
  Move3D, Layers, Eye, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, RotateCcw
} from 'lucide-react';
import styles from './PropertyEditor.module.scss';

export const PropertyEditor: React.FC = () => {
  const { 
    selectedElementId, 
    droppedElements, 
    updateElementStyles, 
    updateElementContent,
    deleteElement 
  } = useBuilderStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const findElementById = (elements: any[], id: string): any => {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (element.children) {
        const found = findElementById(element.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedElementId 
    ? findElementById(droppedElements, selectedElementId)
    : null;

  const handleStyleChange = (property: keyof ElementStyles, value: string) => {
    if (selectedElementId) {
      updateElementStyles(selectedElementId, { [property]: value });
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedElementId) {
      updateElementContent(selectedElementId, content);
    }
  };

  const handleDeleteElement = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  const getStyleValue = (property: keyof ElementStyles): string => {
    return selectedElement?.styles?.[property] || '';
  };

  const handleQuickStyle = (styles: Partial<ElementStyles>) => {
    if (selectedElementId) {
      updateElementStyles(selectedElementId, styles);
    }
  };

  const getElementDisplayName = (type: string): string => {
    const names: Record<string, string> = {
      heading: 'Heading',
      text: 'Text',
      paragraph: 'Paragraph',
      button: 'Button',
      image: 'Image',
      section: 'Section',
      container: 'Container',
      '1-column': '1 Column Layout',
      '2-column': '2 Column Layout',
      '3-column': '3 Column Layout',
      input: 'Input Field',
      textarea: 'Text Area',
      select: 'Dropdown',
      checkbox: 'Checkbox',
      radio: 'Radio Button'
    };
    return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!selectedElement) {
    return (
      <div className={styles.propertyEditor}>
        <div className={styles.propertyEditor__header}>
          <Settings size={16} />
          <h3>Properties</h3>
        </div>
        <div className={styles.propertyEditor__empty}>
          <Settings size={48} className={styles.propertyEditor__emptyIcon} />
          <h4>Select an element</h4>
          <p>Click on any element in the canvas to customize its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.propertyEditor}>
      <div className={styles.propertyEditor__header}>
        <Settings size={16} />
        <h3>Properties</h3>
      </div>
      
      <div className={styles.propertyEditor__content}>
        {/* Element Info & Actions */}
        <div className={styles.elementInfo}>
          <div className={styles.elementInfo__main}>
            <div className={styles.elementInfo__icon}>
              <Layers size={16} />
            </div>
            <div className={styles.elementInfo__details}>
              <div className={styles.elementInfo__name}>{getElementDisplayName(selectedElement.type)}</div>
              <div className={styles.elementInfo__type}>{selectedElement.type}</div>
            </div>
          </div>
          <div className={styles.elementInfo__actions}>
            <button className={styles.actionBtn} title="Duplicate" onClick={() => {}}>
              <Copy size={14} />
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtn__danger}`} title="Delete" onClick={handleDeleteElement}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <Accordion title="Content" icon={<Type size={16} />} defaultOpen={true}>
          <div className={styles.propertySection}>
            <FormField label="Text/Content">
              <textarea
                className={`${styles.propertyInput} ${styles.propertyTextarea}`}
                value={selectedElement.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter your content..."
                rows={3}
              />
            </FormField>
          </div>
        </Accordion>

        {/* Layout & Sizing */}
        <Accordion title="Layout & Sizing" icon={<Layout size={16} />}>
          <div className={styles.propertySection}>
            <div className={styles.propertyRow}>
              <FormField label="Width">
                <Select
                  options={[
                    { label: 'Auto', value: 'auto' },
                    { label: 'Full Width (100%)', value: '100%' },
                    { label: 'Half Width (50%)', value: '50%' },
                    { label: 'Custom', value: 'custom' }
                  ]}
                  value={getStyleValue('width') || 'auto'}
                  onChange={(value) => handleStyleChange('width', value === 'auto' ? '' : value)}
                />
              </FormField>
              <FormField label="Height">
                <Select
                  options={[
                    { label: 'Auto', value: 'auto' },
                    { label: 'Small (100px)', value: '100px' },
                    { label: 'Medium (200px)', value: '200px' },
                    { label: 'Large (300px)', value: '300px' },
                    { label: 'Custom', value: 'custom' }
                  ]}
                  value={getStyleValue('height') || 'auto'}
                  onChange={(value) => handleStyleChange('height', value === 'auto' ? '' : value)}
                />
              </FormField>
            </div>

            <FormField label="Display">
              <Select
                options={[
                  { label: 'Default', value: '' },
                  { label: 'Block', value: 'block' },
                  { label: 'Inline', value: 'inline' },
                  { label: 'Flex', value: 'flex' },
                  { label: 'Grid', value: 'grid' },
                  { label: 'Hidden', value: 'none' }
                ]}
                value={getStyleValue('display')}
                onChange={(value) => handleStyleChange('display', value)}
              />
            </FormField>
          </div>
        </Accordion>

        {/* Spacing */}
        <Accordion title="Spacing" icon={<Move3D size={16} />}>
          <div className={styles.propertySection}>
            <FormField label="Margin (Outside spacing)">
              <Select
                options={[
                  { label: 'None', value: '0' },
                  { label: 'Small', value: '8px' },
                  { label: 'Medium', value: '16px' },
                  { label: 'Large', value: '24px' },
                  { label: 'Extra Large', value: '32px' },
                  { label: 'Custom', value: 'custom' }
                ]}
                value={getStyleValue('margin') || '0'}
                onChange={(value) => handleStyleChange('margin', value === '0' ? '' : value)}
              />
            </FormField>

            <FormField label="Padding (Inside spacing)">
              <Select
                options={[
                  { label: 'None', value: '0' },
                  { label: 'Small', value: '8px' },
                  { label: 'Medium', value: '16px' },
                  { label: 'Large', value: '24px' },
                  { label: 'Extra Large', value: '32px' },
                  { label: 'Custom', value: 'custom' }
                ]}
                value={getStyleValue('padding') || '0'}
                onChange={(value) => handleStyleChange('padding', value === '0' ? '' : value)}
              />
            </FormField>
          </div>
        </Accordion>

        {/* Typography */}
        {(selectedElement.type === 'heading' || selectedElement.type === 'text' || selectedElement.type === 'paragraph' || selectedElement.type === 'button') && (
          <Accordion title="Typography" icon={<Type size={16} />}>
            <div className={styles.propertySection}>
              <div className={styles.propertyRow}>
                <FormField label="Font Size">
                  <Select
                    options={[
                      { label: 'Extra Small', value: '12px' },
                      { label: 'Small', value: '14px' },
                      { label: 'Normal', value: '16px' },
                      { label: 'Large', value: '18px' },
                      { label: 'Extra Large', value: '24px' },
                      { label: 'Huge', value: '32px' },
                      { label: 'Custom', value: 'custom' }
                    ]}
                    value={getStyleValue('fontSize') || '16px'}
                    onChange={(value) => handleStyleChange('fontSize', value)}
                  />
                </FormField>
                <FormField label="Font Weight">
                  <Select
                    options={[
                      { label: 'Light', value: '300' },
                      { label: 'Normal', value: '400' },
                      { label: 'Medium', value: '500' },
                      { label: 'Semi Bold', value: '600' },
                      { label: 'Bold', value: '700' },
                      { label: 'Extra Bold', value: '800' }
                    ]}
                    value={getStyleValue('fontWeight') || '400'}
                    onChange={(value) => handleStyleChange('fontWeight', value)}
                  />
                </FormField>
              </div>

              <FormField label="Text Alignment">
                <div className={styles.buttonGroup}>
                  <button 
                    className={`${styles.buttonGroup__btn} ${getStyleValue('textAlign') === 'left' ? styles.active : ''}`}
                    onClick={() => handleStyleChange('textAlign', 'left')}
                  >
                    <AlignLeft size={14} />
                  </button>
                  <button 
                    className={`${styles.buttonGroup__btn} ${getStyleValue('textAlign') === 'center' ? styles.active : ''}`}
                    onClick={() => handleStyleChange('textAlign', 'center')}
                  >
                    <AlignCenter size={14} />
                  </button>
                  <button 
                    className={`${styles.buttonGroup__btn} ${getStyleValue('textAlign') === 'right' ? styles.active : ''}`}
                    onClick={() => handleStyleChange('textAlign', 'right')}
                  >
                    <AlignRight size={14} />
                  </button>
                </div>
              </FormField>

              <FormField label="Text Color">
                <div className={styles.colorPickerGroup}>
                  <input 
                    type="color" 
                    className={styles.colorPicker} 
                    value={getStyleValue('color') || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                  />
                  <input 
                    type="text" 
                    className={styles.colorInput} 
                    placeholder="#000000" 
                    value={getStyleValue('color')}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                  />
                </div>
              </FormField>

              {/* Quick Font Styles */}
              <FormField label="Quick Styles">
                <div className={styles.buttonGroup}>
                  <button 
                    className={styles.buttonGroup__btn}
                    onClick={() => handleQuickStyle({ fontWeight: '700' })}
                  >
                    <Bold size={14} />
                  </button>
                  <button 
                    className={styles.buttonGroup__btn}
                    onClick={() => handleQuickStyle({ fontStyle: 'italic' })}
                  >
                    <Italic size={14} />
                  </button>
                  <button 
                    className={styles.buttonGroup__btn}
                    onClick={() => handleQuickStyle({ textDecoration: 'underline' })}
                  >
                    <Underline size={14} />
                  </button>
                </div>
              </FormField>
            </div>
          </Accordion>
        )}

        {/* Background & Border */}
        <Accordion title="Background & Border" icon={<Palette size={16} />}>
          <div className={styles.propertySection}>
            <FormField label="Background Color">
              <div className={styles.colorPickerGroup}>
                <input 
                  type="color" 
                  className={styles.colorPicker} 
                  value={getStyleValue('backgroundColor') || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
                <input 
                  type="text" 
                  className={styles.colorInput} 
                  placeholder="#ffffff" 
                  value={getStyleValue('backgroundColor')}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
                <button 
                  className={styles.resetBtn}
                  onClick={() => handleStyleChange('backgroundColor', '')}
                  title="Remove background"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </FormField>

            <div className={styles.propertyRow}>
              <FormField label="Border Width">
                <Select
                  options={[
                    { label: 'None', value: '0' },
                    { label: 'Thin (1px)', value: '1px' },
                    { label: 'Medium (2px)', value: '2px' },
                    { label: 'Thick (4px)', value: '4px' },
                    { label: 'Extra Thick (8px)', value: '8px' }
                  ]}
                  value={getStyleValue('borderWidth') || '0'}
                  onChange={(value) => handleStyleChange('borderWidth', value)}
                />
              </FormField>
              <FormField label="Border Style">
                <Select
                  options={[
                    { label: 'Solid', value: 'solid' },
                    { label: 'Dashed', value: 'dashed' },
                    { label: 'Dotted', value: 'dotted' },
                    { label: 'Double', value: 'double' }
                  ]}
                  value={getStyleValue('borderStyle') || 'solid'}
                  onChange={(value) => handleStyleChange('borderStyle', value)}
                />
              </FormField>
            </div>

            <FormField label="Border Color">
              <div className={styles.colorPickerGroup}>
                <input 
                  type="color" 
                  className={styles.colorPicker} 
                  value={getStyleValue('borderColor') || '#000000'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                />
                <input 
                  type="text" 
                  className={styles.colorInput} 
                  placeholder="#000000" 
                  value={getStyleValue('borderColor')}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                />
              </div>
            </FormField>

            <FormField label="Border Radius (Rounded corners)">
              <Select
                options={[
                  { label: 'None (Square)', value: '0' },
                  { label: 'Small', value: '4px' },
                  { label: 'Medium', value: '8px' },
                  { label: 'Large', value: '16px' },
                  { label: 'Extra Large', value: '24px' },
                  { label: 'Fully Rounded', value: '50px' }
                ]}
                value={getStyleValue('borderRadius') || '0'}
                onChange={(value) => handleStyleChange('borderRadius', value)}
              />
            </FormField>
          </div>
        </Accordion>

        {/* Effects */}
        <Accordion title="Effects" icon={<Eye size={16} />}>
          <div className={styles.propertySection}>
            <FormField label="Opacity">
              <div className={styles.sliderGroup}>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  className={styles.slider}
                  value={parseFloat(getStyleValue('opacity')) || 1}
                  onChange={(e) => handleStyleChange('opacity', e.target.value)}
                />
                <span className={styles.sliderValue}>{Math.round((parseFloat(getStyleValue('opacity')) || 1) * 100)}%</span>
              </div>
            </FormField>

            <FormField label="Shadow">
              <Select
                options={[
                  { label: 'None', value: '' },
                  { label: 'Small', value: '0 1px 3px rgba(0,0,0,0.12)' },
                  { label: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)' },
                  { label: 'Large', value: '0 10px 15px rgba(0,0,0,0.1)' },
                  { label: 'Extra Large', value: '0 25px 50px rgba(0,0,0,0.25)' }
                ]}
                value={getStyleValue('boxShadow') || ''}
                onChange={(value) => handleStyleChange('boxShadow', value)}
              />
            </FormField>
          </div>
        </Accordion>

        {/* Advanced Options Toggle */}
        <div className={styles.advancedToggle}>
          <button 
            className={styles.advancedToggle__btn}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            Advanced Options
            <span className={`arrow ${showAdvanced ? 'open' : ''}`}>▼</span>
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <Accordion title="Advanced CSS" icon={<Settings size={16} />}>
            <div className={styles.propertySection}>
              <FormField label="Custom CSS">
                <textarea
                  className={`${styles.propertyInput} ${styles.propertyTextarea} ${styles.codeInput}`}
                  value={getStyleValue('customCSS')}
                  onChange={(e) => handleStyleChange('customCSS', e.target.value)}
                  placeholder="/* Add custom CSS properties */&#10;color: #333;&#10;font-family: Arial;"
                  rows={6}
                />
              </FormField>
              <div className={styles.helpText}>
                Add custom CSS properties for advanced styling. Use standard CSS syntax.
              </div>
            </div>
          </Accordion>
        )}
      </div>
    </div>
  );
};