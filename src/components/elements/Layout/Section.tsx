import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface SectionProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ element, children }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);

  // Get all styles from the complete merged styles (includes Properties panel values)
  const {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    backgroundColor,
    borderRadius,
    border,
    boxShadow,
    display,
    flexDirection,
    gap,
    width,
    minHeight,
    boxSizing,
    ...remainingStyles
  } = styles;

  // Use merged styles directly - they already include Properties panel values
  const displayStyle = display || element.properties?.display || 'block';
  const flexDir = flexDirection || element.properties?.flexDirection || 'column';
  const gapValue = gap || element.properties?.gap || '0';
  const widthValue = width || element.properties?.width || '100%';
  const minHeightValue = minHeight || (element.properties as any)?.minHeight || '60px';
  const boxSizingValue = boxSizing || (element.properties as any)?.boxSizing || 'border-box';

  // Apply all styles to section element - use merged styles that include Properties panel values
  const sectionStyles: React.CSSProperties = {
    display: displayStyle,
    flexDirection: displayStyle === 'flex' ? (flexDir as any) : undefined,
    gap: displayStyle === 'flex' ? gapValue : undefined,
    width: widthValue,
    minHeight: element.type === 'layout' ? minHeightValue : '60px',
    // Apply padding from merged styles (includes Properties panel)
    padding: padding,
    paddingTop: paddingTop,
    paddingRight: paddingRight,
    paddingBottom: paddingBottom,
    paddingLeft: paddingLeft,
    // Apply margin from merged styles
    margin: margin,
    marginTop: marginTop,
    marginRight: marginRight,
    marginBottom: marginBottom,
    marginLeft: marginLeft,
    boxSizing: boxSizingValue,
    backgroundColor: element.type === 'layout' ? backgroundColor : undefined,
    borderRadius: element.type === 'layout' ? borderRadius : undefined,
    border: element.type === 'layout' ? border : undefined,
    boxShadow: element.type === 'layout' ? boxShadow : undefined,
    ...remainingStyles, // Apply any remaining styles
  };

  return (
    <ElementWrapper element={element}>
      <section style={sectionStyles} data-element-id={element.id} data-element-type={element.type}>
        {children || (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px',
              color: '#9ca3af',
              fontSize: '14px',
              border: '2px dashed #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            Drop components here
          </div>
        )}
      </section>
    </ElementWrapper>
  );
};
