import { ViewportMode } from './builder';

// Enhanced style types for professional page builder
export interface StyleObject {
  // Layout
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;
  
  // Dimensions
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  
  // Flexbox
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
  gap?: string | number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  
  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string | number;
  gridColumnGap?: string | number;
  gridRowGap?: string | number;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  
  // Spacing
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  
  // Typography
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: number | 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic' | 'oblique';
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
  wordWrap?: 'normal' | 'break-word' | 'anywhere';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  
  // Colors
  color?: string;
  backgroundColor?: string;
  
  // Background
  backgroundImage?: string;
  backgroundSize?: 'auto' | 'cover' | 'contain' | string;
  backgroundPosition?: string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'space' | 'round';
  backgroundAttachment?: 'scroll' | 'fixed' | 'local';
  backgroundClip?: 'border-box' | 'padding-box' | 'content-box' | 'text';
  backgroundOrigin?: 'border-box' | 'padding-box' | 'content-box';
  
  // Borders
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderWidth?: string | number;
  borderTopWidth?: string | number;
  borderRightWidth?: string | number;
  borderBottomWidth?: string | number;
  borderLeftWidth?: string | number;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  borderTopStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  borderRightStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  borderBottomStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  borderLeftStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  borderColor?: string;
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRadius?: string | number;
  borderTopLeftRadius?: string | number;
  borderTopRightRadius?: string | number;
  borderBottomRightRadius?: string | number;
  borderBottomLeftRadius?: string | number;
  
  // Effects
  boxShadow?: string;
  textShadow?: string;
  opacity?: number;
  transform?: string;
  transformOrigin?: string;
  filter?: string;
  backdropFilter?: string;
  
  // Transitions and animations
  transition?: string;
  transitionProperty?: string;
  transitionDuration?: string;
  transitionTimingFunction?: string;
  transitionDelay?: string;
  animation?: string;
  animationName?: string;
  animationDuration?: string;
  animationTimingFunction?: string;
  animationDelay?: string;
  animationIterationCount?: number | 'infinite';
  animationDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  animationFillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  animationPlayState?: 'running' | 'paused';
  
  // Interaction
  cursor?: 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out';
  pointerEvents?: 'auto' | 'none' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | 'inherit';
  userSelect?: 'auto' | 'text' | 'none' | 'contain' | 'all';
  touchAction?: 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation';
  
  // Overflow and scrolling
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  overflowWrap?: 'normal' | 'break-word' | 'anywhere';
  scrollBehavior?: 'auto' | 'smooth';
  
  // Visibility and clipping
  visibility?: 'visible' | 'hidden' | 'collapse';
  clipPath?: string;
  
  // Content
  content?: string;
  
  // Table
  tableLayout?: 'auto' | 'fixed';
  borderCollapse?: 'collapse' | 'separate';
  borderSpacing?: string | number;
  captionSide?: 'top' | 'bottom';
  emptyCells?: 'show' | 'hide';
  
  // Lists
  listStyle?: string;
  listStyleType?: 'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'decimal-leading-zero' | 'lower-roman' | 'upper-roman' | 'lower-greek' | 'lower-latin' | 'upper-latin' | 'armenian' | 'georgian' | 'lower-alpha' | 'upper-alpha';
  listStylePosition?: 'inside' | 'outside';
  listStyleImage?: string;
  
  // Multi-column
  columnCount?: number | 'auto';
  columnFill?: 'auto' | 'balance';
  columnGap?: string | number;
  columnRule?: string;
  columnRuleColor?: string;
  columnRuleStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  columnRuleWidth?: string | number;
  columnSpan?: 'none' | 'all';
  columnWidth?: string | number | 'auto';
  
  // Print
  pageBreakAfter?: 'auto' | 'always' | 'avoid' | 'left' | 'right' | 'recto' | 'verso';
  pageBreakBefore?: 'auto' | 'always' | 'avoid' | 'left' | 'right' | 'recto' | 'verso';
  pageBreakInside?: 'auto' | 'avoid';
  
  // Custom CSS
  customCSS?: string;
  
  // CSS Variables
  [key: `--${string}`]: string | number;
}

// Responsive styles that can have different values for each viewport
export interface ResponsiveStyleObject {
  [ViewportMode.DESKTOP]?: StyleObject;
  [ViewportMode.TABLET]?: StyleObject;
  [ViewportMode.MOBILE]?: StyleObject;
}

// Component style with metadata
export interface ComponentStyle {
  id: string;
  name: string;
  description?: string;
  styles: ResponsiveStyleObject;
  className?: string;
  tags?: string[];
  category?: 'layout' | 'component' | 'utility';
  isGlobal?: boolean;
}

// Enhanced theme colors with semantic naming
export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  
  // Semantic colors
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
  
  // Neutral colors
  white: string;
  black: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;
  
  // Surface colors
  background: string;
  surface: string;
  surfaceElevated: string;
  overlay: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textOnPrimary: string;
  textOnSecondary: string;
  textOnAccent: string;
  
  // Border colors
  border: string;
  borderLight: string;
  borderHeavy: string;
  focus: string;
  
  // State colors
  hover: string;
  active: string;
  disabled: string;
  selected: string;
}

// Professional design token system
export interface DesignTokens {
  colors: ThemeColors;
  spacing: {
    0: string;
    px: string;
    0.5: string;
    1: string;
    1.5: string;
    2: string;
    2.5: string;
    3: string;
    3.5: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    14: string;
    16: string;
    20: string;
    24: string;
    28: string;
    32: string;
    36: string;
    40: string;
    44: string;
    48: string;
    52: string;
    56: string;
    60: string;
    64: string;
    72: string;
    80: string;
    96: string;
    // Semantic spacing
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
      primary: string;
      secondary: string;
      heading: string;
      body: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
      '7xl': string;
      '8xl': string;
      '9xl': string;
    };
    fontWeight: {
      thin: number;
      extralight: number;
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
      black: number;
    };
    lineHeight: {
      none: number;
      tight: number;
      snug: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
    letterSpacing: {
      tighter: string;
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    // Semantic shadows
    card: string;
    modal: string;
    dropdown: string;
    tooltip: string;
    focus: string;
  };
  zIndex: {
    auto: string;
    0: number;
    10: number;
    20: number;
    30: number;
    40: number;
    50: number;
    // Semantic z-index
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
    toast: number;
  };
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
      slower: string;
    };
    easing: {
      linear: string;
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
      bounce: string;
      elastic: string;
    };
  };
  breakpoints: {
    [ViewportMode.MOBILE]: {
      min: number;
      max: number;
      mediaQuery: string;
    };
    [ViewportMode.TABLET]: {
      min: number;
      max: number;
      mediaQuery: string;
    };
    [ViewportMode.DESKTOP]: {
      min: number;
      max?: number;
      mediaQuery: string;
    };
  };
}

// CSS-in-JS style generator
export interface StyleGenerator {
  generateCSS: (styles: ResponsiveStyleObject, className?: string) => string;
  generateInlineStyles: (styles: StyleObject) => React.CSSProperties;
  generateMediaQueries: (responsiveStyles: ResponsiveStyleObject) => string;
  optimizeCSS: (css: string) => string;
}

// Global styles for the builder
export interface GlobalStyleSheet {
  reset: string;
  base: string;
  utilities: string;
  components: ComponentStyle[];
  theme: DesignTokens;
}

// Style presets for quick application
export interface StylePreset {
  id: string;
  name: string;
  description: string;
  category: 'layout' | 'text' | 'button' | 'card' | 'form' | 'effect';
  preview?: string;
  styles: ResponsiveStyleObject;
  applicableComponents: string[];
}

// Animation presets
export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  keyframes: string;
  defaultDuration: string;
  defaultEasing: string;
  preview?: string;
  category: 'entrance' | 'exit' | 'attention' | 'hover' | 'loading';
}

// Gradient definitions
export interface GradientDefinition {
  id: string;
  name: string;
  type: 'linear' | 'radial' | 'conic';
  direction?: string;
  stops: Array<{
    color: string;
    position: number;
  }>;
  preview?: string;
}

// Export style utilities type
export type StyleUtilities = {
  spacing: (value: string | number) => string;
  color: (colorName: keyof ThemeColors) => string;
  fontSize: (sizeName: keyof DesignTokens['typography']['fontSize']) => string;
  fontWeight: (weightName: keyof DesignTokens['typography']['fontWeight']) => number;
  borderRadius: (radiusName: keyof DesignTokens['borderRadius']) => string;
  shadow: (shadowName: keyof DesignTokens['shadows']) => string;
  breakpoint: (viewport: ViewportMode) => string;
  zIndex: (layerName: keyof DesignTokens['zIndex']) => number;
};