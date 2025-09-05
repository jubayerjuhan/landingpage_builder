import React, { useEffect, useRef } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import styles from './CustomCSS.module.scss';

interface CustomCSSProps {
  element: BuilderElement;
}

export const CustomCSS: React.FC<CustomCSSProps> = ({ element }) => {
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const cssContent = element.properties?.cssContent || element.content || '';
  const applyGlobally = element.properties?.applyGlobally === true;
  const showPreview = element.properties?.showPreview !== false;
  
  // Generate unique scope class for this CSS block
  const scopeClass = useRef(`custom-css-${element.id}`).current;

  useEffect(() => {
    if (!cssContent) return;

    // Create or update style element
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      styleRef.current.setAttribute('data-custom-css', element.id);
      document.head.appendChild(styleRef.current);
    }

    // Process CSS content
    let processedCSS = cssContent;
    
    // If not applying globally, scope the CSS
    if (!applyGlobally) {
      // Add scope class to all selectors
      processedCSS = cssContent
        .split('}')
        .map(rule => {
          if (!rule.trim()) return '';
          
          const [selector, ...styles] = rule.split('{');
          if (!selector || !styles.length) return rule;
          
          // Don't scope keyframes or media queries
          if (selector.includes('@keyframes') || selector.includes('@media')) {
            return rule + '}';
          }
          
          // Add scope to each selector
          const scopedSelector = selector
            .split(',')
            .map(s => `.${scopeClass} ${s.trim()}`)
            .join(', ');
          
          return `${scopedSelector} { ${styles.join('{')}`;
        })
        .join('}');
    }

    styleRef.current.textContent = processedCSS;

    // Cleanup on unmount
    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [cssContent, applyGlobally, scopeClass, element.id]);

  return (
    <ElementWrapper element={element}>
      <div className={`${styles.customCSS} ${!applyGlobally ? scopeClass : ''}`}>
        {showPreview && (
          <div className={styles.preview}>
            <div className={styles.previewHeader}>
              <span className={styles.previewTitle}>Custom CSS</span>
              <span className={styles.previewScope}>
                {applyGlobally ? 'Global' : 'Scoped'}
              </span>
            </div>
            <pre className={styles.previewCode}>
              <code>{cssContent || '/* Add your custom CSS here */'}</code>
            </pre>
          </div>
        )}
        
        {!applyGlobally && (
          <div className={styles.scopedContent}>
            <p className="custom-text">
              This CSS is scoped to this component. 
              Add content here to test your styles.
            </p>
            <button className="custom-button">Test Button</button>
            <div className="custom-box">Test Box</div>
          </div>
        )}
      </div>
    </ElementWrapper>
  );
};