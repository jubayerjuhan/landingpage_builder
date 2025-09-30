import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface ButtonProps {
  element: BuilderElement;
}

export const Button: React.FC<ButtonProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);

  const variant = (element.properties?.component as any)?.variant || 'primary';
  const size = (element.properties?.component as any)?.size || 'md';
  
  // Base button styles
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderRadius: '6px',
    border: 'none',
    cursor: previewMode === 'preview' ? 'pointer' : 'default',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  };
  
  // Size variants
  const sizeStyles = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };
  
  // Color variants
  const variantStyles = {
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: '1px solid #3b82f6',
    },
    secondary: {
      backgroundColor: '#6b7280',
      color: 'white',
      border: '1px solid #6b7280',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#3b82f6',
      border: '1px solid #3b82f6',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#374151',
      border: '1px solid transparent',
    },
  };
  
  // Extract spacing from properties
  const spacing = element.properties?.spacing;
  const spacingStyles: React.CSSProperties = {};

  // Apply padding from properties
  if (spacing?.padding) {
    spacingStyles.padding = spacing.padding;
  } else if (spacing?.paddingTop || spacing?.paddingRight || spacing?.paddingBottom || spacing?.paddingLeft) {
    spacingStyles.paddingTop = spacing.paddingTop || '0';
    spacingStyles.paddingRight = spacing.paddingRight || '0';
    spacingStyles.paddingBottom = spacing.paddingBottom || '0';
    spacingStyles.paddingLeft = spacing.paddingLeft || '0';
  }

  // Apply margin from properties
  if (spacing?.margin) {
    spacingStyles.margin = spacing.margin;
  } else if (spacing?.marginTop || spacing?.marginRight || spacing?.marginBottom || spacing?.marginLeft) {
    spacingStyles.marginTop = spacing.marginTop || '0';
    spacingStyles.marginRight = spacing.marginRight || '0';
    spacingStyles.marginBottom = spacing.marginBottom || '0';
    spacingStyles.marginLeft = spacing.marginLeft || '0';
  }

  const buttonStyles: React.CSSProperties = {
    ...baseStyles,
    ...styles, // Apply custom styles first
    ...sizeStyles[size as keyof typeof sizeStyles], // Then size styles
    ...variantStyles[variant as keyof typeof variantStyles], // Then variant styles (this ensures variant colors override custom styles)
    ...spacingStyles, // Finally apply spacing from properties
  };
  
  // Use values from getElementContent (which handles all the complex extraction logic)
  const text = content.text || 'Click me';
  const href = content.href || '#';
  
  const handleClick = (e: React.MouseEvent) => {
    if (previewMode === 'edit') {
      e.preventDefault();
    }
  };
  
  // Use anchor tag if href is provided, otherwise button
  const Component = href && href !== '#' ? 'a' : 'button';
  
  return (
    <ElementWrapper element={element}>
      <Component
        style={buttonStyles}
        href={Component === 'a' ? href : undefined}
        target={Component === 'a' && content.target ? content.target : undefined}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (previewMode === 'preview') {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(-1px)';
            target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (previewMode === 'preview') {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = 'none';
          }
        }}
      >
        {text}
      </Component>
    </ElementWrapper>
  );
};