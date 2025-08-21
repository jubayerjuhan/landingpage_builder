import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBuilderStore } from '../../app/store';
import { Plus } from 'lucide-react';
import styles from './GoHighLevelCanvas.module.scss';

export const GoHighLevelCanvas: React.FC = () => {
  const { droppedElements, selectedElementId, selectElement } = useBuilderStore();
  
  const { setNodeRef, isOver } = useDroppable({
    id: 'main-canvas',
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only clear selection if clicking on canvas directly
    if (e.target === e.currentTarget) {
      selectElement('');
    }
  };

  const renderElement = (element: any) => {
    const isSelected = selectedElementId === element.id;
    
    return (
      <div
        key={element.id}
        className={`${styles.element} ${isSelected ? styles.elementSelected : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(element.id);
        }}
      >
        <div className={styles.elementContent}>
          {element.type === 'section' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>Section</span>
              </div>
              <div className={styles.sectionContent}>
                {element.children?.map((child: any) => renderElement(child)) || (
                  <div className={styles.emptySection}>
                    Drop elements here
                  </div>
                )}
              </div>
            </div>
          )}
          
          {element.type === 'row' && (
            <div className={styles.row}>
              <div className={styles.rowHeader}>
                <span className={styles.rowLabel}>Row</span>
              </div>
              <div className={styles.rowContent}>
                {element.children?.map((child: any) => renderElement(child)) || (
                  <div className={styles.emptyRow}>
                    Drop columns here
                  </div>
                )}
              </div>
            </div>
          )}
          
          {element.type === 'column' && (
            <div className={styles.column}>
              <div className={styles.columnHeader}>
                <span className={styles.columnLabel}>Column</span>
              </div>
              <div className={styles.columnContent}>
                {element.children?.map((child: any) => renderElement(child)) || (
                  <div className={styles.emptyColumn}>
                    Drop content here
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!['section', 'row', 'column'].includes(element.type) && (
            <div className={styles.contentElement}>
              <div className={styles.elementType}>{element.type}</div>
              <div className={styles.elementText}>{element.content || `New ${element.type}`}</div>
            </div>
          )}
        </div>
        
        {isSelected && (
          <div className={styles.selectionOutline}>
            <div className={styles.selectionLabel}>{element.type}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.canvas}>
      <div className={styles.canvasHeader}>
        <div className={styles.canvasTitle}>
          <span>Home Page</span>
        </div>
        <div className={styles.canvasActions}>
          <button className={styles.actionButton}>
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`${styles.canvasContent} ${isOver ? styles.canvasContentOver : ''}`}
        onClick={handleCanvasClick}
      >
        {droppedElements && droppedElements.length > 0 ? (
          <div className={styles.elementsContainer}>
            {droppedElements.map(element => renderElement(element))}
          </div>
        ) : (
          <div className={styles.emptyCanvas}>
            <div className={styles.emptyCanvasIcon}>
              <Plus size={48} />
            </div>
            <h3 className={styles.emptyCanvasTitle}>Drop elements here</h3>
            <p className={styles.emptyCanvasDescription}>
              Drag components from the left sidebar to start building your page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};