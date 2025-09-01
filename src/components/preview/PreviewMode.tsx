import React, { useEffect } from 'react';
import { Eye } from 'lucide-react';
import useElementStore from '../../stores/elementStore';
import useCanvasStore from '../../stores/canvasStore';
import { useBuilderStore } from '../../stores/builderStore';
import { PreviewRenderer } from './PreviewRenderer';
import styles from './PreviewMode.module.scss';

export const PreviewMode: React.FC = () => {
  const { elements } = useElementStore();
  const { viewportMode } = useCanvasStore();
  const { setPreviewMode } = useBuilderStore();

  // Handle ESC key to exit preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setPreviewMode]);


  return (
    <div className={`${styles.previewContainer} ${styles[viewportMode]}`}>
      {/* Preview Mode Indicator */}
      <div className={styles.previewIndicator}>
        <div className={styles.indicatorContent}>
          <Eye size={16} />
          <span>Preview Mode</span>
        </div>
        <button 
          className={styles.exitButton}
          onClick={() => setPreviewMode(false)}
        >
          Exit Preview (ESC)
        </button>
      </div>

      {/* Website Content - Pure HTML Rendering */}
      <div className={styles.websiteContent}>
        {elements.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No content to preview</h2>
            <p>Add some elements to your page to see them in preview mode</p>
          </div>
        ) : (
          <PreviewRenderer elements={elements} viewportMode={viewportMode} />
        )}
      </div>
    </div>
  );
};