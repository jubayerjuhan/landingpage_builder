import React from 'react';
import { X } from 'lucide-react';
import useModalStore, { type SectionConfig } from '../../stores/modalStore';
import styles from './AddSectionModal.module.scss';

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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add A Section</h2>
          <button 
            className={styles.modalClose}
            onClick={closeAddSectionModal}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section Type Grid */}
        <div className={styles.sectionGrid}>
          {SECTION_TYPES.map((option) => (
            <button
              key={option.type}
              className={`${styles.sectionOption} ${sectionConfig.type === option.type ? styles.selected : ''}`}
              onClick={() => handleSectionTypeSelect(option.type)}
              type="button"
            >
              {/* Visual representation */}
              <div className={styles.sectionPreview}>
                <div className={styles.sectionVisual}>
                  <div 
                    className={styles.sectionInner}
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
              <div className={styles.sectionLabel}>
                <div className={styles.sectionName}>{option.name}</div>
                <div className={styles.sectionDescription}>{option.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button 
            className={styles.btnSecondary}
            onClick={closeAddSectionModal}
            type="button"
          >
            Cancel
          </button>
          <button 
            className={styles.btnPrimary}
            onClick={handleConfirm}
            type="button"
          >
            Add Section
          </button>
        </div>
      </div>
    </div>
  );
};