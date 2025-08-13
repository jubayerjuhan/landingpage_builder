import React, { useState, useEffect } from 'react';
import type { AnyComponent } from '../../../types/components';
import { ComponentType } from '../../../types/components';
import styles from './PropertyEditor.module.scss';

interface PropertyEditorProps {
  component: AnyComponent;
  onUpdate: (updatedComponent: AnyComponent) => void;
  onDelete: (componentId: string) => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdate,
  onDelete
}) => {
  const [localComponent, setLocalComponent] = useState<AnyComponent>(component);

  useEffect(() => {
    setLocalComponent(component);
  }, [component]);

  const handleStyleChange = (property: string, value: string) => {
    const updatedComponent = {
      ...localComponent,
      styles: {
        ...localComponent.styles,
        [property]: value
      }
    };
    setLocalComponent(updatedComponent);
    onUpdate(updatedComponent);
  };

  const handlePropertyChange = (property: string, value: any) => {
    const updatedComponent = {
      ...localComponent,
      [property]: value
    };
    setLocalComponent(updatedComponent);
    onUpdate(updatedComponent);
  };

  const renderCommonStyleProperties = () => (
    <>
      <div className={styles.propertyGroup}>
        <label className={styles.propertyLabel}>Background Color</label>
        <input
          type="color"
          className={styles.colorInput}
          value={localComponent.styles.backgroundColor || '#ffffff'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
        />
      </div>

      <div className={styles.propertyGroup}>
        <label className={styles.propertyLabel}>Text Color</label>
        <input
          type="color"
          className={styles.colorInput}
          value={localComponent.styles.color || '#333333'}
          onChange={(e) => handleStyleChange('color', e.target.value)}
        />
      </div>

      <div className={styles.propertyGroup}>
        <label className={styles.propertyLabel}>Padding</label>
        <input
          type="text"
          className={styles.propertyInput}
          value={localComponent.styles.padding || ''}
          onChange={(e) => handleStyleChange('padding', e.target.value)}
          placeholder="e.g., 16px or 1rem"
        />
      </div>

      <div className={styles.propertyGroup}>
        <label className={styles.propertyLabel}>Margin</label>
        <input
          type="text"
          className={styles.propertyInput}
          value={localComponent.styles.margin || ''}
          onChange={(e) => handleStyleChange('margin', e.target.value)}
          placeholder="e.g., 8px or 0.5rem"
        />
      </div>

      <div className={styles.propertyGroup}>
        <label className={styles.propertyLabel}>Border Radius</label>
        <input
          type="text"
          className={styles.propertyInput}
          value={localComponent.styles.borderRadius || ''}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          placeholder="e.g., 8px"
        />
      </div>

      <div className={styles.propertyGroup}>
        <label className={styles.propertyLabel}>Font Size</label>
        <input
          type="text"
          className={styles.propertyInput}
          value={localComponent.styles.fontSize || ''}
          onChange={(e) => handleStyleChange('fontSize', e.target.value)}
          placeholder="e.g., 16px"
        />
      </div>

      <div className={styles.propertyGroup}>
        <label className={styles.propertyLabel}>Width</label>
        <input
          type="text"
          className={styles.propertyInput}
          value={localComponent.styles.width || ''}
          onChange={(e) => handleStyleChange('width', e.target.value)}
          placeholder="e.g., 300px or 100%"
        />
      </div>

      <div className={styles.propertyGroup}>
        <label className={styles.propertyLabel}>Height</label>
        <input
          type="text"
          className={styles.propertyInput}
          value={localComponent.styles.height || ''}
          onChange={(e) => handleStyleChange('height', e.target.value)}
          placeholder="e.g., 200px or auto"
        />
      </div>
    </>
  );

  const renderComponentSpecificProperties = () => {
    switch (localComponent.type) {
      case ComponentType.BUTTON:
        return (
          <>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Button Text</label>
              <input
                type="text"
                className={styles.propertyInput}
                value={localComponent.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Variant</label>
              <select
                className={styles.propertySelect}
                value={localComponent.variant || 'primary'}
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Size</label>
              <select
                className={styles.propertySelect}
                value={localComponent.size || 'md'}
                onChange={(e) => handlePropertyChange('size', e.target.value)}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </>
        );

      case ComponentType.TEXT:
        return (
          <div className={styles.propertyGroup}>
            <label className={styles.propertyLabel}>Text Content</label>
            <textarea
              className={styles.propertyTextarea}
              value={localComponent.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
              placeholder="Enter text content"
            />
          </div>
        );

      case ComponentType.HEADING:
        return (
          <>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Heading Text</label>
              <input
                type="text"
                className={styles.propertyInput}
                value={localComponent.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                placeholder="Heading text"
              />
            </div>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Heading Level</label>
              <select
                className={styles.propertySelect}
                value={localComponent.level || 2}
                onChange={(e) => handlePropertyChange('level', parseInt(e.target.value))}
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
                <option value={5}>H5</option>
                <option value={6}>H6</option>
              </select>
            </div>
          </>
        );

      case ComponentType.IMAGE:
        return (
          <>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Image URL</label>
              <input
                type="url"
                className={styles.propertyInput}
                value={localComponent.src || ''}
                onChange={(e) => handlePropertyChange('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Alt Text</label>
              <input
                type="text"
                className={styles.propertyInput}
                value={localComponent.alt || ''}
                onChange={(e) => handlePropertyChange('alt', e.target.value)}
                placeholder="Image description"
              />
            </div>
          </>
        );

      case ComponentType.INPUT:
        return (
          <>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Placeholder</label>
              <input
                type="text"
                className={styles.propertyInput}
                value={localComponent.placeholder || ''}
                onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                placeholder="Placeholder text"
              />
            </div>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Input Type</label>
              <select
                className={styles.propertySelect}
                value={localComponent.inputType || 'text'}
                onChange={(e) => handlePropertyChange('inputType', e.target.value)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.propertyEditor}>
      <h3 className={styles.editorTitle}>
        Edit {localComponent.type.charAt(0).toUpperCase() + localComponent.type.slice(1)}
      </h3>

      {renderComponentSpecificProperties()}
      {renderCommonStyleProperties()}

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.actionButton} ${styles.danger}`}
          onClick={() => onDelete(localComponent.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};