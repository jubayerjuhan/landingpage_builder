import React from 'react';
import styles from './BuilderShell.module.scss';

interface BuilderShellProps {
  left: React.ReactNode;
  canvas: React.ReactNode;
  right: React.ReactNode;
}

export const BuilderShell: React.FC<BuilderShellProps> = ({ left, canvas, right }) => {
  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <div className={styles.windowControls}>
          <span className={`${styles.dot} ${styles.red}`}></span>
          <span className={`${styles.dot} ${styles.yellow}`}></span>
          <span className={`${styles.dot} ${styles.green}`}></span>
          <div className={styles.brand}>build.pro</div>
        </div>
        <div className={styles.toolbar}>
          <button className={styles.iconBtn} title="Dark mode">🌙</button>
          <button className={styles.iconBtn} title="Add page">＋</button>
          <button className={styles.iconBtn} title="Preview">▶</button>
          <button className={styles.iconBtn} title="Share">👤</button>
          <button className={styles.publishBtn}>Publish</button>
        </div>
      </div>

      <aside className={styles.left}>{left}</aside>

      <main className={styles.canvasArea}>
        <div className={styles.canvasToolbar}>
          <div className={styles.tab}>Home Page</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={styles.iconBtn}>100%</button>
            <button className={styles.iconBtn}>1440 × 1024</button>
          </div>
        </div>
        <div className={styles.stage}>
          <div className={styles.artboard}>
            <div className={styles.heroMock}>
              <div className={styles.heroTitle}>FIND SUITABLE REAL</div>
            </div>
            <div className={styles.canvasInner}>{canvas}</div>
          </div>
        </div>
      </main>

      <aside className={styles.right}>{right}</aside>
    </div>
  );
};
