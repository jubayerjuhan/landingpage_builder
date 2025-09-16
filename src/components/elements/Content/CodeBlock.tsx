import React, { useEffect, useRef, useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import useElementStore from '../../../stores/elementStore';

interface CodeBlockProps {
  element: BuilderElement;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const { updateElement } = useElementStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);
  const [isEditing, setIsEditing] = useState(false);
  const editableCodeRef = useRef<HTMLPreElement>(null);
  const editableLangRef = useRef<HTMLDivElement>(null);

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
  const language =
    (element.properties?.component as { language?: string })?.language || 'javascript';

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (previewMode === 'preview') return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    const newCode = editableCodeRef.current?.innerText ?? code;
    const newLang = editableLangRef.current?.innerText?.trim() || language;
    updateElement(element.id, {
      content: newCode,
      properties: {
        ...element.properties,
        component: {
          ...(element.properties?.component as Record<string, unknown>),
          language: newLang,
        },
      },
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      editableCodeRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <ElementWrapper element={element}>
        <div
          style={{
            ...codeBlockStyles,
            outline: '1px dashed rgba(84, 87, 255, 0.5)',
            outlineOffset: '0px',
          }}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={editableLangRef}
            contentEditable
            suppressContentEditableWarning
            style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {language}
          </div>
          <pre
            ref={editableCodeRef}
            contentEditable
            suppressContentEditableWarning
            style={{
              margin: '0',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            <code>{code}</code>
          </pre>
        </div>
      </ElementWrapper>
    );
  }

  return (
    <ElementWrapper element={element}>
      <div
        style={codeBlockStyles}
        onDoubleClick={handleDoubleClick}
        title={previewMode === 'edit' ? 'Double-click to edit' : undefined}
      >
        {language && (
          <div
            style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {language}
          </div>
        )}
        <pre
          style={{
            margin: '0',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </ElementWrapper>
  );
};
