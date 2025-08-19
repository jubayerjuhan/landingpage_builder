# Component Refactoring & Architecture Plan

## Current State Analysis

### Existing Components
```
src/components/
├── Canvas.tsx               # Monolithic - needs breaking down
├── LeftSidebar.tsx         # Good structure, minor improvements needed
├── RightSidebar.tsx        # Good structure, extract form components
├── TopBar.tsx              # Simple, can stay as is
├── shared/
│   └── Accordion.tsx       # Good reusable component
└── [other legacy components]
```

### Issues Identified
1. **Canvas.tsx** - Massive file with multiple responsibilities
2. **Inline element rendering** - No reusable element components
3. **Duplicated form logic** - Property editors could be extracted
4. **No compound components** - Missing Card, Panel, FormField patterns
5. **Hard-coded styles** - Need design system components

## Refactoring Strategy

### Phase 1: Extract Core UI Components

#### 1.1 Form Components
```typescript
// components/ui/FormField/FormField.tsx
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

// components/ui/Input/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// components/ui/Select/Select.tsx
interface SelectProps {
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

#### 1.2 Layout Components
```typescript
// components/ui/Panel/Panel.tsx
const Panel = ({ children, title, actions }) => (
  <div className={styles.panel}>
    {title && (
      <Panel.Header>
        <Panel.Title>{title}</Panel.Title>
        {actions && <Panel.Actions>{actions}</Panel.Actions>}
      </Panel.Header>
    )}
    <Panel.Body>{children}</Panel.Body>
  </div>
);

// components/ui/Card/Card.tsx
const Card = ({ children, variant = 'default', elevated = false }) => (
  <div className={`${styles.card} ${styles[variant]} ${elevated ? styles.elevated : ''}`}>
    {children}
  </div>
);
```

#### 1.3 Data Display Components
```typescript
// components/ui/ColorPicker/ColorPicker.tsx
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  showInput?: boolean;
}

// components/ui/RangeSlider/RangeSlider.tsx
interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  unit?: string;
}
```

### Phase 2: Break Down Canvas Component

#### 2.1 Element Rendering System
```typescript
// components/builder/ElementRenderer/ElementRenderer.tsx
interface ElementRendererProps {
  element: DroppedElement;
  isSelected: boolean;
  previewMode: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DroppedElement>) => void;
}

// components/builder/elements/
├── TypographyElements/
│   ├── HeadingElement.tsx
│   ├── TextElement.tsx
│   └── ParagraphElement.tsx
├── LayoutElements/
│   ├── SectionElement.tsx
│   ├── ContainerElement.tsx
│   └── ColumnLayoutElement.tsx
├── FormElements/
│   ├── InputElement.tsx
│   ├── TextareaElement.tsx
│   └── ButtonElement.tsx
└── MediaElements/
    ├── ImageElement.tsx
    ├── VideoElement.tsx
    └── GalleryElement.tsx
```

#### 2.2 Drop Zone System
```typescript
// components/builder/DropZone/DropZone.tsx
interface DropZoneProps {
  id: string;
  accepts?: string[];
  onDrop: (item: DragItem) => void;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
  className?: string;
}

// components/builder/DroppableArea/DroppableArea.tsx
interface DroppableAreaProps {
  id: string;
  element?: DroppedElement;
  children: React.ReactNode;
  onElementClick: (id: string) => void;
  showBoundaries?: boolean;
}
```

#### 2.3 Canvas Layout
```typescript
// components/builder/Canvas/Canvas.tsx
const Canvas = () => {
  return (
    <div className={styles.canvas}>
      <Canvas.Viewport>
        <Canvas.DropZone>
          <ElementRenderer />
        </Canvas.DropZone>
      </Canvas.Viewport>
    </div>
  );
};

Canvas.Viewport = ({ children, mode }) => (
  <div className={`${styles.viewport} ${styles[mode]}`}>
    {children}
  </div>
);
```

### Phase 3: Property Editor Refactoring

#### 3.1 Property Editor Architecture
```typescript
// components/builder/PropertyEditor/PropertyEditor.tsx
interface PropertyEditorProps {
  element: DroppedElement | null;
  onUpdate: (id: string, updates: Partial<DroppedElement>) => void;
}

// Property editor sections
// components/builder/PropertyEditor/sections/
├── ContentSection.tsx      # Text/content editing
├── LayoutSection.tsx       # Width, height, display
├── SpacingSection.tsx      # Margin, padding
├── TypographySection.tsx   # Font, size, color
├── BackgroundSection.tsx   # Background, borders
└── EffectsSection.tsx      # Shadows, opacity, transforms
```

#### 3.2 Dynamic Property Forms
```typescript
// components/builder/PropertyEditor/PropertyForm.tsx
interface PropertyFormProps {
  schema: PropertySchema;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

// Example schema for dynamic form generation
const buttonPropertySchema: PropertySchema = {
  content: { type: 'text', label: 'Button Text' },
  variant: { 
    type: 'select', 
    label: 'Variant',
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' }
    ]
  },
  size: {
    type: 'select',
    label: 'Size',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' }
    ]
  }
};
```

### Phase 4: Component Palette Improvements

#### 4.1 Categorized Component System
```typescript
// components/builder/ComponentPalette/ComponentPalette.tsx
interface ComponentPaletteProps {
  categories: ComponentCategory[];
  searchable?: boolean;
  collapsible?: boolean;
}

interface ComponentCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  components: ComponentDefinition[];
  defaultOpen?: boolean;
}

// components/builder/ComponentPalette/components/
├── DraggableComponent.tsx    # Individual draggable items
├── ComponentCategory.tsx     # Category sections
├── ComponentSearch.tsx       # Search functionality
└── ComponentPreview.tsx      # Hover preview
```

#### 4.2 Component Definition System
```typescript
// utils/componentDefinitions.ts
export const componentDefinitions: Record<string, ComponentDefinition> = {
  button: {
    type: 'button',
    name: 'Button',
    icon: RectangleHorizontal,
    category: 'basic',
    defaultProps: {
      content: 'Click Me',
      variant: 'primary',
      size: 'md'
    },
    propertySchema: buttonPropertySchema
  },
  heading: {
    type: 'heading',
    name: 'Heading',
    icon: Type,
    category: 'typography',
    defaultProps: {
      content: 'Your Heading Here',
      level: 1
    },
    propertySchema: headingPropertySchema
  }
};
```

### Phase 5: State Management Improvements

#### 5.1 Domain-Specific Stores
```typescript
// stores/elementStore.ts
interface ElementStore {
  elements: DroppedElement[];
  selectedElementId: string | null;
  
  // Element operations
  addElement: (element: DroppedElement, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<DroppedElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveElement: (id: string, newPosition: Position) => void;
  
  // Selection
  selectElement: (id: string | null) => void;
  getSelectedElement: () => DroppedElement | null;
}

// stores/canvasStore.ts
interface CanvasStore {
  viewportMode: ViewportMode;
  previewMode: PreviewMode;
  zoomLevel: number;
  
  setViewportMode: (mode: ViewportMode) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setZoomLevel: (level: number) => void;
}

// stores/historyStore.ts
interface HistoryStore {
  history: HistoryEntry[];
  currentIndex: number;
  
  undo: () => void;
  redo: () => void;
  pushHistory: (entry: HistoryEntry) => void;
  canUndo: boolean;
  canRedo: boolean;
}
```

#### 5.2 Action Creators and Selectors
```typescript
// stores/selectors.ts
export const selectElementById = (id: string) => (state: ElementStore) =>
  state.elements.find(el => el.id === id);

export const selectElementsByType = (type: string) => (state: ElementStore) =>
  state.elements.filter(el => el.type === type);

export const selectNestedElements = (parentId: string) => (state: ElementStore) =>
  state.elements.filter(el => el.parentId === parentId);

// stores/actions.ts
export const createElementActions = (store: ElementStore) => ({
  createElement: (type: string, parentId?: string) => {
    const element = componentFactory.create(type);
    store.addElement(element, parentId);
    store.selectElement(element.id);
  },
  
  cloneElement: (id: string) => {
    const element = store.elements.find(el => el.id === id);
    if (element) {
      const clone = { ...element, id: generateId() };
      store.addElement(clone);
      store.selectElement(clone.id);
    }
  }
});
```

### Phase 6: Create Design System Components

#### 6.1 Design Token Implementation
```typescript
// styles/tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      900: '#1e3a8a'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  }
} as const;
```

#### 6.2 Theme Provider
```typescript
// providers/ThemeProvider.tsx
interface ThemeContextValue {
  theme: 'light' | 'dark';
  tokens: typeof designTokens;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const value = useMemo(() => ({
    theme,
    tokens: designTokens,
    setTheme
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
```

## Implementation Priority

### High Priority (Immediate)
1. ✅ Create CODING_STANDARDS.md
2. 🔄 Extract form components from RightSidebar
3. 🔄 Break down Canvas.tsx into smaller components
4. 🔄 Create reusable element components

### Medium Priority (Next Sprint)
1. Create property editor sections
2. Implement component definition system
3. Add search to component palette
4. Create compound components (Card, Panel)

### Low Priority (Future)
1. Implement design system theme provider
2. Add undo/redo functionality
3. Create advanced property editors
4. Add component templates

## File Structure After Refactoring

```
src/
├── components/
│   ├── ui/                    # Pure UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Card/
│   │   ├── Panel/
│   │   ├── FormField/
│   │   ├── ColorPicker/
│   │   └── index.ts
│   ├── builder/               # Builder-specific components
│   │   ├── Canvas/
│   │   ├── ElementRenderer/
│   │   ├── ComponentPalette/
│   │   ├── PropertyEditor/
│   │   ├── DropZone/
│   │   └── elements/
│   │       ├── TypographyElements/
│   │       ├── LayoutElements/
│   │       ├── FormElements/
│   │       └── MediaElements/
│   ├── layout/                # Layout components
│   │   ├── BuilderShell/
│   │   ├── Sidebar/
│   │   └── TopBar/
│   └── shared/                # Shared utility components
│       ├── Accordion/
│       ├── Modal/
│       └── Tooltip/
├── stores/
│   ├── elementStore.ts
│   ├── canvasStore.ts
│   ├── historyStore.ts
│   ├── selectors.ts
│   └── actions.ts
├── types/
│   ├── components.ts
│   ├── builder.ts
│   ├── styles.ts
│   └── index.ts
├── utils/
│   ├── componentFactory.ts
│   ├── elementHelpers.ts
│   ├── styleHelpers.ts
│   └── validators.ts
├── hooks/
│   ├── useElementActions.ts
│   ├── useKeyboardShortcuts.ts
│   └── useBuilderHistory.ts
└── styles/
    ├── tokens.ts
    ├── base.scss
    ├── utilities.scss
    └── components.scss
```

## Benefits After Refactoring

### Maintainability
- ✅ Single responsibility components
- ✅ Clear file organization
- ✅ Consistent naming conventions
- ✅ Type-safe interfaces

### Reusability
- ✅ Compound components for complex UI
- ✅ Configurable through props
- ✅ Design system tokens
- ✅ Generic utility components

### Developer Experience
- ✅ Faster development with reusable components
- ✅ Better IDE support with TypeScript
- ✅ Clear component API documentation
- ✅ Consistent coding patterns

### Performance
- ✅ Smaller bundle sizes through tree shaking
- ✅ Better component memoization
- ✅ Optimized re-renders
- ✅ Lazy loading opportunities