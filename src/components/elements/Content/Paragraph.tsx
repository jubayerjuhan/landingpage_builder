import React, { useState, useRef, useEffect } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
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
  
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  // Complete styles already include defaults
  const paragraphStyles: React.CSSProperties = {
    ...styles,
    cursor: previewMode === 'preview' ? 'default' : 'text',
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
            outline: '1px dashed rgba(84, 87, 255, 0.5)',
            outlineOffset: '0px',
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