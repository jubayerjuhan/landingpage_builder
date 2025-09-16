import React, { useEffect, useRef, useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import useElementStore from '../../../stores/elementStore';

interface ListProps {
  element: BuilderElement;
}

export const List: React.FC<ListProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const { updateElement } = useElementStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);
  const [isEditing, setIsEditing] = useState(false);
  type EditItem = { id: string; text: string };
  const [editItems, setEditItems] = useState<EditItem[]>([]);
  const containerRef = useRef<HTMLUListElement | HTMLOListElement | null>(null);
  const itemRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const listStyles: React.CSSProperties = {
    margin: '0 0 1rem 0',
    paddingLeft: '1.5rem',
    ...styles,
  };

  // Get list type from properties (ordered or unordered)
  const listType = (element.properties?.component as { type?: string })?.type || 'ul';
  const text = content.text || 'List item 1\nList item 2\nList item 3';
  const items = text.split('\n').filter(item => item.trim());

  const ListTag = listType === 'ol' ? 'ol' : 'ul';

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (previewMode === 'preview') return;
    e.preventDefault();
    e.stopPropagation();
    const initialItems = (text ? text.split('\n') : ['']).map(t => ({
      id: Math.random().toString(36).slice(2),
      text: t,
    }));
    setEditItems(
      initialItems.length > 0
        ? initialItems
        : [{ id: Math.random().toString(36).slice(2), text: '' }]
    );
    setIsEditing(true);
  };

  const focusItem = (index: number) => {
    const el = itemRefs.current[index];
    if (el) {
      el.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false); // move caret to end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const handleSave = () => {
    const normalized = itemRefs.current
      .slice(0, editItems.length)
      .map(el => (el?.innerText || '').trim())
      .filter(i => i.length > 0);
    const newText = normalized.join('\n');
    updateElement(element.id, { content: newText });
    setIsEditing(false);
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>, index: number) => {
    const currentEl = itemRefs.current[index];
    const currentText = currentEl?.innerText ?? '';
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const nextItems = [...editItems];
      const left = currentEl?.innerText || '';
      // Keep current text; create new empty item after current
      nextItems[index] = { ...nextItems[index], text: left };
      nextItems.splice(index + 1, 0, { id: Math.random().toString(36).slice(2), text: '' });
      setEditItems(nextItems);
      // Focus the newly created item on next tick
      setTimeout(() => focusItem(index + 1), 0);
      return;
    }
    if (e.key === 'Backspace' && currentText.length === 0) {
      e.preventDefault();
      if (editItems.length > 1) {
        const nextItems = [...editItems];
        nextItems.splice(index, 1);
        setEditItems(nextItems);
        const newIndex = Math.max(0, index - 1);
        setTimeout(() => focusItem(newIndex), 0);
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index > 0) setTimeout(() => focusItem(index - 1), 0);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (index < editItems.length - 1) setTimeout(() => focusItem(index + 1), 0);
      return;
    }
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
  };

  const handleItemPaste = (e: React.ClipboardEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const textData = e.clipboardData.getData('text/plain').replace(/\n/g, ' ');
    document.execCommand('insertText', false, textData);
  };

  useEffect(() => {
    if (isEditing) {
      // Focus first item when entering edit mode
      setTimeout(() => focusItem(0), 0);
    }
  }, [isEditing]);

  // Ensure DOM reflects current editItems text without breaking caret
  useEffect(() => {
    editItems.forEach((item, idx) => {
      const el = itemRefs.current[idx];
      if (!el) return;
      const domText = el.innerText;
      if (domText !== item.text) {
        el.innerText = item.text;
      }
    });
  }, [editItems]);

  const handleContainerBlurCapture = (e: React.FocusEvent) => {
    // Only save if focus moved outside the list editor container
    const next = e.relatedTarget as Node | null;
    const cur = e.currentTarget as HTMLElement;
    if (!next || !cur.contains(next)) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <ElementWrapper element={element}>
        <ListTag
          ref={containerRef as unknown as React.Ref<HTMLUListElement & HTMLOListElement>}
          style={{
            ...listStyles,
            outline: '1px dashed rgba(84, 87, 255, 0.5)',
            outlineOffset: '0px',
          }}
          onBlurCapture={handleContainerBlurCapture}
        >
          {editItems.map((item, index) => (
            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
              <span
                ref={el => {
                  itemRefs.current[index] = el;
                }}
                contentEditable
                suppressContentEditableWarning
                onKeyDown={e => handleItemKeyDown(e, index)}
                onPaste={handleItemPaste}
                style={{
                  display: 'inline-block',
                  minWidth: '1ch',
                }}
              >
                {/* Intentionally do not render text here to avoid React resetting caret.
                    Initialize content via ref below. */}
              </span>
            </li>
          ))}
        </ListTag>
      </ElementWrapper>
    );
  }

  return (
    <ElementWrapper element={element}>
      <ListTag
        style={listStyles}
        onDoubleClick={handleDoubleClick}
        title={previewMode === 'edit' ? 'Double-click to edit' : undefined}
      >
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: '0.5rem' }}>
            {item.trim()}
          </li>
        ))}
      </ListTag>
    </ElementWrapper>
  );
};
