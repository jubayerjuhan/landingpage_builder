import { useState, useCallback, useRef, useEffect } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import type {
  DragItem,
  DragState,
  DropTarget,
  BuilderElement
} from '../types/builder';
import {
  ComponentType,
  DropTargetType,
  DropPosition
} from '../types/builder';
import { useElementStore, useCanvasStore, useHistoryStore } from '../stores';

// Enhanced drag and drop hook with professional features
export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragItem: null,
    dragPreview: null,
    dropZones: [],
    validDropZone: null
  });

  const elementStore = useElementStore();
  const canvasStore = useCanvasStore();
  const historyStore = useHistoryStore();

  // Drag handlers
  const startDrag = useCallback((item: DragItem) => {
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      dragItem: item
    }));
    canvasStore.setDragging(true);
  }, [canvasStore]);

  const updateDragPreview = useCallback((x: number, y: number, width: number, height: number) => {
    setDragState(prev => ({
      ...prev,
      dragPreview: { x, y, width, height }
    }));
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragItem: null,
      dragPreview: null,
      dropZones: [],
      validDropZone: null
    });
    canvasStore.setDragging(false);
  }, [canvasStore]);

  // Drop zone management
  const registerDropZone = useCallback((dropZone: DropTarget) => {
    setDragState(prev => ({
      ...prev,
      dropZones: [...prev.dropZones.filter(zone => zone.id !== dropZone.id), dropZone]
    }));
  }, []);

  const unregisterDropZone = useCallback((id: string) => {
    setDragState(prev => ({
      ...prev,
      dropZones: prev.dropZones.filter(zone => zone.id !== id)
    }));
  }, []);

  const updateValidDropZone = useCallback((zoneId: string | null) => {
    setDragState(prev => ({
      ...prev,
      validDropZone: zoneId
    }));
  }, []);

  // Drop handlers
  const handleDrop = useCallback((targetZone: DropTarget) => {
    const { dragItem } = dragState;
    if (!dragItem) return false;

    // Validate drop
    if (!canDropElement(dragItem.type, targetZone)) {
      return false;
    }

    // Start history batch
    historyStore.startBatch(`Drop ${dragItem.type}`);

    try {
      if (dragItem.isFromPalette) {
        // Create new element from palette
        const newElement = createElementFromPalette(dragItem, targetZone);
        const elementId = elementStore.addElement(newElement, targetZone.elementId);
        elementStore.selectElement(elementId);
      } else {
        // Move existing element
        if (dragItem.element) {
          elementStore.moveElement(
            dragItem.element.id,
            targetZone.elementId,
            getInsertIndex(targetZone)
          );
        }
      }

      endDrag();
      return true;
    } catch (error) {
      console.error('Drop failed:', error);
      return false;
    } finally {
      historyStore.endBatch();
    }
  }, [dragState, elementStore, historyStore]);

  return {
    dragState,
    startDrag,
    updateDragPreview,
    endDrag,
    registerDropZone,
    unregisterDropZone,
    updateValidDropZone,
    handleDrop
  };
};

// Draggable component hook
export const useDraggableComponent = (componentType: ComponentType, element?: BuilderElement) => {
  const { startDrag, endDrag } = useDragAndDrop();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: element?.id || `palette-${componentType}`,
    data: {
      type: componentType,
      element,
      isFromPalette: !element
    }
  });

  const handleDragStart = useCallback(() => {
    startDrag({
      id: element?.id || uuidv4(),
      type: componentType,
      isFromPalette: !element,
      element
    });
  }, [componentType, element, startDrag]);

  const handleDragEnd = useCallback(() => {
    endDrag();
  }, [endDrag]);

  return {
    setNodeRef,
    attributes: {
      ...attributes,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd
    },
    listeners,
    transform,
    isDragging,
    style: transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined
  };
};

// Droppable zone hook
export const useDroppableZone = (
  id: string,
  elementId: string | undefined,
  accepts: ComponentType[],
  type: DropTargetType = DropTargetType.ELEMENT
) => {
  const { registerDropZone, unregisterDropZone, updateValidDropZone, handleDrop, dragState } = useDragAndDrop();
  const dropZoneRef = useRef<HTMLElement>(null);

  const {
    setNodeRef,
    isOver,
    active
  } = useDroppable({
    id,
    data: {
      elementId,
      accepts,
      type
    }
  });

  // Register/unregister drop zone
  useEffect(() => {
    if (dropZoneRef.current) {
      const bounds = dropZoneRef.current.getBoundingClientRect();
      const dropTarget: DropTarget = {
        id,
        elementId,
        type,
        accepts,
        bounds,
        position: DropPosition.INSIDE,
        isValid: true
      };

      registerDropZone(dropTarget);

      return () => unregisterDropZone(id);
    }
  }, [id, elementId, type, accepts, registerDropZone, unregisterDropZone]);

  // Update valid drop zone when hovering
  useEffect(() => {
    if (isOver && active) {
      const canDrop = active.data.current && 
        accepts.includes(active.data.current.type as ComponentType);
      
      if (canDrop) {
        updateValidDropZone(id);
      }
    } else if (!isOver) {
      updateValidDropZone(null);
    }
  }, [isOver, active, accepts, id, updateValidDropZone]);

  const combinedRef = useCallback((node: HTMLElement | null) => {
    setNodeRef(node);
    if (node) {
      dropZoneRef.current = node;
    }
  }, [setNodeRef]);

  return {
    setNodeRef: combinedRef,
    isOver,
    isValidDrop: dragState.validDropZone === id,
    canDrop: active?.data.current && accepts.includes(active.data.current.type as ComponentType)
  };
};

// Utility functions
const canDropElement = (componentType: ComponentType, target: DropTarget): boolean => {
  // Check if target accepts this component type
  if (!target.accepts.includes(componentType)) return false;

  // Check if target has rejects list
  if (target.rejects?.includes(componentType)) return false;

  // Add more sophisticated validation logic here
  // For example, checking nesting rules, container capacity, etc.

  return true;
};

const createElementFromPalette = (dragItem: DragItem, target: DropTarget): Omit<BuilderElement, 'id'> => {
  // This would normally come from component definitions
  const defaultProperties = getDefaultProperties(dragItem.type);
  
  return {
    type: dragItem.type,
    content: getDefaultContent(dragItem.type),
    properties: defaultProperties,
    styles: getDefaultStyles(dragItem.type),
    parentId: target.elementId
  };
};

const getInsertIndex = (target: DropTarget): number => {
  // Calculate insert index based on drop position
  switch (target.position) {
    case DropPosition.BEFORE:
      return 0; // Insert at beginning
    case DropPosition.AFTER:
      return -1; // Insert at end
    case DropPosition.INSIDE:
    default:
      return -1; // Insert at end of container
  }
};

const getDefaultProperties = (componentType: ComponentType) => {
  // Return default properties based on component type
  const defaults = {
    [ComponentType.HEADING]: {
      content: { text: 'Heading' },
      typography: { fontSize: '2rem', fontWeight: 'bold' }
    },
    [ComponentType.PARAGRAPH]: {
      content: { text: 'This is a paragraph.' },
      typography: { fontSize: '1rem' }
    },
    [ComponentType.BUTTON]: {
      content: { text: 'Button' },
      interaction: { cursor: 'pointer' }
    },
    [ComponentType.IMAGE]: {
      content: { 
        src: 'https://via.placeholder.com/400x300',
        alt: 'Placeholder image'
      }
    },
    [ComponentType.CONTAINER]: {
      layout: { display: 'flex', flexDirection: 'column' }
    }
  };

  return defaults[componentType] || {};
};

const getDefaultContent = (componentType: ComponentType): string => {
  const contentMap = {
    [ComponentType.HEADING]: 'New Heading',
    [ComponentType.PARAGRAPH]: 'New paragraph text.',
    [ComponentType.BUTTON]: 'Click me',
    [ComponentType.TEXT]: 'Text content',
    [ComponentType.CONTAINER]: ''
  };

  return contentMap[componentType] || '';
};

const getDefaultStyles = (componentType: ComponentType) => {
  // Return responsive default styles
  return {
    desktop: getComponentDefaultStyles(componentType),
    tablet: {},
    mobile: {}
  };
};

const getComponentDefaultStyles = (componentType: ComponentType) => {
  const styleDefaults = {
    [ComponentType.HEADING]: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333'
    },
    [ComponentType.PARAGRAPH]: {
      fontSize: '1rem',
      lineHeight: 1.6,
      marginBottom: '1rem',
      color: '#666'
    },
    [ComponentType.BUTTON]: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    [ComponentType.CONTAINER]: {
      padding: '1rem',
      minHeight: '100px'
    },
    [ComponentType.IMAGE]: {
      maxWidth: '100%',
      height: 'auto'
    }
  };

  return styleDefaults[componentType] || {};
};

// Advanced drag and drop features
export const useDragConstraints = () => {
  const canvasStore = useCanvasStore();

  const applySnapToGrid = useCallback((x: number, y: number) => {
    if (!canvasStore.snapToGrid) return { x, y };

    const gridSize = canvasStore.gridSize;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [canvasStore.snapToGrid, canvasStore.gridSize]);

  const applySnapToElements = useCallback((x: number, y: number, draggedElementId: string) => {
    if (!canvasStore.snapToElements) return { x, y };

    const elements = useElementStore.getState().elements;
    const threshold = 5; // px

    const snappedX = x;
    const snappedY = y;

    // Find nearby elements to snap to
    elements.forEach(element => {
      if (element.id === draggedElementId) return;

      // This would need element bounds calculation
      // For now, just return original position
    });

    return { x: snappedX, y: snappedY };
  }, [canvasStore.snapToElements]);

  return {
    applySnapToGrid,
    applySnapToElements
  };
};

// Visual feedback for drag operations
export const useDragVisualFeedback = () => {
  const [dragFeedback, setDragFeedback] = useState({
    showDropZones: false,
    highlightedZones: new Set<string>(),
    insertionIndicator: null as { x: number; y: number; width: number; height: number } | null
  });

  const showDropZones = useCallback(() => {
    setDragFeedback(prev => ({ ...prev, showDropZones: true }));
  }, []);

  const hideDropZones = useCallback(() => {
    setDragFeedback(prev => ({ 
      ...prev, 
      showDropZones: false, 
      highlightedZones: new Set(),
      insertionIndicator: null 
    }));
  }, []);

  const highlightZone = useCallback((zoneId: string) => {
    setDragFeedback(prev => ({
      ...prev,
      highlightedZones: new Set([...prev.highlightedZones, zoneId])
    }));
  }, []);

  const unhighlightZone = useCallback((zoneId: string) => {
    setDragFeedback(prev => {
      const newSet = new Set(prev.highlightedZones);
      newSet.delete(zoneId);
      return { ...prev, highlightedZones: newSet };
    });
  }, []);

  const showInsertionIndicator = useCallback((bounds: { x: number; y: number; width: number; height: number }) => {
    setDragFeedback(prev => ({ ...prev, insertionIndicator: bounds }));
  }, []);

  const hideInsertionIndicator = useCallback(() => {
    setDragFeedback(prev => ({ ...prev, insertionIndicator: null }));
  }, []);

  return {
    dragFeedback,
    showDropZones,
    hideDropZones,
    highlightZone,
    unhighlightZone,
    showInsertionIndicator,
    hideInsertionIndicator
  };
};