import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { TopBar } from '../components/TopBar';
import { ComponentPalette } from '../components/builder/ComponentPalette/ComponentPalette';
import { Canvas } from '../components/Canvas';
import { RightSidebar } from '../components/RightSidebar';
import { useBuilderStore } from '../app/store';
import type { DroppedElement } from '../app/store';
import './BuilderPage.module.scss';

export const BuilderPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const { addElement, reorderElements, droppedElements, getElementById } = useBuilderStore();

  const createElement = (type: string): DroppedElement => {
    const id = `${type}-${Date.now()}`;

    switch (type) {
      case 'heading':
        return { id, type, content: 'New Heading' };
      case 'text':
        return { id, type, content: 'New Text' };
      case 'paragraph':
        return { id, type, content: 'This is a new paragraph. Click to edit.' };
      case 'button':
        return { id, type, content: 'New Button' };
      case 'section':
        return { id, type, content: 'Section', children: [] };
      case 'container':
        return { id, type, content: 'Container', children: [] };
      case 'card':
        return { id, type, content: 'Card', children: [] };
      case 'input':
        return { id, type, content: '' };
      case 'textarea':
        return { id, type, content: '' };
      case 'image':
        return { id, type, content: 'New Image' };
      case 'icon':
        return { id, type, content: 'New Icon' };
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
      <div className="builder-page">
        <TopBar />
        <div className="builder-page__main">
          <div className="left-sidebar">
            <ComponentPalette />
          </div>
          <Canvas />
          <RightSidebar />
        </div>
      </div>

      <DragOverlay>
        {activeId && draggedType && (
          <div className="drag-preview">
            <div className="drag-preview__content">{draggedType}</div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
