import React from 'react';
import type { BuilderElement } from '../../types/builder';
import { getCompleteElementStyles } from '../../utils/styleUtils';

interface PreviewRendererProps {
  elements: BuilderElement[];
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
}

/**
 * Professional Preview Renderer
 * 
 * This component renders pure HTML without any React interactivity.
 * It's designed to show exactly what the hosted website will look like.
 * 
 * Key principles:
 * - No event handlers
 * - No React components
 * - Pure semantic HTML
 * - Only user-defined styles
 */
export const PreviewRenderer: React.FC<PreviewRendererProps> = ({ 
  elements, 
  viewportMode = 'desktop' 
}) => {
  
  /**
   * Convert a BuilderElement to pure HTML
   * This is the core function that generates clean HTML from our element tree
   */
  const renderElement = (element: BuilderElement): React.ReactNode => {
    // Get COMPLETE styles (defaults + custom) for this viewport
    const elementStyles = getCompleteElementStyles(element, viewportMode);
    
    // Helper to get child elements
    const getChildren = (parentId: string) => 
      elements.filter(el => el.parentId === parentId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    
    switch (element.type) {
      case 'layout':
        // Render as semantic section
        const rows = getChildren(element.id);
        return (
          <section 
            key={element.id}
            style={elementStyles}
            data-layout-id={element.id}
          >
            {rows.map(row => renderElement(row))}
          </section>
        );
      
      case 'row':
        // Render as flexbox container with complete styles
        const columns = getChildren(element.id);
        return (
          <div 
            key={element.id}
            style={elementStyles}
            data-row-id={element.id}
          >
            {columns.map(col => renderElement(col))}
          </div>
        );
      
      case 'column':
        // Render as flex item with complete styles
        const columnChildren = getChildren(element.id);
        return (
          <div 
            key={element.id}
            style={elementStyles}
            data-column-id={element.id}
          >
            {columnChildren.map(child => renderElement(child))}
          </div>
        );
      
      case 'heading':
        // Render as semantic heading
        const level = element.properties?.level || 'h2';
        const HeadingTag = level as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag 
            key={element.id}
            style={elementStyles}
          >
            {element.content || 'Heading'}
          </HeadingTag>
        );
      
      case 'paragraph':
        // Render as paragraph
        return (
          <p 
            key={element.id}
            style={elementStyles}
          >
            {element.content || 'Paragraph text'}
          </p>
        );
      
      case 'text':
        // Render as span
        return (
          <span 
            key={element.id}
            style={elementStyles}
          >
            {element.content || 'Text'}
          </span>
        );
      
      case 'button':
        // Render as button (non-interactive in preview)
        return (
          <button 
            key={element.id}
            style={{
              cursor: 'default',
              ...elementStyles
            }}
            type="button"
            disabled
          >
            {element.content || 'Button'}
          </button>
        );
      
      case 'image':
        // Render as image
        return (
          <img 
            key={element.id}
            src={element.properties?.src || 'https://via.placeholder.com/300x200'}
            alt={element.properties?.alt || 'Image'}
            style={elementStyles}
          />
        );
      
      case 'divider':
        // Render as hr
        return (
          <hr 
            key={element.id}
            style={elementStyles}
          />
        );
      
      case 'spacer':
        // Render as empty div with height
        return (
          <div 
            key={element.id}
            style={{
              height: element.properties?.height || '20px',
              ...elementStyles
            }}
          />
        );
      
      default:
        // Fallback for unknown types
        return (
          <div 
            key={element.id}
            style={elementStyles}
          >
            {element.content || ''}
          </div>
        );
    }
  };
  
  // Get root layouts
  const rootLayouts = elements
    .filter(el => el.type === 'layout' && !el.parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
  // Render the page
  return (
    <div className="preview-page" style={{ width: '100%', minHeight: '100vh' }}>
      {rootLayouts.map(layout => renderElement(layout))}
    </div>
  );
};