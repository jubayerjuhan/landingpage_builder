import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { getElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface DividerProps {
  element: BuilderElement;
}

export const Divider: React.FC<DividerProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  
  const dividerStyles: React.CSSProperties = {
    width: '100%',
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '1rem 0',
    border: 'none',
    ...styles,
  };
  
  return (
    <hr style={dividerStyles} data-element-id={element.id} data-element-type={element.type} />
  );
};