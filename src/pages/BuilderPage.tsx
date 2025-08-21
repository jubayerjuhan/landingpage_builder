import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { TopBar } from '../components/TopBar';
import { ComponentPalette } from '../components/builder/ComponentPalette/ComponentPalette';
import { SectionCanvas } from '../components/Canvas/SectionCanvas';
import { RightSidebar } from '../components/RightSidebar';
import { ModalContainer } from '../components/modals/ModalContainer';
import useElementStore from '../stores/elementStore';
import { createElement } from '../utils/elementFactory';
import { ComponentType } from '../types/builder';
import type { BuilderElement } from '../types/builder';
import styles from './BuilderPage.module.scss';

export const BuilderPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const { addElement } = useElementStore();

  const createElementFromType = (type: string): BuilderElement => {
    // Map component types to ComponentType enum
    const typeMap: { [key: string]: ComponentType } = {
      'heading': ComponentType.HEADING,
      'paragraph': ComponentType.PARAGRAPH,
      'text': ComponentType.TEXT,
      'list': ComponentType.LIST,
      'quote': ComponentType.QUOTE,
      'code_block': ComponentType.CODE_BLOCK,
      'image': ComponentType.IMAGE,
      'video': ComponentType.VIDEO,
      'icon': ComponentType.ICON,
      'gallery': ComponentType.GALLERY,
      'button': ComponentType.BUTTON,
      'link': ComponentType.LINK,
      'input': ComponentType.INPUT,
      'textarea': ComponentType.TEXTAREA,
      'section': ComponentType.SECTION,
      'container': ComponentType.CONTAINER,
      'row': ComponentType.ROW,
      'column': ComponentType.COLUMN,
      'spacer': ComponentType.SPACER,
      'divider': ComponentType.DIVIDER,
    };

    const componentType = typeMap[type] || ComponentType.TEXT;
    return createElement(componentType);
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
      const newElement = createElementFromType(elementType);

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
    // Handle reordering of existing elements - simplified for now
    else {
      // For now, just log that we're handling element reordering
      // This can be implemented later if needed
      console.log('Element reordering not yet implemented for new store');
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
