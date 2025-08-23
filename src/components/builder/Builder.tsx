import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { TopBar } from './TopBar/TopBar';
import { Sidebar } from './Sidebar/Sidebar';
import { Canvas } from './Canvas/Canvas';
import { PropertiesSidebar } from './PropertiesSidebar/PropertiesSidebar';
import { useBuilderStore } from '../../stores/builderStore';
import styles from './Builder.module.scss';

export const Builder: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingType, setDraggingType] = useState<string | null>(null);
  const [draggedLabel, setDraggedLabel] = useState<string | null>(null);
  const { addElement, addLayout, updateElement, selectElement, deleteElement, selectedElementId } = useBuilderStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete selected element
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedElementId) {
          event.preventDefault();
          deleteElement(selectedElementId);
          selectElement(null);
        }
      }
      
      // Escape to deselect
      if (event.key === 'Escape') {
        selectElement(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, deleteElement, selectElement]);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const type = event.active.data.current?.type || null;
    setDraggingType(type);
    
    // Set label for drag overlay
    const labelMap: Record<string, string> = {
      'heading': 'Heading',
      'paragraph': 'Paragraph', 
      'text': 'Text',
      'button': 'Button',
      'image': 'Image',
      'list': 'List',
      'single-column': 'Single Column',
      'two-column': '2 Columns',
      'three-column': '3 Columns',
      'four-column': '4 Columns',
      'existing-element': 'Element'
    };
    setDraggedLabel(type ? labelMap[type] || type : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setDraggingType(null);
    setDraggedLabel(null);

    if (!over) return;

    if (active.data.current?.type) {
      const elementType = active.data.current.type;
      const targetId = over.id as string;
      const activeId = active.id as string;
      
      // Handle existing element movement
      if (elementType === 'existing-element') {
        const element = active.data.current.element;
        if (targetId.startsWith('column-')) {
          const newParentId = targetId.replace('column-', '');
          if (element.parentId !== newParentId) {
            // Move element to different column
            updateElement(element.id, { parentId: newParentId });
            selectElement(element.id); // Keep element selected after move
          }
        }
        return;
      }
      
      // Handle new layout drops from sidebar
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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={`${styles.builder} ${isDragging ? 'dnd-cursor-grabbing' : ''}`}>
        <TopBar />
        <div className={styles.builderMain}>
          <Sidebar />
          <Canvas draggingType={draggingType} />
          <PropertiesSidebar />
        </div>
      </div>
      
      <DragOverlay>
        {isDragging && draggedLabel && (
          <div className="drag-overlay">
            📦 {draggedLabel}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};