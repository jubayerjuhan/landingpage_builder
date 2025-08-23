import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { TopBar } from './TopBar/TopBar';
import { Sidebar } from './Sidebar/Sidebar';
import { Canvas } from './Canvas/Canvas';
import { useBuilderStore } from '../../stores/builderStore';
import styles from './Builder.module.scss';

export const Builder: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { addElement, addLayout, reorderLayout } = useBuilderStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);

    if (!over) return;

    if (active.data.current?.type) {
      const elementType = active.data.current.type;
      const targetId = over.id as string;
      
      // Handle layout drops
      if (elementType.includes('column')) {
        const columnCount = elementType === 'single-column' ? 1 : 
                           elementType === 'two-column' ? 2 :
                           elementType === 'three-column' ? 3 : 4;
        
        // Handle drop zones for ordering
        if (targetId === 'main-canvas' || targetId === 'main-canvas-below') {
          addLayout(columnCount);
        } else if (targetId.startsWith('above-') || targetId.startsWith('below-')) {
          const [position, layoutId] = targetId.split('-', 2);
          addLayout(columnCount, position as 'above' | 'below', layoutId);
        } else if (targetId.startsWith('layout-')) {
          // Drop on existing layout - add below it
          const layoutId = targetId.replace('layout-', '');
          addLayout(columnCount, 'below', layoutId);
        }
        return;
      }

      // Handle regular element drops
      const newElement = {
        type: elementType,
        content: elementType === 'heading' ? 'Your Heading Here' : 
                 elementType === 'paragraph' ? 'Your paragraph text here' : 
                 'Your text here',
        parentId: targetId.startsWith('column-') ? targetId.replace('column-', '') : null
      };

      addElement(newElement);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.builder}>
        <TopBar />
        <div className={styles.builderMain}>
          <Sidebar />
          <Canvas />
        </div>
      </div>
    </DndContext>
  );
};