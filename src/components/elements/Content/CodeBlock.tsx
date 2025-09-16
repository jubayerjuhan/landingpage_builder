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

  const insertText = (textToInsert: string) => {
    document.execCommand('insertText', false, textToInsert);
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent) => {
    // Save/cancel shortcuts
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      return;
    }
    // Force newline as \n to keep DOM clean
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      insertText('\n');
      return;
    }
    // Indentation
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      insertText('  ');
      return;
    }
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      // Remove up to two spaces before caret if present
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const pre = editableCodeRef.current;
      if (!pre) return;
      const beforeRange = range.cloneRange();
      beforeRange.setStart(pre, 0);
      const beforeText = beforeRange.toString();
      if (beforeText.endsWith('  ')) {
        document.execCommand('delete');
        document.execCommand('delete');
      } else if (beforeText.endsWith('\t')) {
        document.execCommand('delete');
      }
      return;
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const textData = e.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n');
    insertText(textData);
  };

  const handleLangPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const textData = e.clipboardData.getData('text/plain').replace(/\s+/g, ' ');
    insertText(textData);
  };

  const handleCopy = () => {
    const toCopy = (editableCodeRef.current?.innerText || code).replace(/\u00A0/g, ' ');
    navigator.clipboard?.writeText(toCopy).catch(() => {
      /* ignore */
    });
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
            position: 'relative',
          }}
          onBlur={handleSave}
        >
          {language && (
            <div
              ref={editableLangRef}
              contentEditable
              suppressContentEditableWarning
              onPaste={handleLangPaste}
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
            ref={editableCodeRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleCodeKeyDown}
            onPaste={handleCodePaste}
            style={{
              margin: '0',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              whiteSpace: 'pre',
              wordBreak: 'normal',
            }}
          >
            {code}
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#e5e7eb',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            title="Copy code"
          >
            Copy
          </button>
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
            whiteSpace: 'pre',
            wordBreak: 'normal',
          }}
        >
          <code style={{ display: 'block', width: '100%' }}>{code}</code>
        </pre>
      </div>
    </ElementWrapper>
  );
};
