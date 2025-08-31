import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Eye } from 'lucide-react';
import { TopBar } from './TopBar/TopBar';
import { Sidebar } from './Sidebar/Sidebar';
import { OldStyleCanvas } from '../Canvas/OldStyleCanvas';
import { PropertiesSidebar } from './PropertiesSidebar/PropertiesSidebar';
import { ModalContainer } from '../modals/ModalContainer';
import { useBuilderStore } from '../../stores/builderStore';
import useElementStore from '../../stores/elementStore';
import useModalStore from '../../stores/modalStore';
import { ComponentType } from '../../types/builder';
import { v4 as uuidv4 } from 'uuid';
import styles from './Builder.module.scss';

export const Builder: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingType, setDraggingType] = useState<string | null>(null);
  const [draggedLabel, setDraggedLabel] = useState<string | null>(null);
  const { addElement, addLayout, updateElement, deleteElement, selectedElementId, reorderElements, isPreviewMode, setPreviewMode } = useBuilderStore();
  const { addElementWithChildren, selectElement } = useElementStore();
  const { openAddSectionModal } = useModalStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape to deselect or exit preview
      if (event.key === 'Escape') {
        if (isPreviewMode) {
          setPreviewMode(false);
        } else {
          selectElement(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectElement, isPreviewMode, setPreviewMode]);

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
        
        // Handle element reordering within column
        if (targetId.startsWith('element-above-') || targetId.startsWith('element-below-')) {
          const position = targetId.startsWith('element-above-') ? 'above' : 'below';
          const targetElementId = targetId.replace(`element-${position}-`, '');
          console.log('Reordering element:', element.id, 'to', position, 'of', targetElementId);
          reorderElements(element.id, targetElementId, position);
          selectElement(element.id); // Keep element selected after reorder
          return;
        }
        
        // Handle moving to different column
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
        
        // Create a layout with a row and columns (old style)
        const layoutId = uuidv4();
        const rowId = uuidv4();
        const columnIds = Array.from({ length: columnCount }, () => uuidv4());
        
        // Get current layouts to determine order
        const layouts = useElementStore.getState().elements.filter(el => el.type === 'layout');
        const maxOrder = layouts.reduce((max, el) => Math.max(max, el.order || 0), -1);
        
        const layout = {
          id: layoutId,
          type: 'layout' as ComponentType,
          name: 'Layout',
          content: '',
          order: maxOrder + 1,
          properties: {},
          children: [{
            id: rowId,
            type: 'row' as ComponentType,
            name: 'Row',
            content: '',
            properties: {
              display: 'flex',
              gap: '20px'
            },
            children: columnIds.map((colId, index) => ({
              id: colId,
              type: 'column' as ComponentType,
              name: `Column ${index + 1}`,
              content: '',
              properties: {
                flex: '1',
                minHeight: '100px'
              },
              children: []
            }))
          }]
        };
        
        // Handle drop zones for ordering
        if (targetId === 'main-canvas' || targetId === 'main-canvas-below') {
          addElementWithChildren(layout);
        } else if (targetId.startsWith('above-') || targetId.startsWith('below-')) {
          const [position, layoutTargetId] = targetId.split('-').slice(0, 2);
          // TODO: Handle reordering when dropping above/below existing layouts
          addElementWithChildren(layout);
        } else if (targetId.startsWith('column-')) {
          // If dropping on a column, don't create a layout
          console.log('Cannot drop layout on a column');
          return;
        }
        return;
      }

      // Handle regular element drops
      
      // Handle dropping new element on element drop zone
      if (targetId.startsWith('element-above-') || targetId.startsWith('element-below-')) {
        const position = targetId.startsWith('element-above-') ? 'above' : 'below';
        const targetElementId = targetId.replace(`element-${position}-`, '');
        
        // Find the target element to get its parent column
        const { elements } = useBuilderStore.getState();
        const targetElement = elements.find(el => el.id === targetElementId);
        
        if (targetElement) {
          const newElement = {
            type: elementType,
            content: elementType === 'heading' ? 'Your Heading Here' : 
                     elementType === 'paragraph' ? 'Your paragraph text here' : 
                     'Your text here',
            parentId: targetElement.parentId
          };
          
          // Add new element to the column
          const newElementId = addElement(newElement);
          
          // Then reorder it to the desired position
          if (newElementId) {
            setTimeout(() => {
              reorderElements(newElementId, targetElementId, position);
              selectElement(newElementId);
            }, 10); // Small delay to ensure element is added before reordering
          }
        }
        return;
      }
      
      // Handle dropping directly on column
      if (targetId.startsWith('column-')) {
        const columnId = targetId.replace('column-', '');
        const elementId = uuidv4();
        
        const newElement = {
          id: elementId,
          type: elementType as ComponentType,
          name: elementType.charAt(0).toUpperCase() + elementType.slice(1),
          content: elementType === 'heading' ? 'Your Heading Here' : 
                   elementType === 'paragraph' ? 'Your paragraph text here' : 
                   elementType === 'text' ? 'Your text here' :
                   elementType === 'button' ? 'Click Me' :
                   elementType === 'image' ? '' : 
                   '',
          properties: {},
          children: []
        };

        addElementWithChildren(newElement, columnId);
        selectElement(elementId);
      }
    }
  };

  const handleDragOver = (event: any) => {
    if (event.over) {
      console.log('Dragging over:', event.over.id);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className={`${styles.builder} ${isDragging ? 'dnd-cursor-grabbing' : ''}`}>
        <TopBar />
        <div className={styles.builderMain}>
          {!isPreviewMode && <Sidebar />}
          <OldStyleCanvas draggingType={draggingType} />
          {!isPreviewMode && <PropertiesSidebar />}
        </div>
        
        {/* Modal Container for Section/Row Modals */}
        <ModalContainer />
        
        {/* Preview Mode Banner */}
        {isPreviewMode && (
          <div className={styles.previewBanner}>
            <div className={styles.previewBannerText}>
              <Eye size={16} />
              <span>Preview Mode</span>
            </div>
            <button 
              className={styles.exitPreviewBtn}
              onClick={() => setPreviewMode(false)}
            >
              Exit Preview (ESC)
            </button>
          </div>
        )}
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