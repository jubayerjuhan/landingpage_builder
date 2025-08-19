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
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  selectedElementId: null,
  droppedElements: [],
  pendingDrop: null,
  setSelectedElementId: id => set({ selectedElementId: id }),
  addElement: (element, parentId) =>
    set(state => {
      if (parentId) {
        // Add to parent's children
        const updatedElements = state.droppedElements.map(el => {
          if (el.id === parentId) {
            return {
              ...el,
              children: [...(el.children || []), { ...element, parentId }],
            };
          }
          return el;
        });
        return {
          droppedElements: updatedElements,
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
}));

// TODO: Migrate existing components to use the new store architecture
// Import the new stores like this:
// import { useElementStore, useCanvasStore, useHistoryStore, useUIStore } from '../stores';
