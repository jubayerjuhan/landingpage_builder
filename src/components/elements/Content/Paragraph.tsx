import React, { useState, useRef, useEffect } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import useElementStore from '../../../stores/elementStore';

interface ParagraphProps {
  element: BuilderElement;
}

export const Paragraph: React.FC<ParagraphProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const editableRef = useRef<HTMLParagraphElement>(null);
  
  const { viewportMode, previewMode } = useCanvasStore();
  const { updateElement } = useElementStore();
  
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const paragraphStyles: React.CSSProperties = {
    margin: '0 0 1rem 0',
    lineHeight: '1.6',
    color: '#666',
    fontSize: '1rem',
    ...styles,
    cursor: previewMode === 'preview' ? 'default' : 'text',
    position: 'relative',
  };
  
  const text = content.text || element.content || 'Add your paragraph content here. You can write as much text as you need.';
  
  // Handle double-click to start editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (previewMode === 'preview') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 Paragraph double-clicked, starting edit mode');
    setEditText(text);
    setIsEditing(true);
  };
  
  // Handle save
  const handleSave = () => {
    const newText = editableRef.current?.innerText || editText;
    console.log('💾 Saving paragraph text:', newText);
    updateElement(element.id, { content: newText });
    setIsEditing(false);
  };
  
  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setEditText(text);
  };
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };
  
  // Focus when editing starts
  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);
  
  // If editing, render contentEditable version
  if (isEditing) {
    return (
      <ElementWrapper element={element}>
        <p
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          style={{
            ...paragraphStyles,
            outline: '2px solid #5457ff',
            outlineOffset: '2px',
            background: 'rgba(84, 87, 255, 0.05)',
            padding: '8px',
            borderRadius: '4px',
          }}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        >
          {text}
        </p>
      </ElementWrapper>
    );
  }
  
  // Normal render with double-click handler
  return (
    <ElementWrapper element={element}>
      <p 
        style={paragraphStyles}
        onDoubleClick={handleDoubleClick}
        title={previewMode === 'edit' ? 'Double-click to edit' : undefined}
      >
        {text}
      </p>
    </ElementWrapper>
  );
};