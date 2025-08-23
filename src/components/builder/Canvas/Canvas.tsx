import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { useBuilderStore } from '../../../stores/builderStore';
import { Element } from './Element/Element';
import { AddLayoutModal } from '../../modals/AddLayoutModal';
import styles from './Canvas.module.scss';

interface CanvasProps {
  draggingType: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({ draggingType }) => {
  const { elements, addLayout } = useBuilderStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  return (
    <div className={styles.canvas}>
      <div className={styles.canvasHeader}>
        <span>Canvas</span>
        <button className={styles.addButton} onClick={handleAddLayout}>
          <Plus size={16} />
          Add Layout
        </button>
      </div>

      <div className={styles.canvasContent}>
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

  return (
    <div ref={setNodeRef} className={`${styles.emptyCanvas} ${isOver ? styles.dragOver : ''}`}>
      <div className={styles.emptyContent}>
        <h3>Start Building Your Page</h3>
        <p>Drag layouts from the sidebar to begin</p>
        <button className={styles.primaryButton} onClick={onAddLayout}>
          <Plus size={18} />
          Add Layout
        </button>
      </div>
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
  const { elements, selectedElementId, selectElement, reorderLayout } = useBuilderStore();
  const rows = elements.filter(el => el.type === 'row' && el.parentId === layout.id);

  const isSelected = selectedElementId === layout.id;

  // Make layout droppable for new elements only
  const { setNodeRef: setLayoutRef, isOver: isLayoutOver } = useDroppable({
    id: `layout-${layout.id}`
  });

  const handleLayoutClick = (e: React.MouseEvent) => {
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
  const shouldShowDropZones = isNewLayoutDragging;

  return (
    <div className={styles.layoutWrapper}>
      {!isFirst && shouldShowDropZones && <LayoutDropZone position="above" layoutId={layout.id} />}
      
      <div 
        ref={setLayoutRef}
        className={`${styles.layout} ${isSelected ? styles.selected : ''} ${showDragIndicator ? styles.dragOverLayout : ''}`}
        style={layout.styles}
        onClick={handleLayoutClick}
      >
        {isSelected && (
          <>
            <div className={styles.layoutLabel}>Layout</div>
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
          </>
        )}
        {showDragIndicator && <div className={styles.dragOverIndicator}>Drop here to add layout</div>}
        
        {rows.map(row => (
          <Row key={row.id} row={row} />
        ))}
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
  
  const columnElements = elements.filter(el => el.parentId === column.id);

  return (
    <div 
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.dragOver : ''}`} 
      style={column.styles}
    >
      {columnElements.length === 0 ? (
        <div className={styles.emptyColumn}>
          {isOver && <div className={styles.insertionLine} />}
          Drop elements here
        </div>
      ) : (
        <div className={styles.columnElements}>
          {isOver && <div className={styles.insertionLine} />}
          {columnElements.map((element, index) => (
            <div key={element.id} className={styles.elementWrapper}>
              <Element element={element} />
              {isOver && index === columnElements.length - 1 && (
                <div className={styles.insertionLine} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};