import React from 'react';
import { X } from 'lucide-react';
import useModalStore, { type SectionConfig } from '../../stores/modalStore';

interface SectionTypeOption {
  type: SectionConfig['type'];
  name: string;
  description: string;
  maxWidth: string;
}

const SECTION_TYPES: SectionTypeOption[] = [
  {
    type: 'full-width',
    name: 'Full Width',
    description: 'Spans the entire width of the page',
    maxWidth: '100%'
  },
  {
    type: 'wide',
    name: 'Wide',
    description: 'Wide container with some padding',
    maxWidth: '1400px'
  },
  {
    type: 'medium',
    name: 'Medium',
    description: 'Medium-sized container',
    maxWidth: '1200px'
  },
  {
    type: 'small',
    name: 'Small',
    description: 'Compact container for focused content',
    maxWidth: '960px'
  }
];

export const AddSectionModal: React.FC = () => {
  const { 
    showAddSectionModal, 
    sectionConfig, 
    closeAddSectionModal, 
    setSectionConfig,
    confirmSectionAdd 
  } = useModalStore();

  if (!showAddSectionModal || !sectionConfig) return null;

  const handleSectionTypeSelect = (type: SectionConfig['type']) => {
    const option = SECTION_TYPES.find(opt => opt.type === type);
    if (option) {
      setSectionConfig({
        ...sectionConfig,
        type,
        maxWidth: option.maxWidth === '100%' ? undefined : option.maxWidth
      });
    }
  };

  const handleConfirm = () => {
    confirmSectionAdd();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add A Section</h2>
          <button 
            className="modal-close"
            onClick={closeAddSectionModal}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section Type Grid */}
        <div className="section-grid">
          {SECTION_TYPES.map((option) => (
            <button
              key={option.type}
              className={`section-option ${sectionConfig.type === option.type ? 'selected' : ''}`}
              onClick={() => handleSectionTypeSelect(option.type)}
              type="button"
            >
              {/* Visual representation */}
              <div className="section-preview">
                <div className="section-visual">
                  <div 
                    className="section-inner"
                    style={{
                      width: option.type === 'full-width' ? '100%' : 
                            option.type === 'wide' ? '85%' :
                            option.type === 'medium' ? '70%' : '55%',
                      height: '20px',
                      backgroundColor: '#e5e7eb',
                      margin: '0 auto'
                    }}
                  />
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
              <div className="section-label">
                <div className="section-name">{option.name}</div>
                <div className="section-description">{option.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button 
            className="btn-secondary"
            onClick={closeAddSectionModal}
            type="button"
          >
            Cancel
          </button>
          <button 
            className="btn-primary"
            onClick={handleConfirm}
            type="button"
          >
            Add Section
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
          width: 600px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: hidden;
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

        .section-grid {
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .section-option {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .section-option:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .section-option.selected {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .section-preview {
          margin-bottom: 1rem;
        }

        .section-visual {
          background: #f9fafb;
          border: 1px dashed #d1d5db;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 0.5rem;
          height: 60px;
          display: flex;
          align-items: center;
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

        .section-label {
          text-align: center;
        }

        .section-name {
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .section-description {
          font-size: 0.875rem;
          color: #6b7280;
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