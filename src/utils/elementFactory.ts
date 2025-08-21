import type { BuilderElement, ComponentType, ViewportMode } from '../types/builder';
import { COMPONENT_DEFINITIONS } from '../components/definitions/componentDefinitions';

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