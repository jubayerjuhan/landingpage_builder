import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBuilderStore } from '../app/store';
import type { DroppedElement } from '../app/store';
import { Plus, Star, Image as ImageIcon } from 'lucide-react';
import './Canvas.module.scss';

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
  className: string;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({ id, children, className }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `container-${id}`,
  });

  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? 'canvas__container--over' : ''}`}>
      {children}
    </div>
  );
};

interface ElementRendererProps {
  element: DroppedElement;
  isSelected: boolean;
  onElementClick: (elementId: string, event: React.MouseEvent) => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  onElementClick,
}) => {
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
      case 'section':
        const isSectionEmpty = !element.children || element.children.length === 0;
        return (
          <div
            className={`canvas__section ${isSelected ? 'canvas__section--selected' : ''} ${
              isSectionEmpty ? 'canvas__section--empty' : ''
            }`}
          >
            <div className="canvas__section-header">Section</div>
            <DroppableContainer id={element.id} className="canvas__section-content">
              {element.children?.map(child => (
                <ElementRenderer
                  key={child.id}
                  element={child}
                  isSelected={false}
                  onElementClick={onElementClick}
                />
              ))}
            </DroppableContainer>
          </div>
        );
      case 'container':
        const isContainerEmpty = !element.children || element.children.length === 0;
        return (
          <div
            className={`canvas__container ${isSelected ? 'canvas__container--selected' : ''} ${
              isContainerEmpty ? 'canvas__container--empty' : ''
            }`}
          >
            <DroppableContainer id={element.id} className="canvas__container-content">
              {element.children?.map(child => (
                <ElementRenderer
                  key={child.id}
                  element={child}
                  isSelected={false}
                  onElementClick={onElementClick}
                />
              ))}
            </DroppableContainer>
          </div>
        );
      case 'card':
        const isCardEmpty = !element.children || element.children.length === 0;
        return (
          <div
            className={`canvas__card ${isSelected ? 'canvas__card--selected' : ''} ${
              isCardEmpty ? 'canvas__card--empty' : ''
            }`}
          >
            <DroppableContainer id={element.id} className="canvas__card-content">
              {element.children?.map(child => (
                <ElementRenderer
                  key={child.id}
                  element={child}
                  isSelected={false}
                  onElementClick={onElementClick}
                />
              ))}
            </DroppableContainer>
          </div>
        );
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

  return (
    <div
      className={`canvas__element ${isSelected ? 'canvas__element--selected' : ''}`}
      onClick={e => onElementClick(element.id, e)}
    >
      {renderElementContent()}
    </div>
  );
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
              <ElementRenderer
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onElementClick={handleElementClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
