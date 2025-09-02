import { ComponentType } from '../types/builder';
import type { BuilderElement, ViewportMode } from '../types/builder';
import { COMPONENT_DEFINITIONS } from '../components/definitions/componentDefinitions';
import type { SectionConfig, RowConfig } from '../stores/modalStore';

/**
 * Creates a new BuilderElement from component definitions
 */
export const createElement = (type: ComponentType, overrides?: Partial<BuilderElement>): BuilderElement => {
  const definition = COMPONENT_DEFINITIONS[type];
  
  if (!definition) {
    throw new Error(`Component definition not found for type: ${type}`);
  }
  
  const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Clone the default props to avoid mutation
  const defaultElement = JSON.parse(JSON.stringify(definition.defaultProps));
  
  const element: BuilderElement = {
    id,
    ...defaultElement,
    ...overrides,
  };
  
  return element;
};

/**
 * Creates multiple elements from an array of component types
 */
export const createElements = (types: ComponentType[]): BuilderElement[] => {
  return types.map(type => createElement(type));
};

/**
 * Creates a element with children
 */
export const createElementWithChildren = (
  type: ComponentType, 
  children: BuilderElement[], 
  overrides?: Partial<BuilderElement>
): BuilderElement => {
  const element = createElement(type, overrides);
  
  // Update children parent references
  const updatedChildren = children.map(child => ({
    ...child,
    parentId: element.id
  }));
  
  return {
    ...element,
    children: updatedChildren
  };
};

/**
 * Duplicates an element with a new ID
 */
export const duplicateElement = (element: BuilderElement): BuilderElement => {
  const newId = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const duplicated: BuilderElement = {
    ...JSON.parse(JSON.stringify(element)), // Deep clone
    id: newId,
    name: element.name ? `${element.name} Copy` : undefined,
  };
  
  // Update children IDs recursively
  if (duplicated.children) {
    duplicated.children = duplicated.children.map(child => ({
      ...duplicateElement(child),
      parentId: newId
    }));
  }
  
  return duplicated;
};

/**
 * Validates if an element can be a child of another element
 */
export const canBeChild = (childType: ComponentType, parentType: ComponentType): boolean => {
  const parentDefinition = COMPONENT_DEFINITIONS[parentType];
  const childDefinition = COMPONENT_DEFINITIONS[childType];
  
  if (!parentDefinition || !childDefinition) {
    return false;
  }
  
  // Check if parent accepts children
  if (!parentDefinition.canHaveChildren) {
    return false;
  }
  
  // Check if parent accepts this child type
  if (parentDefinition.acceptsChildren && !parentDefinition.acceptsChildren.includes(childType)) {
    return false;
  }
  
  // Check if child can be child of this parent
  if (childDefinition.canBeChildOf && !childDefinition.canBeChildOf.includes(parentType)) {
    return false;
  }
  
  return true;
};

/**
 * Gets the component definition for a given type
 */
export const getComponentDefinition = (type: ComponentType) => {
  return COMPONENT_DEFINITIONS[type];
};

/**
 * Updates element properties for a specific viewport
 */
export const updateElementViewport = (
  element: BuilderElement, 
  viewport: ViewportMode, 
  properties: Partial<BuilderElement['properties']>,
  styles?: React.CSSProperties
): BuilderElement => {
  const updated = { ...element };
  
  // Update properties
  if (properties) {
    updated.properties = {
      ...updated.properties,
      ...properties
    };
  }
  
  // Update viewport-specific styles
  if (styles) {
    updated.styles = {
      ...updated.styles,
      [viewport]: {
        ...updated.styles[viewport],
        ...styles
      }
    };
  }
  
  return updated;
};

/**
 * Creates a section element from modal configuration
 */
export const createSectionFromConfig = (config: SectionConfig, overrides?: Partial<BuilderElement>): BuilderElement => {
  const maxWidthMap = {
    'full-width': '100%',
    'wide': '1400px',
    'medium': '1200px',
    'small': '800px'
  };

  const section = createElement(ComponentType.SECTION, {
    name: `${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Section`,
    properties: {
      maxWidth: config.maxWidth || maxWidthMap[config.type],
      backgroundColor: config.backgroundColor || 'transparent',
      padding: config.padding || '4rem 0'
    },
    styles: {
      desktop: {
        maxWidth: config.maxWidth || maxWidthMap[config.type],
        backgroundColor: config.backgroundColor || 'transparent',
        padding: config.padding || '4rem 0',
        margin: '0 auto',
        width: '100%'
      },
      tablet: {
        padding: '3rem 1rem'
      },
      mobile: {
        padding: '2rem 1rem'
      }
    },
    ...overrides
  });

  return section;
};

/**
 * Creates a layout element with columns directly (simplified structure)
 */
export const createLayoutFromConfig = (config: SectionConfig | { columns: number }, overrides?: Partial<BuilderElement>): BuilderElement => {
  const columnCount = 'columns' in config ? config.columns : 1;
  
  // Create columns with proper width distribution
  const columns: BuilderElement[] = [];
  const columnWidth = `${100 / columnCount}%`;
  
  for (let i = 0; i < columnCount; i++) {
    columns.push(createElement(ComponentType.COLUMN, {
      name: `Column ${i + 1}`,
      content: '',
      properties: {
        width: columnWidth,
        minHeight: '100px',
        padding: '0px', // Default to no padding for tight layouts
        boxSizing: 'border-box'
      },
      order: i
    }));
  }
  
  // Create layout with columns directly (no row wrapper)
  const layoutName = columnCount === 1 ? 'Single Column' : `${columnCount} Columns`;
  const layout = createElement(ComponentType.LAYOUT, {
    name: layoutName,
    content: '',
    properties: {
      display: 'flex',
      flexDirection: 'row',
      gap: '20px', // Gap between columns
      width: '100%',
      padding: '0px', // Default to no padding for clean layouts
      boxSizing: 'border-box'
    },
    children: columns, // Columns are direct children of layout
    ...overrides
  });
  
  return layout;
};

/**
 * Creates a row element with automatic column generation
 */
export const createRowWithColumns = (config: RowConfig, overrides?: Partial<BuilderElement>): BuilderElement => {
  // Create columns based on count
  const columns: BuilderElement[] = [];
  const columnWidth = `${100 / config.columns}%`;
  
  for (let i = 0; i < config.columns; i++) {
    const column = createElement(ComponentType.COLUMN, {
      name: `Column ${i + 1}`,
      properties: {
        width: columnWidth,
        padding: '1rem'
      },
      styles: {
        desktop: {
          width: columnWidth,
          padding: '1rem',
          minHeight: '100px'
        },
        tablet: {
          width: config.columns <= 2 ? columnWidth : '100%',
          marginBottom: config.columns > 2 ? '1rem' : '0'
        },
        mobile: {
          width: '100%',
          marginBottom: '1rem'
        }
      }
    });
    columns.push(column);
  }

  // Create row with columns as children
  const row = createElementWithChildren(ComponentType.ROW, columns, {
    name: `${config.columns}-Column Row`,
    properties: {
      gap: config.gap || '1rem',
      alignment: config.alignment || 'stretch'
    },
    styles: {
      desktop: {
        display: 'flex',
        gap: config.gap || '1rem',
        alignItems: config.alignment === 'stretch' ? 'stretch' : config.alignment,
        width: '100%'
      },
      tablet: {
        flexWrap: config.columns > 2 ? 'wrap' : 'nowrap'
      },
      mobile: {
        flexDirection: 'column',
        gap: '1rem'
      }
    },
    ...overrides
  });

  return row;
};