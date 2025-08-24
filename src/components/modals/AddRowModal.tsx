import React from 'react';
import { X } from 'lucide-react';
import useModalStore, { type RowConfig } from '../../stores/modalStore';
import styles from './AddRowModal.module.scss';

interface ColumnLayoutOption {
  columns: number;
  name: string;
  description: string;
}

const COLUMN_LAYOUTS: ColumnLayoutOption[] = [
  {
    columns: 1,
    name: '1 Column',
    description: 'Single full-width column'
  },
  {
    columns: 2,
    name: '2 Column',
    description: 'Two equal columns'
  },
  {
    columns: 3,
    name: '3 Column',
    description: 'Three equal columns'
  },
  {
    columns: 4,
    name: '4 Column',
    description: 'Four equal columns'
  },
  {
    columns: 5,
    name: '5 Column',
    description: 'Five equal columns'
  },
  {
    columns: 6,
    name: '6 Column',
    description: 'Six equal columns'
  }
];

export const AddRowModal: React.FC = () => {
  const { 
    showAddRowModal, 
    rowConfig, 
    closeAddRowModal, 
    setRowConfig,
    confirmRowAdd 
  } = useModalStore();

  if (!showAddRowModal || !rowConfig) return null;

  const handleColumnSelect = (columns: number) => {
    setRowConfig({
      ...rowConfig,
      columns
    });
  };

  const handleConfirm = () => {
    confirmRowAdd();
  };

  const renderColumnPreview = (columnCount: number) => {
    return Array.from({ length: columnCount }, (_, index) => (
      <div
        key={index}
        className="column-preview"
        style={{
          flex: '1',
          height: '20px',
          backgroundColor: '#d1d5db',
          borderRadius: '2px'
        }}
      />
    ));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add A Row</h2>
          <button 
            className={styles.modalClose}
            onClick={closeAddRowModal}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Column Layout Grid */}
        <div className={styles.columnGrid}>
          {COLUMN_LAYOUTS.map((layout) => (
            <button
              key={layout.columns}
              className={`${styles.columnOption} ${rowConfig.columns === layout.columns ? styles.selected : ''}`}
              onClick={() => handleColumnSelect(layout.columns)}
              type="button"
            >
              {/* Visual representation */}
              <div className={styles.columnPreviewContainer}>
                <div className={styles.columnVisual}>
                  {renderColumnPreview(layout.columns)}
                </div>
                <div className={styles.dragHandle}>
                  <div className={styles.dragDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              
              {/* Label */}
              <div className={styles.columnLabel}>
                <div className={styles.columnName}>{layout.name}</div>
                <div className={styles.columnDescription}>{layout.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Row Settings */}
        <div className={styles.rowSettings}>
          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Column Gap</label>
            <select 
              className={styles.settingSelect}
              value={rowConfig.gap}
              onChange={(e) => setRowConfig({ ...rowConfig, gap: e.target.value })}
            >
              <option value="0.5rem">Small (0.5rem)</option>
              <option value="1rem">Medium (1rem)</option>
              <option value="1.5rem">Large (1.5rem)</option>
              <option value="2rem">Extra Large (2rem)</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Column Alignment</label>
            <select 
              className={styles.settingSelect}
              value={rowConfig.alignment}
              onChange={(e) => setRowConfig({ ...rowConfig, alignment: e.target.value as RowConfig['alignment'] })}
            >
              <option value="stretch">Stretch</option>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button 
            className={styles.btnSecondary}
            onClick={closeAddRowModal}
            type="button"
          >
            Cancel
          </button>
          <button 
            className={styles.btnPrimary}
            onClick={handleConfirm}
            type="button"
          >
            Add Row
          </button>
        </div>
      </div>
    </div>
  );
};