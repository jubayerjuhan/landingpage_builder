import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { useBuilderStore } from '../../../../stores/builderStore';
import styles from './Element.module.scss';

interface ElementProps {
  element: any;
}

export const Element: React.FC<ElementProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);
  const [isHovered, setIsHovered] = useState(false);
  const [localContent, setLocalContent] = useState(element.content);
  const editRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const { updateElement, selectedElementId, selectElement, isPreviewMode } = useBuilderStore();

  const isSelected = selectedElementId === element.id;

  // Make element draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging
  } = useDraggable({
    id: `element-${element.id}`,
    data: {
      type: 'existing-element',
      element: element
    }
  });

  // Handle element selection
  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectElement(element.id);
  };

  // Handle double-click to edit (disabled - using inline editing instead)
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Double-click editing disabled - using inline editing for better UX
    // if (['heading', 'paragraph', 'text', 'button', 'quote'].includes(element.type)) {
    //   setIsEditing(true);
    //   setEditContent(element.content);
    // }
  };

  // Save content
  const saveContent = () => {
    const newContent = editRef.current?.innerHTML || editContent;
    updateElement(element.id, { content: newContent });
    setIsEditing(false);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveContent();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };


  // Sync local content with element content when it changes externally
  useEffect(() => {
    setLocalContent(element.content);
  }, [element.content]);

  // Set content when element becomes selected
  useEffect(() => {
    if (isSelected) {
      // Set content for heading
      if (element.type === 'heading' && headingRef.current) {
        headingRef.current.textContent = element.content || 'Heading';
      }
      // Set content for paragraph
      if (element.type === 'paragraph' && paragraphRef.current) {
        paragraphRef.current.textContent = element.content || 'Your paragraph text goes here. Click to edit.';
      }
      // Set content for text
      if (element.type === 'text' && textRef.current) {
        textRef.current.textContent = element.content || 'Text';
      }
      // Set content for button
      if (element.type === 'button' && buttonRef.current) {
        buttonRef.current.textContent = element.content || 'Click Me';
      }
      // Set content for quote
      if (element.type === 'quote' && quoteRef.current) {
        quoteRef.current.textContent = element.content || 'This is a quote. Click to edit.';
      }
    }
  }, [isSelected, element.type, element.content]);

  // Focus and select text when editing starts
  useEffect(() => {
    if (isEditing && editRef.current) {
      // Set initial content from element
      if (element.content && editRef.current.innerHTML !== element.content) {
        editRef.current.innerHTML = element.content;
      }
      
      editRef.current.focus();
      
      // Select all text content
      setTimeout(() => {
        if (editRef.current) {
          const range = document.createRange();
          range.selectNodeContents(editRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 10);
    }
  }, [isEditing, element.content]);

  // Enhanced List Component with add/remove/reorder functionality
  const renderListComponent = () => {
    const listItems = element.listItems || ['List item 1', 'List item 2', 'List item 3'];
    const ListTag = element.listType === 'ordered' ? 'ol' : 'ul';
    const elementStyles = element.styles || {};

    // Handle adding new list item
    const addListItem = () => {
      const newItems = [...listItems, `New item ${listItems.length + 1}`];
      updateElement(element.id, { listItems: newItems });
    };

    // Handle removing list item
    const removeListItem = (index: number) => {
      if (listItems.length > 1) {
        const newItems = listItems.filter((_: any, i: number) => i !== index);
        updateElement(element.id, { listItems: newItems });
      }
    };

    // Handle updating list item text
    const updateListItem = (index: number, newText: string) => {
      const newItems = [...listItems];
      newItems[index] = newText;
      updateElement(element.id, { listItems: newItems });
    };

    // Handle reordering (move up/down)
    const moveListItem = (index: number, direction: 'up' | 'down') => {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < listItems.length) {
        const newItems = [...listItems];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        updateElement(element.id, { listItems: newItems });
      }
    };

    return (
      <div className={styles.listContainer} style={elementStyles}>
        <ListTag className={styles.list}>
          {listItems.map((item: string, index: number) => (
            <li key={index} className={styles.listItem}>
              <div className={styles.listItemContent}>
                <span 
                  className={styles.listItemText}
                  contentEditable={isSelected && !isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateListItem(index, (e.target as HTMLElement).textContent || '')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      (e.target as HTMLElement).blur();
                    }
                  }}
                >
                  {item}
                </span>
                
                {isSelected && !isPreviewMode && (
                  <div className={styles.listItemControls}>
                    <button 
                      className={styles.listControlBtn}
                      onClick={() => moveListItem(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button 
                      className={styles.listControlBtn}
                      onClick={() => moveListItem(index, 'down')}
                      disabled={index === listItems.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button 
                      className={styles.listControlBtn}
                      onClick={() => removeListItem(index)}
                      disabled={listItems.length <= 1}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ListTag>
        
        {isSelected && !isPreviewMode && (
          <button 
            className={styles.addListItemBtn}
            onClick={addListItem}
            title="Add new item"
          >
            + Add Item
          </button>
        )}
      </div>
    );
  };

  // Render editing mode
  if (isEditing) {
    return (
      <>
        <div className={`${styles.element} ${styles.editing}`} style={{ position: 'relative' }}>
          <div
            ref={editRef}
            contentEditable
            suppressContentEditableWarning
            className={`${styles.editableContent} ${styles[element.type]}`}
            style={element.styles || {}}
            onBlur={saveContent}
            onKeyDown={handleKeyDown}
            dangerouslySetInnerHTML={{ __html: element.content || editContent || '' }}
          />
        </div>
      </>
    );
  }

  // Render based on element type
  const renderElement = () => {
    const elementStyles = element.styles || {};
    
    switch (element.type) {
      case 'heading':
        return isSelected && !isPreviewMode ? (
          <h2 
            ref={headingRef}
            className={styles.heading} 
            style={elementStyles}
            contentEditable={true}
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = (e.target as HTMLElement).textContent || '';
              updateElement(element.id, { content: newContent });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLElement).blur();
              }
            }}
          />
        ) : (
          <h2 
            className={styles.heading} 
            style={elementStyles}
            dangerouslySetInnerHTML={{ 
              __html: element.content || 'Heading' 
            }}
          />
        );
      
      case 'paragraph':
        return isSelected && !isPreviewMode ? (
          <p 
            ref={paragraphRef}
            className={styles.paragraph} 
            style={elementStyles}
            contentEditable={true}
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = (e.target as HTMLElement).textContent || '';
              updateElement(element.id, { content: newContent });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLElement).blur();
              }
            }}
          />
        ) : (
          <p 
            className={styles.paragraph} 
            style={elementStyles}
            dangerouslySetInnerHTML={{ 
              __html: element.content || 'Your paragraph text goes here. Click to edit.' 
            }}
          />
        );
      
      case 'text':
        return isSelected && !isPreviewMode ? (
          <span 
            ref={textRef}
            className={styles.text} 
            style={elementStyles}
            contentEditable={true}
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = (e.target as HTMLElement).textContent || '';
              updateElement(element.id, { content: newContent });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLElement).blur();
              }
            }}
          />
        ) : (
          <span 
            className={styles.text} 
            style={elementStyles}
            dangerouslySetInnerHTML={{ 
              __html: element.content || 'Text' 
            }}
          />
        );
      
      case 'button':
        return isSelected && !isPreviewMode ? (
          <button 
            ref={buttonRef}
            className={styles.button} 
            style={elementStyles}
            contentEditable={true}
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = (e.target as HTMLElement).textContent || '';
              updateElement(element.id, { content: newContent });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLElement).blur();
              }
            }}
          />
        ) : (
          <button 
            className={styles.button} 
            style={elementStyles}
            dangerouslySetInnerHTML={{ 
              __html: element.content || 'Click Me' 
            }}
          />
        );
      
      case 'image':
        return (
          <div className={styles.imagePlaceholder} style={elementStyles}>
            {element.imageUrl ? (
              <img 
                src={element.imageUrl} 
                alt={element.altText || 'Image'}
                className={styles.image}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: elementStyles.borderRadius || '0'
                }}
              />
            ) : (
              <div className={styles.placeholderContent}>
                <div className={styles.placeholderIcon}>🖼️</div>
                <span>Click to upload image</span>
              </div>
            )}
          </div>
        );
      
      case 'list':
        return renderListComponent();
      
      case 'quote':
        return (
          <blockquote className={styles.quote} style={elementStyles}>
            {isSelected && !isPreviewMode ? (
              <div 
                ref={quoteRef}
                className={styles.quoteContent}
                contentEditable={true}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newContent = (e.target as HTMLElement).textContent || '';
                  updateElement(element.id, { content: newContent });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                  }
                }}
              />
            ) : (
              <div 
                className={styles.quoteContent}
                dangerouslySetInnerHTML={{ 
                  __html: element.content || 'This is a quote. Click to edit.' 
                }}
              />
            )}
            {element.author && (
              <cite className={styles.quoteAuthor}>
                — {element.author}
              </cite>
            )}
          </blockquote>
        );
      
      case 'code':
        return (
          <div className={styles.codeBlock} style={elementStyles}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLanguage}>
                {element.language || 'javascript'}
              </span>
              <button className={styles.copyButton}>Copy</button>
            </div>
            <pre className={styles.codeContent}>
              <code>
                {element.content || '// Your code here\nconsole.log("Hello, World!");'}
              </code>
            </pre>
          </div>
        );
      
      case 'video':
        return (
          <div className={styles.videoContainer} style={elementStyles}>
            {element.videoUrl ? (
              <video 
                className={styles.video}
                controls={element.showControls !== false}
                autoPlay={element.autoplay === true}
                loop={element.loop === true}
                muted={element.muted === true}
                poster={element.posterUrl}
              >
                <source src={element.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : element.embedUrl ? (
              <iframe 
                className={styles.videoEmbed}
                src={element.embedUrl}
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              <div className={styles.placeholderContent}>
                <div className={styles.placeholderIcon}>🎥</div>
                <span>Click to add video</span>
              </div>
            )}
          </div>
        );
      
      case 'gallery':
        const galleryImages = element.images || [];
        return (
          <div className={styles.gallery} style={elementStyles}>
            {galleryImages.length > 0 ? (
              <div className={`${styles.galleryGrid} ${styles[element.galleryType || 'grid']}`}>
                {galleryImages.map((img: any, index: number) => (
                  <div key={index} className={styles.galleryItem}>
                    <img src={img.url} alt={img.alt || `Gallery image ${index + 1}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.placeholderContent}>
                <div className={styles.placeholderIcon}>🖼️</div>
                <span>Click to add images</span>
              </div>
            )}
          </div>
        );
      
      case 'background-video':
        return (
          <div className={styles.backgroundVideo} style={elementStyles}>
            {element.videoUrl ? (
              <>
                <video 
                  className={styles.bgVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={element.videoUrl} type="video/mp4" />
                </video>
                <div className={styles.videoOverlay} style={{
                  backgroundColor: element.overlayColor || 'rgba(0,0,0,0.3)'
                }}>
                  <div className={styles.overlayContent}>
                    {element.content || 'Background video content'}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.placeholderContent}>
                <div className={styles.placeholderIcon}>🎬</div>
                <span>Click to add background video</span>
              </div>
            )}
          </div>
        );
      
      case 'link':
        return (
          <a 
            href={element.url || '#'} 
            className={styles.link} 
            style={elementStyles}
            target={element.target || '_self'}
          >
            {element.content || 'Link text'}
          </a>
        );
      
      case 'accordion':
        const accordionItems = element.accordionItems || [
          { title: 'Accordion Item 1', content: 'Content for item 1' },
          { title: 'Accordion Item 2', content: 'Content for item 2' }
        ];
        return (
          <div className={styles.accordion} style={elementStyles}>
            {accordionItems.map((item: any, index: number) => (
              <div key={index} className={styles.accordionItem}>
                <div className={styles.accordionHeader}>
                  {item.title}
                  <span className={styles.accordionIcon}>▼</span>
                </div>
                <div className={styles.accordionContent}>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'tabs':
        const tabItems = element.tabItems || [
          { title: 'Tab 1', content: 'Content for tab 1' },
          { title: 'Tab 2', content: 'Content for tab 2' }
        ];
        return (
          <div className={styles.tabs} style={elementStyles}>
            <div className={styles.tabHeaders}>
              {tabItems.map((item: any, index: number) => (
                <button key={index} className={`${styles.tabHeader} ${index === 0 ? styles.active : ''}`}>
                  {item.title}
                </button>
              ))}
            </div>
            <div className={styles.tabContent}>
              {tabItems[0]?.content || 'Tab content'}
            </div>
          </div>
        );
      
      case 'modal':
        return (
          <div className={styles.modalTrigger} style={elementStyles}>
            <button className={styles.modalButton}>
              {element.triggerText || 'Open Modal'}
            </button>
          </div>
        );
      
      case 'popup':
        return (
          <div className={styles.popupTrigger} style={elementStyles}>
            <span className={styles.popupText}>
              {element.content || 'Hover for popup'}
            </span>
          </div>
        );
      
      case 'input':
        return (
          <div className={styles.inputField} style={elementStyles}>
            <label className={styles.inputLabel}>
              {element.label || 'Input Label'}
            </label>
            <input 
              type={element.inputType || 'text'}
              placeholder={element.placeholder || 'Enter text...'}
              className={styles.input}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className={styles.textareaField} style={elementStyles}>
            <label className={styles.inputLabel}>
              {element.label || 'Textarea Label'}
            </label>
            <textarea 
              placeholder={element.placeholder || 'Enter your message...'}
              className={styles.textarea}
              rows={element.rows || 4}
            />
          </div>
        );
      
      case 'checkbox':
        const checkboxOptions = element.options || ['Option 1', 'Option 2', 'Option 3'];
        return (
          <div className={styles.checkboxGroup} style={elementStyles}>
            <label className={styles.inputLabel}>
              {element.label || 'Checkbox Group'}
            </label>
            {checkboxOptions.map((option: string, index: number) => (
              <label key={index} className={styles.checkboxItem}>
                <input type="checkbox" className={styles.checkbox} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <div className={styles.dateField} style={elementStyles}>
            <label className={styles.inputLabel}>
              {element.label || 'Date'}
            </label>
            <input 
              type="date" 
              className={styles.dateInput}
            />
          </div>
        );
      
      default:
        return (
          <div className={styles.unknown} style={elementStyles}>
            <div className={styles.placeholderContent}>
              <div className={styles.placeholderIcon}>❓</div>
              <span>{element.type}: {element.content || 'Unknown component'}</span>
            </div>
          </div>
        );
    }
  };

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1
  } : undefined;

  return (
    <div
      className={`${styles.element} ${isSelected && !isPreviewMode ? styles.selected : ''} ${isDragging ? styles.dragging : ''} ${isPreviewMode ? styles.previewMode : ''}`}
      style={dragStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => !isPreviewMode && setIsHovered(true)}
      onMouseLeave={() => !isPreviewMode && setIsHovered(false)}
      title={!isPreviewMode && ['heading', 'paragraph', 'text', 'button', 'quote'].includes(element.type) ? 'Select and click text to edit' : ''}
    >
      {renderElement()}
      
      {(isSelected || isHovered) && !isEditing && !isPreviewMode && (
        <>
          <div className={styles.elementLabel}>
            {element.type}
          </div>
          <div 
            ref={setDragRef}
            className={styles.dragHandle}
            {...attributes}
            {...listeners}
          >
            <GripVertical size={14} />
          </div>
        </>
      )}
    </div>
  );
};