import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { NewCanvas } from '../components/NewCanvas';
import { NewComponentPalette } from '../components/NewComponentPalette';
import { useElementStore, useCanvasStore, setupStoreIntegration } from '../stores';
import { ViewportMode, ComponentType } from '../types/builder';
import { COMPONENT_DEFINITIONS } from '../components/definitions/componentDefinitions';

const TestPage: React.FC = () => {
  const elementCount = useElementStore(state => state.elements.length);
  const selectedCount = useElementStore(state => state.selectedElementIds.length);
  const addElement = useElementStore(state => state.addElement);
  const viewportMode = useCanvasStore(state => state.viewportMode);
  const setViewportMode = useCanvasStore(state => state.setViewportMode);
  const clearSelection = useElementStore(state => state.clearSelection);
  const resetAllStores = () => {
    // Reset elements
    useElementStore.setState({
      elements: [],
      selectedElementIds: [],
      hoveredElementId: null,
      clipboard: []
    });
    
    // Reset canvas
    useCanvasStore.getState().resetView();
  };

  // Setup store integration on mount
  React.useEffect(() => {
    const cleanup = setupStoreIntegration();
    return cleanup;
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) return;

    // Check if dragging from palette
    const dragData = active.data.current;
    if (dragData?.isFromPalette && dragData?.type) {
      // Create new element from component definition
      const componentType = dragData.type as ComponentType;
      const definition = COMPONENT_DEFINITIONS[componentType];
      
      if (definition) {
        addElement({
          ...definition.defaultProps,
          type: componentType
        });
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="test-page">
        <div className="test-header">
          <div className="test-title">
            <h1>🚀 Landing Page Builder - Foundation Test</h1>
            <p>Testing our professional foundation with new stores and component system</p>
          </div>
          
          <div className="test-stats">
            <div className="stat">
              <span className="stat-label">Elements:</span>
              <span className="stat-value">{elementCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Selected:</span>
              <span className="stat-value">{selectedCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Viewport:</span>
              <span className="stat-value">{viewportMode}</span>
            </div>
          </div>
          
          <div className="test-actions">
            <select 
              value={viewportMode}
              onChange={(e) => setViewportMode(e.target.value as ViewportMode)}
            >
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
              <option value="mobile">Mobile</option>
            </select>
            
            <button onClick={clearSelection}>Clear Selection</button>
            <button onClick={resetAllStores} className="danger">Reset All</button>
          </div>
        </div>

        <div className="test-content">
          <div className="test-sidebar">
            <NewComponentPalette />
          </div>
          
          <div className="test-main">
            <NewCanvas />
          </div>
        </div>
        
        <div className="test-footer">
          <div className="foundation-info">
            <h3>🏗️ Foundation Features Tested:</h3>
            <ul>
              <li>✅ Multi-Store State Management (Zustand)</li>
              <li>✅ Professional Drag & Drop (@dnd-kit)</li>
              <li>✅ 25+ Component Definitions</li>
              <li>✅ Responsive Type System</li>
              <li>✅ Component Categories & Organization</li>
              <li>✅ Element Selection & Management</li>
              <li>✅ Viewport Switching</li>
              <li>🚧 Property Editor (Phase 3)</li>
              <li>🚧 Templates (Phase 4)</li>
              <li>🚧 Export System (Phase 4)</li>
            </ul>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default TestPage;