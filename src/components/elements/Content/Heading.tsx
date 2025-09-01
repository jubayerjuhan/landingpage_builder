import React, { useState, useRef, useEffect } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import useElementStore from '../../../stores/elementStore';

interface HeadingProps {
  element: BuilderElement;
}

export const Heading: React.FC<HeadingProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLHeadingElement>(null);
  
  const { viewportMode } = useCanvasStore();
  const { updateElement } = useElementStore();
  const { previewMode } = useCanvasStore();
  
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  // Get heading level from properties or default to H2
  const level = (element.properties?.typography as any)?.level || '2';
  const headingLevel = Math.max(1, Math.min(6, parseInt(level))) as 1 | 2 | 3 | 4 | 5 | 6;
  
  const headingStyles: React.CSSProperties = {
    margin: '0 0 1rem 0',
    fontWeight: 'bold',
    color: '#333',
    ...styles,
    cursor: previewMode === 'preview' ? 'default' : 'text',
    position: 'relative',
  };
  
  const text = content.text || element.content || 'Your Heading Here';
  
  // Handle save
  const handleSave = () => {
    const newText = editableRef.current?.innerText || text;
    console.log('💾 Saving heading text:', newText);
    updateElement(element.id, { content: newText });
    setIsEditing(false);
  };
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };
  
  // Setup double-click listener using useEffect
  useEffect(() => {
    const headingElement = editableRef.current;
    if (!headingElement) return;

    const handleDoubleClick = (e: MouseEvent) => {
      if (previewMode === 'preview') return;
      
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🎯 Double-click detected on heading!');
      setIsEditing(true);
      
      // Focus and select text after a short delay
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus();
          const range = document.createRange();
          range.selectNodeContents(editableRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 10);
    };

    headingElement.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      headingElement.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [previewMode, isEditing]);
  
  const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  
  // Don't wrap with ElementWrapper when editing
  if (isEditing) {
    return (
      <HeadingTag
        ref={editableRef as any}
        contentEditable
        suppressContentEditableWarning
        style={{
          ...headingStyles,
          outline: '1px dashed rgba(84, 87, 255, 0.5)',
          outlineOffset: '0px',
        }}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        data-element-id={element.id}
        data-element-type={element.type}
      >
        {text}
      </HeadingTag>
    );
  }
  
  return (
    <ElementWrapper element={element}>
      <HeadingTag
        ref={editableRef as any}
        style={headingStyles}
        title={previewMode === 'edit' ? 'Double-click to edit' : undefined}
      >
        {text}
      </HeadingTag>
    </ElementWrapper>
  );
};