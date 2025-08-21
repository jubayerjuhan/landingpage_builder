import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  element: BuilderElement;
}

export const Icon: React.FC<IconProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  
  const iconStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...styles,
  };
  
  // Get icon name from properties
  const iconName = (element.properties?.component as any)?.icon || 'Star';
  const size = (element.properties?.component as any)?.size || 24;
  const color = styles.color || '#374151';
  
  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Star;
  
  return (
    <ElementWrapper element={element}>
      <div style={iconStyles}>
        <IconComponent 
          size={size} 
          color={color}
          style={{ width: size, height: size }}
        />
      </div>
    </ElementWrapper>
  );
};