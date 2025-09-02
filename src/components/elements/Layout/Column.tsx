import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface ColumnProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({ element, children }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);

  // Use width from properties (set by Layout when creating columns)
  const columnWidth = element.properties?.width || '100%';
  const boxSizing = (element.properties as any)?.boxSizing || 'border-box';
  const minHeight = (element.properties as any)?.minHeight || '100px';

  // Get padding from complete styles (includes Properties panel values)
  const columnPadding = styles.padding || (element.properties as any)?.padding || '0px';
  const columnPaddingTop = styles.paddingTop || '0px';
  const columnPaddingRight = styles.paddingRight || '0px';
  const columnPaddingBottom = styles.paddingBottom || '0px';
  const columnPaddingLeft = styles.paddingLeft || '0px';

  // Filter out styles to avoid duplication - we handle padding explicitly above
  const {
    width,
    ...remainingStyles
  } = styles;

  const columnStyles: React.CSSProperties = {
    width: width || columnWidth, // Use width from styles or properties
    flexGrow: 0, // Don't grow
    flexShrink: 0, // Don't shrink
    flexBasis: columnWidth, // Use exact width as basis
    display: 'flex',
    flexDirection: 'column',
    // Removed gap - elements should have their own margins for WYSIWYG consistency
    minHeight: minHeight,
    // Apply padding from complete styles (supports Properties panel)
    padding: columnPadding !== '0px' ? columnPadding : undefined,
    paddingTop: columnPaddingTop !== '0px' ? columnPaddingTop : undefined,
    paddingRight: columnPaddingRight !== '0px' ? columnPaddingRight : undefined,
    paddingBottom: columnPaddingBottom !== '0px' ? columnPaddingBottom : undefined,
    paddingLeft: columnPaddingLeft !== '0px' ? columnPaddingLeft : undefined,
    overflow: 'visible', // Ensure child elements can show drag handles
    position: 'relative', // Ensure proper stacking context
    boxSizing: boxSizing, // Ensure padding doesn't affect width calculation
    ...remainingStyles, // Apply all other styles including backgroundColor, borders, etc.
  };

  return (
    <div style={columnStyles} data-element-id={element.id} data-element-type={element.type}>
      {children || (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '60px',
            color: '#9ca3af',
            fontSize: '14px',
            border: '2px dashed #e5e7eb',
            borderRadius: '8px',
            padding: '0', // Remove default padding
            margin: '0', // Remove default margin
            boxSizing: 'border-box',
          }}
        >
          Drop components here
        </div>
      )}
    </div>
  );
};
