import React, { useState } from 'react';
import { Save, Eye, Undo, Redo, Monitor, Tablet, Smartphone, Zap, Settings } from 'lucide-react';
import styles from './TopBar.module.scss';

type Viewport = 'desktop' | 'tablet' | 'mobile';

export const TopBar: React.FC = () => {
  const [currentViewport, setCurrentViewport] = useState<Viewport>('desktop');

  const viewports = [
    { id: 'desktop' as Viewport, label: 'Desktop', icon: Monitor },
    { id: 'tablet' as Viewport, label: 'Tablet', icon: Tablet },
    { id: 'mobile' as Viewport, label: 'Mobile', icon: Smartphone },
  ];

  const handleViewportChange = (viewport: Viewport) => {
    setCurrentViewport(viewport);
    // TODO: Implement viewport switching logic
    console.log('Switching to viewport:', viewport);
  };

  const handleUndo = () => {
    // TODO: Implement undo functionality
    console.log('Undo');
  };

  const handleRedo = () => {
    // TODO: Implement redo functionality
    console.log('Redo');
  };

  const handlePreview = () => {
    // TODO: Implement preview mode
    window.open('/?preview=true', '_blank');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving...');
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing...');
  };

  return (
    <div className={styles.topBar}>
      {/* Left Section - Logo & Project Info */}
      <div className={styles.left}>
        <div className={styles.logo}>
          PageCraft
        </div>
        <div className={styles.projectName}>
          Untitled Landing Page
        </div>
      </div>
      
      {/* Center Section - Controls & Viewport Switcher */}
      <div className={styles.center}>
        {/* History Controls */}
        <div className={styles.historyControls}>
          <button 
            className={styles.iconButton} 
            onClick={handleUndo}
            title="Undo (⌘Z)"
          >
            <Undo size={16} />
          </button>
          <button 
            className={styles.iconButton} 
            onClick={handleRedo}
            title="Redo (⌘⇧Z)"
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Viewport Switcher */}
        <div className={styles.viewportSwitcher}>
          {viewports.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.viewportButton} ${currentViewport === id ? styles.active : ''}`}
              onClick={() => handleViewportChange(id)}
              title={`Switch to ${label} view`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className={styles.right}>
        <div className={styles.actionGroup}>
          <button 
            className={styles.iconButton}
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button 
            className={`${styles.button} ${styles.previewButton}`}
            onClick={handlePreview}
            title="Preview your page"
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          
          <button 
            className={styles.button}
            onClick={handleSave}
            title="Save changes (⌘S)"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          
          <button 
            className={styles.primaryButton}
            onClick={handlePublish}
            title="Publish your page"
          >
            <Zap size={16} />
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};