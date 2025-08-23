import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../../../stores/builderStore';
import styles from './Element.module.scss';

interface ElementProps {
  element: any;
}

export const Element: React.FC<ElementProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);
  const editRef = useRef<HTMLDivElement>(null);
  const { updateElement, selectedElementId, selectElement } = useBuilderStore();

  const isSelected = selectedElementId === element.id;

  // Handle element selection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  // Handle double-click to edit
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (['heading', 'paragraph', 'text'].includes(element.type)) {
      console.log('Starting edit mode for:', element.id);
      setIsEditing(true);
      setEditContent(element.content);
    }
  };

  // Save content
  const saveContent = () => {
    const newContent = editRef.current?.innerText || editContent;
    updateElement(element.id, { content: newContent });
    setIsEditing(false);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveContent();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  // Focus and select text when editing starts
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  // Render editing mode
  if (isEditing) {
    return (
      <div className={`${styles.element} ${styles.editing}`}>
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          className={styles.editableContent}
          onBlur={saveContent}
          onKeyDown={handleKeyDown}
        >
          {editContent}
        </div>
      </div>
    );
  }

  // Render based on element type
  const renderElement = () => {
    switch (element.type) {
      case 'heading':
        return (
          <h2 className={styles.heading}>
            {element.content}
          </h2>
        );
      
      case 'paragraph':
        return (
          <p className={styles.paragraph}>
            {element.content}
          </p>
        );
      
      case 'text':
        return (
          <span className={styles.text}>
            {element.content}
          </span>
        );
      
      case 'button':
        return (
          <button className={styles.button}>
            {element.content || 'Click Me'}
          </button>
        );
      
      case 'image':
        return (
          <div className={styles.imagePlaceholder}>
            <span>Image Placeholder</span>
          </div>
        );
      
      default:
        return (
          <div className={styles.unknown}>
            {element.type}: {element.content}
          </div>
        );
    }
  };

  return (
    <div
      className={`${styles.element} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title={['heading', 'paragraph', 'text'].includes(element.type) ? 'Double-click to edit' : ''}
    >
      {renderElement()}
      
      {isSelected && (
        <div className={styles.elementLabel}>
          {element.type}
        </div>
      )}
    </div>
  );
};