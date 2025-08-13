import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { AnyComponent } from '../../../types/components';
import { DragHandle } from '../DragHandle';
import { ComponentRenderer } from '../ComponentRenderer';
import styles from './DropZone.module.scss';

interface DropZoneProps {
  id: string;
  components: AnyComponent[];
  onComponentSelect?: (component: AnyComponent) => void;
  selectedComponentId?: string;
  children?: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({
  id,
  components,
  onComponentSelect,
  selectedComponentId,
  children
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id
  });

  const dropZoneClasses = [
    styles.dropZone,
    isOver && styles.dropZoneOver
  ].filter(Boolean).join(' ');

  const handleComponentClick = (component: AnyComponent) => {
    onComponentSelect?.(component);
  };

  return (
    <div ref={setNodeRef} className={dropZoneClasses}>
      {components.length === 0 && !children && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>📦</div>
          <span>Drop components here</span>
        </div>
      )}
      
      {components.map((component) => (
        <div
          key={component.id}
          className={`${styles.componentWrapper} ${
            selectedComponentId === component.id ? styles.selected : ''
          }`}
        >
          <div className={styles.componentControls}>
            <DragHandle id={component.id} />
          </div>
          <ComponentRenderer
            component={component}
            isSelected={selectedComponentId === component.id}
            onSelect={() => handleComponentClick(component)}
          />
        </div>
      ))}
      
      {children}
    </div>
  );
};