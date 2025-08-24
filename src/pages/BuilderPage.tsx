import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { TopBar } from '../components/TopBar';
import { ComponentPalette } from '../components/builder/ComponentPalette/ComponentPalette';
import { SectionCanvas } from '../components/Canvas/SectionCanvas';
import { RightSidebar } from '../components/RightSidebar';
import { ModalContainer } from '../components/modals/ModalContainer';
import { useDropIndicator } from '../components/builder/DropIndicator';
import useElementStore from '../stores/elementStore';
import useHistoryStore from '../stores/historyStore';
import { createElement } from '../utils/elementFactory';
import { ComponentType } from '../types/builder';
import type { BuilderElement } from '../types/builder';
import styles from './BuilderPage.module.scss';

export const BuilderPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<BuilderElement | null>(null);
  
  const { addElement, moveElement, elements } = useElementStore();
  const { undo, redo, canUndo, canRedo } = useHistoryStore();
  const dropIndicator = useDropIndicator();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, key, shiftKey, target } = event;
      const isCtrlOrCmd = ctrlKey || metaKey;
      
      // Don't trigger shortcuts when typing in inputs or contentEditable
      if (target instanceof HTMLElement && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      )) {
        return;
      }

      if (isCtrlOrCmd && key === 'z' && !shiftKey) {
        event.preventDefault();
        undo();
      } else if (isCtrlOrCmd && (key === 'y' || (key === 'z' && shiftKey))) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

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
      setDraggedElement(null);
    } else if (active.data.current?.isElementDrag) {
      // Element being dragged for reordering
      const element = active.data.current.element as BuilderElement;
      setDraggedElement(element);
      setDraggedType(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Clear drop indicators
    dropIndicator.clearAllIndicators();

    if (!over) {
      setActiveId(null);
      setDraggedType(null);
      setDraggedElement(null);
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
    // Handle reordering of existing elements
    else if (active.data.current?.isElementDrag && draggedElement) {
      const targetId = over.id as string;
      
      // Determine the new parent and position
      if (targetId.startsWith('container-')) {
        const newParentId = targetId.replace('container-', '');
        
        // Don't allow dropping element on itself or its descendants
        if (newParentId !== draggedElement.id && !isDescendant(newParentId, draggedElement.id)) {
          console.log(`Moving element ${draggedElement.id} to container ${newParentId}`);
          
          // Move the element to new parent
          moveElement(draggedElement.id, newParentId);
        }
      } else if (targetId === 'main-canvas') {
        // Move to root level
        console.log(`Moving element ${draggedElement.id} to root level`);
        moveElement(draggedElement.id, null);
      }
    }

    setActiveId(null);
    setDraggedType(null);
    setDraggedElement(null);
  };

  // Helper function to check if an element is a descendant of another
  const isDescendant = (ancestorId: string, elementId: string): boolean => {
    const element = elements.find(el => el.id === elementId);
    if (!element || !element.parentId) return false;
    
    if (element.parentId === ancestorId) return true;
    return isDescendant(ancestorId, element.parentId);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.builderPage}>
        <TopBar canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />
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
        {activeId && draggedElement && (
          <div className={styles.dragPreview}>
            <div className={styles.dragPreviewContent}>
              Moving {draggedElement.type}
            </div>
          </div>
        )}
      </DragOverlay>

      {/* Drop Indicators */}
      <dropIndicator.DropIndicators />

      {/* Modal Container for Section/Row modals */}
      <ModalContainer />
    </DndContext>
  );
};
