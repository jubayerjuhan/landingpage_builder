import React, { useEffect, useRef, useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import useElementStore from '../../../stores/elementStore';

interface LinkProps {
  element: BuilderElement;
}

export const Link: React.FC<LinkProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const { updateElement } = useElementStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLSpanElement>(null);

  const linkStyles: React.CSSProperties = {
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: previewMode === 'preview' ? 'pointer' : 'default',
    transition: 'color 0.2s ease',
    ...styles,
  };

  const text = content.text || 'Link text';
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

  return (
    <ElementWrapper element={element}>
      <a
        href={href}
        target={content.target}
        style={{
          ...linkStyles,
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        title={previewMode === 'edit' ? 'Double-click to edit' : undefined}
        onMouseEnter={e => {
          if (previewMode === 'preview') {
            (e.target as HTMLElement).style.color = '#1d4ed8';
          }
        }}
        onMouseLeave={e => {
          if (previewMode === 'preview') {
            (e.target as HTMLElement).style.color = styles.color || '#3b82f6';
          }
        }}
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
      </a>
    </ElementWrapper>
  );
};
