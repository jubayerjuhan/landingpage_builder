import React from 'react';

import { useElementStore, useCanvasStore } from '../stores';
import { CanvasDropZone } from './DragAndDrop';
import { COMPONENT_DEFINITIONS } from './definitions/componentDefinitions';
import { ComponentType, type ViewportMode } from '../types/builder';
import './Canvas.module.scss';

// Simple component renderer for testing
interface ElementRendererProps {
  elementId: string;
  viewportMode: ViewportMode;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ elementId, viewportMode }) => {
  const element = useElementStore(state => state.getElementById(elementId));
  const selectedElementIds = useElementStore(state => state.selectedElementIds);
  const selectElement = useElementStore(state => state.selectElement);

  if (!element) return null;

  const isSelected = selectedElementIds.includes(elementId);
  const definition = COMPONENT_DEFINITIONS[element.type];
  const styles = element.styles[viewportMode] || {};

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(elementId);
  };

  // Simple rendering based on component type
  const renderContent = () => {
    switch (element.type) {
      case ComponentType.HEADING:
        return (
          <h2 style={styles}>
            {element.content || 'Heading'}
          </h2>
        );
      
      case ComponentType.PARAGRAPH:
        return (
          <p style={styles}>
            {element.content || 'Paragraph text'}
          </p>
        );
      
      case ComponentType.BUTTON:
        return (
          <button style={styles}>
            {element.content || 'Button'}
          </button>
        );
      
      case ComponentType.CONTAINER:
        const children = useElementStore.getState().getElementChildren(elementId);
        return (
          <div style={styles} className="container-element">
            {children.map(child => (
              <ElementRenderer key={child.id} elementId={child.id} viewportMode={viewportMode} />
            ))}
            {children.length === 0 && (
              <div className="empty-container">Drop elements here</div>
            )}
          </div>
        );
      
      case ComponentType.SECTION:
        const sectionChildren = useElementStore.getState().getElementChildren(elementId);
        return (
          <section style={styles} className="section-element">
            {sectionChildren.map(child => (
              <ElementRenderer key={child.id} elementId={child.id} viewportMode={viewportMode} />
            ))}
            {sectionChildren.length === 0 && (
              <div className="empty-section">Drop elements here</div>
            )}
          </section>
        );

      default:
        return (
          <div style={styles}>
            {element.type} - {element.content || 'Content'}
          </div>
        );
    }
  };

  return (
    <div
      className={`element-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      data-element-id={elementId}
      data-element-type={element.type}
    >
      {renderContent()}
    </div>
  );
};

export const NewCanvas: React.FC = () => {
  const elements = useElementStore(state => state.elements);
  const clearSelection = useElementStore(state => state.clearSelection);
  const viewportMode = useCanvasStore(state => state.viewportMode);

  // Get root elements (no parent)
  const rootElements = elements.filter(el => !el.parentId);

  const handleCanvasClick = () => {
    clearSelection();
  };

  return (
    <div className="new-canvas" onClick={handleCanvasClick}>
      <div className="canvas-header">
        <h3>New Canvas (Testing Foundation)</h3>
        <div className="canvas-info">
          <span>Viewport: {viewportMode}</span>
          <span>Elements: {elements.length}</span>
        </div>
      </div>
      
      <CanvasDropZone
        id="new-canvas-drop-zone"
        accepts={[
          ComponentType.SECTION,
          ComponentType.CONTAINER,
          ComponentType.HEADING,
          ComponentType.PARAGRAPH,
          ComponentType.BUTTON,
          ComponentType.IMAGE
        ]}
        className="canvas-drop-area"
        placeholder="Drag components here to test the new foundation"
      >
        {rootElements.map(element => (
          <ElementRenderer
            key={element.id}
            elementId={element.id}
            viewportMode={viewportMode}
          />
        ))}
      </CanvasDropZone>
    </div>
  );
};