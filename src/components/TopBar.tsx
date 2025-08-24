import React from 'react';
import { Undo, Redo, Eye, Globe, Save, Download, Settings } from 'lucide-react';
import styles from './TopBar.module.scss';

interface TopBarProps {
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo
}) => {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Builder</span>
        </div>
      </div>
      
      <div className={styles.topBarCenter}>
        <div className={styles.actionGroup}>
          <button 
            className={`${styles.iconButton} ${!canUndo ? styles.disabled : ''}`}
            title="Undo (Ctrl+Z)"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo size={18} />
            <span>Undo</span>
          </button>
          <button 
            className={`${styles.iconButton} ${!canRedo ? styles.disabled : ''}`}
            title="Redo (Ctrl+Y)"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo size={18} />
            <span>Redo</span>
          </button>
        </div>
        
        <div className={styles.divider} />
        
        <button className={styles.previewButton} title="Preview">
          <Eye size={18} />
          <span>Preview</span>
        </button>
      </div>

      <div className={styles.topBarRight}>
        <button className={styles.secondaryButton} title="Save Draft">
          <Save size={18} />
          <span>Save</span>
        </button>
        
        <button className={styles.secondaryButton} title="Export">
          <Download size={18} />
          <span>Export</span>
        </button>
        
        <button className={styles.primaryButton} title="Publish">
          <Globe size={18} />
          <span>Publish</span>
        </button>
      </div>
    </div>
  );
};