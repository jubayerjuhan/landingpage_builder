import React, { useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import useElementStore from '../stores/elementStore';
import useCanvasStore from '../stores/canvasStore';
import { ElementWrapper } from '../components/elements/ElementWrapper';
import { Heading } from '../components/elements/content/Heading';
import type { BuilderElement } from '../types/builder';
import { ComponentType } from '../types/builder';

export const TestEditFeatures: React.FC = () => {
  const { addElement, elements, selectedElementIds, selectElement } = useElementStore();
  const { previewMode, setPreviewMode } = useCanvasStore();

  // Create test elements on mount
  useEffect(() => {
    // Clear existing elements
    useElementStore.setState({ elements: [] });
    
    // Create a test heading element
    const testHeading: BuilderElement = {
      id: 'test-heading-' + uuidv4(),
      type: ComponentType.HEADING,
      name: 'Test Heading',
      content: 'Click me to select, double-click to edit',
      parentId: null,
      order: 0,
      styles: {
        desktop: {
          fontSize: '32px',
          color: '#333',
          margin: '20px'
        }
      },
      properties: {},
      children: []
    };

    // Create a test paragraph element
    const testParagraph: BuilderElement = {
      id: 'test-paragraph-' + uuidv4(),
      type: ComponentType.PARAGRAPH,
      name: 'Test Paragraph',
      content: 'This is a test paragraph. Double-click to edit inline.',
      parentId: null,
      order: 1,
      styles: {
        desktop: {
          fontSize: '16px',
          color: '#666',
          margin: '20px'
        }
      },
      properties: {},
      children: []
    };

    // Create a test image element (for resize handles)
    const testImage: BuilderElement = {
      id: 'test-image-' + uuidv4(),
      type: ComponentType.IMAGE,
      name: 'Test Image',
      content: '',
      parentId: null,
      order: 2,
      styles: {
        desktop: {
          width: '300px',
          height: '200px',
          margin: '20px'
        }
      },
      properties: {
        media: {
          src: 'https://via.placeholder.com/300x200',
          alt: 'Test Image'
        }
      },
      children: []
    };

    // Add elements to store
    addElement(testHeading);
    addElement(testParagraph);
    addElement(testImage);

    // Ensure we're in edit mode
    setPreviewMode('edit');
  }, []);

  useEffect(() => {
    console.log('TestEditFeatures State:', {
      elements: elements.length,
      selectedElementIds,
      previewMode
    });
  }, [elements, selectedElementIds, previewMode]);

  const handleContainerClick = () => {
    // Clear selection when clicking container
    selectElement('');
  };

  return (
    <DndContext>
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ marginBottom: '20px', padding: '10px', background: 'white', borderRadius: '8px' }}>
          <h2>Edit Features Test Page</h2>
          <p>Preview Mode: <strong>{previewMode}</strong></p>
          <p>Selected Elements: <strong>{selectedElementIds.join(', ') || 'None'}</strong></p>
          <button 
            onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}
            style={{
              padding: '8px 16px',
              background: '#5457ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Preview Mode
          </button>
        </div>

        <div 
          onClick={handleContainerClick}
          style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '8px',
            minHeight: '500px',
            position: 'relative'
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Test Elements (Try selecting, hovering, and double-clicking):</h3>
          
          {elements.map(element => (
            <div key={element.id} style={{ marginBottom: '20px' }}>
              {element.type === ComponentType.HEADING && <Heading element={element} />}
              {element.type === ComponentType.PARAGRAPH && (
                <ElementWrapper element={element}>
                  <p dangerouslySetInnerHTML={{ __html: element.content || '' }} />
                </ElementWrapper>
              )}
              {element.type === ComponentType.IMAGE && (
                <ElementWrapper element={element}>
                  <img 
                    src={(element.properties?.media as any)?.src || 'https://via.placeholder.com/300x200'} 
                    alt={(element.properties?.media as any)?.alt || 'Test Image'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </ElementWrapper>
              )}
            </div>
          ))}
        </div>
      </div>
      <DragOverlay />
    </DndContext>
  );
};