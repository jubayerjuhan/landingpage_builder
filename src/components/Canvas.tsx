import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBuilderStore } from '../app/store';
import type { DroppedElement } from '../app/store';
import { Plus, Star, Image as ImageIcon } from 'lucide-react';
import './Canvas.module.scss';

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
            {/* Sample elements for demonstration */}
            <div 
              className={`canvas__element ${selectedElementId === 'sample-headline' ? 'canvas__element--selected' : ''}`}
              onClick={(e) => handleElementClick('sample-headline', e)}
            >
              <h1 contentEditable suppressContentEditableWarning={true}>
                Sample Headline
              </h1>
            </div>
            
            <div 
              className={`canvas__element ${selectedElementId === 'sample-button' ? 'canvas__element--selected' : ''}`}
              onClick={(e) => handleElementClick('sample-button', e)}
            >
              <button className="sample-button">Sample Button</button>
            </div>

            {/* Dynamically dropped elements */}
            {droppedElements.map((element) => (
              <div
                key={element.id}
                className={`canvas__element ${selectedElementId === element.id ? 'canvas__element--selected' : ''}`}
                onClick={(e) => handleElementClick(element.id, e)}
              >
                {element.type === 'heading' && (
                  <h1 contentEditable suppressContentEditableWarning={true}>
                    {element.content}
                  </h1>
                )}
                {element.type === 'text' && (
                  <span contentEditable suppressContentEditableWarning={true}>
                    {element.content}
                  </span>
                )}
                {element.type === 'paragraph' && (
                  <p contentEditable suppressContentEditableWarning={true}>
                    {element.content}
                  </p>
                )}
                {element.type === 'button' && (
                  <button className="sample-button">
                    {element.content}
                  </button>
                )}
                {(element.type === 'section' || element.type === 'container' || element.type === 'grid') && (
                  <div className="canvas__container">
                    <span contentEditable suppressContentEditableWarning={true}>
                      {element.content}
                    </span>
                  </div>
                )}
                {element.type === 'image' && (
                  <div className="canvas__image-placeholder">
                    <ImageIcon size={24} />
                    <span>Image placeholder</span>
                  </div>
                )}
                {element.type === 'icon' && (
                  <div className="canvas__icon">
                    <Star size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};