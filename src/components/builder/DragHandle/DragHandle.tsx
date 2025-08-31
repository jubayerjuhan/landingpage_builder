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
      type: element.type,
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

  const dragHandleStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-12px',
    left: '-12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: '#5457ff',
    border: '2px solid white',
    borderRadius: '6px',
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: 'all 0.2s ease',
    zIndex: 1000,
    color: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    ...(isDragging
      ? {
          backgroundColor: '#3b3fd1',
          transform: 'scale(0.95)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        }
      : {}),
  };

  return (
    <div
      ref={setNodeRef}
      className={`${styles.dragHandle} ${isDragging ? styles.dragging : ''}`}
      style={dragHandleStyles}
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
