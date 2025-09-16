import React, { useEffect, useRef, useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import useElementStore from '../../../stores/elementStore';

interface ButtonProps {
  element: BuilderElement;
}

export const Button: React.FC<ButtonProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const { updateElement } = useElementStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLSpanElement>(null);

  const variant = (element.properties?.component as { variant?: string })?.variant || 'primary';
  const size = (element.properties?.component as { size?: string })?.size || 'md';

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

  const buttonStyles: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size as keyof typeof sizeStyles],
    ...variantStyles[variant as keyof typeof variantStyles],
    ...styles,
  };

  const text = content.text || 'Click me';
  const href = content.href || '#';

  const handleClick = (e: React.MouseEvent) => {
    if (previewMode === 'edit') {
      e.preventDefault();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (previewMode === 'preview') return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    const newText = editableRef.current?.innerText?.trim() || text;
    updateElement(element.id, { content: newText });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || (e.key === 'Enter' && e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const textData = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, textData);
  };

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  // Use anchor tag if href is provided, otherwise button
  const Component = href && href !== '#' ? 'a' : 'button';

  return (
    <ElementWrapper element={element}>
      <Component
        style={{
          ...buttonStyles,
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}
        href={Component === 'a' ? href : undefined}
        target={Component === 'a' && content.target ? content.target : undefined}
        onClick={handleClick}
        onMouseEnter={e => {
          if (previewMode === 'preview') {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(-1px)';
            target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={e => {
          if (previewMode === 'preview') {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = 'none';
          }
        }}
        title={previewMode === 'edit' ? 'Double-click to edit' : undefined}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <span
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            style={{ outline: '1px dashed rgba(84, 87, 255, 0.5)', outlineOffset: '0px' }}
          >
            {text}
          </span>
        ) : (
          <span>{text}</span>
        )}
      </Component>
    </ElementWrapper>
  );
};
