import React from 'react';
import { Undo, Redo, Eye, Globe, Save, Download, Settings } from 'lucide-react';
import styles from './TopBar.module.scss';

export const TopBar: React.FC = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Builder</span>
        </div>
      </div>
      
      <div className={styles.topBarCenter}>
        <div className={styles.actionGroup}>
          <button className={styles.iconButton} title="Undo">
            <Undo size={18} />
            <span>Undo</span>
          </button>
          <button className={styles.iconButton} title="Redo">
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