import React from 'react';
import { createPortal } from 'react-dom';
import type { ComponentType } from '../../types/builder';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import './DragPreview.module.scss';

interface DragPreviewProps {
  componentType?: ComponentType;
  customPreview?: React.ReactNode;
}

export const DragPreview: React.FC<DragPreviewProps> = ({
  componentType,
  customPreview
}) => {
  const { dragState } = useDragAndDrop();

  if (!dragState.isDragging || !dragState.dragPreview) {
    return null;
  }

  const previewContent = customPreview || (
    componentType ? <DefaultPreview componentType={componentType} /> : null
  );

  const style: React.CSSProperties = {
    position: 'fixed',
    left: dragState.dragPreview.x,
    top: dragState.dragPreview.y,
    width: dragState.dragPreview.width,
    height: dragState.dragPreview.height,
    pointerEvents: 'none',
    zIndex: 9999,
    opacity: 0.8,
    transform: 'rotate(5deg)',
    transformOrigin: 'top left'
  };

  return createPortal(
    <div className="drag-preview" style={style}>
      {previewContent}
    </div>,
    document.body
  );
};

interface DefaultPreviewProps {
  componentType: ComponentType;
}

const DefaultPreview: React.FC<DefaultPreviewProps> = ({ componentType }) => {
  const getPreviewContent = () => {
    switch (componentType) {
      case ComponentType.HEADING:
        return (
          <div className="drag-preview__heading">
            <h2>Heading</h2>
          </div>
        );
      
      case ComponentType.PARAGRAPH:
        return (
          <div className="drag-preview__paragraph">
            <p>Paragraph text content</p>
          </div>
        );
      
      case ComponentType.BUTTON:
        return (
          <div className="drag-preview__button">
            <button>Button</button>
          </div>
        );
      
      case ComponentType.IMAGE:
        return (
          <div className="drag-preview__image">
            <div className="image-placeholder">
              📷 Image
            </div>
          </div>
        );
      
      case ComponentType.CONTAINER:
        return (
          <div className="drag-preview__container">
            <div className="container-outline">
              Container
            </div>
          </div>
        );
      
      default:
        return (
          <div className="drag-preview__default">
            {componentType}
          </div>
        );
    }
  };

  return (
    <div className={`drag-preview__content drag-preview__content--${componentType}`}>
      {getPreviewContent()}
    </div>
  );
};