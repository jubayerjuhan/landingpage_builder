import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { getCompleteElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface DividerProps {
  element: BuilderElement;
}

export const Divider: React.FC<DividerProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  
  const dividerStyles: React.CSSProperties = {
    width: '100%',
    height: '1px',
    backgroundColor: '#e5e7eb',
    border: 'none',
    ...styles,
  };
  
  return (
    <hr style={dividerStyles} data-element-id={element.id} data-element-type={element.type} />
  );
};