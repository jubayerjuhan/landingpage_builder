/**
 * Professional Design System
 * Based on industry standards from Webflow, Framer, and GoHighLevel
 */

// ============================================================================
// SPACING SYSTEM - 8px Grid
// ============================================================================
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '96px',
  '6xl': '128px',
} as const;

export const spacingNumeric = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
  '6xl': 128,
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================
export const typography = {
  // Font Sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    base: 1.5,
    normal: 1.6,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Font Weights
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// COLOR SYSTEM
// ============================================================================
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f0ff',
    100: '#e0e1ff',
    200: '#c1c3ff',
    300: '#a2a5ff',
    400: '#8386ff',
    500: '#5457ff', // Main
    600: '#4346e6',
    700: '#3235cc',
    800: '#2124b3',
    900: '#101399',
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// ============================================================================
// LAYOUT SYSTEM
// ============================================================================
export const layout = {
  // Container
  container: {
    maxWidth: '1200px',
    padding: '0 20px',
  },
  
  // Section Defaults
  section: {
    paddingY: '60px',
    paddingX: '20px',
    minHeight: '100px',
  },
  
  // Column Defaults
  column: {
    padding: '15px',
    gap: '20px',
    minHeight: '80px',
  },
  
  // Grid System
  grid: {
    columns: 12,
    gap: '20px',
  },
} as const;

// ============================================================================
// SHADOWS
// ============================================================================
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

// ============================================================================
// BORDERS
// ============================================================================
export const borders = {
  radius: {
    none: '0',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },
  
  width: {
    none: '0',
    thin: '1px',
    base: '2px',
    thick: '4px',
  },
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================
export const transitions = {
  none: 'none',
  all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'background-color, border-color, color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================
export const zIndex = {
  auto: 'auto',
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get spacing value as number
 */
export const getSpacingValue = (key: keyof typeof spacingNumeric): number => {
  return spacingNumeric[key];
};

/**
 * Create consistent spacing object
 */
export const createSpacing = (
  top: number | string = 0,
  right: number | string = 0,
  bottom: number | string = 0,
  left: number | string = 0
) => ({
  paddingTop: typeof top === 'number' ? `${top}px` : top,
  paddingRight: typeof right === 'number' ? `${right}px` : right,
  paddingBottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
  paddingLeft: typeof left === 'number' ? `${left}px` : left,
});

/**
 * Create consistent margin object
 */
export const createMargin = (
  top: number | string = 0,
  right: number | string = 0,
  bottom: number | string = 0,
  left: number | string = 0
) => ({
  marginTop: typeof top === 'number' ? `${top}px` : top,
  marginRight: typeof right === 'number' ? `${right}px` : right,
  marginBottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
  marginLeft: typeof left === 'number' ? `${left}px` : left,
});

export default {
  spacing,
  spacingNumeric,
  typography,
  colors,
  layout,
  shadows,
  borders,
  transitions,
  zIndex,
  breakpoints,
};