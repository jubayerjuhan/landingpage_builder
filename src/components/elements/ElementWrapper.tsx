import React, { useRef } from 'react';
import { Trash2 } from 'lucide-react';
import type { BuilderElement } from '../../types/builder';
import useElementStore from '../../stores/elementStore';
import useCanvasStore from '../../stores/canvasStore';
import { DragHandle } from '../builder/DragHandle';
import { ResizeHandles } from '../builder/ResizeHandles';
import styles from './ElementWrapper.module.scss';

interface ElementWrapperProps {
  element: BuilderElement;
  children: React.ReactNode;
  className?: string;
}

export const ElementWrapper: React.FC<ElementWrapperProps> = ({
  element,
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { selectedElementIds, hoveredElementId, selectElement, setHoveredElement, deleteElement } =
    useElementStore();
  const { previewMode } = useCanvasStore();

  const isSelected = selectedElementIds.includes(element.id) && element.id.length > 0;
  const isHovered = hoveredElementId === element.id;
  const isPreviewMode = previewMode === 'preview';
  const isTextElement = ['heading', 'paragraph', 'text'].includes(element.type);

  // In preview mode, render children without wrapper
  if (isPreviewMode) {
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    // Don't interfere with double-click for text editing
    if (e.detail >= 2 && isTextElement) {
      e.stopPropagation();
      return;
    }
    // Only handle single clicks
    if (e.detail === 1) {
      selectElement(element.id, e.metaKey || e.ctrlKey);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredElement(element.id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoveredElementId === element.id) {
      setHoveredElement(null);
    }
  };

  // Base wrapper styles
  const wrapperClasses = [
    styles.elementWrapper,
    className,
    isSelected ? styles.selected : '',
    isHovered ? styles.hovered : '',
    `element-${element.type}`,
  ]
    .filter(Boolean)
    .join(' ');

  // Inline styles as fallback
  const inlineStyles: React.CSSProperties = {
    position: 'relative',
    display: 'block',
    width: '100%',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    borderRadius: '4px',
    ...(isSelected
      ? {
          outline: '2px solid #5457ff',
          outlineOffset: '1px',
          background: 'rgba(84, 87, 255, 0.05)',
        }
      : {}),
    ...(isHovered && !isSelected
      ? {
          outline: '2px solid rgba(84, 87, 255, 0.3)',
          outlineOffset: '1px',
          background: 'rgba(84, 87, 255, 0.02)',
        }
      : {}),
  };

  // Handle element deletion
  const handleDelete = () => {
    deleteElement(element.id);
  };

  // Determine if we should show editing UI
  const showDragHandle = isSelected || isHovered;
  const showResizeHandles = isSelected && !isTextElement;

  return (
    <div
      ref={containerRef}
      className={wrapperClasses}
      style={inlineStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {/* Drag Handle */}
      <DragHandle element={element} isVisible={showDragHandle} />

      {/* Delete Button */}
      {showDragHandle && (
        <div
          className={styles.deleteButton}
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            backgroundColor: '#ff4444',
            border: '2px solid white',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 1001,
            color: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            handleDelete();
          }}
          title="Delete element"
        >
          <Trash2 size={12} />
        </div>
      )}

      {/* Resize Handles for non-text elements */}
      {showResizeHandles && (
        <ResizeHandles
          element={element}
          isVisible={showResizeHandles}
          containerRef={containerRef}
        />
      )}

      {/* Element Content */}
      {children}

      {/* Element label */}
      {(isSelected || isHovered) && (
        <div
          className={styles.elementLabel}
          style={{
            position: 'absolute',
            top: '-24px',
            left: '0',
            background: '#5457ff',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 1001,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            textTransform: 'capitalize',
            letterSpacing: '0.5px',
          }}
        >
          {element.name || element.type}
        </div>
      )}
    </div>
  );
};
