import React from 'react';
import { Button } from '../../ui';
import type { AnyComponent } from '../../../types/components';
import { ComponentType } from '../../../types/components';

interface ComponentRendererProps {
  component: AnyComponent;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  onSelect
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  const baseStyle: React.CSSProperties = {
    outline: isSelected ? '2px solid var(--color-primary)' : 'none',
    outlineOffset: '2px'
  };

  switch (component.type) {
    case ComponentType.BUTTON:
      return (
        <div style={baseStyle} onClick={handleClick}>
          <Button
            variant={component.variant || 'primary'}
            size={component.size || 'md'}
            customStyles={component.styles}
            disabled={component.disabled}
          >
            {component.content || 'Button'}
          </Button>
        </div>
      );

    case ComponentType.TEXT:
      return (
        <div style={baseStyle} onClick={handleClick}>
          <div
            style={{
              ...component.styles,
              backgroundColor: component.styles?.backgroundColor,
              padding: component.styles?.padding || '8px',
              margin: component.styles?.margin,
              borderRadius: component.styles?.borderRadius,
              fontSize: component.styles?.fontSize || '16px',
              fontWeight: component.styles?.fontWeight,
              color: component.styles?.color || '#333',
              width: component.styles?.width,
              height: component.styles?.height
            }}
          >
            {component.content || 'Text content'}
          </div>
        </div>
      );

    case ComponentType.HEADING: {
      const level = component.level || 2;
      const common = (
        <div
          style={{
            ...component.styles,
            backgroundColor: component.styles?.backgroundColor,
            padding: component.styles?.padding || '8px',
            margin: component.styles?.margin || '0 0 16px 0',
            borderRadius: component.styles?.borderRadius,
            fontSize: component.styles?.fontSize,
            fontWeight: component.styles?.fontWeight || '600',
            color: component.styles?.color || '#333',
            width: component.styles?.width,
            height: component.styles?.height
          }}
        >
          {component.content || 'Heading'}
        </div>
      );
      return (
        <div style={baseStyle} onClick={handleClick}>
          {level === 1 && <h1>{common}</h1>}
          {level === 2 && <h2>{common}</h2>}
          {level === 3 && <h3>{common}</h3>}
          {level === 4 && <h4>{common}</h4>}
          {level === 5 && <h5>{common}</h5>}
          {level === 6 && <h6>{common}</h6>}
        </div>
      );
    }

    case ComponentType.IMAGE:
      return (
        <div style={baseStyle} onClick={handleClick}>
          <img
            src={component.src || 'https://via.placeholder.com/200x150?text=Image'}
            alt={component.alt || 'Image'}
            style={{
              ...component.styles,
              backgroundColor: component.styles?.backgroundColor,
              padding: component.styles?.padding,
              margin: component.styles?.margin,
              borderRadius: component.styles?.borderRadius,
              width: component.styles?.width || '200px',
              height: component.styles?.height || '150px',
              objectFit: 'cover'
            }}
          />
        </div>
      );

    case ComponentType.INPUT:
      return (
        <div style={baseStyle} onClick={handleClick}>
          <input
            type={component.inputType || 'text'}
            placeholder={component.placeholder || 'Enter text...'}
            value={component.value || ''}
            readOnly
            style={{
              ...component.styles,
              backgroundColor: component.styles?.backgroundColor || '#fff',
              padding: component.styles?.padding || '8px 12px',
              margin: component.styles?.margin,
              borderRadius: component.styles?.borderRadius || '4px',
              fontSize: component.styles?.fontSize || '16px',
              fontWeight: component.styles?.fontWeight,
              color: component.styles?.color || '#333',
              width: component.styles?.width || '200px',
              height: component.styles?.height,
              border: '1px solid #ccc'
            }}
          />
        </div>
      );

    case ComponentType.CONTAINER:
      return (
        <div style={baseStyle} onClick={handleClick}>
          <div
            style={{
              ...component.styles,
              backgroundColor: component.styles?.backgroundColor || '#f8f9fa',
              padding: component.styles?.padding || '16px',
              margin: component.styles?.margin,
              borderRadius: component.styles?.borderRadius || '8px',
              fontSize: component.styles?.fontSize,
              fontWeight: component.styles?.fontWeight,
              color: component.styles?.color,
              width: component.styles?.width || '100%',
              height: component.styles?.height || '100px',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px'
            }}
          >
            {component.children?.length ? (
              component.children.map((child) => (
                <ComponentRenderer
                  key={child.id}
                  component={child as any}
                />
              ))
            ) : (
              <span style={{ color: '#666', fontSize: '14px' }}>
                Drop components here
              </span>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div style={baseStyle} onClick={handleClick}>
          <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
            Unknown component: {component.type}
          </div>
        </div>
      );
  }
};