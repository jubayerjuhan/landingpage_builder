import { create } from 'zustand';
import type { CanvasStore } from '../types/builder';
import { ViewportMode, PreviewMode } from '../types/builder';

const DEFAULT_CANVAS_SIZE = { width: 1200, height: 800 };
const DEFAULT_ZOOM_LEVEL = 1;
const DEFAULT_GRID_SIZE = 10;
// Removed unused DEFAULT_PANEL_WIDTHS constant

const useCanvasStore = create<CanvasStore>((set) => ({
  // Viewport and display
  viewportMode: ViewportMode.DESKTOP,
  previewMode: PreviewMode.EDIT,
  zoomLevel: DEFAULT_ZOOM_LEVEL,
  panOffset: { x: 0, y: 0 },
  
  // Visual aids
  showGrid: true,
  showRulers: true,
  showGuides: true,
  showBoundaries: true,
  snapToGrid: true,
  snapToElements: true,
  gridSize: DEFAULT_GRID_SIZE,
  
  // Canvas state
  canvasSize: DEFAULT_CANVAS_SIZE,
  isDragging: false,
  isResizing: false,
  isPanning: false,
  
  // Methods
  setViewportMode: (mode) => {
    set({ viewportMode: mode });
    
    // Adjust canvas size based on viewport
    const canvasSizes = {
      [ViewportMode.DESKTOP]: { width: 1200, height: 800 },
      [ViewportMode.TABLET]: { width: 768, height: 1024 },
      [ViewportMode.MOBILE]: { width: 375, height: 667 }
    };
    
    set({ canvasSize: canvasSizes[mode] });
  },

  setPreviewMode: (mode) => {
    set({ previewMode: mode });
    
    // Hide visual aids in preview mode
    if (mode === PreviewMode.PREVIEW) {
      set({
        showGrid: false,
        showRulers: false,
        showGuides: false,
        showBoundaries: false
      });
    } else {
      // Restore default visual aids in edit mode
      set({
        showGrid: true,
        showRulers: true,
        showGuides: true,
        showBoundaries: true
      });
    }
  },

  setZoomLevel: (level) => {
    // Clamp zoom level between 0.1 and 5
    const clampedLevel = Math.max(0.1, Math.min(5, level));
    set({ zoomLevel: clampedLevel });
  },

  setPanOffset: (offset) => {
    set({ panOffset: offset });
  },

  resetView: () => {
    set({
      zoomLevel: DEFAULT_ZOOM_LEVEL,
      panOffset: { x: 0, y: 0 }
    });
  },

  // Visual aids toggles
  toggleGrid: () => {
    set(state => ({ showGrid: !state.showGrid }));
  },

  toggleRulers: () => {
    set(state => ({ showRulers: !state.showRulers }));
  },

  toggleGuides: () => {
    set(state => ({ showGuides: !state.showGuides }));
  },

  toggleBoundaries: () => {
    set(state => ({ showBoundaries: !state.showBoundaries }));
  },

  toggleSnapToGrid: () => {
    set(state => ({ snapToGrid: !state.snapToGrid }));
  },

  toggleSnapToElements: () => {
    set(state => ({ snapToElements: !state.snapToElements }));
  },

  setGridSize: (size) => {
    // Clamp grid size between 5 and 50
    const clampedSize = Math.max(5, Math.min(50, size));
    set({ gridSize: clampedSize });
  },

  // Canvas state
  setCanvasSize: (size) => {
    set({ canvasSize: size });
  },

  setDragging: (isDragging) => {
    set({ isDragging });
  },

  setResizing: (isResizing) => {
    set({ isResizing });
  },

  setPanning: (isPanning) => {
    set({ isPanning });
  }
}));

// Utility functions for canvas calculations
export const canvasUtils = {
  // Convert screen coordinates to canvas coordinates
  screenToCanvas: (screenX: number, screenY: number, canvasStore: CanvasStore) => {
    const { zoomLevel, panOffset } = canvasStore;
    return {
      x: (screenX - panOffset.x) / zoomLevel,
      y: (screenY - panOffset.y) / zoomLevel
    };
  },

  // Convert canvas coordinates to screen coordinates  
  canvasToScreen: (canvasX: number, canvasY: number, canvasStore: CanvasStore) => {
    const { zoomLevel, panOffset } = canvasStore;
    return {
      x: canvasX * zoomLevel + panOffset.x,
      y: canvasY * zoomLevel + panOffset.y
    };
  },

  // Snap coordinate to grid
  snapToGrid: (coordinate: number, gridSize: number): number => {
    return Math.round(coordinate / gridSize) * gridSize;
  },

  // Calculate zoom level to fit content
  getZoomToFit: (contentBounds: DOMRect, canvasSize: { width: number; height: number }) => {
    const scaleX = canvasSize.width / contentBounds.width;
    const scaleY = canvasSize.height / contentBounds.height;
    return Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
  },

  // Get viewport dimensions based on mode
  getViewportDimensions: (mode: ViewportMode) => {
    const dimensions = {
      [ViewportMode.DESKTOP]: { width: 1200, height: 800, label: 'Desktop' },
      [ViewportMode.TABLET]: { width: 768, height: 1024, label: 'Tablet' },
      [ViewportMode.MOBILE]: { width: 375, height: 667, label: 'Mobile' }
    };
    return dimensions[mode];
  },

  // Calculate responsive breakpoints
  getBreakpoints: () => ({
    [ViewportMode.MOBILE]: { min: 320, max: 767 },
    [ViewportMode.TABLET]: { min: 768, max: 1199 },
    [ViewportMode.DESKTOP]: { min: 1200 }
  })
};

export default useCanvasStore;