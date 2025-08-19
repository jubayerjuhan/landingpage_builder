import React, { forwardRef } from 'react';
import { useDroppableZone } from '../../hooks/useDragAndDrop';
import { type ComponentType, DropTargetType } from '../../types/builder';
import './DropZone.module.scss';

interface DropZoneProps {
  id: string;
  elementId?: string;
  accepts: ComponentType[];
  type?: DropTargetType;
  className?: string;
  children?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  placeholder?: string;
  minHeight?: number;
  // onDrop?: (draggedType: ComponentType) => void; // TODO: Implement drop handler
}

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(({
  id,
  elementId,
  accepts,
  type = DropTargetType.ELEMENT,
  className = '',
  children,
  orientation = 'vertical',
  placeholder = 'Drop elements here',
  minHeight = 100,
  // onDrop
}, ref) => {
  const { setNodeRef, isOver, isValidDrop, canDrop } = useDroppableZone(
    id,
    elementId,
    accepts,
    type
  );

  const combinedRef = React.useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node);
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [setNodeRef, ref]);

  const dropZoneClasses = [
    'drop-zone',
    `drop-zone--${orientation}`,
    `drop-zone--type-${type}`,
    className,
    isOver && 'drop-zone--over',
    isValidDrop && 'drop-zone--valid',
    canDrop && 'drop-zone--can-drop',
    !children && 'drop-zone--empty'
  ].filter(Boolean).join(' ');

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <div
      ref={combinedRef}
      className={dropZoneClasses}
      style={{
        minHeight: isEmpty ? minHeight : undefined
      }}
      data-drop-zone-id={id}
      data-accepts={accepts.join(',')}
    >
      {children}
      
      {isEmpty && (
        <div className="drop-zone__placeholder">
          <div className="drop-zone__placeholder-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
              />
            </svg>
          </div>
          <div className="drop-zone__placeholder-text">
            {placeholder}
          </div>
          {accepts.length > 0 && (
            <div className="drop-zone__placeholder-accepts">
              Accepts: {accepts.join(', ')}
            </div>
          )}
        </div>
      )}
      
      {isOver && isValidDrop && (
        <div className="drop-zone__drop-indicator">
          <div className="drop-zone__drop-indicator-line" />
          <div className="drop-zone__drop-indicator-text">
            Drop here
          </div>
        </div>
      )}
      
      {isOver && !isValidDrop && (
        <div className="drop-zone__invalid-indicator">
          <div className="drop-zone__invalid-indicator-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
          </div>
          <div className="drop-zone__invalid-indicator-text">
            Cannot drop here
          </div>
        </div>
      )}
    </div>
  );
});

DropZone.displayName = 'DropZone';

// Specialized drop zones for different use cases
interface CanvasDropZoneProps extends Omit<DropZoneProps, 'type'> {
  canvasWidth?: number;
  canvasHeight?: number;
}

export const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({
  canvasWidth = 1200,
  canvasHeight = 800,
  ...props
}) => (
  <DropZone
    {...props}
    type={DropTargetType.CANVAS}
    className={`drop-zone--canvas ${props.className || ''}`}
    minHeight={canvasHeight}
    placeholder="Start building by dragging components here"
  />
);

interface ContainerDropZoneProps extends Omit<DropZoneProps, 'type'> {}

export const ContainerDropZone: React.FC<ContainerDropZoneProps> = (props) => (
  <DropZone
    {...props}
    type={DropTargetType.ELEMENT}
    className={`drop-zone--container ${props.className || ''}`}
    placeholder="Drop components into this container"
  />
);

interface BetweenElementsDropZoneProps extends Omit<DropZoneProps, 'type' | 'minHeight'> {}

export const BetweenElementsDropZone: React.FC<BetweenElementsDropZoneProps> = (props) => (
  <DropZone
    {...props}
    type={DropTargetType.BETWEEN}
    className={`drop-zone--between ${props.className || ''}`}
    minHeight={8}
    placeholder=""
  />
);