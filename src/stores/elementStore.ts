import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { BuilderElement, ElementStore } from '../types/builder';
import { ComponentType } from '../types/builder';
import { createSnapshot, historyActions } from './historyStore';

const useElementStore = create<ElementStore>((set, get) => ({
  elements: [],
  selectedElementIds: [],
  hoveredElementId: null,
  clipboard: [],

  // Element operations
  addElement: (element, parentId, index) => {
    const state = get();
    const beforeSnapshot = createSnapshot(state.elements, state.selectedElementIds);
    
    const newElement: BuilderElement = {
      ...element,
      id: uuidv4(),
      parentId,
      order: index ?? get().elements.filter(el => el.parentId === parentId).length
    };

    set(currentState => ({
      elements: [...currentState.elements, newElement]
    }));

    // Track history after state change
    const afterState = get();
    const afterSnapshot = createSnapshot(afterState.elements, afterState.selectedElementIds);
    
    // Import history store dynamically to avoid circular dependency
    import('./historyStore').then(({ default: useHistoryStore }) => {
      useHistoryStore.getState().pushHistory({
        ...historyActions.createElement(newElement.id, `Add ${element.type}`),
        beforeState: beforeSnapshot,
        afterState: afterSnapshot
      });
    });

    return newElement.id;
  },

  addElementWithChildren: (element, parentId, index) => {
    const elementsToAdd: BuilderElement[] = [];
    
    // Recursively add element and its children
    const processElement = (el: BuilderElement, newParentId?: string): string => {
      const newId = el.id || uuidv4(); // Keep existing ID if present
      const order = index ?? get().elements.filter(elem => elem.parentId === newParentId).length + elementsToAdd.filter(elem => elem.parentId === newParentId).length;
      
      const processedElement: BuilderElement = {
        ...el,
        id: newId,
        parentId: newParentId,
        order
      };
      
      // Remove children from the element since we'll add them separately
      const { children: _, ...elementWithoutChildren } = processedElement;
      elementsToAdd.push(elementWithoutChildren);
      
      // Process children if they exist
      if (el.children && el.children.length > 0) {
        el.children.forEach((child, childIndex) => {
          processElement(child, newId);
        });
      }
      
      return newId;
    };
    
    const newElementId = processElement(element, parentId);
    
    set(state => ({
      elements: [...state.elements, ...elementsToAdd]
    }));

    return newElementId;
  },

  updateElement: (id, updates, viewport) => {
    const state = get();
    const beforeSnapshot = createSnapshot(state.elements, state.selectedElementIds);
    
    set(currentState => ({
      elements: currentState.elements.map(element => {
        if (element.id === id) {
          if (viewport && updates.styles) {
            // Update responsive styles for specific viewport
            return {
              ...element,
              ...updates,
              styles: {
                ...element.styles,
                [viewport]: {
                  ...element.styles?.[viewport],
                  ...updates.styles?.[viewport]
                }
              }
            };
          }
          return { ...element, ...updates };
        }
        return element;
      })
    }));

    // Track history after state change
    const afterState = get();
    const afterSnapshot = createSnapshot(afterState.elements, afterState.selectedElementIds);
    
    // Import history store dynamically to avoid circular dependency
    import('./historyStore').then(({ default: useHistoryStore }) => {
      useHistoryStore.getState().pushHistory({
        ...historyActions.updateElement(id, `Update ${state.elements.find(el => el.id === id)?.type || 'element'}`),
        beforeState: beforeSnapshot,
        afterState: afterSnapshot
      });
    });
  },

  updateElements: (updates) => {
    set(state => ({
      elements: state.elements.map(element => {
        const update = updates.find(u => u.id === element.id);
        return update ? { ...element, ...update.updates } : element;
      })
    }));
  },

  deleteElement: (id) => {
    set(state => {
      const elementToDelete = state.elements.find(el => el.id === id);
      if (!elementToDelete) return state;

      // Recursively find all children to delete
      const getElementAndChildren = (elementId: string): string[] => {
        const children = state.elements
          .filter(el => el.parentId === elementId)
          .map(el => el.id);
        return [elementId, ...children.flatMap(getElementAndChildren)];
      };

      const idsToDelete = getElementAndChildren(id);
      
      return {
        elements: state.elements.filter(el => !idsToDelete.includes(el.id)),
        selectedElementIds: state.selectedElementIds.filter(selectedId => !idsToDelete.includes(selectedId))
      };
    });
  },

  deleteElements: (ids) => {
    ids.forEach(id => get().deleteElement(id));
  },

  duplicateElement: (id) => {
    const state = get();
    const element = state.getElementById(id);
    if (!element) return '';

    const duplicateWithChildren = (el: BuilderElement, newParentId?: string): BuilderElement => {
      const newId = uuidv4();
      const duplicated: BuilderElement = {
        ...el,
        id: newId,
        parentId: newParentId || el.parentId,
        name: el.name ? `${el.name} Copy` : undefined
      };

      // Add the duplicated element
      set(state => ({
        elements: [...state.elements, duplicated]
      }));

      // Duplicate children recursively
      const children = state.elements.filter(child => child.parentId === el.id);
      children.forEach(child => duplicateWithChildren(child, newId));

      return duplicated;
    };

    const duplicated = duplicateWithChildren(element);
    return duplicated.id;
  },

  duplicateElements: (ids) => {
    return ids.map(id => get().duplicateElement(id)).filter(Boolean);
  },

  moveElement: (id, newParentId, index) => {
    const state = get();
    const beforeSnapshot = createSnapshot(state.elements, state.selectedElementIds);
    
    set(currentState => {
      const element = currentState.elements.find(el => el.id === id);
      if (!element) return currentState;

      // Update the element's parent and order
      const updatedElements = currentState.elements.map(el => {
        if (el.id === id) {
          return {
            ...el,
            parentId: newParentId,
            order: index ?? 0
          };
        }
        // Reorder siblings if necessary
        if (el.parentId === newParentId && el.id !== id) {
          const currentOrder = el.order ?? 0;
          const targetIndex = index ?? 0;
          if (currentOrder >= targetIndex) {
            return { ...el, order: currentOrder + 1 };
          }
        }
        return el;
      });

      return { elements: updatedElements };
    });

    // Track history after state change
    const afterState = get();
    const afterSnapshot = createSnapshot(afterState.elements, afterState.selectedElementIds);
    
    // Import history store dynamically to avoid circular dependency
    import('./historyStore').then(({ default: useHistoryStore }) => {
      useHistoryStore.getState().pushHistory({
        ...historyActions.moveElement(id, `Move ${state.elements.find(el => el.id === id)?.type || 'element'}`),
        beforeState: beforeSnapshot,
        afterState: afterSnapshot
      });
    });
  },

  reorderElement: (id, newIndex) => {
    set(state => {
      const element = state.elements.find(el => el.id === id);
      if (!element) return state;

      const siblings = state.elements
        .filter(el => el.parentId === element.parentId && el.id !== id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const updatedElements = state.elements.map(el => {
        if (el.id === id) {
          return { ...el, order: newIndex };
        }
        if (el.parentId === element.parentId && el.id !== id) {
          const currentIndex = siblings.findIndex(s => s.id === el.id);
          let adjustedIndex = currentIndex;
          if (currentIndex >= newIndex) {
            adjustedIndex = currentIndex + 1;
          }
          return { ...el, order: adjustedIndex };
        }
        return el;
      });

      return { elements: updatedElements };
    });
  },

  // Selection
  selectElement: (id, multiSelect = false) => {
    set(state => {
      // Don't allow selecting empty or invalid IDs
      if (!id || id.length === 0) {
        return { selectedElementIds: [] };
      }
      
      if (multiSelect) {
        const isSelected = state.selectedElementIds.includes(id);
        return {
          selectedElementIds: isSelected 
            ? state.selectedElementIds.filter(selectedId => selectedId !== id)
            : [...state.selectedElementIds, id]
        };
      }
      return { selectedElementIds: [id] };
    });
  },

  selectElements: (ids) => {
    set({ selectedElementIds: ids });
  },

  selectAll: () => {
    set(state => ({
      selectedElementIds: state.elements.map(el => el.id)
    }));
  },

  clearSelection: () => {
    set({ selectedElementIds: [] });
  },

  setHoveredElement: (id) => {
    set({ hoveredElementId: id });
  },

  // Clipboard operations
  copyElements: (ids) => {
    const state = get();
    const elementsToCopy = ids
      .map(id => state.getElementById(id))
      .filter(Boolean) as BuilderElement[];
    
    set({ clipboard: elementsToCopy });
  },

  cutElements: (ids) => {
    get().copyElements(ids);
    get().deleteElements(ids);
  },

  pasteElements: (parentId) => {
    const state = get();
    if (state.clipboard.length === 0) return [];

    const pastedIds: string[] = [];
    
    state.clipboard.forEach(element => {
      const pastedId = get().duplicateElement(element.id);
      if (pastedId && parentId) {
        get().moveElement(pastedId, parentId);
      }
      if (pastedId) pastedIds.push(pastedId);
    });

    return pastedIds;
  },

  // Getters
  getSelectedElements: () => {
    const state = get();
    return state.selectedElementIds
      .map(id => state.getElementById(id))
      .filter(Boolean) as BuilderElement[];
  },

  getElementById: (id) => {
    const state = get();
    return state.elements.find(el => el.id === id) || null;
  },

  getElementByPath: (path) => {
    // Path format: "parent.child.grandchild"
    const state = get();
    const pathSegments = path.split('.');
    
    let currentElement = state.elements.find(el => 
      !el.parentId && el.type === pathSegments[0] as ComponentType
    );
    
    for (let i = 1; i < pathSegments.length && currentElement; i++) {
      currentElement = state.elements.find(el => 
        el.parentId === currentElement!.id && el.type === pathSegments[i] as ComponentType
      );
    }
    
    return currentElement || null;
  },

  getElementChildren: (id) => {
    const state = get();
    return state.elements
      .filter(el => el.parentId === id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  getElementParent: (id) => {
    const state = get();
    const element = state.getElementById(id);
    return element?.parentId ? state.getElementById(element.parentId) : null;
  },

  getElementAncestors: (id) => {
    const state = get();
    const ancestors: BuilderElement[] = [];
    let currentElement = state.getElementById(id);
    
    while (currentElement?.parentId) {
      const parent = state.getElementById(currentElement.parentId);
      if (parent) {
        ancestors.unshift(parent);
        currentElement = parent;
      } else {
        break;
      }
    }
    
    return ancestors;
  },

  getElementTree: () => {
    const state = get();
    const rootElements = state.elements
      .filter(el => !el.parentId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    
    const buildTree = (element: BuilderElement): BuilderElement => {
      const children = state.getElementChildren(element.id);
      return {
        ...element,
        children: children.map(buildTree)
      };
    };
    
    return rootElements.map(buildTree);
  },

  // Queries
  findElements: (predicate) => {
    const state = get();
    return state.elements.filter(predicate);
  },

  getElementsByType: (type) => {
    const state = get();
    return state.elements.filter(el => el.type === type);
  },

  searchElements: (query) => {
    const state = get();
    const lowerQuery = query.toLowerCase();
    
    return state.elements.filter(element => {
      // Search in content
      if (element.content?.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in name
      if (element.name?.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in type
      if (element.type.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in properties
      const propertiesText = JSON.stringify(element.properties).toLowerCase();
      if (propertiesText.includes(lowerQuery)) return true;
      
      return false;
    });
  }
}));

// Set up global state restoration for history system
if (typeof window !== 'undefined') {
  (window as any).__restoreBuilderState = (snapshot: any) => {
    const elementStore = useElementStore.getState();
    
    // Restore elements and selection
    useElementStore.setState({
      elements: snapshot.elements || [],
      selectedElementIds: snapshot.selectedElementIds || [],
    });
  };
}

export default useElementStore;