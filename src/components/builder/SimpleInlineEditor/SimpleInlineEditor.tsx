import React, { useState, useRef, useEffect } from 'react';
import type { BuilderElement } from '../../../types/builder';
import useElementStore from '../../../stores/elementStore';
import styles from './SimpleInlineEditor.module.scss';

interface SimpleInlineEditorProps {
  element: BuilderElement;
  children: React.ReactNode;
}

export const SimpleInlineEditor: React.FC<SimpleInlineEditorProps> = ({ element, children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(element.content || '');
  const editableRef = useRef<HTMLDivElement>(null);
  const { updateElement } = useElementStore();

  // Handle double-click to start editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    console.log('🔥 Double-click detected in SimpleInlineEditor for:', element.id, element.type);
    e.preventDefault();
    e.stopPropagation();
    console.log('Starting edit mode for:', element.id);
    setIsEditing(true);
  };

  // Handle saving changes
  const handleSave = () => {
    const newContent = editableRef.current?.innerText || '';
    console.log('Saving content:', newContent);
    updateElement(element.id, { content: newContent });
    setEditedContent(newContent);
    setIsEditing(false);
  };

  // Handle canceling edit
  const handleCancel = () => {
    setIsEditing(false);
    if (editableRef.current) {
      editableRef.current.innerText = element.content || '';
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Focus on edit mode
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

  if (isEditing) {
    // Extract styles from the child element
    const childElement = React.Children.only(children) as React.ReactElement;
    const originalStyles = childElement.props.style || {};
    
    return (
      <div className={styles.editingContainer}>
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={styles.editableContent}
          style={{
            ...originalStyles, // Apply original element styles
            outline: '2px solid #5457ff',
            padding: '4px',
            borderRadius: '4px',
            minHeight: '1em',
            background: 'white',
            margin: 0 // Reset margin to prevent double spacing
          }}
        >
          {element.content || ''}
        </div>
      </div>
    );
  }

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        console.log('🔵 Single click on SimpleInlineEditor wrapper for:', element.id);
      }}
      className={styles.editableWrapper}
      title="Double-click to edit"
      style={{ cursor: 'text', width: '100%' }}
    >
      {children}
    </div>
  );
};