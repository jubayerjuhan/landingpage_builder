import type { BuilderElement, ViewportMode, ComponentProperties } from '../types/builder';

/**
 * Converts BuilderElement properties and styles to CSS styles for a given viewport
 */
export const getElementStyles = (
  element: BuilderElement, 
  viewportMode: ViewportMode
): React.CSSProperties => {
  const styles = element.styles[viewportMode] || {};
  const properties = element.properties || {};
  
  const cssStyles: React.CSSProperties = { ...styles };
  
  // Apply properties-based styles
  if (properties.layout) {
    Object.assign(cssStyles, properties.layout);
  }
  
  if (properties.spacing) {
    const { spacing } = properties;
    if (spacing.margin) cssStyles.margin = spacing.margin;
    if (spacing.marginTop) cssStyles.marginTop = spacing.marginTop;
    if (spacing.marginRight) cssStyles.marginRight = spacing.marginRight;
    if (spacing.marginBottom) cssStyles.marginBottom = spacing.marginBottom;
    if (spacing.marginLeft) cssStyles.marginLeft = spacing.marginLeft;
    if (spacing.padding) cssStyles.padding = spacing.padding;
    if (spacing.paddingTop) cssStyles.paddingTop = spacing.paddingTop;
    if (spacing.paddingRight) cssStyles.paddingRight = spacing.paddingRight;
    if (spacing.paddingBottom) cssStyles.paddingBottom = spacing.paddingBottom;
    if (spacing.paddingLeft) cssStyles.paddingLeft = spacing.paddingLeft;
  }
  
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