import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { useBuilderStore } from '../../../../stores/builderStore';
import styles from './Element.module.scss';

interface ElementProps {
  element: any;
}

export const Element: React.FC<ElementProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);
  const [isHovered, setIsHovered] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);
  const { updateElement, selectedElementId, selectElement } = useBuilderStore();

  const isSelected = selectedElementId === element.id;

  // Make element draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging
  } = useDraggable({
    id: `element-${element.id}`,
    data: {
      type: 'existing-element',
      element: element
    }
  });

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
    const elementStyles = element.styles || {};
    
    switch (element.type) {
      case 'heading':
        return (
          <h2 className={styles.heading} style={elementStyles}>
            {element.content}
          </h2>
        );
      
      case 'paragraph':
        return (
          <p className={styles.paragraph} style={elementStyles}>
            {element.content}
          </p>
        );
      
      case 'text':
        return (
          <span className={styles.text} style={elementStyles}>
            {element.content}
          </span>
        );
      
      case 'button':
        return (
          <button className={styles.button} style={elementStyles}>
            {element.content || 'Click Me'}
          </button>
        );
      
      case 'image':
        return (
          <div className={styles.imagePlaceholder} style={elementStyles}>
            <span>Image Placeholder</span>
          </div>
        );
      
      default:
        return (
          <div className={styles.unknown} style={elementStyles}>
            {element.type}: {element.content}
          </div>
        );
    }
  };

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1
  } : undefined;

  return (
    <div
      ref={setDragRef}
      className={`${styles.element} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      style={dragStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={['heading', 'paragraph', 'text'].includes(element.type) ? 'Double-click to edit' : ''}
    >
      {renderElement()}
      
      {(isSelected || isHovered) && !isEditing && (
        <>
          <div className={styles.elementLabel}>
            {element.type}
          </div>
          <div 
            className={styles.dragHandle}
            {...attributes}
            {...listeners}
          >
            <GripVertical size={14} />
          </div>
        </>
      )}
    </div>
  );
};