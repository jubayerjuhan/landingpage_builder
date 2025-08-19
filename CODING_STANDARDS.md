# Landing Page Builder - Coding Standards & Architecture Guidelines

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [File Organization](#file-organization)
3. [Component Standards](#component-standards)
4. [TypeScript Guidelines](#typescript-guidelines)
5. [SCSS/Styling Guidelines](#scssstyling-guidelines)
6. [State Management](#state-management)
7. [Naming Conventions](#naming-conventions)
8. [Code Quality Rules](#code-quality-rules)
9. [Reusability Principles](#reusability-principles)
10. [Performance Guidelines](#performance-guidelines)

## Project Architecture

### Core Principles
- **Component-Driven Development**: Every UI piece should be a reusable component
- **Separation of Concerns**: Business logic, UI logic, and styling are separated
- **Type Safety**: Everything must be strictly typed with TypeScript
- **Modular Design**: Features should be self-contained and composable
- **Performance First**: Optimize for bundle size and runtime performance

### Architecture Layers
```
src/
├── app/           # Global app state and configuration
├── components/    # Reusable UI components
├── pages/         # Page-level components
├── types/         # TypeScript type definitions
├── utils/         # Pure utility functions
├── hooks/         # Custom React hooks
├── styles/        # Global styles and design tokens
└── constants/     # Application constants
```

## File Organization

### Directory Structure Rules

#### Components Organization
```
components/
├── ui/              # Pure UI components (buttons, inputs, etc.)
│   ├── Button/
│   │   ├── index.ts
│   │   ├── Button.tsx
│   │   ├── Button.module.scss
│   │   └── Button.types.ts
├── builder/         # Builder-specific components
├── layout/          # Layout components
├── shared/          # Shared utility components
└── index.ts         # Barrel exports
```

#### Component File Structure
Each component must have:
- `index.ts` - Barrel export file
- `ComponentName.tsx` - Main component file
- `ComponentName.module.scss` - Component styles
- `ComponentName.types.ts` - Component-specific types
- `ComponentName.test.tsx` - Unit tests (future)

#### Barrel Exports Pattern
```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
```

## Component Standards

### Component Structure Template
```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// ComponentName.tsx
import React from 'react';
import { ComponentNameProps } from './ComponentName.types';
import styles from './ComponentName.module.scss';

export const ComponentName: React.FC<ComponentNameProps> = ({
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const classNames = [
    styles.component,
    styles[`component--${variant}`],
    styles[`component--${size}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

### Component Design Principles

#### 1. Single Responsibility
Each component should have one clear purpose:
- ✅ `Button` - handles button interactions
- ✅ `Modal` - manages modal state and display
- ❌ `ButtonModal` - violates single responsibility

#### 2. Composability
Components should work well together:
```typescript
<Card>
  <Card.Header>
    <Heading level={2}>Title</Heading>
  </Card.Header>
  <Card.Body>
    <Text>Content</Text>
  </Card.Body>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

#### 3. Polymorphic Components
Support different underlying elements:
```typescript
interface PolymorphicProps<T extends React.ElementType> {
  as?: T;
}

export const Text = <T extends React.ElementType = 'p'>({
  as,
  children,
  ...props
}: PolymorphicProps<T> & React.ComponentPropsWithoutRef<T>) => {
  const Component = as || 'p';
  return <Component {...props}>{children}</Component>;
};
```

## TypeScript Guidelines

### Type Organization
```
types/
├── index.ts           # Main exports
├── components.ts      # Component-related types
├── styles.ts          # Styling types
├── builder.ts         # Builder-specific types
├── api.ts            # API response types
└── utils.ts          # Utility types
```

### Type Definition Rules

#### 1. Strict Interface Definitions
```typescript
// ✅ Good - Explicit and specific
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

// ❌ Bad - Too generic
interface ButtonProps {
  [key: string]: any;
}
```

#### 2. Generic Type Constraints
```typescript
// For component props that extend HTML attributes
interface ComponentProps<T extends React.ElementType = 'div'> 
  extends React.ComponentPropsWithoutRef<T> {
  variant?: 'primary' | 'secondary';
}

// For data structures
interface ApiResponse<T = unknown> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}
```

#### 3. Discriminated Unions for Component Variants
```typescript
type FormFieldProps = 
  | { type: 'input'; placeholder: string; }
  | { type: 'textarea'; rows: number; }
  | { type: 'select'; options: Array<{ label: string; value: string }>; };
```

## SCSS/Styling Guidelines

### BEM Methodology with CSS Modules
```scss
// Button.module.scss
.button {
  // Base styles
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-base);
  cursor: pointer;

  // Variants
  &--primary {
    background-color: var(--color-primary);
    color: var(--color-white);
    
    &:hover {
      background-color: var(--color-primary-hover);
    }
  }

  &--secondary {
    background-color: var(--color-secondary);
    color: var(--color-white);
  }

  // Sizes
  &--sm {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  &--md {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
  }

  &--lg {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-lg);
  }

  // States
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--loading {
    pointer-events: none;
  }
}
```

### Design Token Structure
```scss
// styles/tokens.scss
:root {
  // Colors
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-light: rgba(59, 130, 246, 0.1);
  
  // Spacing
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  // Typography
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  // Transitions
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

### Responsive Design System
```scss
// styles/mixins.scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: 640px) { @content; }
  }
  @if $breakpoint == 'md' {
    @media (min-width: 768px) { @content; }
  }
  @if $breakpoint == 'lg' {
    @media (min-width: 1024px) { @content; }
  }
  @if $breakpoint == 'xl' {
    @media (min-width: 1280px) { @content; }
  }
}

// Usage
.component {
  padding: var(--spacing-sm);
  
  @include respond-to('md') {
    padding: var(--spacing-md);
  }
  
  @include respond-to('lg') {
    padding: var(--spacing-lg);
  }
}
```

## State Management

### Zustand Store Structure
```typescript
// stores/builderStore.ts
interface BuilderState {
  // State
  elements: Element[];
  selectedElementId: string | null;
  mode: 'edit' | 'preview';
  
  // Actions
  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setMode: (mode: 'edit' | 'preview') => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  mode: 'edit',
  
  addElement: (element) => set((state) => ({
    elements: [...state.elements, element]
  })),
  
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    )
  })),
  
  deleteElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id),
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),
  
  selectElement: (id) => set({ selectedElementId: id }),
  setMode: (mode) => set({ mode })
}));
```

### Custom Hooks for Business Logic
```typescript
// hooks/useElementActions.ts
export const useElementActions = () => {
  const { addElement, updateElement, deleteElement } = useBuilderStore();
  
  const duplicateElement = useCallback((element: Element) => {
    const newElement = {
      ...element,
      id: generateId(),
      position: { ...element.position, y: element.position.y + 50 }
    };
    addElement(newElement);
  }, [addElement]);
  
  const moveElement = useCallback((id: string, newPosition: Position) => {
    updateElement(id, { position: newPosition });
  }, [updateElement]);
  
  return {
    duplicateElement,
    moveElement,
    deleteElement
  };
};
```

## Naming Conventions

### Files and Directories
- **PascalCase**: Component files (`Button.tsx`, `ComponentPalette.tsx`)
- **camelCase**: Utility files (`createElement.ts`, `formatStyles.ts`)
- **kebab-case**: CSS class names (`.button-primary`, `.modal-overlay`)
- **UPPER_SNAKE_CASE**: Constants (`API_ENDPOINTS`, `DEFAULT_CONFIG`)

### Variables and Functions
```typescript
// ✅ Good
const isVisible = true;
const elementCount = 10;
const handleElementClick = () => {};
const calculateElementPosition = () => {};

// ❌ Bad
const visible = true;
const count = 10;
const click = () => {};
const calc = () => {};
```

### Component Props
```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  isLoading: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

// ❌ Bad
interface ButtonProps {
  type: string;
  loading: any;
  click: Function;
  content: any;
}
```

## Code Quality Rules

### ESLint Configuration
```javascript
// eslint.config.js
export default {
  rules: {
    // React specific
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off', // Using TypeScript
    
    // TypeScript specific
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-const': 'error',
    
    // General code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error'
  }
};
```

### Import Organization
```typescript
// 1. External libraries
import React, { useState, useCallback } from 'react';
import { DragDropContext } from '@dnd-kit/core';

// 2. Internal utilities and hooks
import { useBuilderStore } from '@/stores/builderStore';
import { createElement } from '@/utils/componentFactory';

// 3. Types
import type { Element, ComponentType } from '@/types';

// 4. Relative imports
import { Button } from '../Button';
import styles from './Component.module.scss';
```

### Function Structure
```typescript
// ✅ Good - Pure function with clear purpose
export const calculateElementBounds = (
  element: Element, 
  containerSize: Size
): Bounds => {
  const { width, height, position } = element;
  
  return {
    top: position.y,
    left: position.x,
    bottom: position.y + height,
    right: position.x + width
  };
};

// ✅ Good - Component with clear props and behavior
export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate
}) => {
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect(element.id);
  }, [element.id, onSelect]);
  
  const handleStyleChange = useCallback((styles: Partial<StyleObject>) => {
    onUpdate(element.id, { styles: { ...element.styles, ...styles } });
  }, [element.id, element.styles, onUpdate]);
  
  return (
    <div
      className={`${styles.element} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      {/* Component content */}
    </div>
  );
};
```

## Reusability Principles

### 1. Compound Components Pattern
```typescript
// Card compound component
const Card = ({ children, className = '' }) => (
  <div className={`${styles.card} ${className}`}>{children}</div>
);

Card.Header = ({ children }) => (
  <div className={styles.cardHeader}>{children}</div>
);

Card.Body = ({ children }) => (
  <div className={styles.cardBody}>{children}</div>
);

Card.Footer = ({ children }) => (
  <div className={styles.cardFooter}>{children}</div>
);

export { Card };
```

### 2. Render Props Pattern
```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

export const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch logic here
  
  return <>{children(data, loading, error)}</>;
};

// Usage
<DataFetcher<Element[]> url="/api/elements">
  {(elements, loading, error) => (
    loading ? <Spinner /> : <ElementList elements={elements} />
  )}
</DataFetcher>
```

### 3. Higher-Order Components for Cross-Cutting Concerns
```typescript
export const withDragAndDrop = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P & { draggable?: boolean }) => {
    const { draggable = false, ...restProps } = props;
    
    if (!draggable) {
      return <Component {...(restProps as P)} />;
    }
    
    return (
      <DraggableWrapper>
        <Component {...(restProps as P)} />
      </DraggableWrapper>
    );
  };
};
```

## Performance Guidelines

### 1. Memoization Strategy
```typescript
// Memoize expensive calculations
const ElementPreview = React.memo<ElementPreviewProps>(({ element, styles }) => {
  const computedStyles = useMemo(() => 
    compileElementStyles(element, styles), 
    [element, styles]
  );
  
  const handleClick = useCallback((event: React.MouseEvent) => {
    // Handle click logic
  }, []);
  
  return <div style={computedStyles} onClick={handleClick} />;
});

// Memoize context values
const BuilderContext = createContext<BuilderContextValue>({});

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextValue = useMemo(() => ({
    elements,
    selectedElement,
    actions: {
      addElement,
      updateElement,
      deleteElement
    }
  }), [elements, selectedElement, addElement, updateElement, deleteElement]);
  
  return (
    <BuilderContext.Provider value={contextValue}>
      {children}
    </BuilderContext.Provider>
  );
};
```

### 2. Lazy Loading and Code Splitting
```typescript
// Lazy load heavy components
const PropertyEditor = React.lazy(() => import('./PropertyEditor'));
const ComponentPalette = React.lazy(() => import('./ComponentPalette'));

// Usage with Suspense
<Suspense fallback={<Spinner />}>
  <PropertyEditor />
</Suspense>
```

### 3. Virtual Rendering for Large Lists
```typescript
// For large element lists
import { FixedSizeList as List } from 'react-window';

const ElementList: React.FC<{ elements: Element[] }> = ({ elements }) => {
  const renderItem = ({ index, style }) => (
    <div style={style}>
      <ElementItem element={elements[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={elements.length}
      itemSize={80}
    >
      {renderItem}
    </List>
  );
};
```

---

## Implementation Checklist

When creating new components or features, ensure:

- [ ] Component follows single responsibility principle
- [ ] TypeScript interfaces are defined and exported
- [ ] CSS modules with BEM methodology
- [ ] Proper prop validation and defaults
- [ ] Accessibility attributes (ARIA labels, roles)
- [ ] Responsive design considerations
- [ ] Performance optimizations (memoization, lazy loading)
- [ ] Unit tests (when applicable)
- [ ] Documentation comments
- [ ] Barrel exports in index.ts files

---

*This document should be reviewed and updated regularly as the project evolves.*