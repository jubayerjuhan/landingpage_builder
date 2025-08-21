import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface ListProps {
  element: BuilderElement;
}

export const List: React.FC<ListProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const listStyles: React.CSSProperties = {
    margin: '0 0 1rem 0',
    paddingLeft: '1.5rem',
    ...styles,
  };
  
  // Get list type from properties (ordered or unordered)
  const listType = (element.properties?.component as any)?.type || 'ul';
  const text = content.text || 'List item 1\nList item 2\nList item 3';
  const items = text.split('\n').filter(item => item.trim());
  
  const ListTag = listType === 'ol' ? 'ol' : 'ul';
  
  return (
    <ElementWrapper element={element}>
      <ListTag style={listStyles}>
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: '0.5rem' }}>
            {item.trim()}
          </li>
        ))}
      </ListTag>
    </ElementWrapper>
  );
};