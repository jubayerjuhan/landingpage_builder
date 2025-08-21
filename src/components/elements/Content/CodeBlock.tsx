import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface CodeBlockProps {
  element: BuilderElement;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const codeBlockStyles: React.CSSProperties = {
    margin: '1rem 0',
    padding: '1rem',
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    borderRadius: '0.5rem',
    overflow: 'auto',
    fontSize: '0.875rem',
    fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    lineHeight: '1.6',
    ...styles,
  };
  
  const code = content.text || 'console.log("Hello World");';
  const language = (element.properties?.component as any)?.language || 'javascript';
  
  return (
    <ElementWrapper element={element}>
      <div style={codeBlockStyles}>
        {language && (
          <div style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {language}
          </div>
        )}
        <pre style={{ 
          margin: '0', 
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          <code>{code}</code>
        </pre>
      </div>
    </ElementWrapper>
  );
};