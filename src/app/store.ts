import { create } from 'zustand';

export interface DroppedElement {
  id: string;
  type: string;
  content: string;
}

interface BuilderStore {
  selectedElementId: string | null;
  droppedElements: DroppedElement[];
  pendingDrop: { type: string } | null;
  setSelectedElementId: (id: string | null) => void;
  addElement: (element: DroppedElement) => void;
  setPendingDrop: (drop: { type: string } | null) => void;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  selectedElementId: null,
  droppedElements: [],
  pendingDrop: null,
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  addElement: (element) => set((state) => ({ 
    droppedElements: [...state.droppedElements, element],
    pendingDrop: null 
  })),
  setPendingDrop: (drop) => set({ pendingDrop: drop }),
}));