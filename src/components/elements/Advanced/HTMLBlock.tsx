import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import styles from './HTMLBlock.module.scss';

interface HTMLBlockProps {
  element: BuilderElement;
}

export const HTMLBlock: React.FC<HTMLBlockProps> = ({ element }) => {
  const htmlContent = element.properties?.htmlContent || element.content || '<p>Add your custom HTML here</p>';
  const allowScripts = element.properties?.allowScripts === true;
  
  // Sanitize HTML if scripts are not allowed
  const sanitizeHTML = (html: string): string => {
    if (allowScripts) return html;
    
    // Remove script tags and event handlers
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*'[^']*'/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    return sanitized;
  };

  return (
    <ElementWrapper element={element}>
      <div 
        className={styles.htmlBlock}
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(htmlContent) }}
      />
    </ElementWrapper>
  );
};