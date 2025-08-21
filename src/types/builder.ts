import type { ResponsiveStyleObject } from './styles';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

// Core builder types
export interface BuilderElement {
  id: string;
  type: ComponentType;
  content?: string;
  properties: ComponentProperties;
  styles: ResponsiveStyleObject;
  children?: BuilderElement[];
  parentId?: string;
  locked?: boolean;
  hidden?: boolean;
  name?: string;
  order?: number;
}

// Component type enumeration
export enum ComponentType {
  // Layout Components
  SECTION = 'section',
  CONTAINER = 'container', 
  ROW = 'row',
  COLUMN = 'column',
  SPACER = 'spacer',
  DIVIDER = 'divider',
  
  // Content Components  
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  TEXT = 'text',
  LIST = 'list',
  QUOTE = 'quote',
  CODE_BLOCK = 'code_block',
  
  // Media Components
  IMAGE = 'image',
  VIDEO = 'video', 
  ICON = 'icon',
  GALLERY = 'gallery',
  BACKGROUND_VIDEO = 'background_video',
  
  // Interactive Components
  BUTTON = 'button',
  LINK = 'link',
  ACCORDION = 'accordion',
  TABS = 'tabs',
  MODAL = 'modal',
  POPUP = 'popup',
  
  // Form Components
  INPUT = 'input',
  TEXTAREA = 'textarea', 
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  FORM = 'form',
  
  // Business Components
  PRICING_TABLE = 'pricing_table',
  TESTIMONIAL = 'testimonial',
  FAQ = 'faq',
  TEAM_MEMBER = 'team_member',
  CONTACT_CARD = 'contact_card',
  
  // Advanced Components
  HTML_BLOCK = 'html_block',
  EMBED = 'embed',
  CUSTOM_CSS = 'custom_css'
}

// Base component properties interface
export interface ComponentProperties {
  // Content properties
  content?: {
    text?: string;
    html?: string;
    placeholder?: string;
    alt?: string;
    src?: string;
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    title?: string;
  };
  
  // Layout properties
  layout?: {
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    maxHeight?: string | number;
    display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
    zIndex?: number;
  };
  
  // Flex properties
  flex?: {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
    gap?: string | number;
  };
  
  // Grid properties
  grid?: {
    templateColumns?: string;
    templateRows?: string;
    gap?: string | number;
    columnGap?: string | number;
    rowGap?: string | number;
    autoColumns?: string;
    autoRows?: string;
    autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
  };
  
  // Typography properties
  typography?: {
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: number | 'normal' | 'bold' | 'lighter' | 'bolder';
    lineHeight?: string | number;
    letterSpacing?: string | number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
  };
  
  // Spacing properties
  spacing?: {
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
  };
  
  // Border properties
  border?: {
    width?: string | number;
    style?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    color?: string;
    radius?: string | number;
    topLeftRadius?: string | number;
    topRightRadius?: string | number;
    bottomLeftRadius?: string | number;
    bottomRightRadius?: string | number;
  };
  
  // Background properties
  background?: {
    color?: string;
    image?: string;
    size?: 'auto' | 'cover' | 'contain' | string;
    position?: string;
    repeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
    attachment?: 'scroll' | 'fixed' | 'local';
    gradient?: {
      type: 'linear' | 'radial';
      direction?: string;
      stops: Array<{ color: string; position: number }>;
    };
  };
  
  // Shadow and effects
  effects?: {
    boxShadow?: string;
    textShadow?: string;
    opacity?: number;
    transform?: string;
    filter?: string;
    transition?: string;
  };
  
  // Animation properties
  animation?: {
    name?: string;
    duration?: string;
    timingFunction?: string;
    delay?: string;
    iterationCount?: string | number;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
    playState?: 'running' | 'paused';
  };
  
  // Interactive properties
  interaction?: {
    cursor?: 'auto' | 'pointer' | 'text' | 'move' | 'not-allowed' | 'grab' | 'grabbing';
    userSelect?: 'auto' | 'none' | 'text' | 'all';
    pointerEvents?: 'auto' | 'none';
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
    overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
    overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  };
  
  // Form properties
  form?: {
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    value?: string | number | boolean;
    name?: string;
    id?: string;
    autocomplete?: string;
    validation?: {
      type?: 'email' | 'url' | 'tel' | 'number' | 'date' | 'pattern';
      pattern?: string;
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
      step?: number;
      message?: string;
    };
  };
  
  // Component-specific properties
  component?: Record<string, any>;
}

export interface ElementPosition {
  x: number;
  y: number;
}

export interface ElementSize {
  width: number;
  height: number;
}

export interface ElementBounds extends ElementPosition, ElementSize {}

// Viewport and canvas types
export enum ViewportMode {
  DESKTOP = 'desktop',
  TABLET = 'tablet', 
  MOBILE = 'mobile'
}

export enum PreviewMode {
  EDIT = 'edit',
  PREVIEW = 'preview'
}

export interface ViewportBreakpoints {
  [ViewportMode.DESKTOP]: { min: number; max?: number };
  [ViewportMode.TABLET]: { min: number; max: number };
  [ViewportMode.MOBILE]: { min: number; max: number };
}

export interface ViewportConfig {
  mode: ViewportMode;
  width: number;
  height?: number;
  label: string;
  icon: LucideIcon;
}

export interface DevicePreset {
  name: string;
  viewport: ViewportMode;
  width: number;
  height: number;
  pixelRatio: number;
  userAgent?: string;
}

// Drag and drop types
export interface DragItem {
  id: string;
  type: ComponentType;
  isFromPalette: boolean;
  element?: BuilderElement;
  preview?: {
    width: number;
    height: number;
    image?: string;
  };
}

export interface DragState {
  isDragging: boolean;
  dragItem: DragItem | null;
  dragPreview: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  dropZones: DropTarget[];
  validDropZone: string | null;
}

export interface DropTarget {
  id: string;
  elementId?: string;
  type: DropTargetType;
  accepts: ComponentType[];
  rejects?: ComponentType[];
  bounds: DOMRect;
  position: DropPosition;
  isValid: boolean;
}

export enum DropTargetType {
  CANVAS = 'canvas',
  ELEMENT = 'element',
  SLOT = 'slot',
  BETWEEN = 'between'
}

export enum DropPosition {
  INSIDE = 'inside',
  BEFORE = 'before',
  AFTER = 'after'
}

// Component definition types
export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  icon: LucideIcon;
  category: ComponentCategory;
  defaultProps: Omit<BuilderElement, 'id'>;
  propertySchema: PropertySchema;
  description: string;
  tags: string[];
  canHaveChildren: boolean;
  acceptsChildren?: ComponentType[];
  canBeChildOf?: ComponentType[];
  previewImage?: string;
}

export enum ComponentCategory {
  LAYOUT = 'layout',
  CONTENT = 'content', 
  MEDIA = 'media',
  INTERACTIVE = 'interactive',
  FORMS = 'forms',
  BUSINESS = 'business',
  ADVANCED = 'advanced'
}

export interface ComponentCategoryInfo {
  id: ComponentCategory;
  name: string;
  icon: LucideIcon;
  description: string;
  defaultOpen: boolean;
  order: number;
}

// Property editor types
export interface PropertySchema {
  [groupName: string]: PropertyGroup;
}

export interface PropertyGroup {
  label: string;
  icon?: LucideIcon;
  order: number;
  collapsed?: boolean;
  fields: {
    [fieldName: string]: PropertyField;
  };
}

export interface PropertyField {
  type: PropertyFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  validation?: PropertyValidation;
  conditional?: {
    field: string;
    value: any;
    operator?: 'equals' | 'not-equals' | 'contains' | 'not-contains';
  };
  // Type-specific options
  options?: Array<{ label: string; value: string | number; icon?: LucideIcon }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  accept?: string; // For file inputs
  multiple?: boolean;
  rows?: number; // For textarea
  format?: 'hex' | 'rgb' | 'hsl'; // For color inputs
  responsive?: boolean; // Can have different values per viewport
}

export enum PropertyFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  RANGE = 'range',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  COLOR = 'color',
  IMAGE = 'image',
  URL = 'url',
  ICON = 'icon',
  SPACING = 'spacing',
  BORDER = 'border',
  SHADOW = 'shadow',
  GRADIENT = 'gradient',
  ANIMATION = 'animation',
  CODE = 'code'
}

export interface PropertyValidation {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

// Store types
export interface ElementStore {
  elements: BuilderElement[];
  selectedElementIds: string[];
  hoveredElementId: string | null;
  clipboard: BuilderElement[];
  
  // Element operations
  addElement: (element: Omit<BuilderElement, 'id'>, parentId?: string, index?: number) => string;
  addElementWithChildren: (element: BuilderElement, parentId?: string, index?: number) => string;
  updateElement: (id: string, updates: Partial<BuilderElement>, viewport?: ViewportMode) => void;
  updateElements: (updates: Array<{ id: string; updates: Partial<BuilderElement> }>) => void;
  deleteElement: (id: string) => void;
  deleteElements: (ids: string[]) => void;
  duplicateElement: (id: string) => string;
  duplicateElements: (ids: string[]) => string[];
  moveElement: (id: string, newParentId?: string, index?: number) => void;
  reorderElement: (id: string, newIndex: number) => void;
  
  // Selection
  selectElement: (id: string, multiSelect?: boolean) => void;
  selectElements: (ids: string[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setHoveredElement: (id: string | null) => void;
  
  // Clipboard operations
  copyElements: (ids: string[]) => void;
  cutElements: (ids: string[]) => void;
  pasteElements: (parentId?: string) => string[];
  
  // Getters
  getSelectedElements: () => BuilderElement[];
  getElementById: (id: string) => BuilderElement | null;
  getElementByPath: (path: string) => BuilderElement | null;
  getElementChildren: (id: string) => BuilderElement[];
  getElementParent: (id: string) => BuilderElement | null;
  getElementAncestors: (id: string) => BuilderElement[];
  getElementTree: () => BuilderElement[];
  
  // Queries
  findElements: (predicate: (element: BuilderElement) => boolean) => BuilderElement[];
  getElementsByType: (type: ComponentType) => BuilderElement[];
  searchElements: (query: string) => BuilderElement[];
}

export interface CanvasStore {
  // Viewport and display
  viewportMode: ViewportMode;
  previewMode: PreviewMode;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  
  // Visual aids
  showGrid: boolean;
  showRulers: boolean;
  showGuides: boolean;
  showBoundaries: boolean;
  snapToGrid: boolean;
  snapToElements: boolean;
  gridSize: number;
  
  // Canvas state
  canvasSize: { width: number; height: number };
  isDragging: boolean;
  isResizing: boolean;
  isPanning: boolean;
  
  // Methods
  setViewportMode: (mode: ViewportMode) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setZoomLevel: (level: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  resetView: () => void;
  
  // Visual aids toggles
  toggleGrid: () => void;
  toggleRulers: () => void;
  toggleGuides: () => void;
  toggleBoundaries: () => void;
  toggleSnapToGrid: () => void;
  toggleSnapToElements: () => void;
  setGridSize: (size: number) => void;
  
  // Canvas state
  setCanvasSize: (size: { width: number; height: number }) => void;
  setDragging: (isDragging: boolean) => void;
  setResizing: (isResizing: boolean) => void;
  setPanning: (isPanning: boolean) => void;
}

export interface HistoryStore {
  history: HistoryEntry[];
  currentIndex: number;
  maxHistorySize: number;
  
  // History operations
  undo: () => boolean;
  redo: () => boolean;
  pushHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  replaceCurrentHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  
  // Batch operations
  startBatch: (description: string) => void;
  endBatch: () => void;
  isBatching: boolean;
  
  // Getters
  canUndo: () => boolean;
  canRedo: () => boolean;
  getUndoDescription: () => string | null;
  getRedoDescription: () => string | null;
  getHistorySize: () => number;
}

// History and undo/redo types
export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: HistoryAction;
  beforeState: HistorySnapshot;
  afterState: HistorySnapshot;
  description: string;
  isBatch?: boolean;
  batchId?: string;
}

export interface HistorySnapshot {
  elements: BuilderElement[];
  selectedElementIds: string[];
  canvasState?: Partial<{
    viewportMode: ViewportMode;
    zoomLevel: number;
    panOffset: { x: number; y: number };
  }>;
}

export interface HistoryAction {
  type: HistoryActionType;
  elementIds: string[];
  metadata?: Record<string, any>;
}

export enum HistoryActionType {
  ADD_ELEMENT = 'add_element',
  UPDATE_ELEMENT = 'update_element',
  DELETE_ELEMENT = 'delete_element',
  MOVE_ELEMENT = 'move_element',
  DUPLICATE_ELEMENT = 'duplicate_element',
  REORDER_ELEMENT = 'reorder_element',
  
  BATCH_ADD = 'batch_add',
  BATCH_UPDATE = 'batch_update',
  BATCH_DELETE = 'batch_delete',
  BATCH_MOVE = 'batch_move',
  
  PASTE_ELEMENTS = 'paste_elements',
  CUT_ELEMENTS = 'cut_elements',
  
  CHANGE_VIEWPORT = 'change_viewport',
  CHANGE_ZOOM = 'change_zoom'
}

export interface UIStore {
  // Panel states
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;
  bottomPanelHeight: number;
  
  // Active tabs
  leftPanelTab: 'components' | 'layers' | 'assets';
  rightPanelTab: 'properties' | 'styles' | 'settings';
  bottomPanelTab: 'code' | 'console' | 'preview';
  
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  
  // Notifications
  notifications: Notification[];
  
  // Methods
  setLeftPanelOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setBottomPanelOpen: (open: boolean) => void;
  setLeftPanelWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;
  setBottomPanelHeight: (height: number) => void;
  setLeftPanelTab: (tab: 'components' | 'layers' | 'assets') => void;
  setRightPanelTab: (tab: 'properties' | 'styles' | 'settings') => void;
  setBottomPanelTab: (tab: 'code' | 'console' | 'preview') => void;
  setLoading: (loading: boolean, message?: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  timestamp: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Component renderer types
export interface ElementRendererProps {
  element: BuilderElement;
  isSelected: boolean;
  isHovered: boolean;
  previewMode: PreviewMode;
  viewportMode: ViewportMode;
  onSelect: (id: string, multiSelect?: boolean) => void;
  onHover: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<BuilderElement>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  showBoundaries: boolean;
  showGuides: boolean;
  isDragging: boolean;
  children?: ReactNode;
}

export interface ElementWrapperProps extends ElementRendererProps {
  className?: string;
  style?: React.CSSProperties;
  'data-element-id': string;
  'data-element-type': ComponentType;
}

// Error and validation types
export interface ValidationError {
  field: string;
  path: string;
  message: string;
  code: ValidationErrorCode;
  severity: 'error' | 'warning' | 'info';
}

export enum ValidationErrorCode {
  REQUIRED = 'required',
  INVALID_FORMAT = 'invalid_format',
  OUT_OF_RANGE = 'out_of_range',
  INVALID_REFERENCE = 'invalid_reference',
  CIRCULAR_REFERENCE = 'circular_reference',
  DUPLICATE_ID = 'duplicate_id',
  INVALID_PARENT = 'invalid_parent',
  MAX_DEPTH_EXCEEDED = 'max_depth_exceeded'
}

export interface BuilderError {
  id: string;
  type: BuilderErrorType;
  message: string;
  details?: Record<string, any>;
  elementId?: string;
  field?: string;
  timestamp: number;
  stack?: string;
  resolved?: boolean;
}

export enum BuilderErrorType {
  VALIDATION = 'validation',
  RUNTIME = 'runtime',
  NETWORK = 'network',
  PARSING = 'parsing',
  RENDERING = 'rendering',
  STATE = 'state'
}

// Global state interface
export interface BuilderState {
  elements: ElementStore;
  canvas: CanvasStore;
  history: HistoryStore;
  ui: UIStore;
}

// Template system types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  thumbnail: string;
  previewImages: string[];
  elements: BuilderElement[];
  styles: GlobalStyles;
  metadata: {
    author: string;
    version: string;
    created: number;
    updated: number;
    downloads: number;
    rating: number;
  };
  premium?: boolean;
}

export enum TemplateCategory {
  LANDING_PAGE = 'landing_page',
  BUSINESS = 'business',
  ECOMMERCE = 'ecommerce',
  PORTFOLIO = 'portfolio',
  BLOG = 'blog',
  RESTAURANT = 'restaurant',
  REAL_ESTATE = 'real_estate',
  HEALTH = 'health',
  EDUCATION = 'education',
  NONPROFIT = 'nonprofit',
  COMING_SOON = 'coming_soon',
  ERROR_PAGE = 'error_page'
}

// Global styles interface
export interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    [key: string]: string;
  };
  typography: {
    fontFamilies: {
      primary: string;
      secondary: string;
      mono: string;
      [key: string]: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      [key: string]: string;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
      [key: string]: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    [key: string]: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
    [key: string]: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    [key: string]: string;
  };
  breakpoints: ViewportBreakpoints;
}

// Export and integration types
export interface ExportOptions {
  format: ExportFormat;
  minify?: boolean;
  includeMeta?: boolean;
  inlineStyles?: boolean;
  responsiveImages?: boolean;
  seoOptimized?: boolean;
  customCSS?: string;
  customJS?: string;
}

export enum ExportFormat {
  HTML = 'html',
  REACT = 'react',
  VUE = 'vue',
  JSON = 'json',
  PDF = 'pdf'
}

export interface ExportResult {
  files: Array<{
    name: string;
    content: string;
    type: 'html' | 'css' | 'js' | 'json' | 'image';
  }>;
  assets: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  metadata: {
    exportedAt: number;
    format: ExportFormat;
    version: string;
    elements: number;
    size: number;
  };
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RecursiveRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? RecursiveRequired<T[P]> : T[P];
};

export type ElementId = string;
export type ElementPath = string;
export type CSSValue = string | number;
export type ResponsiveValue<T> = {
  [ViewportMode.DESKTOP]?: T;
  [ViewportMode.TABLET]?: T;
  [ViewportMode.MOBILE]?: T;
};