import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from '../../../types/components';
import styles from './ComponentPalette.module.scss';

interface ComponentTemplate {
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
  category: 'layout' | 'content';
}

const componentTemplates: ComponentTemplate[] = [
  {
    type: ComponentType.SECTION,
    name: 'Section',
    description: 'Container for organizing content',
    icon: '📋',
    category: 'layout',
  },
  {
    type: ComponentType.CONTAINER,
    name: 'Container',
    description: 'Container for other elements',
    icon: '📦',
    category: 'layout',
  },
  {
    type: ComponentType.CARD,
    name: 'Card',
    description: 'Card with shadow and border',
    icon: '🃏',
    category: 'layout',
  },
  {
    type: ComponentType.HEADING,
    name: 'Heading',
    description: 'Section heading',
    icon: '📰',
    category: 'content',
  },
  {
    type: ComponentType.TEXT,
    name: 'Text',
    description: 'Simple text paragraph',
    icon: '📝',
    category: 'content',
  },
  {
    type: ComponentType.BUTTON,
    name: 'Button',
    description: 'Clickable button element',
    icon: '🔘',
    category: 'content',
  },
  {
    type: ComponentType.IMAGE,
    name: 'Image',
    description: 'Image element',
    icon: '🖼️',
    category: 'content',
  },
  {
    type: ComponentType.INPUT,
    name: 'Input',
    description: 'Text input field',
    icon: '📄',
    category: 'content',
  },
  {
    type: ComponentType.TEXTAREA,
    name: 'Text Area',
    description: 'Multi-line text input',
    icon: '📝',
    category: 'content',
  },
];

interface DraggableComponentProps {
  template: ComponentTemplate;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ template }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${template.type}`,
    data: {
      type: template.type,
      isFromPalette: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={styles.componentItem}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={styles.componentIcon}>{template.icon}</div>
      <div className={styles.componentInfo}>
        <div className={styles.componentName}>{template.name}</div>
        <div className={styles.componentDescription}>{template.description}</div>
      </div>
    </div>
  );
};

export const ComponentPalette: React.FC = () => {
  const layoutComponents = componentTemplates.filter(c => c.category === 'layout');
  const contentComponents = componentTemplates.filter(c => c.category === 'content');

  return (
    <div className={styles.palette}>
      <h3 className={styles.paletteTitle}>Layout Elements</h3>
      <div className={styles.componentList}>
        {layoutComponents.map(template => (
          <DraggableComponent key={template.type} template={template} />
        ))}
      </div>

      <h3 className={styles.paletteTitle}>Content Elements</h3>
      <div className={styles.componentList}>
        {contentComponents.map(template => (
          <DraggableComponent key={template.type} template={template} />
        ))}
      </div>
    </div>
  );
};
