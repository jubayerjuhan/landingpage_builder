import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '../app/store';
import type { DroppedElement } from '../app/store';
import { Plus, Star, Image as ImageIcon, GripVertical, X } from 'lucide-react';
import './Canvas.module.scss';

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
  className: string;
  elements?: DroppedElement[];
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({ id, children, className, elements = [] }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `container-${id}`,
  });

  return (
    <SortableContext items={elements.map(el => el.id)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className={`${className} ${isOver ? 'canvas__container--over' : ''}`}>
        {children}
      </div>
    </SortableContext>
  );
};

interface SortableElementWrapperProps {
  element: DroppedElement;
  isSelected: boolean;
  onElementClick: (elementId: string, event: React.MouseEvent) => void;
}

const SortableElementWrapper: React.FC<SortableElementWrapperProps> = ({
  element,
  isSelected,
  onElementClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getComponentBadge = (elementType: string) => {
    const badges: Record<string, { label: string; color: string; icon: string }> = {
      heading: { label: 'Heading', color: '#3b82f6', icon: 'H1' },
      text: { label: 'Text', color: '#6b7280', icon: 'T' },
      paragraph: { label: 'Paragraph', color: '#6b7280', icon: 'P' },
      button: { label: 'Button', color: '#10b981', icon: 'BTN' },
      image: { label: 'Image', color: '#f59e0b', icon: 'IMG' },
      input: { label: 'Input', color: '#8b5cf6', icon: 'IN' },
      textarea: { label: 'Text Area', color: '#8b5cf6', icon: 'TA' },
      section: { label: 'Section', color: '#3b82f6', icon: '📦' },
      container: { label: 'Container', color: '#10b981', icon: '📁' },
      card: { label: 'Card', color: '#f59e0b', icon: '🃏' },
    };
    return badges[elementType] || { label: elementType, color: '#6b7280', icon: '?' };
  };

  const badge = getComponentBadge(element.type);
  const isLayoutComponent = ['section', 'container', 'card'].includes(element.type);
  const { removeElement } = useBuilderStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  if (isLayoutComponent) {
    // For layout components, don't show wrapper styling - let the component handle its own appearance
    return (
      <div ref={setNodeRef} style={style} className="sortable-element-wrapper sortable-element-wrapper--layout">
        <ElementRenderer
          element={element}
          isSelected={isSelected}
          onElementClick={onElementClick}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      </div>
    );
  }

  // For content elements, show unified design similar to layout components
  return (
    <div ref={setNodeRef} style={style} className="sortable-element-wrapper">
      <div 
        className={`canvas__content-element ${isSelected ? 'canvas__content-element--selected' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onElementClick(element.id, e);
        }}
      >
        {isSelected && (
          <div 
            className="canvas__content-element-badge"
            style={{ backgroundColor: badge.color }}
          >
            {badge.label}
          </div>
        )}
        {isSelected && (
          <div className="canvas__content-element-drag-handle" {...attributes} {...listeners}>
            <GripVertical size={16} />
          </div>
        )}
        {isSelected && (
          <div className="canvas__content-element-delete-button" onClick={handleDelete}>
            <X size={14} />
          </div>
        )}
        <div className="canvas__content-element-content">
          <ElementRenderer
            element={element}
            isSelected={isSelected}
            onElementClick={onElementClick}
          />
        </div>
      </div>
    </div>
  );
};

interface ElementRendererProps {
  element: DroppedElement;
  isSelected: boolean;
  onElementClick: (elementId: string, event: React.MouseEvent) => void;
  dragHandleProps?: {
    [key: string]: unknown;
  };
}

const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onElementClick,
  dragHandleProps,
}) => {
  const { selectedElementId, removeElement } = useBuilderStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };
  const renderElementContent = () => {
    switch (element.type) {
      case 'heading':
        return (
          <h1 contentEditable suppressContentEditableWarning={true}>
            {element.content}
          </h1>
        );
      case 'text':
        return (
          <span contentEditable suppressContentEditableWarning={true}>
            {element.content}
          </span>
        );
      case 'paragraph':
        return (
          <p contentEditable suppressContentEditableWarning={true}>
            {element.content}
          </p>
        );
      case 'button':
        return <button className="sample-button">{element.content}</button>;
      case 'image':
        return (
          <div className="canvas__image-placeholder">
            <ImageIcon size={24} />
            <span>Image placeholder</span>
          </div>
        );
      case 'icon':
        return (
          <div className="canvas__icon">
            <Star size={24} />
          </div>
        );
      case 'input':
        return (
          <input
            type="text"
            placeholder="Enter text..."
            className="canvas__input"
            defaultValue={element.content}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder="Enter text..."
            className="canvas__textarea"
            defaultValue={element.content}
            rows={4}
          />
        );
      case 'section': {
        const isSectionEmpty = !element.children || element.children.length === 0;
        return (
          <div
            className={`canvas__section ${isSelected ? 'canvas__section--selected' : ''} ${
              isSectionEmpty ? 'canvas__section--empty' : ''
            }`}
            onClick={(e) => {
              // Only select this section if clicking on the section itself, not its children
              if (e.target === e.currentTarget || (e.target as Element).closest('.canvas__section-content') === e.currentTarget.querySelector('.canvas__section-content')) {
                e.stopPropagation();
                onElementClick(element.id, e);
              }
            }}
          >
            <div className="canvas__section-header">Section</div>
            {dragHandleProps && isSelected && (
              <div className="canvas__section-drag-handle" {...dragHandleProps}>
                <GripVertical size={16} />
              </div>
            )}
            {isSelected && (
              <div className="canvas__section-delete-button" onClick={handleDelete}>
                <X size={14} />
              </div>
            )}
            <DroppableContainer id={element.id} className="canvas__section-content" elements={element.children || []}>
              {element.children?.map(child => (
                <SortableElementWrapper
                  key={child.id}
                  element={child}
                  isSelected={selectedElementId === child.id}
                  onElementClick={onElementClick}
                />
              ))}
            </DroppableContainer>
          </div>
        );
      }
      case 'container': {
        const isContainerEmpty = !element.children || element.children.length === 0;
        return (
          <div
            className={`canvas__container ${isSelected ? 'canvas__container--selected' : ''} ${
              isContainerEmpty ? 'canvas__container--empty' : ''
            }`}
            onClick={(e) => {
              // Only select this container if clicking on the container itself, not its children
              if (e.target === e.currentTarget || (e.target as Element).closest('.canvas__container-content') === e.currentTarget.querySelector('.canvas__container-content')) {
                e.stopPropagation();
                onElementClick(element.id, e);
              }
            }}
          >
            {isSelected && (
              <div className="canvas__container-header">Container</div>
            )}
            {dragHandleProps && isSelected && (
              <div className="canvas__container-drag-handle" {...dragHandleProps}>
                <GripVertical size={16} />
              </div>
            )}
            {isSelected && (
              <div className="canvas__container-delete-button" onClick={handleDelete}>
                <X size={14} />
              </div>
            )}
            <DroppableContainer id={element.id} className="canvas__container-content" elements={element.children || []}>
              {element.children?.map(child => (
                <SortableElementWrapper
                  key={child.id}
                  element={child}
                  isSelected={selectedElementId === child.id}
                  onElementClick={onElementClick}
                />
              ))}
            </DroppableContainer>
          </div>
        );
      }
      case 'card': {
        const isCardEmpty = !element.children || element.children.length === 0;
        return (
          <div
            className={`canvas__card ${isSelected ? 'canvas__card--selected' : ''} ${
              isCardEmpty ? 'canvas__card--empty' : ''
            }`}
            onClick={(e) => {
              // Only select this card if clicking on the card itself, not its children
              if (e.target === e.currentTarget || (e.target as Element).closest('.canvas__card-content') === e.currentTarget.querySelector('.canvas__card-content')) {
                e.stopPropagation();
                onElementClick(element.id, e);
              }
            }}
          >
            {isSelected && (
              <div className="canvas__card-header">Card</div>
            )}
            {dragHandleProps && isSelected && (
              <div className="canvas__card-drag-handle" {...dragHandleProps}>
                <GripVertical size={16} />
              </div>
            )}
            {isSelected && (
              <div className="canvas__card-delete-button" onClick={handleDelete}>
                <X size={14} />
              </div>
            )}
            <DroppableContainer id={element.id} className="canvas__card-content" elements={element.children || []}>
              {element.children?.map(child => (
                <SortableElementWrapper
                  key={child.id}
                  element={child}
                  isSelected={selectedElementId === child.id}
                  onElementClick={onElementClick}
                />
              ))}
            </DroppableContainer>
          </div>
        );
      }
      default:
        return (
          <div className="canvas__unknown-element">
            <span contentEditable suppressContentEditableWarning={true}>
              {element.content || `Unknown element: ${element.type}`}
            </span>
          </div>
        );
    }
  };

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event bubbling to prevent parent elements from being selected
    onElementClick(element.id, e);
  };

  // For content elements, don't add extra wrapper since SortableElementWrapper handles styling
  const isLayoutComponent = ['section', 'container', 'card'].includes(element.type);
  
  if (isLayoutComponent) {
    // Layout components need their onClick handler
    return (
      <div onClick={handleElementClick}>
        {renderElementContent()}
      </div>
    );
  }

  // Content elements get their click handler from the outer wrapper
  return renderElementContent();
};

export const Canvas: React.FC = () => {
  const { selectedElementId, setSelectedElementId, droppedElements } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'main-canvas',
  });

  const handleElementClick = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElementId(elementId);
  };

  const handleCanvasClick = () => {
    setSelectedElementId(null);
  };

  return (
    <div className="canvas" onClick={handleCanvasClick}>
      <div className="canvas__viewport">
        <SortableContext items={droppedElements.map(el => el.id)} strategy={verticalListSortingStrategy}>
          <div
            ref={setNodeRef}
            className={`canvas__drop-zone ${isOver ? 'canvas__drop-zone--over' : ''}`}
          >
            {droppedElements.length === 0 && (
              <div className="drop-zone__placeholder">
                <Plus size={32} className="drop-zone__icon" />
                <h3 className="drop-zone__title">Drop elements here</h3>
                <p className="drop-zone__description">
                  Drag components from the left sidebar to start building your page
                </p>
              </div>
            )}

            <div className="canvas__elements">
              {/* Dynamically dropped elements */}
              {droppedElements.map(element => (
                <SortableElementWrapper
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onElementClick={handleElementClick}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
