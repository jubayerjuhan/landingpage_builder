import React, { useEffect } from 'react';
import { ComponentType } from '../types/builder';
import type { BuilderElement } from '../types/builder';
import useElementStore from '../stores/elementStore';
import useCanvasStore from '../stores/canvasStore';
import { ElementRenderer } from '../components/elements/ElementRenderer';
import styles from './TestInlineEdit.module.scss';

export const TestInlineEdit: React.FC = () => {
  const { elements, addElement, clearSelection } = useElementStore();
  const { setPreviewMode } = useCanvasStore();

  useEffect(() => {
    // Set to edit mode
    setPreviewMode('edit');
    
    // Clear any existing elements
    useElementStore.setState({ elements: [] });
    
    // Create test elements
    const testHeading: BuilderElement = {
      id: 'test-heading-1',
      type: ComponentType.HEADING,
      name: 'Test Heading',
      content: 'Double-click me to edit this heading',
      parentId: null,
      order: 0,
      styles: {
        desktop: {
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '20px'
        }
      },
      properties: {}
    };

    const testParagraph: BuilderElement = {
      id: 'test-paragraph-1',
      type: ComponentType.PARAGRAPH,
      name: 'Test Paragraph',
      content: 'This is a paragraph. Double-click to edit this text content.',
      parentId: null,
      order: 1,
      styles: {
        desktop: {
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#666'
        }
      },
      properties: {}
    };

    const testText: BuilderElement = {
      id: 'test-text-1',
      type: ComponentType.TEXT,
      name: 'Test Text',
      content: 'Small text element - also editable with double-click',
      parentId: null,
      order: 2,
      styles: {
        desktop: {
          fontSize: '14px',
          color: '#999'
        }
      },
      properties: {}
    };

    // Add elements to store
    useElementStore.setState({ 
      elements: [testHeading, testParagraph, testText] 
    });
  }, [setPreviewMode]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  return (
    <div className={styles.testPage}>
      <div className={styles.header}>
        <h1>Inline Edit Test</h1>
        <p>Instructions: Click to select, double-click to edit text</p>
      </div>
      
      <div 
        className={styles.canvas}
        onClick={handleCanvasClick}
      >
        {elements.map((element) => (
          <div key={element.id} className={styles.elementContainer}>
            <ElementRenderer element={element} />
          </div>
        ))}
      </div>
    </div>
  );
};