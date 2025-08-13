import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import styles from './DragHandle.module.scss';

interface DragHandleProps {
  id: string;
  isDragging?: boolean;
}

export const DragHandle: React.FC<DragHandleProps> = ({ id, isDragging }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.dragHandle} ${isDragging ? styles.dragging : ''}`}
      {...listeners}
      {...attributes}
      aria-label="Drag to reorder component"
    >
      <div className={styles.dots} />
    </div>
  );
};