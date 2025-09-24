import React, { useRef, useState } from 'react';
import type { BuilderElement } from '../../types/builder';
import { useBuilderStore } from '../../stores/builderStore';
import useCanvasStore from '../../stores/canvasStore';
import { DragHandle } from '../builder/DragHandle';
import { ResizeHandles } from '../builder/ResizeHandles';
import styles from './ElementWrapper.module.scss';

interface ElementWrapperProps {
  element: BuilderElement;
  children: React.ReactNode;
  className?: string;
  showSelectionChrome?: boolean;
}

export const ElementWrapper: React.FC<ElementWrapperProps> = ({
  element,
  children,
  className = '',
  showSelectionChrome = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { selectedElementId, selectElement, isPreviewMode } = useBuilderStore();
  const { previewMode } = useCanvasStore();

  const isSelected = selectedElementId === element.id;
  const isPreview = isPreviewMode || previewMode === 'preview';
  const isTextElement = ['heading', 'paragraph', 'text', 'image'].includes(element.type);

  // Defensive check: ensure we have proper selection state
  const shouldShowChrome = showSelectionChrome && !isPreview;
  const shouldShowSelectedOutline = !isPreview && isSelected;
  const shouldShowHoverOutline = shouldShowChrome && isHovered && !isSelected;
  const shouldShowLabel = shouldShowChrome && isSelected && Boolean(selectedElementId);

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation(); // Prevent parent elements from handling this click
    // Don't interfere with double-click for text editing
    if (e.detail >= 2 && isTextElement) {
      return;
    }
    // Only handle single clicks
    if (e.detail === 1) {
      selectElement(element.id);
    }
  };

  const handleMouseEnter = () => {
    if (isPreview) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isPreview) return;
    setIsHovered(false);
  };

  // Base wrapper styles
  const wrapperClasses = [
    styles.elementWrapper,
    className,
    shouldShowChrome && isSelected ? styles.selected : '',
    shouldShowChrome && isHovered ? styles.hovered : '',
    `element-${element.type}`
  ].filter(Boolean).join(' ');

  // Inline styles as fallback
  const inlineStyles: React.CSSProperties = {
    position: 'relative',
    display: 'block',
    width: '100%',
    transition: 'all 0.2s ease',
    cursor: isPreview ? 'default' : 'pointer',
    borderRadius: '4px',
    ...(shouldShowSelectedOutline ? {
      outline: '2px solid #5457ff',
      outlineOffset: '1px',
    } : {}),
    ...(shouldShowHoverOutline ? {
      outline: '2px solid rgba(84, 87, 255, 0.3)',
      outlineOffset: '1px',
      background: 'rgba(84, 87, 255, 0.02)'
    } : {})
  };

  // Determine if we should show editing UI
  const showDragHandle = shouldShowLabel;
  const showResizeHandles = shouldShowLabel && !isTextElement;

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
      {shouldShowChrome && (
        <DragHandle
          element={element}
          isVisible={showDragHandle}
        />
      )}

      {/* Resize Handles for non-text elements */}
      {shouldShowChrome && showResizeHandles && (
        <ResizeHandles
          element={element}
          isVisible={showResizeHandles}
          containerRef={containerRef}
        />
      )}

      {/* Element Content */}
      {children}

      {/* Element label */}
      {shouldShowLabel && (
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
            letterSpacing: '0.5px'
          }}
        >
          {element.name || element.type}
        </div>
      )}
    </div>
  );
};
