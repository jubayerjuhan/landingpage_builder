import React from 'react';
import { ElementRenderer } from './elements/ElementRenderer';
import { createElement } from '../utils/elementFactory';
import { ComponentType, ViewportMode } from '../types/builder';

export const TestNewComponents: React.FC = () => {
  // Create test elements using the new system
  const testElements = [
    createElement(ComponentType.HEADING),
    createElement(ComponentType.PARAGRAPH),
    createElement(ComponentType.BUTTON),
    createElement(ComponentType.IMAGE),
    createElement(ComponentType.CONTAINER),
  ];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem', color: '#111827' }}>
        New Component System Test
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {testElements.map((element) => (
          <div key={element.id} style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '1rem',
            backgroundColor: 'white'
          }}>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              Type: {element.type} | ID: {element.id}
            </div>
            <ElementRenderer element={element} />
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
        <h2 style={{ margin: '0 0 1rem 0', color: '#1e40af' }}>
          ✅ Component System Status
        </h2>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
          <li>✅ BuilderElement type system</li>
          <li>✅ Component definitions with schemas</li>
          <li>✅ Element factory for creation</li>
          <li>✅ ElementRenderer for display</li>
          <li>✅ Layout, Content, Media, Interactive components</li>
          <li>✅ Responsive styles support</li>
        </ul>
      </div>
    </div>
  );
};