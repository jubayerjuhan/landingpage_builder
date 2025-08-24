import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import useElementStore from '../../stores/elementStore';
import useModalStore from '../../stores/modalStore';
import { ElementRenderer } from '../elements/ElementRenderer';
import { ComponentType } from '../../types/builder';
import type { BuilderElement } from '../../types/builder';
import styles from './SectionCanvas.module.scss';

export const SectionCanvas: React.FC = () => {
  const { elements, selectedElementIds, selectElement, clearSelection } = useElementStore();
  const { openAddSectionModal, openAddRowModal } = useModalStore();

  // Get root level sections (elements with no parentId)
  const sections = elements.filter(el => !el.parentId && el.type === ComponentType.SECTION);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only clear selection if clicking on canvas directly
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  const renderSection = (section: BuilderElement) => {
    const rows = elements.filter(el => el.parentId === section.id && el.type === ComponentType.ROW);
    
    return (
      <div key={section.id} className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              openAddRowModal(section.id);
            }}
            title="Add Row"
          >
            <Plus size={16} />
            Add Row
          </button>
        </div>
        <ElementRenderer element={section}>
          {rows.length > 0 ? (
            rows.map(row => renderRow(row))
          ) : (
            <div className={styles.emptySection}>
              <button
                className={styles.addFirstRow}
                onClick={(e) => {
                  e.stopPropagation();
                  openAddRowModal(section.id);
                }}
              >
                <Plus size={20} />
                <span>Add Row</span>
              </button>
            </div>
          )}
        </ElementRenderer>
      </div>
    );
  };

  const renderRow = (row: BuilderElement) => {
    const columns = elements.filter(el => el.parentId === row.id && el.type === ComponentType.COLUMN);
    
    return (
      <ElementRenderer key={row.id} element={row}>
        {columns.map(column => renderColumn(column))}
      </ElementRenderer>
    );
  };

  const renderColumn = (column: BuilderElement) => {
    return (
      <DroppableColumn key={column.id} column={column} />
    );
  };

  // Droppable column component - wrap the column's ElementRenderer with droppable
  const DroppableColumn: React.FC<{ column: BuilderElement }> = ({ column }) => {
    const columnElements = elements.filter(el => el.parentId === column.id);
    const { isOver, setNodeRef } = useDroppable({
      id: `container-${column.id}`,
    });

    // Pass the droppable ref to a wrapper div that contains the column
    return (
      <div 
        ref={setNodeRef} 
        style={{ 
          flex: 1, 
          position: 'relative',
          overflow: 'visible' // Don't clip child elements
        }}
      >
        <ElementRenderer element={column}>
          {columnElements.length > 0 ? (
            columnElements
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map(element => (
                <ElementRenderer key={element.id} element={element} />
              ))
          ) : (
            <div className={`${styles.emptyColumn} ${isOver ? styles.emptyColumnOver : ''}`}>
              Drop elements here
            </div>
          )}
        </ElementRenderer>
      </div>
    );
  };

  // Empty canvas drop zone component
  const EmptyCanvasDropZone: React.FC = () => {
    const { isOver, setNodeRef } = useDroppable({
      id: 'main-canvas',
    });

    return (
      <div 
        ref={setNodeRef}
        className={`${styles.emptyCanvas} ${isOver ? styles.emptyCanvasOver : ''}`}
      >
        <div className={styles.emptyMessage}>
          <Plus size={32} />
          <h3>Start Building Your Page</h3>
          <p>Add your first section to get started</p>
          <button
            className={styles.primaryButton}
            onClick={() => openAddSectionModal()}
          >
            <Plus size={18} />
            Add Section
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.canvas} onClick={handleCanvasClick}>
      {/* Canvas Header */}
      <div className={styles.canvasHeader}>
        <div className={styles.canvasTitle}>
          <span>Canvas</span>
        </div>
        <div className={styles.canvasActions}>
          <button
            className={styles.addSectionButton}
            onClick={() => openAddSectionModal()}
          >
            <Plus size={18} />
            Add Section
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className={styles.canvasContent}>
        {sections.length > 0 ? (
          <div className={styles.sectionsContainer}>
            {sections.map(section => renderSection(section))}
          </div>
        ) : (
          <EmptyCanvasDropZone />
        )}
      </div>
    </div>
  );
};