import type { BuilderElement, ViewportMode, ComponentProperties } from '../types/builder';
import { getDefaultStyles, getHeadingStyles, mergeStyles } from './defaultComponentStyles';

/**
 * Get complete element styles including defaults and custom styles
 * This is the SINGLE SOURCE OF TRUTH for both builder and preview
 */
export const getCompleteElementStyles = (
  element: BuilderElement, 
  viewportMode: ViewportMode
): React.CSSProperties => {
  // 1. Start with component default styles
  let baseStyles = getDefaultStyles(element.type);
  
  // Special handling for headings based on level
  if (element.type === 'heading') {
    const level = element.properties?.level || 2;
    baseStyles = mergeStyles(baseStyles, getHeadingStyles(level as 1 | 2 | 3 | 4 | 5 | 6));
  }
  
  // 2. Get viewport-specific custom styles
  const customStyles = element.styles?.[viewportMode] || {};
  
  // 3. Get properties-based styles
  const propertyStyles: React.CSSProperties = {};
  const properties = element.properties || {};
  
  // Apply spacing properties
  if (properties.spacing) {
    const { spacing } = properties;
    if (spacing.margin) propertyStyles.margin = spacing.margin;
    if (spacing.marginTop) propertyStyles.marginTop = spacing.marginTop;
    if (spacing.marginRight) propertyStyles.marginRight = spacing.marginRight;
    if (spacing.marginBottom) propertyStyles.marginBottom = spacing.marginBottom;
    if (spacing.marginLeft) propertyStyles.marginLeft = spacing.marginLeft;
    if (spacing.padding) propertyStyles.padding = spacing.padding;
    if (spacing.paddingTop) propertyStyles.paddingTop = spacing.paddingTop;
    if (spacing.paddingRight) propertyStyles.paddingRight = spacing.paddingRight;
    if (spacing.paddingBottom) propertyStyles.paddingBottom = spacing.paddingBottom;
    if (spacing.paddingLeft) propertyStyles.paddingLeft = spacing.paddingLeft;
  }
  
  // Apply layout properties
  if (properties.layout) {
    Object.assign(propertyStyles, properties.layout);
  }
  
  // 4. Merge all styles (order matters: defaults -> custom -> properties)
  return mergeStyles(mergeStyles(baseStyles, customStyles), propertyStyles);
};

/**
 * DEPRECATED: Use getCompleteElementStyles instead
 * Keeping for backward compatibility
 */
export const getElementStyles = (
  element: BuilderElement, 
  viewportMode: ViewportMode
): React.CSSProperties => {
  return getCompleteElementStyles(element, viewportMode);
};

/**
 * Convert element properties to CSS styles
 */
export const propertiesToStyles = (properties: ComponentProperties): React.CSSProperties => {
  const cssStyles: React.CSSProperties = {};
  
  if (properties.typography) {
    const { typography } = properties;
    if (typography.fontFamily) cssStyles.fontFamily = typography.fontFamily;
    if (typography.fontSize) cssStyles.fontSize = typography.fontSize;
    if (typography.fontWeight) cssStyles.fontWeight = typography.fontWeight;
    if (typography.lineHeight) cssStyles.lineHeight = typography.lineHeight;
    if (typography.letterSpacing) cssStyles.letterSpacing = typography.letterSpacing;
    if (typography.textAlign) cssStyles.textAlign = typography.textAlign;
    if (typography.textDecoration) cssStyles.textDecoration = typography.textDecoration;
    if (typography.textTransform) cssStyles.textTransform = typography.textTransform;
    if (typography.whiteSpace) cssStyles.whiteSpace = typography.whiteSpace;
  }
  
  if (properties.border) {
    const { border } = properties;
    if (border.width) cssStyles.borderWidth = border.width;
    if (border.style) cssStyles.borderStyle = border.style;
    if (border.color) cssStyles.borderColor = border.color;
    if (border.radius) cssStyles.borderRadius = border.radius;
  }
  
  if (properties.background) {
    const { background } = properties;
    if (background.color) cssStyles.backgroundColor = background.color;
    if (background.image) cssStyles.backgroundImage = `url(${background.image})`;
    if (background.size) cssStyles.backgroundSize = background.size;
    if (background.position) cssStyles.backgroundPosition = background.position;
    if (background.repeat) cssStyles.backgroundRepeat = background.repeat;
    if (background.attachment) cssStyles.backgroundAttachment = background.attachment;
    
    if (background.gradient) {
      const { gradient } = background;
      const stops = gradient.stops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
      if (gradient.type === 'linear') {
        cssStyles.backgroundImage = `linear-gradient(${gradient.direction || '0deg'}, ${stops})`;
      } else {
        cssStyles.backgroundImage = `radial-gradient(${stops})`;
      }
    }
  }
  
  if (properties.effects) {
    const { effects } = properties;
    if (effects.boxShadow) cssStyles.boxShadow = effects.boxShadow;
    if (effects.textShadow) cssStyles.textShadow = effects.textShadow;
    if (effects.opacity !== undefined) cssStyles.opacity = effects.opacity;
    if (effects.transform) cssStyles.transform = effects.transform;
    if (effects.filter) cssStyles.filter = effects.filter;
    if (effects.transition) cssStyles.transition = effects.transition;
  }
  
  if (properties.flex) {
    const { flex } = properties;
    if (flex.direction) cssStyles.flexDirection = flex.direction;
    if (flex.wrap) cssStyles.flexWrap = flex.wrap;
    if (flex.justifyContent) cssStyles.justifyContent = flex.justifyContent;
    if (flex.alignItems) cssStyles.alignItems = flex.alignItems;
    if (flex.alignContent) cssStyles.alignContent = flex.alignContent;
    if (flex.gap) cssStyles.gap = flex.gap;
  }
  
  if (properties.grid) {
    const { grid } = properties;
    if (grid.templateColumns) cssStyles.gridTemplateColumns = grid.templateColumns;
    if (grid.templateRows) cssStyles.gridTemplateRows = grid.templateRows;
    if (grid.gap) cssStyles.gap = grid.gap;
    if (grid.columnGap) cssStyles.columnGap = grid.columnGap;
    if (grid.rowGap) cssStyles.rowGap = grid.rowGap;
    if (grid.autoColumns) cssStyles.gridAutoColumns = grid.autoColumns;
    if (grid.autoRows) cssStyles.gridAutoRows = grid.autoRows;
    if (grid.autoFlow) cssStyles.gridAutoFlow = grid.autoFlow;
  }
  
  if (properties.interaction) {
    const { interaction } = properties;
    if (interaction.cursor) cssStyles.cursor = interaction.cursor;
    if (interaction.userSelect) cssStyles.userSelect = interaction.userSelect;
    if (interaction.pointerEvents) cssStyles.pointerEvents = interaction.pointerEvents;
    if (interaction.overflow) cssStyles.overflow = interaction.overflow;
    if (interaction.overflowX) cssStyles.overflowX = interaction.overflowX;
    if (interaction.overflowY) cssStyles.overflowY = interaction.overflowY;
  }
  
  return cssStyles;
};

/**
 * Merges element content properties for easy access
 */
export const getElementContent = (element: BuilderElement) => {
  return {
    text: element.content || element.properties?.content?.text || '',
    html: element.properties?.content?.html || '',
    src: element.properties?.content?.src || '',
    alt: element.properties?.content?.alt || '',
    href: element.properties?.content?.href || '',
    target: element.properties?.content?.target || '_self',
    title: element.properties?.content?.title || '',
    placeholder: element.properties?.content?.placeholder || '',
  };
};