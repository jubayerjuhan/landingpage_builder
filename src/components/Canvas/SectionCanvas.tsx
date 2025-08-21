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
  const { elements, selectedElementIds, selectElement } = useElementStore();
  const { openAddSectionModal, openAddRowModal } = useModalStore();

  // Get root level sections (elements with no parentId)
  const sections = elements.filter(el => !el.parentId && el.type === ComponentType.SECTION);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only clear selection if clicking on canvas directly
    if (e.target === e.currentTarget) {
      selectElement(''); // Use empty string instead of null
    }
  };

  const renderSection = (section: BuilderElement) => {
    const isSelected = selectedElementIds.includes(section.id);
    const rows = elements.filter(el => el.parentId === section.id && el.type === ComponentType.ROW);

    return (
      <div
        key={section.id}
        className={`${styles.section} ${isSelected ? styles.sectionSelected : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(section.id);
        }}
      >
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>
            {section.name || 'Section'}
          </span>
          <div className={styles.sectionActions}>
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
        </div>

        {/* Section Content */}
        <div className={styles.sectionContent}>
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
        </div>
      </div>
    );
  };

  const renderRow = (row: BuilderElement) => {
    const isSelected = selectedElementIds.includes(row.id);
    const columns = elements.filter(el => el.parentId === row.id && el.type === ComponentType.COLUMN);

    return (
      <div
        key={row.id}
        className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(row.id);
        }}
      >
        {/* Row Header */}
        <div className={styles.rowHeader}>
          <span className={styles.rowLabel}>
            {row.name || 'Row'}
          </span>
        </div>

        {/* Row Content - Columns */}
        <div className={styles.rowContent}>
          {columns.map(column => renderColumn(column))}
        </div>
      </div>
    );
  };

  const renderColumn = (column: BuilderElement) => {
    const isSelected = selectedElementIds.includes(column.id);

    return (
      <DroppableColumn key={column.id} column={column} isSelected={isSelected} />
    );
  };

  // Droppable column component
  const DroppableColumn: React.FC<{ column: BuilderElement; isSelected: boolean }> = ({ column, isSelected }) => {
    const columnElements = elements.filter(el => el.parentId === column.id);
    const { isOver, setNodeRef } = useDroppable({
      id: `container-${column.id}`,
    });

    return (
      <div
        ref={setNodeRef}
        className={`${styles.column} ${isSelected ? styles.columnSelected : ''} ${isOver ? styles.columnOver : ''}`}
        style={{
          width: (column.properties as any)?.width || 'auto',
          flex: (column.properties as any)?.width ? 'none' : '1'
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(column.id);
        }}
      >
        {/* Column Header */}
        <div className={styles.columnHeader}>
          <span className={styles.columnLabel}>
            {column.name || 'Column'}
          </span>
        </div>

        {/* Column Content */}
        <div className={styles.columnContent}>
          {columnElements.length > 0 ? (
            columnElements.map(element => (
              <ElementRenderer key={element.id} element={element} />
            ))
          ) : (
            <div className={`${styles.emptyColumn} ${isOver ? styles.emptyColumnOver : ''}`}>
              Drop elements here
            </div>
          )}
        </div>
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