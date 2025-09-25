import React, { useState } from 'react';
import { Save, Eye, EyeOff, Undo, Redo, Monitor, Tablet, Smartphone, Zap, Settings, Download } from 'lucide-react';
import { useBuilderStore } from '../../../stores/builderStore';
import { buildHtmlDocumentFromElements } from '../../../utils/export/componentExport';
import { ComponentType } from '../../../types/builder';
import type { BuilderElement as ExportBuilderElement, ComponentProperties, ResponsiveStyleObject } from '../../../types/builder';
import styles from './TopBar.module.scss';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const buildResponsiveStyles = (styles?: Record<string, unknown>): ResponsiveStyleObject => ({
  desktop: (styles?.desktop ?? styles ?? {}) as React.CSSProperties,
  tablet: (styles?.tablet ?? {}) as React.CSSProperties,
  mobile: (styles?.mobile ?? {}) as React.CSSProperties,
});

const ensureContentObject = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return {};
};

export const TopBar: React.FC = () => {
  const [currentViewport, setCurrentViewport] = useState<Viewport>('desktop');
  const { isPreviewMode, togglePreviewMode, elements } = useBuilderStore();

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
    togglePreviewMode();
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving...');
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing...');
  };

  const handleExport = () => {
    const exportableElements = [...elements]
      .filter(element => element.type === 'video')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (exportableElements.length === 0) {
      window.alert('Add a video to the canvas before exporting to HTML.');
      return;
    }

    const normalizedElements: ExportBuilderElement[] = exportableElements.map(element => {
      const properties: ComponentProperties = {
        ...(element.properties as ComponentProperties | undefined),
      };

      const contentObject = ensureContentObject(element.content);
      if (!properties.content) {
        properties.content = contentObject;
      } else {
        properties.content = {
          ...properties.content,
          ...contentObject,
        };
      }

      return {
        id: element.id,
        type: element.type as ComponentType,
        content: contentObject,
        properties,
        styles: buildResponsiveStyles(element.styles as Record<string, unknown> | undefined),
      } as ExportBuilderElement;
    });

    const htmlDocument = buildHtmlDocumentFromElements(normalizedElements);
    const blob = new Blob([htmlDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'landing-page.html';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
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
            className={`${styles.button} ${styles.previewButton} ${isPreviewMode ? styles.active : ''}`}
            onClick={handlePreview}
            title={isPreviewMode ? "Exit preview mode" : "Preview your page"}
          >
            {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
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
            className={styles.button}
            onClick={handleExport}
            title="Export to HTML"
          >
            <Download size={16} />
            <span>Export</span>
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
