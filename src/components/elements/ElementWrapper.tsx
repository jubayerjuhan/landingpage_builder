import React from 'react';
import type { BuilderElement } from '../../types/builder';
import useElementStore from '../../stores/elementStore';
import useCanvasStore from '../../stores/canvasStore';

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
  const { selectedElementIds, hoveredElementId, selectElement, setHoveredElement } =
    useElementStore();
  const { previewMode, showBoundaries } = useCanvasStore();

  const isSelected = selectedElementIds.includes(element.id);
  const isHovered = hoveredElementId === element.id;
  const isPreviewMode = previewMode === 'preview';

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectElement(element.id, e.metaKey || e.ctrlKey);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    setHoveredElement(element.id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    if (hoveredElementId === element.id) {
      setHoveredElement(null);
    }
  };

  // Base wrapper styles
  const wrapperStyles: React.CSSProperties = {
    position: 'relative',
    outline: isSelected ? '2px solid #3b82f6' : isHovered ? '1px solid #60a5fa' : 'none',
    outlineOffset: '1px',
    transition: 'outline 0.2s ease',
    cursor: isPreviewMode ? 'default' : 'pointer',
  };

  // Add boundary visualization in edit mode
  if (showBoundaries && !isPreviewMode) {
    wrapperStyles.border = '1px dashed rgba(156, 163, 175, 0.5)';
  }

  return (
    <div
      className={className}
      style={wrapperStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {children}
    </div>
  );
};
