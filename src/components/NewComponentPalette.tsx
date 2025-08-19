import React from 'react';
import { useDraggableComponent } from './DragAndDrop';
import { 
  COMPONENT_DEFINITIONS, 
  COMPONENT_CATEGORIES, 
  getComponentsByCategory,
  getAllCategories 
} from './definitions/componentDefinitions';
import type { ComponentDefinition } from '../types/builder';
import { ComponentCategory } from '../types/builder';
// Using inline styles for now to avoid SCSS issues
// import './ComponentPalette.module.scss';

interface DraggableComponentProps {
  definition: ComponentDefinition;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ definition }) => {
  const { setNodeRef, attributes, listeners, isDragging, style } = useDraggableComponent(
    definition.type
  );

  const IconComponent = definition.icon;

  const componentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    cursor: 'grab',
    transition: 'all 0.2s ease',
    opacity: isDragging ? 0.5 : 1,
    ...style
  };

  return (
    <div
      ref={setNodeRef}
      style={componentStyle}
      {...attributes}
      {...listeners}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = '#007bff';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.15)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = '#e0e0e0';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'none';
        }
      }}
    >
      <div style={{
        flexShrink: 0,
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        color: '#007bff'
      }}>
        <IconComponent size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 500,
          fontSize: '0.875rem',
          color: '#333',
          marginBottom: '0.25rem'
        }}>
          {definition.name}
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: '#666',
          lineHeight: 1.3
        }}>
          {definition.description}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {definition.tags.slice(0, 2).map(tag => (
          <span key={tag} style={{
            backgroundColor: '#e9ecef',
            color: '#495057',
            padding: '0.125rem 0.375rem',
            borderRadius: '12px',
            fontSize: '0.65rem',
            fontWeight: 500
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

interface CategorySectionProps {
  category: ComponentCategory;
  isOpen: boolean;
  onToggle: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, isOpen, onToggle }) => {
  const categoryInfo = COMPONENT_CATEGORIES[category];
  const components = getComponentsByCategory(category);
  const IconComponent = categoryInfo.icon;

  return (
    <div style={{
      marginBottom: '0.5rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          backgroundColor: isOpen ? '#007bff' : '#f8f9fa',
          color: isOpen ? 'white' : 'black',
          borderBottom: '1px solid #e9ecef',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={onToggle}
      >
        <IconComponent size={18} />
        <span style={{
          flex: 1,
          fontWeight: 500,
          fontSize: '0.9rem'
        }}>
          {categoryInfo.name}
        </span>
        <span style={{
          fontSize: '0.8rem',
          color: isOpen ? 'rgba(255, 255, 255, 0.8)' : '#666'
        }}>
          ({components.length})
        </span>
        <span style={{
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          {isOpen ? '−' : '+'}
        </span>
      </div>
      
      {isOpen && (
        <div style={{ padding: '1rem' }}>
          <p style={{
            margin: '0 0 1rem 0',
            fontSize: '0.8rem',
            color: '#666',
            fontStyle: 'italic'
          }}>
            {categoryInfo.description}
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {components.map(definition => (
              <DraggableComponent key={definition.type} definition={definition} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const NewComponentPalette: React.FC = () => {
  const [openCategories, setOpenCategories] = React.useState<Set<ComponentCategory>>(
    new Set([ComponentCategory.LAYOUT, ComponentCategory.CONTENT])
  );

  const categories = getAllCategories();

  const toggleCategory = (category: ComponentCategory) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(category)) {
      newOpenCategories.delete(category);
    } else {
      newOpenCategories.add(category);
    }
    setOpenCategories(newOpenCategories);
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fafafa'
    }}>
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white'
      }}>
        <h2 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#333'
        }}>
          Components
        </h2>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: '#666'
        }}>
          Drag components to the canvas
        </p>
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.5rem'
      }}>
        {categories.map(categoryInfo => (
          <CategorySection
            key={categoryInfo.id}
            category={categoryInfo.id}
            isOpen={openCategories.has(categoryInfo.id)}
            onToggle={() => toggleCategory(categoryInfo.id)}
          />
        ))}
      </div>
      
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: 'white',
        textAlign: 'center'
      }}>
        <small style={{
          color: '#666',
          fontSize: '0.75rem'
        }}>
          {Object.keys(COMPONENT_DEFINITIONS).length} components available
        </small>
      </div>
    </div>
  );
};