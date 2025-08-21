import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  getAllCategories, 
  getComponentsByCategory
} from '../../definitions/componentDefinitions';
import { ComponentCategory } from '../../../types/builder';
import type { ComponentDefinition } from '../../../types/builder';
import styles from './ComponentPalette.module.scss';

interface DraggableComponentProps {
  definition: ComponentDefinition;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ definition }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${definition.type}`,
    data: {
      type: definition.type,
      isFromPalette: true,
    },
  });

  const IconComponent = definition.icon;

  return (
    <div
      ref={setNodeRef}
      className={styles.componentItem}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={styles.componentIcon}>
        <IconComponent size={18} />
      </div>
      <div className={styles.componentInfo}>
        <div className={styles.componentName}>{definition.name}</div>
        <div className={styles.componentDescription}>{definition.description}</div>
      </div>
    </div>
  );
};

type TabType = 'elements' | 'layouts';

export const ComponentPalette: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('elements');
  const categories = getAllCategories();
  
  const layoutCategories = [ComponentCategory.LAYOUT];
  const elementCategories = [
    ComponentCategory.CONTENT,
    ComponentCategory.MEDIA, 
    ComponentCategory.INTERACTIVE,
    ComponentCategory.FORMS,
    ComponentCategory.BUSINESS,
    ComponentCategory.ADVANCED
  ];

  const getVisibleCategories = () => {
    return activeTab === 'layouts' 
      ? categories.filter(cat => layoutCategories.includes(cat.id))
      : categories.filter(cat => elementCategories.includes(cat.id));
  };

  return (
    <div className={styles.palette}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'elements' ? styles.active : ''}`}
          onClick={() => setActiveTab('elements')}
        >
          Elements
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'layouts' ? styles.active : ''}`}
          onClick={() => setActiveTab('layouts')}
        >
          Layouts
        </button>
      </div>

      <div className={styles.categoriesContainer}>
        {getVisibleCategories().map(category => {
          const components = getComponentsByCategory(category.id);
          const IconComponent = category.icon;
          
          return (
            <div key={category.id} className={styles.category}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  <IconComponent size={16} />
                </div>
                <h3 className={styles.categoryTitle}>{category.name}</h3>
              </div>
              <div className={styles.componentList}>
                {components.map(definition => (
                  <DraggableComponent key={definition.type} definition={definition} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};