import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  Plus,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Ruler as Rulers,
  Move,
  RotateCcw,
  Eye,
  Trash2,
} from 'lucide-react';
import useElementStore from '../../stores/elementStore';
import useModalStore from '../../stores/modalStore';
import useCanvasStore from '../../stores/canvasStore';
import { ElementRenderer } from '../elements/ElementRenderer';
import { ElementWrapper } from '../elements/ElementWrapper';
import type { BuilderElement } from '../../types/builder';
import styles from './OldStyleCanvas.module.scss';

// Droppable Column Component
interface DroppableColumnProps {
  column: BuilderElement;
  elements: BuilderElement[];
  styles: Record<string, string>;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ column, elements, styles }) => {
  const columnElements = elements.filter(el => el.parentId === column.id);
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={isOver ? styles.columnOver : ''}
      style={{ position: 'relative', width: '100%' }}
    >
      <ElementRenderer element={column}>
        {columnElements.length > 0 ? (
          columnElements
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map(element => (
              <ElementWrapper key={element.id} element={element}>
                <ElementRenderer element={element} />
              </ElementWrapper>
            ))
        ) : (
          <div className={styles.emptyColumn}>Drop component here</div>
        )}
      </ElementRenderer>
    </div>
  );
};

// Empty Canvas Component
const EmptyCanvas: React.FC = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'main-canvas',
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.emptyCanvas} ${isOver ? styles.emptyCanvasOver : ''}`}
    >
      <div className={styles.emptyContent}>
        <div className={styles.emptyIcon}>🎨</div>
        <h3>Start Building Your Page</h3>
        <p>Drag a layout from the sidebar to get started</p>
      </div>
    </div>
  );
};

// Layout Drop Zone Component
const LayoutDropZone: React.FC<{ position: 'above' | 'below'; layoutId?: string }> = ({
  position,
  layoutId,
}) => {
  const dropId = layoutId ? `${position}-${layoutId}` : 'main-canvas-below';
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
  });

  return (
    <div ref={setNodeRef} className={`${styles.dropZone} ${isOver ? styles.dropZoneActive : ''}`}>
      <div className={styles.dropZoneLine} />
      <div className={styles.dropZoneLabel}>Drop here</div>
    </div>
  );
};

// Layout Container Component
const LayoutContainer: React.FC<{
  layout: BuilderElement;
  isFirst: boolean;
  isLast: boolean;
  draggingType: string | null;
}> = ({ layout, isFirst, isLast, draggingType }) => {
  const { elements, selectedElementIds, deleteElement, moveElement } = useElementStore();
  const { previewMode } = useCanvasStore();
  const isPreviewMode = previewMode === 'preview';

  // Get columns directly from layout (no more rows)
  const columns = elements.filter(el => el.type === 'column' && el.parentId === layout.id);
  const isSelected = selectedElementIds.includes(layout.id);

  // Get column count to determine layout name
  const getLayoutName = () => {
    const columnCount = columns.length;

    switch (columnCount) {
      case 0:
        return 'Layout';
      case 1:
        return 'Single Column';
      case 2:
        return '2 Columns';
      case 3:
        return '3 Columns';
      case 4:
        return '4 Columns';
      default:
        return `${columnCount} Columns`;
    }
  };

  // Make layout droppable for new elements only
  const { setNodeRef: setLayoutRef, isOver: isLayoutOver } = useDroppable({
    id: `layout-${layout.id}`,
  });

  // handleLayoutClick removed - selection now handled by ElementWrapper

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const layouts = elements
      .filter(el => el.type === 'layout')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const currentIndex = layouts.findIndex(l => l.id === layout.id);
    if (currentIndex > 0) {
      const targetLayout = layouts[currentIndex - 1];
      // Swap orders
      moveElement(layout.id, targetLayout.parentId || null, targetLayout.order);
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const layouts = elements
      .filter(el => el.type === 'layout')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const currentIndex = layouts.findIndex(l => l.id === layout.id);
    if (currentIndex < layouts.length - 1) {
      const targetLayout = layouts[currentIndex + 1];
      // Swap orders
      moveElement(layout.id, targetLayout.parentId || null, targetLayout.order);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(layout.id);
  };

  // Always show drop zones when any dragging is happening
  const isDraggingSomething = draggingType !== null;
  const showDragIndicator = isLayoutOver && isDraggingSomething;

  // Always show drop zones when dragging
  const shouldShowDropZones = isDraggingSomething && !isPreviewMode;

  return (
    <div className={styles.layoutWrapper}>
      {!isFirst && shouldShowDropZones && <LayoutDropZone position="above" layoutId={layout.id} />}

      <div ref={setLayoutRef} className={showDragIndicator ? styles.dragOverLayout : ''}>
        <ElementRenderer element={layout}>
          {/* Always show layout label */}
          {!isPreviewMode && (
            <div className={`${styles.layoutLabel} ${isSelected ? styles.selected : ''}`}>
              {getLayoutName()}
            </div>
          )}

          {/* Layout controls when selected */}
          {isSelected && !isPreviewMode && (
            <div className={styles.layoutControls}>
              <button
                className={styles.moveBtn}
                onClick={handleMoveUp}
                disabled={isFirst}
                title="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                className={styles.moveBtn}
                onClick={handleMoveDown}
                disabled={isLast}
                title="Move down"
              >
                <ChevronDown size={14} />
              </button>
              <button className={styles.deleteBtn} onClick={handleDelete} title="Delete layout">
                <Trash2 size={14} />
              </button>
            </div>
          )}

          {/* Render columns directly (no more rows) */}
          {columns.map(column => (
            <DroppableColumn key={column.id} column={column} elements={elements} styles={styles} />
          ))}
        </ElementRenderer>
      </div>

      {!isLast && shouldShowDropZones && <LayoutDropZone position="below" layoutId={layout.id} />}
    </div>
  );
};

interface OldStyleCanvasProps {
  draggingType?: string | null;
}

export const OldStyleCanvas: React.FC<OldStyleCanvasProps> = ({ draggingType }) => {
  const { elements, clearSelection } = useElementStore();
  const { previewMode, showGrid } = useCanvasStore();

  const [zoom, setZoom] = useState(100);
  const [showRulers, setShowRulers] = useState(false);

  const isPreviewMode = previewMode === 'preview';

  // Get root layouts ordered by their order property
  const layouts = elements
    .filter(el => el.type === 'layout' && !el.parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(25, prev - 25));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  const toggleGrid = () => {
    // Toggle grid in canvas store
  };

  const toggleRulers = () => {
    setShowRulers(!showRulers);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  return (
    <div className={`${styles.canvas} ${isPreviewMode ? styles.previewMode : ''}`}>
      {/* Modern Canvas Header */}
      {!isPreviewMode && (
        <div className={styles.canvasHeader}>
          <div className={styles.canvasTitle}>
            <div className={styles.canvasTitleText}>Untitled Landing Page</div>
          </div>

          <div className={styles.canvasControls}>
            {/* Zoom Controls */}
            <div className={styles.controlGroup}>
              <div className={styles.zoomControls}>
                <button
                  className={styles.zoomButton}
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  disabled={zoom <= 25}
                >
                  <ZoomOut size={14} />
                </button>

                <div className={styles.zoomLevel} onClick={handleZoomReset} title="Reset Zoom">
                  {zoom}%
                </div>

                <button
                  className={styles.zoomButton}
                  onClick={handleZoomIn}
                  title="Zoom In"
                  disabled={zoom >= 200}
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>

            {/* View Controls */}
            <div className={styles.controlGroup}>
              <div className={styles.viewControls}>
                <button
                  className={`${styles.viewButton} ${showGrid ? styles.active : ''}`}
                  onClick={toggleGrid}
                  title="Toggle Grid"
                >
                  <Grid3X3 size={14} />
                </button>

                <button
                  className={`${styles.viewButton} ${showRulers ? styles.active : ''}`}
                  onClick={toggleRulers}
                  title="Toggle Rulers"
                >
                  <Rulers size={14} />
                </button>

                <button className={styles.viewButton} title="Pan Mode">
                  <Move size={14} />
                </button>
              </div>
            </div>

            {/* Removed Add Section button - using drag and drop only */}
          </div>
        </div>
      )}

      {/* Canvas Content with Professional Layout */}
      <div className={styles.canvasContent} onClick={handleCanvasClick}>
        <div className={styles.canvasInner}>
          <div
            className={styles.canvasWorkspace}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center top',
            }}
          >
            {layouts.length === 0 ? (
              <EmptyCanvas />
            ) : (
              <div className={styles.layouts}>
                {layouts.map((layout, index) => (
                  <LayoutContainer
                    key={layout.id}
                    layout={layout}
                    isFirst={index === 0}
                    isLast={index === layouts.length - 1}
                    draggingType={draggingType}
                  />
                ))}
                {/* Always show bottom drop zone when dragging layouts */}
                {(draggingType?.includes('column') || draggingType?.includes('layout')) && (
                  <LayoutDropZone position="below" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid overlay */}
      {showGrid && !isPreviewMode && <div className={styles.gridOverlay} />}
    </div>
  );
};
