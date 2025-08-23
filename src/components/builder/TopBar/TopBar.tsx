import React from 'react';
import { Save, Eye, Undo, Redo } from 'lucide-react';
import styles from './TopBar.module.scss';

export const TopBar: React.FC = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        <h1 className={styles.logo}>Builder</h1>
      </div>
      
      <div className={styles.center}>
        <button className={styles.iconButton} title="Undo">
          <Undo size={18} />
        </button>
        <button className={styles.iconButton} title="Redo">
          <Redo size={18} />
        </button>
      </div>

      <div className={styles.right}>
        <button className={styles.button}>
          <Eye size={16} />
          Preview
        </button>
        <button className={styles.button}>
          <Save size={16} />
          Save
        </button>
        <button className={styles.primaryButton}>
          Publish
        </button>
      </div>
    </div>
  );
};