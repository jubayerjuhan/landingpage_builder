import React from 'react';
import styles from './BoxModelVisualizer.module.scss';

interface BoxModelVisualizerProps {
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  onMarginChange?: (side: 'top' | 'right' | 'bottom' | 'left', value: string) => void;
  onPaddingChange?: (side: 'top' | 'right' | 'bottom' | 'left', value: string) => void;
  linked?: {
    margin?: boolean;
    padding?: boolean;
  };
}

export const BoxModelVisualizer: React.FC<BoxModelVisualizerProps> = ({
  margin = {},
  padding = {},
  onMarginChange,
  onPaddingChange,
  linked = { margin: false, padding: false }
}) => {
  const handleInputChange = (
    type: 'margin' | 'padding',
    side: 'top' | 'right' | 'bottom' | 'left',
    value: string
  ) => {
    // Only allow numbers and units
    const cleanValue = value.replace(/[^0-9.a-z%]/gi, '');
    
    if (type === 'margin' && onMarginChange) {
      if (linked.margin) {
        // Update all sides when linked
        ['top', 'right', 'bottom', 'left'].forEach(s => {
          onMarginChange(s as any, cleanValue);
        });
      } else {
        onMarginChange(side, cleanValue);
      }
    } else if (type === 'padding' && onPaddingChange) {
      if (linked.padding) {
        // Update all sides when linked
        ['top', 'right', 'bottom', 'left'].forEach(s => {
          onPaddingChange(s as any, cleanValue);
        });
      } else {
        onPaddingChange(side, cleanValue);
      }
    }
  };

  return (
    <div className={styles.boxModel}>
      {/* Margin Layer */}
      <div className={styles.marginBox}>
        <div className={styles.label}>MARGIN</div>
        
        {/* Margin Inputs */}
        <input
          type="text"
          className={styles.marginTop}
          value={margin.top || '0'}
          onChange={(e) => handleInputChange('margin', 'top', e.target.value)}
          placeholder="0"
          disabled={linked.margin && margin.top !== margin.right}
        />
        <input
          type="text"
          className={styles.marginRight}
          value={margin.right || '0'}
          onChange={(e) => handleInputChange('margin', 'right', e.target.value)}
          placeholder="0"
          disabled={linked.margin && margin.top !== margin.right}
        />
        <input
          type="text"
          className={styles.marginBottom}
          value={margin.bottom || '0'}
          onChange={(e) => handleInputChange('margin', 'bottom', e.target.value)}
          placeholder="0"
          disabled={linked.margin && margin.top !== margin.bottom}
        />
        <input
          type="text"
          className={styles.marginLeft}
          value={margin.left || '0'}
          onChange={(e) => handleInputChange('margin', 'left', e.target.value)}
          placeholder="0"
          disabled={linked.margin && margin.top !== margin.left}
        />

        {/* Padding Layer */}
        <div className={styles.paddingBox}>
          <div className={styles.label}>PADDING</div>
          
          {/* Padding Inputs */}
          <input
            type="text"
            className={styles.paddingTop}
            value={padding.top || '0'}
            onChange={(e) => handleInputChange('padding', 'top', e.target.value)}
            placeholder="0"
          />
          <input
            type="text"
            className={styles.paddingRight}
            value={padding.right || '0'}
            onChange={(e) => handleInputChange('padding', 'right', e.target.value)}
            placeholder="0"
          />
          <input
            type="text"
            className={styles.paddingBottom}
            value={padding.bottom || '0'}
            onChange={(e) => handleInputChange('padding', 'bottom', e.target.value)}
            placeholder="0"
          />
          <input
            type="text"
            className={styles.paddingLeft}
            value={padding.left || '0'}
            onChange={(e) => handleInputChange('padding', 'left', e.target.value)}
            placeholder="0"
          />

          {/* Content Box */}
          <div className={styles.contentBox}>
            <div className={styles.contentLabel}>CONTENT</div>
          </div>
        </div>
      </div>
    </div>
  );
};