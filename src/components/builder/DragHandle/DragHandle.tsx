import React, { useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import type { BuilderElement } from '../../../types/builder';
import styles from './DragHandle.module.scss';

interface DragHandleProps {
  element: BuilderElement;
  isVisible: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const DragHandle: React.FC<DragHandleProps> = ({
  element,
  isVisible,
  onDragStart,
  onDragEnd,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `drag-handle-${element.id}`,
    data: {
      type: 'existing-element', // Fixed: Always mark as existing element for drag
      element,
      isFromPalette: false,
      isElementDrag: true,
    },
  });

  const handleMouseDown = useCallback(() => {
    onDragStart?.();
  }, [onDragStart]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) {
      onDragEnd?.();
    }
  }, [isDragging, onDragEnd]);

  if (!isVisible) {
    return null;
  }

  // Note: dragHandleStyles removed as it was unused - styles are applied via CSS modules

  return (
    <div
      ref={setNodeRef}
      className={`${styles.dragHandle} ${isDragging ? styles.dragging : ''}`}
      {...listeners}
      {...attributes}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      title={`Drag to move ${element.type}`}
    >
      <GripVertical size={12} />
    </div>
  );
};
