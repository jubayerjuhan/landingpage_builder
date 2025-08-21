import React from 'react';
import { X } from 'lucide-react';
import useModalStore, { type RowConfig } from '../../stores/modalStore';

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
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add A Row</h2>
          <button 
            className="modal-close"
            onClick={closeAddRowModal}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Column Layout Grid */}
        <div className="column-grid">
          {COLUMN_LAYOUTS.map((layout) => (
            <button
              key={layout.columns}
              className={`column-option ${rowConfig.columns === layout.columns ? 'selected' : ''}`}
              onClick={() => handleColumnSelect(layout.columns)}
              type="button"
            >
              {/* Visual representation */}
              <div className="column-preview-container">
                <div className="column-visual">
                  {renderColumnPreview(layout.columns)}
                </div>
                <div className="drag-handle">
                  <div className="drag-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              
              {/* Label */}
              <div className="column-label">
                <div className="column-name">{layout.name}</div>
                <div className="column-description">{layout.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Row Settings */}
        <div className="row-settings">
          <div className="setting-group">
            <label className="setting-label">Column Gap</label>
            <select 
              className="setting-select"
              value={rowConfig.gap}
              onChange={(e) => setRowConfig({ ...rowConfig, gap: e.target.value })}
            >
              <option value="0.5rem">Small (0.5rem)</option>
              <option value="1rem">Medium (1rem)</option>
              <option value="1.5rem">Large (1.5rem)</option>
              <option value="2rem">Extra Large (2rem)</option>
            </select>
          </div>

          <div className="setting-group">
            <label className="setting-label">Column Alignment</label>
            <select 
              className="setting-select"
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
        <div className="modal-actions">
          <button 
            className="btn-secondary"
            onClick={closeAddRowModal}
            type="button"
          >
            Cancel
          </button>
          <button 
            className="btn-primary"
            onClick={handleConfirm}
            type="button"
          >
            Add Row
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 0;
          width: 700px;
          max-width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .column-grid {
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .column-option {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .column-option:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .column-option.selected {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .column-preview-container {
          margin-bottom: 1rem;
        }

        .column-visual {
          background: #f9fafb;
          border: 1px dashed #d1d5db;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 0.5rem;
          height: 60px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .drag-handle {
          display: flex;
          justify-content: center;
        }

        .drag-dots {
          display: flex;
          gap: 2px;
        }

        .drag-dots span {
          width: 3px;
          height: 3px;
          background: #9ca3af;
          border-radius: 50%;
          display: block;
        }

        .column-label {
          text-align: center;
        }

        .column-name {
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .column-description {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .row-settings {
          padding: 0 2rem 1rem;
          border-top: 1px solid #e5e7eb;
          margin-top: 1rem;
          padding-top: 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .setting-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .setting-select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 0.875rem;
        }

        .setting-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .modal-actions {
          padding: 1.5rem 2rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn-secondary {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .btn-primary {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};