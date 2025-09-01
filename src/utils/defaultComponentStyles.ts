import { ComponentType } from '../types/builder';
import { spacing, typography, colors, layout, shadows, borders } from '../styles/designSystem';

/**
 * Professional Default Styles for Components
 * These ensure consistent, professional appearance out of the box
 * Based on best practices from Webflow, Framer, and GoHighLevel
 */

export const defaultComponentStyles: Record<ComponentType, React.CSSProperties> = {
  // ============================================================================
  // LAYOUT COMPONENTS
  // ============================================================================
  
  layout: {
    width: '100%',
    padding: `${layout.section.paddingY} ${layout.section.paddingX}`,
    minHeight: layout.section.minHeight,
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
  },
  
  section: {
    width: '100%',
    padding: `${layout.section.paddingY} ${layout.section.paddingX}`,
    minHeight: layout.section.minHeight,
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
  },
  
  container: {
    width: '100%',
    maxWidth: layout.container.maxWidth,
    margin: '0 auto',
    padding: layout.container.padding,
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
  },
  
  row: {
    display: 'flex',
    width: '100%',
    gap: layout.grid.gap,
    flexWrap: 'wrap' as const,
    alignItems: 'stretch' as const,
    minHeight: '80px',
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
  },
  
  column: {
    flex: '1 1 0%',
    padding: layout.column.padding,
    minHeight: layout.column.minHeight,
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
  },
  
  spacer: {
    width: '100%',
    height: spacing.xl,
    display: 'block',
  },
  
  divider: {
    width: '100%',
    height: '1px',
    backgroundColor: colors.neutral[200],
    margin: `${spacing.lg} 0`,
    border: 'none',
  },
  
  // ============================================================================
  // CONTENT COMPONENTS
  // ============================================================================
  
  heading: {
    marginTop: '0',
    marginBottom: spacing.lg,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    color: colors.neutral[900],
    fontFamily: 'inherit',
  },
  
  paragraph: {
    marginTop: '0',
    marginBottom: spacing.md,
    lineHeight: typography.lineHeight.normal,
    color: colors.neutral[700],
    fontSize: typography.fontSize.base,
    fontFamily: 'inherit',
  },
  
  text: {
    display: 'inline-block',
    lineHeight: typography.lineHeight.base,
    color: colors.neutral[700],
    fontSize: typography.fontSize.base,
    fontFamily: 'inherit',
  },
  
  list: {
    marginTop: '0',
    marginBottom: spacing.md,
    paddingLeft: spacing.lg,
    lineHeight: typography.lineHeight.normal,
    color: colors.neutral[700],
    fontSize: typography.fontSize.base,
  },
  
  quote: {
    marginTop: '0',
    marginBottom: spacing.lg,
    paddingLeft: spacing.lg,
    borderLeft: `4px solid ${colors.primary[500]}`,
    fontStyle: 'italic' as const,
    color: colors.neutral[600],
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.relaxed,
  },
  
  code: {
    display: 'block',
    padding: spacing.md,
    marginTop: '0',
    marginBottom: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.md,
    fontFamily: 'monospace',
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    color: colors.neutral[800],
    overflowX: 'auto' as const,
  },
  
  // ============================================================================
  // MEDIA COMPONENTS
  // ============================================================================
  
  image: {
    display: 'block',
    width: '100%',
    height: 'auto',
    marginBottom: spacing.md,
    borderRadius: borders.radius.lg,
    objectFit: 'cover' as const,
  },
  
  video: {
    display: 'block',
    width: '100%',
    height: 'auto',
    marginBottom: spacing.md,
    borderRadius: borders.radius.lg,
  },
  
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    color: colors.neutral[700],
  },
  
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  
  'background-video': {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    zIndex: -1,
  },
  
  // ============================================================================
  // INTERACTIVE COMPONENTS
  // ============================================================================
  
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.sm} ${spacing.lg}`,
    marginBottom: spacing.sm,
    backgroundColor: colors.primary[500],
    color: 'white',
    border: 'none',
    borderRadius: borders.radius.md,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    fontFamily: 'inherit',
  },
  
  link: {
    color: colors.primary[500],
    textDecoration: 'underline',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    fontSize: 'inherit',
    fontFamily: 'inherit',
  },
  
  accordion: {
    width: '100%',
    marginBottom: spacing.md,
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borders.radius.lg,
    overflow: 'hidden',
  },
  
  tabs: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  
  modal: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: borders.radius.xl,
    padding: spacing.xl,
    boxShadow: shadows['2xl'],
    maxWidth: '500px',
    width: '90%',
    zIndex: 1050,
  },
  
  popup: {
    position: 'absolute' as const,
    backgroundColor: 'white',
    borderRadius: borders.radius.lg,
    padding: spacing.md,
    boxShadow: shadows.lg,
    border: `1px solid ${colors.neutral[200]}`,
    zIndex: 1060,
  },
  
  // ============================================================================
  // FORM COMPONENTS
  // ============================================================================
  
  input: {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    marginBottom: spacing.md,
    backgroundColor: 'white',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borders.radius.md,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    color: colors.neutral[900],
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
  },
  
  textarea: {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    marginBottom: spacing.md,
    backgroundColor: 'white',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borders.radius.md,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.neutral[900],
    fontFamily: 'inherit',
    minHeight: '120px',
    resize: 'vertical' as const,
    transition: 'border-color 0.2s ease',
  },
  
  // Placeholder for undefined component types
  // This ensures we always have some default styles
} as const;

/**
 * Get default styles for a component type
 */
export const getDefaultStyles = (type: ComponentType): React.CSSProperties => {
  return defaultComponentStyles[type] || {};
};

/**
 * Merge default styles with custom styles
 * Custom styles override defaults
 */
export const mergeStyles = (
  defaultStyles: React.CSSProperties,
  customStyles?: React.CSSProperties
): React.CSSProperties => {
  return {
    ...defaultStyles,
    ...customStyles,
  };
};

/**
 * Get typography styles based on heading level
 */
export const getHeadingStyles = (level: 1 | 2 | 3 | 4 | 5 | 6): React.CSSProperties => {
  const sizes = {
    1: typography.fontSize['5xl'],
    2: typography.fontSize['4xl'],
    3: typography.fontSize['3xl'],
    4: typography.fontSize['2xl'],
    5: typography.fontSize.xl,
    6: typography.fontSize.lg,
  };
  
  return {
    fontSize: sizes[level],
    fontWeight: level <= 3 ? typography.fontWeight.bold : typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    marginBottom: spacing.lg,
  };
};

/**
 * Apply responsive styles based on viewport
 */
export const getResponsiveStyles = (
  baseStyles: React.CSSProperties,
  viewport: 'mobile' | 'tablet' | 'desktop'
): React.CSSProperties => {
  // Adjust spacing for mobile
  if (viewport === 'mobile') {
    return {
      ...baseStyles,
      padding: baseStyles.padding ? 
        (typeof baseStyles.padding === 'string' && baseStyles.padding.includes(' ') ? 
          baseStyles.padding.split(' ').map(v => {
            const num = parseInt(v);
            return isNaN(num) ? v : `${Math.floor(num * 0.75)}px`;
          }).join(' ') : baseStyles.padding) : baseStyles.padding,
      fontSize: baseStyles.fontSize ?
        (typeof baseStyles.fontSize === 'string' && baseStyles.fontSize.includes('px') ?
          `${Math.floor(parseInt(baseStyles.fontSize) * 0.9)}px` : baseStyles.fontSize) : baseStyles.fontSize,
    };
  }
  
  return baseStyles;
};

export default {
  defaultComponentStyles,
  getDefaultStyles,
  mergeStyles,
  getHeadingStyles,
  getResponsiveStyles,
};