import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { 
  HistoryStore, 
  HistoryEntry, 
  HistorySnapshot,
  HistoryActionType,
  BuilderElement 
} from '../types/builder';

const DEFAULT_MAX_HISTORY_SIZE = 50;

const useHistoryStore = create<HistoryStore>((set, get) => {
  let batchDescription = '';
  let batchId = '';

  return {
    history: [],
    currentIndex: -1,
    maxHistorySize: DEFAULT_MAX_HISTORY_SIZE,
    isBatching: false,

    // History operations
    undo: () => {
      const state = get();
      if (!state.canUndo()) return false;

      const currentEntry = state.history[state.currentIndex];
      if (!currentEntry) return false;

      // Apply the before state
      restoreSnapshot(currentEntry.beforeState);

      set({ currentIndex: state.currentIndex - 1 });
      return true;
    },

    redo: () => {
      const state = get();
      if (!state.canRedo()) return false;

      const nextEntry = state.history[state.currentIndex + 1];
      if (!nextEntry) return false;

      // Apply the after state
      restoreSnapshot(nextEntry.afterState);

      set({ currentIndex: state.currentIndex + 1 });
      return true;
    },

    pushHistory: (entry) => {
      const state = get();
      
      // If we're in the middle of history, remove everything after current index
      const historyToKeep = state.history.slice(0, state.currentIndex + 1);
      
      // Create the full history entry
      const fullEntry: HistoryEntry = {
        ...entry,
        id: uuidv4(),
        timestamp: Date.now(),
        isBatch: state.isBatching,
        batchId: state.isBatching ? batchId : undefined
      };

      // Add the new entry
      const newHistory = [...historyToKeep, fullEntry];
      
      // Trim history if it exceeds max size
      const trimmedHistory = newHistory.length > state.maxHistorySize
        ? newHistory.slice(-state.maxHistorySize)
        : newHistory;

      set({
        history: trimmedHistory,
        currentIndex: trimmedHistory.length - 1
      });
    },

    replaceCurrentHistory: (entry) => {
      const state = get();
      if (state.currentIndex < 0) {
        // No current entry to replace, just push
        get().pushHistory(entry);
        return;
      }

      const fullEntry: HistoryEntry = {
        ...entry,
        id: state.history[state.currentIndex].id,
        timestamp: Date.now(),
        isBatch: state.isBatching,
        batchId: state.isBatching ? batchId : undefined
      };

      const newHistory = [...state.history];
      newHistory[state.currentIndex] = fullEntry;

      set({ history: newHistory });
    },

    clearHistory: () => {
      set({
        history: [],
        currentIndex: -1,
        isBatching: false
      });
    },

    // Batch operations
    startBatch: (description) => {
      batchDescription = description;
      batchId = uuidv4();
      set({ isBatching: true });
    },

    endBatch: () => {
      const state = get();
      if (!state.isBatching) return;

      // If we have batch entries, create a summary entry
      const batchEntries = state.history.filter(entry => entry.batchId === batchId);
      
      if (batchEntries.length > 1) {
        // Combine all batch entries into one
        const firstEntry = batchEntries[0];
        const lastEntry = batchEntries[batchEntries.length - 1];
        
        const combinedEntry: HistoryEntry = {
          id: uuidv4(),
          timestamp: Date.now(),
          action: {
            type: HistoryActionType.BATCH_UPDATE,
            elementIds: [...new Set(batchEntries.flatMap(e => e.action.elementIds))]
          },
          beforeState: firstEntry.beforeState,
          afterState: lastEntry.afterState,
          description: batchDescription,
          isBatch: true,
          batchId
        };

        // Remove individual batch entries and add combined entry
        const nonBatchHistory = state.history.filter(entry => entry.batchId !== batchId);
        
        set({
          history: [...nonBatchHistory, combinedEntry],
          currentIndex: nonBatchHistory.length
        });
      }

      set({ isBatching: false });
      batchDescription = '';
      batchId = '';
    },

    // Getters
    canUndo: () => {
      const state = get();
      return state.currentIndex >= 0;
    },

    canRedo: () => {
      const state = get();
      return state.currentIndex < state.history.length - 1;
    },

    getUndoDescription: () => {
      const state = get();
      const entry = state.history[state.currentIndex];
      return entry?.description || null;
    },

    getRedoDescription: () => {
      const state = get();
      const entry = state.history[state.currentIndex + 1];
      return entry?.description || null;
    },

    getHistorySize: () => {
      const state = get();
      return state.history.length;
    }
  };
});

// Helper function to create a snapshot of current state
export const createSnapshot = (
  elements: BuilderElement[],
  selectedElementIds: string[],
  canvasState?: Partial<{
    viewportMode: string;
    zoomLevel: number;
    panOffset: { x: number; y: number };
  }>
): HistorySnapshot => ({
  elements: JSON.parse(JSON.stringify(elements)), // Deep clone
  selectedElementIds: [...selectedElementIds],
  canvasState
});

// Helper function to restore a snapshot
const restoreSnapshot = (snapshot: HistorySnapshot) => {
  // This would typically dispatch actions to restore the state
  // For now, we'll assume the stores have methods to restore state
  if (typeof window !== 'undefined' && (window as any).__restoreBuilderState) {
    (window as any).__restoreBuilderState(snapshot);
  }
};

// Helper function to create common history actions
export const historyActions = {
  createElement: (elementId: string, description?: string): Omit<HistoryEntry, 'id' | 'timestamp'> => ({
    action: {
      type: HistoryActionType.ADD_ELEMENT,
      elementIds: [elementId]
    },
    beforeState: createSnapshot([], []),
    afterState: createSnapshot([], []),
    description: description || `Add ${elementId}`
  }),

  updateElement: (elementId: string, description?: string): Omit<HistoryEntry, 'id' | 'timestamp'> => ({
    action: {
      type: HistoryActionType.UPDATE_ELEMENT,
      elementIds: [elementId]
    },
    beforeState: createSnapshot([], []),
    afterState: createSnapshot([], []),
    description: description || `Update ${elementId}`
  }),

  deleteElement: (elementId: string, description?: string): Omit<HistoryEntry, 'id' | 'timestamp'> => ({
    action: {
      type: HistoryActionType.DELETE_ELEMENT,
      elementIds: [elementId]
    },
    beforeState: createSnapshot([], []),
    afterState: createSnapshot([], []),
    description: description || `Delete ${elementId}`
  }),

  moveElement: (elementId: string, description?: string): Omit<HistoryEntry, 'id' | 'timestamp'> => ({
    action: {
      type: HistoryActionType.MOVE_ELEMENT,
      elementIds: [elementId]
    },
    beforeState: createSnapshot([], []),
    afterState: createSnapshot([], []),
    description: description || `Move ${elementId}`
  }),

  duplicateElement: (elementId: string, description?: string): Omit<HistoryEntry, 'id' | 'timestamp'> => ({
    action: {
      type: HistoryActionType.DUPLICATE_ELEMENT,
      elementIds: [elementId]
    },
    beforeState: createSnapshot([], []),
    afterState: createSnapshot([], []),
    description: description || `Duplicate ${elementId}`
  }),

  batchUpdate: (elementIds: string[], description: string): Omit<HistoryEntry, 'id' | 'timestamp'> => ({
    action: {
      type: HistoryActionType.BATCH_UPDATE,
      elementIds
    },
    beforeState: createSnapshot([], []),
    afterState: createSnapshot([], []),
    description
  })
};

// Keyboard shortcuts for undo/redo
export const setupHistoryKeyboardShortcuts = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const { ctrlKey, metaKey, key, shiftKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    if (isCtrlOrCmd && key === 'z' && !shiftKey) {
      event.preventDefault();
      useHistoryStore.getState().undo();
    } else if (isCtrlOrCmd && (key === 'y' || (key === 'z' && shiftKey))) {
      event.preventDefault();
      useHistoryStore.getState().redo();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }
};

export default useHistoryStore;