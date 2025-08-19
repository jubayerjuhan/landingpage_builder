import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { UIStore, Notification } from '../types/builder';

const DEFAULT_PANEL_WIDTHS = {
  left: 280,
  right: 320,
  bottom: 200
};

const useUIStore = create<UIStore>((set, get) => ({
  // Panel states
  leftPanelOpen: true,
  rightPanelOpen: true,
  bottomPanelOpen: false,
  leftPanelWidth: DEFAULT_PANEL_WIDTHS.left,
  rightPanelWidth: DEFAULT_PANEL_WIDTHS.right,
  bottomPanelHeight: DEFAULT_PANEL_WIDTHS.bottom,

  // Active tabs
  leftPanelTab: 'components',
  rightPanelTab: 'properties',
  bottomPanelTab: 'code',

  // Loading states
  isLoading: false,
  loadingMessage: '',

  // Notifications
  notifications: [],

  // Methods
  setLeftPanelOpen: (open) => {
    set({ leftPanelOpen: open });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-left-panel-open', JSON.stringify(open));
    }
  },

  setRightPanelOpen: (open) => {
    set({ rightPanelOpen: open });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-right-panel-open', JSON.stringify(open));
    }
  },

  setBottomPanelOpen: (open) => {
    set({ bottomPanelOpen: open });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-bottom-panel-open', JSON.stringify(open));
    }
  },

  setLeftPanelWidth: (width) => {
    // Clamp width between 200 and 600
    const clampedWidth = Math.max(200, Math.min(600, width));
    set({ leftPanelWidth: clampedWidth });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-left-panel-width', clampedWidth.toString());
    }
  },

  setRightPanelWidth: (width) => {
    // Clamp width between 250 and 600
    const clampedWidth = Math.max(250, Math.min(600, width));
    set({ rightPanelWidth: clampedWidth });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-right-panel-width', clampedWidth.toString());
    }
  },

  setBottomPanelHeight: (height) => {
    // Clamp height between 150 and 400
    const clampedHeight = Math.max(150, Math.min(400, height));
    set({ bottomPanelHeight: clampedHeight });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-bottom-panel-height', clampedHeight.toString());
    }
  },

  setLeftPanelTab: (tab) => {
    set({ leftPanelTab: tab });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-left-panel-tab', tab);
    }
  },

  setRightPanelTab: (tab) => {
    set({ rightPanelTab: tab });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-right-panel-tab', tab);
    }
  },

  setBottomPanelTab: (tab) => {
    set({ bottomPanelTab: tab });
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('builder-bottom-panel-tab', tab);
    }
  },

  setLoading: (loading, message = '') => {
    set({
      isLoading: loading,
      loadingMessage: loading ? message : ''
    });
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: Date.now()
    };

    set(state => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto-remove notification after duration (if specified)
    if (newNotification.duration && !newNotification.persistent) {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, newNotification.duration);
    } else if (!newNotification.persistent) {
      // Default auto-remove after 5 seconds for non-persistent notifications
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, 5000);
    }
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  }
}));

// Load preferences from localStorage on initialization
if (typeof window !== 'undefined') {
  const loadPreferences = () => {
    const state = useUIStore.getState();

    // Load panel states
    const leftPanelOpen = localStorage.getItem('builder-left-panel-open');
    if (leftPanelOpen !== null) {
      state.setLeftPanelOpen(JSON.parse(leftPanelOpen));
    }

    const rightPanelOpen = localStorage.getItem('builder-right-panel-open');
    if (rightPanelOpen !== null) {
      state.setRightPanelOpen(JSON.parse(rightPanelOpen));
    }

    const bottomPanelOpen = localStorage.getItem('builder-bottom-panel-open');
    if (bottomPanelOpen !== null) {
      state.setBottomPanelOpen(JSON.parse(bottomPanelOpen));
    }

    // Load panel sizes
    const leftPanelWidth = localStorage.getItem('builder-left-panel-width');
    if (leftPanelWidth) {
      state.setLeftPanelWidth(parseInt(leftPanelWidth, 10));
    }

    const rightPanelWidth = localStorage.getItem('builder-right-panel-width');
    if (rightPanelWidth) {
      state.setRightPanelWidth(parseInt(rightPanelWidth, 10));
    }

    const bottomPanelHeight = localStorage.getItem('builder-bottom-panel-height');
    if (bottomPanelHeight) {
      state.setBottomPanelHeight(parseInt(bottomPanelHeight, 10));
    }

    // Load active tabs
    const leftPanelTab = localStorage.getItem('builder-left-panel-tab');
    if (leftPanelTab) {
      state.setLeftPanelTab(leftPanelTab as any);
    }

    const rightPanelTab = localStorage.getItem('builder-right-panel-tab');
    if (rightPanelTab) {
      state.setRightPanelTab(rightPanelTab as any);
    }

    const bottomPanelTab = localStorage.getItem('builder-bottom-panel-tab');
    if (bottomPanelTab) {
      state.setBottomPanelTab(bottomPanelTab as any);
    }
  };

  // Load preferences when the store is first used
  loadPreferences();
}

// Utility functions for notifications
export const notificationHelpers = {
  success: (title: string, message?: string, duration?: number) => {
    useUIStore.getState().addNotification({
      type: 'success',
      title,
      message,
      duration
    });
  },

  error: (title: string, message?: string, persistent = false) => {
    useUIStore.getState().addNotification({
      type: 'error',
      title,
      message,
      persistent
    });
  },

  warning: (title: string, message?: string, duration?: number) => {
    useUIStore.getState().addNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  },

  info: (title: string, message?: string, duration?: number) => {
    useUIStore.getState().addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  }
};

// Keyboard shortcuts for panel toggles
export const setupUIKeyboardShortcuts = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const { ctrlKey, metaKey, key, altKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    // Toggle left panel: Ctrl/Cmd + 1
    if (isCtrlOrCmd && key === '1') {
      event.preventDefault();
      const state = useUIStore.getState();
      state.setLeftPanelOpen(!state.leftPanelOpen);
    }

    // Toggle right panel: Ctrl/Cmd + 2  
    if (isCtrlOrCmd && key === '2') {
      event.preventDefault();
      const state = useUIStore.getState();
      state.setRightPanelOpen(!state.rightPanelOpen);
    }

    // Toggle bottom panel: Ctrl/Cmd + 3
    if (isCtrlOrCmd && key === '3') {
      event.preventDefault();
      const state = useUIStore.getState();
      state.setBottomPanelOpen(!state.bottomPanelOpen);
    }

    // Switch viewport modes: Alt + 1/2/3
    if (altKey && ['1', '2', '3'].includes(key)) {
      event.preventDefault();
      // This would integrate with canvas store
      // Import and use canvasStore here if needed
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }
};

// Layout utilities
export const layoutUtils = {
  // Calculate available canvas space
  getCanvasSpace: (state: UIStore) => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    let availableWidth = windowWidth;
    let availableHeight = windowHeight;

    // Subtract panel widths
    if (state.leftPanelOpen) {
      availableWidth -= state.leftPanelWidth;
    }
    
    if (state.rightPanelOpen) {
      availableWidth -= state.rightPanelWidth;
    }

    if (state.bottomPanelOpen) {
      availableHeight -= state.bottomPanelHeight;
    }

    // Account for top bar (assume 60px)
    availableHeight -= 60;

    return {
      width: Math.max(300, availableWidth), // Minimum 300px
      height: Math.max(200, availableHeight) // Minimum 200px
    };
  },

  // Get responsive panel sizes for mobile
  getResponsivePanelSizes: () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile) {
      return {
        leftPanelWidth: Math.min(280, window.innerWidth * 0.8),
        rightPanelWidth: Math.min(320, window.innerWidth * 0.8),
        bottomPanelHeight: Math.min(200, window.innerHeight * 0.4)
      };
    }

    return DEFAULT_PANEL_WIDTHS;
  }
};

export default useUIStore;