import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import type { BuilderElement } from '../../../types/builder';
import useElementStore from '../../../stores/elementStore';
import styles from './InlineEditor.module.scss';

interface InlineEditorProps {
  element: BuilderElement;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  children: React.ReactNode;
}

interface FloatingToolbarProps {
  onFormat: (command: string, value?: string) => void;
  position: { x: number; y: number } | null;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ onFormat, position }) => {
  if (!position) return null;

  const toolbarStyles: React.CSSProperties = {
    position: 'fixed',
    left: position.x,
    top: position.y - 50,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    background: 'white',
    border: '1px solid #e1e5e9',
    borderRadius: '6px',
    padding: '4px 6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  };

  const buttonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    border: 'none',
    background: 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.15s ease'
  };

  const separatorStyles: React.CSSProperties = {
    width: '1px',
    height: '20px',
    background: '#e1e5e9',
    margin: '0 4px'
  };

  return (
    <div 
      className={styles.floatingToolbar}
      style={toolbarStyles}
    >
      <button
        className={styles.toolbarButton}
        style={buttonStyles}
        onClick={() => onFormat('bold')}
        title="Bold (Cmd+B)"
      >
        <Bold size={14} />
      </button>
      <button
        className={styles.toolbarButton}
        style={buttonStyles}
        onClick={() => onFormat('italic')}
        title="Italic (Cmd+I)"
      >
        <Italic size={14} />
      </button>
      <button
        className={styles.toolbarButton}
        style={buttonStyles}
        onClick={() => onFormat('underline')}
        title="Underline (Cmd+U)"
      >
        <Underline size={14} />
      </button>
      <div className={styles.separator} style={separatorStyles} />
      <button
        className={styles.toolbarButton}
        style={buttonStyles}
        onClick={() => onFormat('justifyLeft')}
        title="Align Left"
      >
        <AlignLeft size={14} />
      </button>
      <button
        className={styles.toolbarButton}
        style={buttonStyles}
        onClick={() => onFormat('justifyCenter')}
        title="Align Center"
      >
        <AlignCenter size={14} />
      </button>
      <button
        className={styles.toolbarButton}
        style={buttonStyles}
        onClick={() => onFormat('justifyRight')}
        title="Align Right"
      >
        <AlignRight size={14} />
      </button>
    </div>
  );
};

export const InlineEditor: React.FC<InlineEditorProps> = ({
  element,
  isActive,
  onActivate,
  onDeactivate,
  children
}) => {
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);
  const [lastContent, setLastContent] = useState(element.content || '');
  const editableRef = useRef<HTMLDivElement>(null);
  const { updateElement } = useElementStore();

  // Handle double-click to activate editing
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    console.log('🖱️ DOUBLE-CLICK detected on element:', element.id, element.type, 'isActive:', isActive);
    e.stopPropagation();
    e.preventDefault();
    
    if (!isActive) {
      console.log('🔧 Activating inline editor for:', element.id);
      onActivate();
      
      // Focus the editable element after activation
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus();
          
          // Select all text
          const range = document.createRange();
          range.selectNodeContents(editableRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 50);
    }
  }, [isActive, onActivate]);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editableRef.current) {
      const newContent = editableRef.current.innerHTML;
      setLastContent(newContent);
      
      // Update element content in store
      updateElement(element.id, {
        content: newContent
      });
    }
  }, [element.id, updateElement]);

  // Handle blur to deactivate
  const handleBlur = useCallback(() => {
    // Small delay to allow toolbar clicks
    setTimeout(() => {
      onDeactivate();
      setToolbarPosition(null);
    }, 150);
  }, [onDeactivate]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isActive) return;

    // Handle Enter to finish editing
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
      return;
    }

    // Handle Escape to cancel editing
    if (e.key === 'Escape') {
      e.preventDefault();
      if (editableRef.current) {
        editableRef.current.innerHTML = lastContent;
      }
      handleBlur();
      return;
    }

    // Handle formatting shortcuts
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          break;
      }
    }
  }, [isActive, lastContent, handleBlur]);

  // Handle text selection for toolbar positioning
  const handleMouseUp = useCallback(() => {
    if (!isActive) return;

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setToolbarPosition({
        x: rect.left + (rect.width / 2) - 100, // Center the toolbar
        y: rect.top
      });
    } else {
      setToolbarPosition(null);
    }
  }, [isActive]);

  // Handle formatting commands from toolbar
  const handleFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editableRef.current?.focus();
    handleInput(); // Update content after formatting
  }, [handleInput]);

  // Reset content when element content changes externally
  useEffect(() => {
    if (editableRef.current && !isActive) {
      editableRef.current.innerHTML = element.content || '';
      setLastContent(element.content || '');
    }
  }, [element.content, isActive]);

  if (isActive) {
    // Extract the original element's styles from the children
    const childElement = React.Children.only(children) as React.ReactElement;
    const originalStyles = childElement.props.style || {};
    
    return (
      <>
        <div
          ref={editableRef}
          className={styles.inlineEditor}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: element.content || '' }}
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseUp={handleMouseUp}
          style={{
            ...originalStyles, // Apply original element styles
            outline: 'none',
            border: '2px solid #5457ff',
            borderRadius: '4px',
            padding: '4px 8px',
            minHeight: '1.2em',
            cursor: 'text',
            margin: '0' // Override margin to prevent double margins
          }}
        />
        <FloatingToolbar
          onFormat={handleFormat}
          position={toolbarPosition}
        />
      </>
    );
  }

  // Non-editing state - show children with double-click handler
  return (
    <div 
      className={styles.editableWrapper}
      style={{
        position: 'relative',
        cursor: 'text',
        minHeight: '1.2em',
        width: '100%',
        display: 'block' // Ensure full coverage
      }}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        console.log('🖱️ Single click on InlineEditor wrapper:', element.id);
      }}
      title="Double-click to edit"
    >
      {/* Clone children and add double-click handler directly to them */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childElement = child as React.ReactElement<{ style?: React.CSSProperties; onDoubleClick?: (e: React.MouseEvent) => void }>;
          return React.cloneElement(childElement, {
            onDoubleClick: (e: React.MouseEvent) => {
              console.log('🖱️ Double-click on child element:', element.id, child.type);
              handleDoubleClick(e);
            },
            style: {
              ...(childElement.props.style || {}),
              cursor: 'text'
            }
          });
        }
        return child;
      })}
    </div>
  );
};