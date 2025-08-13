import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { TopBar } from '../components/TopBar';
import { LeftSidebar } from '../components/LeftSidebar';
import { Canvas } from '../components/Canvas';
import { RightSidebar } from '../components/RightSidebar';
import { useBuilderStore } from '../app/store';
import type { DroppedElement } from '../app/store';
import './BuilderPage.module.scss';

export const BuilderPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const { addElement } = useBuilderStore();

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
        return { id, type, content: 'New Section' };
      case 'container':
        return { id, type, content: 'New Container' };
      case 'grid':
        return { id, type, content: 'New Grid' };
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
    
    if (over && over.id === 'main-canvas' && active.data.current?.isFromPalette) {
      const elementType = active.data.current.type as string;
      const newElement = createElement(elementType);
      addElement(newElement);
      console.log('Created new element:', newElement);
    }
    
    setActiveId(null);
    setDraggedType(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="builder-page">
        <TopBar />
        <div className="builder-page__main">
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </div>
      </div>
      
      <DragOverlay>
        {activeId && draggedType && (
          <div className="drag-preview">
            <div className="drag-preview__content">
              {draggedType}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};