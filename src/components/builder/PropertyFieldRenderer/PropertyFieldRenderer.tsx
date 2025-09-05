import React from 'react';
import { PropertyFieldType, type PropertyField } from '../../../types/builder';
import { FormField } from '../../ui/FormField';
import { Select } from '../../ui/Select';
import { 
  Type, 
  Palette, 
  Box, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import styles from './PropertyFieldRenderer.module.scss';

interface PropertyFieldRendererProps {
  field: PropertyField;
  value: any;
  onChange: (value: any) => void;
  label?: string;
  elementType?: string;
}

export const PropertyFieldRenderer: React.FC<PropertyFieldRendererProps> = ({
  field,
  value,
  onChange,
  label
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className={styles.input}
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <textarea
            className={styles.textarea}
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={styles.input}
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'select':
        return (
          <Select
            options={field.options || []}
            value={value || field.defaultValue || ''}
            onChange={onChange}
          />
        );

      case 'color':
        return (
          <div className={styles.colorField}>
            <input
              type="color"
              className={styles.colorPicker}
              value={value || field.defaultValue || '#000000'}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              className={styles.colorInput}
              value={value || field.defaultValue || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
            />
          </div>
        );

      case 'checkbox':
        return (
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={value || field.defaultValue || false}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        );

      case 'range':
        return (
          <div className={styles.sliderField}>
            <input
              type="range"
              className={styles.slider}
              value={value || field.defaultValue || field.min || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step}
            />
            <span className={styles.sliderValue}>
              {value || field.defaultValue || field.min || 0}
              {field.unit || ''}
            </span>
          </div>
        );

      case 'spacing':
        return (
          <div className={styles.spacingField}>
            <div className={styles.spacingInputs}>
              <input
                type="number"
                className={styles.spacingInput}
                placeholder="Top"
                value={value?.top || ''}
                onChange={(e) => onChange({ ...value, top: e.target.value })}
              />
              <input
                type="number"
                className={styles.spacingInput}
                placeholder="Right"
                value={value?.right || ''}
                onChange={(e) => onChange({ ...value, right: e.target.value })}
              />
              <input
                type="number"
                className={styles.spacingInput}
                placeholder="Bottom"
                value={value?.bottom || ''}
                onChange={(e) => onChange({ ...value, bottom: e.target.value })}
              />
              <input
                type="number"
                className={styles.spacingInput}
                placeholder="Left"
                value={value?.left || ''}
                onChange={(e) => onChange({ ...value, left: e.target.value })}
              />
            </div>
            <button
              className={styles.spacingLink}
              onClick={() => {
                const val = value?.top || '0';
                onChange({ top: val, right: val, bottom: val, left: val });
              }}
              title="Link all values"
            >
              🔗
            </button>
          </div>
        );

      case 'radio':
        return (
          <div className={styles.buttonGroup}>
            {field.options?.map((option) => (
              <button
                key={option.value}
                className={`${styles.buttonGroupBtn} ${value === option.value ? styles.active : ''}`}
                onClick={() => onChange(option.value)}
                title={option.label}
              >
                {option.icon || option.label}
              </button>
            ))}
          </div>
        );

      case 'icon':
        return (
          <div className={styles.iconSelect}>
            {field.options?.map((option) => (
              <button
                key={option.value}
                className={`${styles.iconOption} ${value === option.value ? styles.active : ''}`}
                onClick={() => onChange(option.value)}
                title={option.label}
              >
                <span className={styles.iconPreview}>{option.icon}</span>
              </button>
            ))}
          </div>
        );

      case 'font_family':
        return (
          <Select
            options={[
              { label: 'System Default', value: 'system-ui' },
              { label: 'Sans Serif', value: 'sans-serif' },
              { label: 'Serif', value: 'serif' },
              { label: 'Monospace', value: 'monospace' },
              { label: 'Arial', value: 'Arial' },
              { label: 'Helvetica', value: 'Helvetica' },
              { label: 'Times New Roman', value: 'Times New Roman' },
              { label: 'Georgia', value: 'Georgia' },
              { label: 'Courier New', value: 'Courier New' },
              { label: 'Verdana', value: 'Verdana' }
            ]}
            value={value || field.defaultValue || 'system-ui'}
            onChange={onChange}
          />
        );

      case 'border':
        return (
          <Select
            options={[
              { label: 'None', value: 'none' },
              { label: 'Solid', value: 'solid' },
              { label: 'Dashed', value: 'dashed' },
              { label: 'Dotted', value: 'dotted' },
              { label: 'Double', value: 'double' },
              { label: 'Groove', value: 'groove' },
              { label: 'Ridge', value: 'ridge' },
              { label: 'Inset', value: 'inset' },
              { label: 'Outset', value: 'outset' }
            ]}
            value={value || field.defaultValue || 'none'}
            onChange={onChange}
          />
        );

      case 'shadow':
        return (
          <Select
            options={[
              { label: 'None', value: 'none' },
              { label: 'Small', value: '0 1px 3px rgba(0,0,0,0.12)' },
              { label: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)' },
              { label: 'Large', value: '0 10px 15px rgba(0,0,0,0.1)' },
              { label: 'Extra Large', value: '0 20px 25px rgba(0,0,0,0.1)' },
              { label: 'Inner', value: 'inset 0 2px 4px rgba(0,0,0,0.06)' }
            ]}
            value={value || field.defaultValue || 'none'}
            onChange={onChange}
          />
        );

      case 'code':
        return (
          <textarea
            className={`${styles.textarea} ${styles.codeInput}`}
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || '/* Custom CSS */'}
            rows={field.rows || 6}
            spellCheck={false}
          />
        );

      default:
        return (
          <input
            type="text"
            className={styles.input}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <FormField label={label || field.label}>
      {renderField()}
      {field.helpText && (
        <div className={styles.helpText}>{field.helpText}</div>
      )}
    </FormField>
  );
};