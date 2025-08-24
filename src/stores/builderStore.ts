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
  isPreviewMode: boolean;
  addElement: (element: Partial<BuilderElement>) => string;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  addLayout: (columnCount: number, insertPosition?: 'above' | 'below', targetLayoutId?: string) => string;
  addRow: (layoutId: string) => string;
  addColumn: (rowId: string) => string;
  reorderLayout: (layoutId: string, targetLayoutId: string, position: 'above' | 'below') => void;
  moveElement: (elementId: string, targetColumnId: string) => void;
  reorderElements: (elementId: string, targetElementId: string, position: 'above' | 'below') => void;
  togglePreviewMode: () => void;
  setPreviewMode: (isPreview: boolean) => void;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  elements: [],
  selectedElementId: null,
  isPreviewMode: false,

  addElement: (element) => {
    const { elements } = get();
    
    // Calculate the order for the new element
    const siblingElements = elements.filter(el => el.parentId === element.parentId);
    const maxOrder = siblingElements.reduce((max, el) => Math.max(max, el.order || 0), -1);
    
    const newElement: BuilderElement = {
      id: uuidv4(),
      type: element.type || 'text',
      content: element.content || '',
      parentId: element.parentId || null,
      order: element.order || (maxOrder + 1),
      styles: element.styles || {}
    };

    set((state) => ({
      elements: [...state.elements, newElement]
    }));
    
    return newElement.id; // Return the new element ID for further operations
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
      styles: {
        padding: '40px',
        backgroundColor: 'transparent'
      }
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
  },

  moveElement: (elementId, targetColumnId) => {
    get().updateElement(elementId, { parentId: targetColumnId });
  },

  reorderElements: (elementId, targetElementId, position) => {
    const { elements } = get();
    const sourceElement = elements.find(el => el.id === elementId);
    const targetElement = elements.find(el => el.id === targetElementId);
    
    if (!sourceElement || !targetElement) {
      console.error('Cannot reorder: source or target element not found', { elementId, targetElementId });
      return;
    }
    
    // If moving to a different column, update parent first
    if (sourceElement.parentId !== targetElement.parentId) {
      sourceElement.parentId = targetElement.parentId;
    }
    
    // Get all elements in the target column
    const columnElements = elements
      .filter(el => el.parentId === targetElement.parentId && el.id !== elementId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const targetIndex = columnElements.findIndex(el => el.id === targetElementId);
    
    // Insert source element at the correct position
    const insertIndex = position === 'above' ? targetIndex : targetIndex + 1;
    columnElements.splice(insertIndex, 0, sourceElement);
    
    // Update orders for all elements in the column
    set((state) => ({
      elements: state.elements.map(el => {
        if (el.parentId === targetElement.parentId || el.id === elementId) {
          const newIndex = columnElements.findIndex(e => e.id === el.id);
          if (newIndex !== -1) {
            return { 
              ...el, 
              parentId: targetElement.parentId,
              order: newIndex 
            };
          }
        }
        return el;
      })
    }));
    
    console.log('Reordered elements:', { 
      sourceId: elementId, 
      targetId: targetElementId, 
      position,
      newOrder: columnElements.map(e => ({ id: e.id, order: columnElements.findIndex(el => el.id === e.id) }))
    });
  },

  togglePreviewMode: () => {
    set((state) => ({ 
      isPreviewMode: !state.isPreviewMode,
      selectedElementId: !state.isPreviewMode ? null : state.selectedElementId 
    }));
  },

  setPreviewMode: (isPreview) => {
    set({ 
      isPreviewMode: isPreview,
      selectedElementId: isPreview ? null : get().selectedElementId 
    });
  }
}));