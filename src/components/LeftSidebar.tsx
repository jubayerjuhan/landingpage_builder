import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Accordion } from './shared/Accordion';
import { Layout, Type, Square, Circle, Image, RectangleHorizontal } from 'lucide-react';
import './LeftSidebar.module.scss';

const layoutItems = [
  { id: 'section', name: 'Section', icon: Square },
  { id: 'container', name: 'Container', icon: Layout },
  { id: 'grid', name: 'Grid', icon: Layout },
];

const typographyItems = [
  { id: 'heading', name: 'Heading', icon: Type },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'paragraph', name: 'Paragraph', icon: Type },
];

const elementItems = [
  { id: 'button', name: 'Button', icon: RectangleHorizontal },
  { id: 'image', name: 'Image', icon: Image },
  { id: 'icon', name: 'Icon', icon: Circle },
];

interface DraggableItemProps {
  id: string;
  name: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  type: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, name, icon: Icon, type }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${id}`,
    data: {
      type,
      isFromPalette: true,
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="sidebar-item"
    >
      <Icon size={16} className="sidebar-item__icon" />
      <span className="sidebar-item__name">{name}</span>
    </div>
  );
};

export const LeftSidebar: React.FC = () => {
  return (
    <div className="left-sidebar">
      <div className="left-sidebar__header">
        <h3>Elements</h3>
      </div>
      
      <div className="left-sidebar__content">
        <Accordion title="Layout" defaultOpen={true}>
          <div className="sidebar-items">
            {layoutItems.map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                name={item.name}
                icon={item.icon}
                type={item.id}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="Typography">
          <div className="sidebar-items">
            {typographyItems.map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                name={item.name}
                icon={item.icon}
                type={item.id}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="Elements">
          <div className="sidebar-items">
            {elementItems.map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                name={item.name}
                icon={item.icon}
                type={item.id}
              />
            ))}
          </div>
        </Accordion>
      </div>
    </div>
  );
};