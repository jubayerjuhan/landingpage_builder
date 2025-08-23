import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useBuilderStore } from '../../../stores/builderStore';
import { Element } from './Element/Element';
import { AddLayoutModal } from '../../modals/AddLayoutModal';
import styles from './Canvas.module.scss';

export const Canvas: React.FC = () => {
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
              />
            ))}
            <LayoutDropZone position="below" />
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
}> = ({ layout, isFirst, isLast }) => {
  const { elements, selectedElementId, selectElement } = useBuilderStore();
  const rows = elements.filter(el => el.type === 'row' && el.parentId === layout.id);

  const isSelected = selectedElementId === layout.id;

  // Make layout droppable for reordering
  const { setNodeRef: setLayoutRef, isOver: isLayoutOver } = useDroppable({
    id: `layout-${layout.id}`
  });

  const handleLayoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(layout.id);
  };

  return (
    <div className={styles.layoutWrapper}>
      {!isFirst && <LayoutDropZone position="above" layoutId={layout.id} />}
      
      <div 
        ref={setLayoutRef}
        className={`${styles.layout} ${isSelected ? styles.selected : ''} ${isLayoutOver ? styles.dragOverLayout : ''}`}
        style={layout.styles}
        onClick={handleLayoutClick}
      >
        {isSelected && <div className={styles.layoutLabel}>Layout</div>}
        {isLayoutOver && <div className={styles.dragOverIndicator}>Drop here to reorder</div>}
        
        {rows.map(row => (
          <Row key={row.id} row={row} />
        ))}
      </div>
      
      {isLast && <LayoutDropZone position="below" layoutId={layout.id} />}
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
          Drop elements here
        </div>
      ) : (
        columnElements.map(element => (
          <Element key={element.id} element={element} />
        ))
      )}
    </div>
  );
};