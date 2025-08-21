import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { TopBar } from '../components/TopBar';
import { ComponentPalette } from '../components/builder/ComponentPalette/ComponentPalette';
import { SectionCanvas } from '../components/Canvas/SectionCanvas';
import { RightSidebar } from '../components/RightSidebar';
import { ModalContainer } from '../components/modals/ModalContainer';
import { useBuilderStore } from '../app/store';
import type { DroppedElement } from '../app/store';
import styles from './BuilderPage.module.scss';

export const BuilderPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const { addElement, reorderElements, droppedElements, getElementById } = useBuilderStore();

  const createElement = (type: string): DroppedElement => {
    const id = `${type}-${Date.now()}`;

    // Layout elements that can have children
    if (['section', 'container', 'row', 'column'].includes(type)) {
      return { id, type, content: '', children: [] };
    }

    // Content elements
    switch (type) {
      case 'heading':
        return { id, type, content: 'Your Heading Here' };
      case 'text':
        return { id, type, content: 'Text content' };
      case 'paragraph':
        return {
          id,
          type,
          content: 'Add your paragraph content here. You can write as much text as you need.',
        };
      case 'button':
        return { id, type, content: 'Click me' };
      case 'input':
        return { id, type, content: '' };
      case 'textarea':
        return { id, type, content: '' };
      case 'image':
        return { id, type, content: 'New Image' };
      case 'icon':
        return { id, type, content: '⭐' };
      case 'list':
        return { id, type, content: '• List item 1\n• List item 2\n• List item 3' };
      case 'quote':
        return { id, type, content: '"This is a quote or testimonial."' };
      case 'code_block':
        return { id, type, content: 'console.log("Hello World");' };
      default:
        return { id, type, content: `New ${type}` };
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    if (active.data.current?.isFromPalette) {
      setDraggedType(active.data.current.type as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setDraggedType(null);
      return;
    }

    // Handle drops from component palette
    if (active.data.current?.isFromPalette) {
      const elementType = active.data.current.type as string;
      const newElement = createElement(elementType);

      if (over.id === 'main-canvas') {
        // Drop on main canvas
        addElement(newElement);
      } else if (typeof over.id === 'string' && over.id.startsWith('container-')) {
        // Drop on container (section, container, card)
        const parentId = over.id.replace('container-', '');
        addElement(newElement, parentId);
      }

      console.log('Created new element:', newElement);
    }
    // Handle reordering of existing elements
    else {
      const activeElement = getElementById(active.id as string);
      if (!activeElement) return;

      // Find the parent of the active element and the target parent
      const activeParentId = activeElement.parentId || null;

      // Determine target parent based on over.id
      let targetParentId = null;
      if (over.id !== 'main-canvas' && typeof over.id === 'string') {
        if (over.id.startsWith('container-')) {
          targetParentId = over.id.replace('container-', '');
        } else {
          // If dropping on another element, find its parent
          const targetElement = getElementById(over.id as string);
          targetParentId = targetElement?.parentId || null;
        }
      }

      // Get the current elements list (either root or parent's children)
      const currentElements = activeParentId
        ? getElementById(activeParentId)?.children || []
        : droppedElements;

      const targetElements = targetParentId
        ? getElementById(targetParentId)?.children || []
        : droppedElements;

      // Find current and target indices
      const oldIndex = currentElements.findIndex(el => el.id === active.id);

      // If moving within the same container, calculate new index
      if (activeParentId === targetParentId) {
        let newIndex = targetElements.findIndex(el => el.id === over.id);
        if (newIndex === -1) newIndex = targetElements.length;

        if (oldIndex !== newIndex) {
          reorderElements(activeParentId, oldIndex, newIndex);
        }
      }
      // TODO: Handle moving between different containers (cross-container drag)
      // This would require using moveElement instead of reorderElements
    }

    setActiveId(null);
    setDraggedType(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.builderPage}>
        <TopBar />
        <div className={styles.builderMain}>
          <div className={styles.leftSidebar}>
            <ComponentPalette />
          </div>
          <div className={styles.canvasContainer}>
            <SectionCanvas />
          </div>
          <RightSidebar />
        </div>
      </div>

      <DragOverlay>
        {activeId && draggedType && (
          <div className={styles.dragPreview}>
            <div className={styles.dragPreviewContent}>{draggedType}</div>
          </div>
        )}
      </DragOverlay>

      {/* Modal Container for Section/Row modals */}
      <ModalContainer />
    </DndContext>
  );
};
