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
  Eye
} from 'lucide-react';
import { useBuilderStore } from '../../../stores/builderStore';
import { Element } from './Element/Element';
import { AddLayoutModal } from '../../modals/AddLayoutModal';
import styles from './Canvas.module.scss';

interface CanvasProps {
  draggingType: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({ draggingType }) => {
  const { elements, addLayout, isPreviewMode } = useBuilderStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  
  // Get root layouts ordered by their order property
  const layouts = elements
    .filter(el => el.type === 'layout' && !el.parentId)
    .sort((a, b) => a.order - b.order);

  const handleAddLayout = () => {
    setIsModalOpen(true);
  };

  const handleSelectLayout = (columnCount: number) => {
    addLayout(columnCount);
  };

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
    setShowGrid(!showGrid);
  };

  const toggleRulers = () => {
    setShowRulers(!showRulers);
  };

  return (
    <div className={`${styles.canvas} ${isPreviewMode ? styles.previewMode : ''}`}>
      {/* Modern Canvas Header */}
      {!isPreviewMode && (
      <div className={styles.canvasHeader}>
        <div className={styles.canvasTitle}>
          <div className={styles.canvasTitleText}>
            Untitled Landing Page
          </div>
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
              
              <button 
                className={styles.viewButton}
                title="Pan Mode"
              >
                <Move size={14} />
              </button>
            </div>
          </div>

          {/* Add Layout Button */}
          <button className={styles.addButton} onClick={handleAddLayout}>
            <Plus size={16} />
            Add Section
          </button>
        </div>
      </div>
      )}

      {/* Canvas Content with Professional Layout */}
      <div className={styles.canvasContent}>
        <div className={styles.canvasInner}>
          <div 
            className={styles.canvasWorkspace}
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center top'
            }}
          >
            {layouts.length === 0 ? (
              <EmptyCanvas onAddLayout={handleAddLayout} />
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
                {draggingType?.includes('column') && <LayoutDropZone position="below" />}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AddLayoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLayout={handleSelectLayout}
      />
    </div>
  );
};

const EmptyCanvas: React.FC<{ onAddLayout: () => void }> = ({ onAddLayout }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'main-canvas'
  });
  const { isPreviewMode } = useBuilderStore();

  return (
    <div ref={setNodeRef} className={`${styles.emptyCanvas} ${isOver ? styles.dragOver : ''}`}>
      {!isPreviewMode && (
      <div className={styles.emptyContent}>
        <h3>Start Building Your Page</h3>
        <p>Drag layouts from the sidebar to begin</p>
        <button className={styles.primaryButton} onClick={onAddLayout}>
          <Plus size={18} />
          Add Layout
        </button>
      </div>
      )}
    </div>
  );
};

const LayoutDropZone: React.FC<{ position: 'above' | 'below', layoutId?: string }> = ({ position, layoutId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: layoutId ? `${position}-${layoutId}` : `main-canvas-${position}`
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`${styles.layoutDropZone} ${isOver ? styles.active : ''}`}
    >
      {isOver && <div className={styles.dropIndicator} />}
    </div>
  );
};

const LayoutContainer: React.FC<{ 
  layout: any; 
  isFirst: boolean;
  isLast: boolean;
  draggingType: string | null;
}> = ({ layout, isFirst, isLast, draggingType }) => {
  const { elements, selectedElementId, selectElement, reorderLayout, isPreviewMode } = useBuilderStore();
  const rows = elements.filter(el => el.type === 'row' && el.parentId === layout.id);

  const isSelected = selectedElementId === layout.id;

  // Get column count to determine layout name
  const getLayoutName = () => {
    if (rows.length === 0) return 'Layout';
    const firstRow = rows[0];
    const columns = elements.filter(el => el.type === 'column' && el.parentId === firstRow.id);
    const columnCount = columns.length;
    
    switch (columnCount) {
      case 1: return 'Single Column';
      case 2: return '2 Columns';
      case 3: return '3 Columns';
      case 4: return '4 Columns';
      default: return `${columnCount} Columns`;
    }
  };

  // Make layout droppable for new elements only
  const { setNodeRef: setLayoutRef, isOver: isLayoutOver } = useDroppable({
    id: `layout-${layout.id}`
  });

  const handleLayoutClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectElement(layout.id);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const layouts = elements.filter(el => el.type === 'layout').sort((a, b) => a.order - b.order);
    const currentIndex = layouts.findIndex(l => l.id === layout.id);
    if (currentIndex > 0) {
      const targetLayout = layouts[currentIndex - 1];
      reorderLayout(layout.id, targetLayout.id, 'above');
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const layouts = elements.filter(el => el.type === 'layout').sort((a, b) => a.order - b.order);
    const currentIndex = layouts.findIndex(l => l.id === layout.id);
    if (currentIndex < layouts.length - 1) {
      const targetLayout = layouts[currentIndex + 1];
      reorderLayout(layout.id, targetLayout.id, 'below');
    }
  };

  // Only show drag effects for new layouts from sidebar
  const isNewLayoutDragging = draggingType?.includes('column');
  const showDragIndicator = isLayoutOver && isNewLayoutDragging;
  
  // Only show drop zones when dragging new layouts from sidebar
  const shouldShowDropZones = isNewLayoutDragging && !isPreviewMode;

  return (
    <div className={styles.layoutWrapper}>
      {!isFirst && shouldShowDropZones && <LayoutDropZone position="above" layoutId={layout.id} />}
      
      <div 
        ref={setLayoutRef}
        className={`${styles.layout} ${isSelected ? styles.selected : ''} ${showDragIndicator ? styles.dragOverLayout : ''}`}
        onClick={handleLayoutClick}
      >
        {/* Always show layout label */}
        {!isPreviewMode && (
        <div className={`${styles.layoutLabel} ${isSelected ? styles.selected : ''}`}>
          {getLayoutName()}
        </div>
        )}
        
        {isSelected && !isPreviewMode && (
          <div className={styles.layoutControls}>
            <div className={styles.moveButtons}>
              <button 
                className={`${styles.moveButton} ${isFirst ? styles.disabled : ''}`}
                onClick={handleMoveUp}
                disabled={isFirst}
                title="Move up"
              >
                <ChevronUp size={16} />
              </button>
              <button 
                className={`${styles.moveButton} ${isLast ? styles.disabled : ''}`}
                onClick={handleMoveDown}
                disabled={isLast}
                title="Move down"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        )}
        {showDragIndicator && !isPreviewMode && <div className={styles.dragOverIndicator}>Drop here to add layout</div>}
        
        <div className={styles.layoutContent} style={layout.styles}>
          {rows.map(row => (
            <Row key={row.id} row={row} />
          ))}
        </div>
      </div>
      
      {isLast && shouldShowDropZones && <LayoutDropZone position="below" layoutId={layout.id} />}
    </div>
  );
};

const Row: React.FC<{ row: any }> = ({ row }) => {
  const { elements } = useBuilderStore();
  const columns = elements
    .filter(el => el.type === 'column' && el.parentId === row.id)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={styles.row} style={row.styles}>
      {columns.map(column => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  );
};

const Column: React.FC<{ column: any }> = ({ column }) => {
  const { elements } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`
  });
  
  const columnElements = elements
    .filter(el => el.parentId === column.id)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div 
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.dragOver : ''}`} 
      style={column.styles}
    >
      {columnElements.length === 0 ? (
        <div className={styles.emptyColumn}>
          {isOver && (
            <>
              <div className={styles.insertionLine} />
              <div className={styles.dropMessage}>Drop element here</div>
            </>
          )}
          {!isOver && "Drop elements here"}
        </div>
      ) : (
        <div className={styles.columnElements}>
          {columnElements.map((element, index) => (
            <div key={element.id} className={styles.elementWrapper}>
              {/* Drop zone above element */}
              <ElementDropZone 
                position="above" 
                targetElementId={element.id}
                isFirst={index === 0}
              />
              <Element element={element} />
              {/* Drop zone below last element */}
              {index === columnElements.length - 1 && (
                <ElementDropZone 
                  position="below" 
                  targetElementId={element.id}
                  isLast={true}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ElementDropZone: React.FC<{ 
  position: 'above' | 'below'; 
  targetElementId: string;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ position, targetElementId, isFirst, isLast }) => {
  const dropId = `element-${position}-${targetElementId}`;
  const { setNodeRef, isOver } = useDroppable({
    id: dropId
  });

  return (
    <div 
      ref={setNodeRef}
      className={`${styles.elementDropZone} ${isOver ? styles.active : ''}`}
      style={{
        height: isOver ? '20px' : '2px',
        marginTop: position === 'above' && !isFirst ? '2px' : '0',
        marginBottom: position === 'below' && !isLast ? '2px' : '0',
        backgroundColor: isOver ? 'rgba(84, 87, 255, 0.1)' : 'transparent',
        border: isOver ? '1px dashed #5457ff' : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      {isOver && <div className={styles.dropIndicatorLine} />}
    </div>
  );
};