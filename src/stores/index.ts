// Central store exports and integration
import useElementStore from './elementStore';
import useCanvasStore from './canvasStore';
import useHistoryStore, { setupHistoryKeyboardShortcuts } from './historyStore';
import useUIStore, { setupUIKeyboardShortcuts } from './uiStore';

// Re-export individual stores
export { 
  useElementStore,
  useCanvasStore, 
  useHistoryStore,
  useUIStore
};

// Re-export utilities
export { canvasUtils } from './canvasStore';
export { createSnapshot, historyActions, setupHistoryKeyboardShortcuts } from './historyStore';
export { notificationHelpers, setupUIKeyboardShortcuts, layoutUtils } from './uiStore';

// Combined store hook for convenience
export const useBuilderStores = () => ({
  elements: useElementStore(),
  canvas: useCanvasStore(),
  history: useHistoryStore(),
  ui: useUIStore()
});

// Global store integration and synchronization
export const setupStoreIntegration = () => {
  // Setup keyboard shortcuts
  const cleanupHistoryShortcuts = setupHistoryKeyboardShortcuts();
  const cleanupUIShortcuts = setupUIKeyboardShortcuts();

  // Setup store synchronization
  let isUpdating = false;

  // Sync element changes with history
  useElementStore.subscribe((state, prevState) => {
    if (isUpdating) return;
    
    const history = useHistoryStore.getState();
    
    // Compare elements to detect changes
    const elementsChanged = JSON.stringify(state.elements) !== JSON.stringify(prevState.elements);
    const selectionChanged = JSON.stringify(state.selectedElementIds) !== JSON.stringify(prevState.selectedElementIds);
    
    if (elementsChanged && !history.isBatching) {
      // Create history entry for element changes
      // This would be more sophisticated in a real implementation
      // to track specific changes and create appropriate history entries
      console.log('Element state changed, consider adding to history');
    }
  });

  // Global state restoration (used by history)
  if (typeof window !== 'undefined') {
    (window as any).__restoreBuilderState = (snapshot: any) => {
      isUpdating = true;
      
      // Restore element state
      useElementStore.setState({
        elements: snapshot.elements,
        selectedElementIds: snapshot.selectedElementIds
      });

      // Restore canvas state if provided
      if (snapshot.canvasState) {
        useCanvasStore.setState(snapshot.canvasState);
      }
      
      isUpdating = false;
    };
  }

  // Return cleanup function
  return () => {
    cleanupHistoryShortcuts?.();
    cleanupUIShortcuts?.();
    
    if (typeof window !== 'undefined') {
      delete (window as any).__restoreBuilderState;
    }
  };
};

// Store persistence utilities
export const persistenceUtils = {
  // Save current state to localStorage
  saveToLocalStorage: (key: string = 'builder-state') => {
    if (typeof window === 'undefined') return;
    
    const state = {
      elements: useElementStore.getState().elements,
      selectedElementIds: useElementStore.getState().selectedElementIds,
      canvasState: {
        viewportMode: useCanvasStore.getState().viewportMode,
        zoomLevel: useCanvasStore.getState().zoomLevel,
        panOffset: useCanvasStore.getState().panOffset
      },
      timestamp: Date.now()
    };

    localStorage.setItem(key, JSON.stringify(state));
  },

  // Load state from localStorage
  loadFromLocalStorage: (key: string = 'builder-state') => {
    if (typeof window === 'undefined') return null;
    
    const savedState = localStorage.getItem(key);
    if (!savedState) return null;

    try {
      const state = JSON.parse(savedState);
      
      // Restore element state
      useElementStore.setState({
        elements: state.elements || [],
        selectedElementIds: state.selectedElementIds || []
      });

      // Restore canvas state
      if (state.canvasState) {
        useCanvasStore.setState(state.canvasState);
      }

      return state;
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      return null;
    }
  },

  // Clear saved state
  clearLocalStorage: (key: string = 'builder-state') => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  // Auto-save functionality
  setupAutoSave: (interval: number = 30000, key: string = 'builder-autosave') => {
    if (typeof window === 'undefined') return;

    const autoSave = setInterval(() => {
      persistenceUtils.saveToLocalStorage(key);
    }, interval);

    return () => clearInterval(autoSave);
  }
};

// Development utilities
export const devUtils = {
  // Get current state snapshot for debugging
  getStateSnapshot: () => ({
    elements: useElementStore.getState().elements,
    selectedElementIds: useElementStore.getState().selectedElementIds,
    canvas: {
      viewportMode: useCanvasStore.getState().viewportMode,
      previewMode: useCanvasStore.getState().previewMode,
      zoomLevel: useCanvasStore.getState().zoomLevel,
      panOffset: useCanvasStore.getState().panOffset
    },
    history: {
      historyLength: useHistoryStore.getState().history.length,
      currentIndex: useHistoryStore.getState().currentIndex,
      canUndo: useHistoryStore.getState().canUndo(),
      canRedo: useHistoryStore.getState().canRedo()
    },
    ui: {
      leftPanelOpen: useUIStore.getState().leftPanelOpen,
      rightPanelOpen: useUIStore.getState().rightPanelOpen,
      bottomPanelOpen: useUIStore.getState().bottomPanelOpen,
      notifications: useUIStore.getState().notifications.length
    }
  }),

  // Reset all stores to initial state
  resetAllStores: () => {
    useElementStore.setState({
      elements: [],
      selectedElementIds: [],
      hoveredElementId: null,
      clipboard: []
    });

    useCanvasStore.getState().resetView();
    useCanvasStore.setState({
      viewportMode: 'desktop' as any,
      previewMode: 'edit' as any
    });

    useHistoryStore.getState().clearHistory();

    useUIStore.getState().clearNotifications();
  },

  // Log store state changes (for debugging)
  enableStateLogging: () => {
    const logState = (storeName: string) => (state: any, prevState: any) => {
      console.group(`${storeName} State Change`);
      console.log('Previous:', prevState);
      console.log('Current:', state);
      console.groupEnd();
    };

    const unsubscribeElement = useElementStore.subscribe(logState('Element'));
    const unsubscribeCanvas = useCanvasStore.subscribe(logState('Canvas'));
    const unsubscribeHistory = useHistoryStore.subscribe(logState('History'));
    const unsubscribeUI = useUIStore.subscribe(logState('UI'));

    return () => {
      unsubscribeElement();
      unsubscribeCanvas();
      unsubscribeHistory();
      unsubscribeUI();
    };
  }
};

// Type-safe store selectors
export const storeSelectors = {
  // Element selectors
  getSelectedElements: () => useElementStore.getState().getSelectedElements(),
  getElementById: (id: string) => useElementStore.getState().getElementById(id),
  getElementChildren: (id: string) => useElementStore.getState().getElementChildren(id),
  
  // Canvas selectors
  getCurrentViewport: () => useCanvasStore.getState().viewportMode,
  getCanvasTransform: () => {
    const { zoomLevel, panOffset } = useCanvasStore.getState();
    return { zoomLevel, panOffset };
  },
  
  // History selectors
  getHistoryState: () => {
    const state = useHistoryStore.getState();
    return {
      canUndo: state.canUndo(),
      canRedo: state.canRedo(),
      undoDescription: state.getUndoDescription(),
      redoDescription: state.getRedoDescription()
    };
  },
  
  // UI selectors
  getPanelLayout: () => {
    const state = useUIStore.getState();
    return {
      leftPanel: { open: state.leftPanelOpen, width: state.leftPanelWidth },
      rightPanel: { open: state.rightPanelOpen, width: state.rightPanelWidth },
      bottomPanel: { open: state.bottomPanelOpen, height: state.bottomPanelHeight }
    };
  }
};

export default {
  useElementStore,
  useCanvasStore,
  useHistoryStore,
  useUIStore,
  useBuilderStores,
  setupStoreIntegration,
  persistenceUtils,
  devUtils,
  storeSelectors
};