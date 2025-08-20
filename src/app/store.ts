// Legacy store - migrating to new store architecture
// This file is maintained for backward compatibility
// New components should use stores from '../stores/index'

import { create } from 'zustand';

export interface DroppedElement {
  id: string;
  type: string;
  content: string;
  children?: DroppedElement[];
  parentId?: string;
}

interface BuilderStore {
  selectedElementId: string | null;
  droppedElements: DroppedElement[];
  pendingDrop: { type: string } | null;
  setSelectedElementId: (id: string | null) => void;
  addElement: (element: DroppedElement, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<DroppedElement>) => void;
  setPendingDrop: (drop: { type: string } | null) => void;
  getElementById: (id: string) => DroppedElement | null;
  moveElement: (elementId: string, newParentId: string | null, newIndex?: number) => void;
  reorderElements: (parentId: string | null, oldIndex: number, newIndex: number) => void;
  removeElement: (elementId: string) => void;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  selectedElementId: null,
  droppedElements: [],
  pendingDrop: null,
  setSelectedElementId: id => set({ selectedElementId: id }),
  addElement: (element, parentId) =>
    set(state => {
      if (parentId) {
        // Recursively find and update the parent element
        const updateElementRecursively = (elements: DroppedElement[]): DroppedElement[] => {
          return elements.map(el => {
            if (el.id === parentId) {
              return {
                ...el,
                children: [...(el.children || []), { ...element, parentId }],
              };
            }
            if (el.children && el.children.length > 0) {
              return {
                ...el,
                children: updateElementRecursively(el.children),
              };
            }
            return el;
          });
        };

        return {
          droppedElements: updateElementRecursively(state.droppedElements),
          pendingDrop: null,
        };
      } else {
        // Add to root level
        return {
          droppedElements: [...state.droppedElements, element],
          pendingDrop: null,
        };
      }
    }),
  updateElement: (id, updates) =>
    set(state => ({
      droppedElements: state.droppedElements.map(el => (el.id === id ? { ...el, ...updates } : el)),
    })),
  setPendingDrop: drop => set({ pendingDrop: drop }),
  getElementById: id => {
    const state = get();
    const findElement = (elements: DroppedElement[]): DroppedElement | null => {
      for (const element of elements) {
        if (element.id === id) return element;
        if (element.children) {
          const found = findElement(element.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findElement(state.droppedElements);
  },
  
  removeElement: (elementId) =>
    set(state => {
      const removeElementRecursively = (elements: DroppedElement[]): DroppedElement[] => {
        return elements
          .filter(el => el.id !== elementId)
          .map(el => ({
            ...el,
            children: el.children ? removeElementRecursively(el.children) : undefined,
          }));
      };

      return {
        droppedElements: removeElementRecursively(state.droppedElements),
      };
    }),

  moveElement: (elementId, newParentId, newIndex) =>
    set(state => {
      // First, find and remove the element from its current location
      let elementToMove: DroppedElement | null = null;
      
      const removeFromParent = (elements: DroppedElement[]): DroppedElement[] => {
        return elements
          .map(el => {
            if (el.id === elementId) {
              elementToMove = el;
              return null; // Mark for removal
            }
            if (el.children) {
              return {
                ...el,
                children: removeFromParent(el.children),
              };
            }
            return el;
          })
          .filter(Boolean) as DroppedElement[];
      };

      removeFromParent(state.droppedElements);
      if (!elementToMove) return state; // Element not found

      // Update the element's parentId
      const movedElement = { ...elementToMove!, parentId: newParentId };

      // Add to new location
      if (newParentId) {
        const addToParent = (elements: DroppedElement[]): DroppedElement[] => {
          return elements.map(el => {
            if (el.id === newParentId) {
              const children = el.children || [];
              const insertIndex = newIndex !== undefined ? Math.min(newIndex, children.length) : children.length;
              const newChildren = [...children];
              newChildren.splice(insertIndex, 0, movedElement);
              return { ...el, children: newChildren };
            }
            if (el.children) {
              return { ...el, children: addToParent(el.children) };
            }
            return el;
          });
        };

        return {
          droppedElements: addToParent(state.droppedElements.filter(el => el.id !== elementId)),
        };
      } else {
        // Move to root level
        const rootElements = state.droppedElements.filter(el => el.id !== elementId);
        const insertIndex = newIndex !== undefined ? Math.min(newIndex, rootElements.length) : rootElements.length;
        const newRootElements = [...rootElements];
        newRootElements.splice(insertIndex, 0, { ...movedElement, parentId: undefined });
        
        return { droppedElements: newRootElements };
      }
    }),

  reorderElements: (parentId, oldIndex, newIndex) =>
    set(state => {
      if (parentId) {
        // Reorder within a container
        const reorderInParent = (elements: DroppedElement[]): DroppedElement[] => {
          return elements.map(el => {
            if (el.id === parentId && el.children) {
              const newChildren = [...el.children];
              const [movedElement] = newChildren.splice(oldIndex, 1);
              newChildren.splice(newIndex, 0, movedElement);
              return { ...el, children: newChildren };
            }
            if (el.children) {
              return { ...el, children: reorderInParent(el.children) };
            }
            return el;
          });
        };

        return {
          droppedElements: reorderInParent(state.droppedElements),
        };
      } else {
        // Reorder at root level
        const newElements = [...state.droppedElements];
        const [movedElement] = newElements.splice(oldIndex, 1);
        newElements.splice(newIndex, 0, movedElement);
        
        return { droppedElements: newElements };
      }
    }),
}));

// TODO: Migrate existing components to use the new store architecture
// Import the new stores like this:
// import { useElementStore, useCanvasStore, useHistoryStore, useUIStore } from '../stores';
