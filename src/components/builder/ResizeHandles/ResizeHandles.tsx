import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { BuilderElement } from '../../../types/builder';
import useElementStore from '../../../stores/elementStore';
import styles from './ResizeHandles.module.scss';

interface ResizeHandlesProps {
  element: BuilderElement;
  isVisible: boolean;
  containerRef: React.RefObject<HTMLElement>;
}

type ResizeDirection = 
  | 'nw' | 'n' | 'ne' 
  | 'w' | 'e' 
  | 'sw' | 's' | 'se';

interface ResizeState {
  isResizing: boolean;
  direction: ResizeDirection | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  aspectRatio: number | null;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  element,
  isVisible,
  containerRef
}) => {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    direction: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    aspectRatio: null
  });
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showDimensions, setShowDimensions] = useState(false);
  const { updateElement } = useElementStore();

  // Get current element dimensions
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, [containerRef, element.styles]);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((direction: ResizeDirection, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isImage = element.type === 'image';
    
    setResizeState({
      isResizing: true,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      aspectRatio: isImage ? rect.width / rect.height : null
    });

    setShowDimensions(true);

    // Add global mouse event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = getCursorForDirection(direction);
  }, [containerRef, element.type]);

  // Handle mouse move during resize
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeState.isResizing || !containerRef.current) return;

    const deltaX = e.clientX - resizeState.startX;
    const deltaY = e.clientY - resizeState.startY;
    
    let newWidth = resizeState.startWidth;
    let newHeight = resizeState.startHeight;

    // Calculate new dimensions based on direction
    switch (resizeState.direction) {
      case 'nw':
        newWidth = resizeState.startWidth - deltaX;
        newHeight = resizeState.startHeight - deltaY;
        break;
      case 'n':
        newHeight = resizeState.startHeight - deltaY;
        break;
      case 'ne':
        newWidth = resizeState.startWidth + deltaX;
        newHeight = resizeState.startHeight - deltaY;
        break;
      case 'w':
        newWidth = resizeState.startWidth - deltaX;
        break;
      case 'e':
        newWidth = resizeState.startWidth + deltaX;
        break;
      case 'sw':
        newWidth = resizeState.startWidth - deltaX;
        newHeight = resizeState.startHeight + deltaY;
        break;
      case 's':
        newHeight = resizeState.startHeight + deltaY;
        break;
      case 'se':
        newWidth = resizeState.startWidth + deltaX;
        newHeight = resizeState.startHeight + deltaY;
        break;
    }

    // Apply minimum constraints
    newWidth = Math.max(newWidth, getMinWidth(element.type));
    newHeight = Math.max(newHeight, getMinHeight(element.type));

    // Maintain aspect ratio if needed
    if (resizeState.aspectRatio && (e.shiftKey || element.type === 'image')) {
      if (resizeState.direction?.includes('e') || resizeState.direction?.includes('w')) {
        newHeight = newWidth / resizeState.aspectRatio;
      } else {
        newWidth = newHeight * resizeState.aspectRatio;
      }
    }

    // Update dimensions display
    setDimensions({ width: newWidth, height: newHeight });

    // Apply styles to element immediately for live preview
    if (containerRef.current) {
      containerRef.current.style.width = `${newWidth}px`;
      containerRef.current.style.height = `${newHeight}px`;
    }
  }, [resizeState, containerRef, element.type]);

  // Handle mouse up to finish resize
  const handleMouseUp = useCallback(() => {
    if (!resizeState.isResizing) return;

    // Finalize the resize by updating the element
    const viewport = 'desktop'; // TODO: Get current viewport from canvas store
    updateElement(element.id, {
      styles: {
        ...element.styles,
        [viewport]: {
          ...element.styles?.[viewport],
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`
        }
      }
    });

    // Clean up
    setResizeState(prev => ({ ...prev, isResizing: false, direction: null }));
    setShowDimensions(false);
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, [resizeState.isResizing, dimensions, updateElement, element.id, element.styles]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!isVisible) return null;

  const handles: ResizeDirection[] = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

  const getHandleStyles = (direction: ResizeDirection): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      background: '#5457ff',
      border: '2px solid white',
      borderRadius: '3px',
      width: '8px',
      height: '8px',
      pointerEvents: 'auto',
      transition: 'all 0.15s ease',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
      cursor: getCursorForDirection(direction),
      zIndex: 1002 // Increased z-index
    };

    const positions: { [key in ResizeDirection]: React.CSSProperties } = {
      nw: { top: '-4px', left: '-4px' },
      n: { top: '-4px', left: '50%', transform: 'translateX(-50%)' },
      ne: { top: '-4px', right: '-4px' },
      w: { top: '50%', left: '-4px', transform: 'translateY(-50%)' },
      e: { top: '50%', right: '-4px', transform: 'translateY(-50%)' },
      sw: { bottom: '-4px', left: '-4px' },
      s: { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' },
      se: { bottom: '-4px', right: '-4px' }
    };

    return { ...baseStyles, ...positions[direction] };
  };

  const resizeContainerStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 5
  };

  const dimensionDisplayStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '-35px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#333',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 10
  };

  return (
    <>
      <div className={styles.resizeContainer} style={resizeContainerStyles}>
        {handles.map((direction) => (
          <div
            key={direction}
            className={`${styles.resizeHandle} ${styles[direction]}`}
            style={getHandleStyles(direction)}
            onMouseDown={(e) => handleMouseDown(direction, e)}
          />
        ))}
      </div>
      
      {showDimensions && (
        <div className={styles.dimensionDisplay} style={dimensionDisplayStyles}>
          {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
        </div>
      )}
    </>
  );
};

// Helper functions
const getCursorForDirection = (direction: ResizeDirection): string => {
  const cursors = {
    nw: 'nw-resize',
    n: 'n-resize',
    ne: 'ne-resize',
    w: 'w-resize',
    e: 'e-resize',
    sw: 'sw-resize',
    s: 's-resize',
    se: 'se-resize'
  };
  return cursors[direction];
};

const getMinWidth = (elementType: string): number => {
  const minWidths = {
    image: 50,
    button: 60,
    input: 100,
    textarea: 150,
    container: 100,
    column: 100
  };
  return minWidths[elementType as keyof typeof minWidths] || 50;
};

const getMinHeight = (elementType: string): number => {
  const minHeights = {
    image: 50,
    button: 32,
    input: 36,
    textarea: 80,
    container: 50,
    column: 100
  };
  return minHeights[elementType as keyof typeof minHeights] || 20;
};