import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from '../../../types/components';
import styles from './ComponentPalette.module.scss';

interface ComponentTemplate {
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
}

const componentTemplates: ComponentTemplate[] = [
  {
    type: ComponentType.BUTTON,
    name: 'Button',
    description: 'Clickable button element',
    icon: '🔘'
  },
  {
    type: ComponentType.TEXT,
    name: 'Text',
    description: 'Simple text paragraph',
    icon: '📝'
  },
  {
    type: ComponentType.HEADING,
    name: 'Heading',
    description: 'Section heading',
    icon: '📰'
  },
  {
    type: ComponentType.IMAGE,
    name: 'Image',
    description: 'Image element',
    icon: '🖼️'
  },
  {
    type: ComponentType.INPUT,
    name: 'Input',
    description: 'Text input field',
    icon: '📄'
  },
  {
    type: ComponentType.CONTAINER,
    name: 'Container',
    description: 'Container for other elements',
    icon: '📦'
  }
];

interface DraggableComponentProps {
  template: ComponentTemplate;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ template }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${template.type}`,
    data: {
      type: template.type,
      isFromPalette: true
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={styles.componentItem}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={styles.componentIcon}>
        {template.icon}
      </div>
      <div className={styles.componentInfo}>
        <div className={styles.componentName}>
          {template.name}
        </div>
        <div className={styles.componentDescription}>
          {template.description}
        </div>
      </div>
    </div>
  );
};

export const ComponentPalette: React.FC = () => {
  const [tab, setTab] = useState<'elements' | 'layouts'>('elements');

  return (
    <div className={styles.palette}>
      <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
        <button
          className={styles.tab + ' ' + (tab === 'elements' ? styles.active : '')}
          onClick={() => setTab('elements')}
        >
          Elements
        </button>
        <button
          className={styles.tab + ' ' + (tab === 'layouts' ? styles.active : '')}
          onClick={() => setTab('layouts')}
        >
          Layouts
        </button>
      </div>

      {tab === 'elements' && (
        <>
          <h3 className={styles.paletteTitle}>Basic Elements</h3>
          <div className={styles.componentList}>
            {componentTemplates.map((template) => (
              <DraggableComponent
                key={template.type}
                template={template}
              />
            ))}
          </div>
        </>
      )}

      {tab === 'layouts' && (
        <div style={{ color: '#6b7280', fontSize: 12 }}>Layout presets coming soon.</div>
      )}
    </div>
  );
};