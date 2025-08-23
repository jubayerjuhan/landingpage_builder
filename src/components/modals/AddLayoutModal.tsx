import React from 'react';
import { Columns, Columns2, Columns3, Columns4, X } from 'lucide-react';
import styles from './AddLayoutModal.module.scss';

interface AddLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLayout: (columnCount: number) => void;
}

export const AddLayoutModal: React.FC<AddLayoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectLayout 
}) => {
  if (!isOpen) return null;

  const layoutOptions = [
    { count: 1, icon: <Columns size={32} />, label: 'Single Column', description: 'Perfect for headers and content blocks' },
    { count: 2, icon: <Columns2 size={32} />, label: '2 Columns', description: 'Great for side-by-side content' },
    { count: 3, icon: <Columns3 size={32} />, label: '3 Columns', description: 'Ideal for feature lists or cards' },
    { count: 4, icon: <Columns4 size={32} />, label: '4 Columns', description: 'Perfect for grid layouts' }
  ];

  const handleSelectLayout = (count: number) => {
    onSelectLayout(count);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Choose Layout Type</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.description}>
            Select the number of columns for your new layout:
          </p>

          <div className={styles.layoutGrid}>
            {layoutOptions.map((option) => (
              <div
                key={option.count}
                className={styles.layoutOption}
                onClick={() => handleSelectLayout(option.count)}
              >
                <div className={styles.layoutIcon}>
                  {option.icon}
                </div>
                <h3>{option.label}</h3>
                <p>{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};