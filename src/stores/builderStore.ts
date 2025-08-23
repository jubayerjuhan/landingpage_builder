import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface BuilderElement {
  id: string;
  type: string;
  content: string;
  parentId: string | null;
  order: number;
  styles?: Record<string, any>;
}

interface BuilderStore {
  elements: BuilderElement[];
  selectedElementId: string | null;
  addElement: (element: Partial<BuilderElement>) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  addLayout: (columnCount: number, insertPosition?: 'above' | 'below', targetLayoutId?: string) => string;
  addRow: (layoutId: string) => string;
  addColumn: (rowId: string) => string;
  reorderLayout: (layoutId: string, targetLayoutId: string, position: 'above' | 'below') => void;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  elements: [],
  selectedElementId: null,

  addElement: (element) => {
    const newElement: BuilderElement = {
      id: uuidv4(),
      type: element.type || 'text',
      content: element.content || '',
      parentId: element.parentId || null,
      order: element.order || 0,
      styles: element.styles || {}
    };

    set((state) => ({
      elements: [...state.elements, newElement]
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id)
    }));
  },

  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  addLayout: (columnCount, insertPosition = 'below', targetLayoutId) => {
    const { elements } = get();
    const layouts = elements.filter(el => el.type === 'layout').sort((a, b) => a.order - b.order);
    
    let newOrder = layouts.length;
    
    if (targetLayoutId && insertPosition) {
      const targetLayout = layouts.find(l => l.id === targetLayoutId);
      if (targetLayout) {
        const targetIndex = layouts.findIndex(l => l.id === targetLayoutId);
        if (insertPosition === 'above') {
          newOrder = targetLayout.order;
          // Increment order of layouts at or after this position
          layouts.slice(targetIndex).forEach(layout => {
            get().updateElement(layout.id, { order: layout.order + 1 });
          });
        } else {
          newOrder = targetLayout.order + 1;
          // Increment order of layouts after this position
          layouts.slice(targetIndex + 1).forEach(layout => {
            get().updateElement(layout.id, { order: layout.order + 1 });
          });
        }
      }
    }

    const layoutId = uuidv4();
    const layout: BuilderElement = {
      id: layoutId,
      type: 'layout',
      content: '',
      parentId: null,
      order: newOrder,
      styles: {}
    };

    set((state) => ({
      elements: [...state.elements, layout]
    }));

    // Create row and columns
    const rowId = get().addRow(layoutId);
    for (let i = 0; i < columnCount; i++) {
      get().addColumn(rowId);
    }

    return layoutId;
  },

  addRow: (layoutId) => {
    const rowId = uuidv4();
    const row: BuilderElement = {
      id: rowId,
      type: 'row',
      content: '',
      parentId: layoutId,
      order: 0,
      styles: {
        display: 'flex',
        gap: '20px'
      }
    };

    set((state) => ({
      elements: [...state.elements, row]
    }));

    return rowId;
  },

  addColumn: (rowId) => {
    const { elements } = get();
    const existingColumns = elements.filter(el => el.type === 'column' && el.parentId === rowId);
    
    const columnId = uuidv4();
    const column: BuilderElement = {
      id: columnId,
      type: 'column',
      content: '',
      parentId: rowId,
      order: existingColumns.length,
      styles: {
        flex: '1',
        minHeight: '100px'
      }
    };

    set((state) => ({
      elements: [...state.elements, column]
    }));

    return columnId;
  },

  reorderLayout: (layoutId, targetLayoutId, position) => {
    const { elements } = get();
    const layouts = elements.filter(el => el.type === 'layout').sort((a, b) => a.order - b.order);
    
    const sourceLayout = layouts.find(l => l.id === layoutId);
    const targetLayout = layouts.find(l => l.id === targetLayoutId);
    
    if (!sourceLayout || !targetLayout) return;
    
    const sourceIndex = layouts.findIndex(l => l.id === layoutId);
    const targetIndex = layouts.findIndex(l => l.id === targetLayoutId);
    
    // Create a new array with the layout moved to the new position
    const newLayouts = [...layouts];
    newLayouts.splice(sourceIndex, 1); // Remove source layout
    
    let insertIndex;
    if (position === 'above') {
      insertIndex = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
    } else {
      insertIndex = targetIndex >= sourceIndex ? targetIndex : targetIndex + 1;
    }
    
    newLayouts.splice(insertIndex, 0, sourceLayout); // Insert at new position
    
    // Update all layout orders
    set((state) => ({
      elements: state.elements.map(el => {
        if (el.type === 'layout') {
          const newIndex = newLayouts.findIndex(l => l.id === el.id);
          return { ...el, order: newIndex };
        }
        return el;
      })
    }));
  }
}));