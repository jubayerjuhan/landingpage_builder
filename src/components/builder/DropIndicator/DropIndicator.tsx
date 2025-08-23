import React, { useEffect, useState } from 'react';
import styles from './DropIndicator.module.scss';

interface DropIndicatorProps {
  isVisible: boolean;
  position: 'before' | 'after' | 'inside';
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  orientation?: 'horizontal' | 'vertical';
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({
  isVisible,
  position,
  bounds,
  orientation = 'horizontal'
}) => {
  const [animationClass, setAnimationClass] = useState('');

  // Animate indicator on show/hide
  useEffect(() => {
    if (isVisible) {
      setAnimationClass(styles.fadeIn);
      const timer = setTimeout(() => setAnimationClass(''), 200);
      return () => clearTimeout(timer);
    } else {
      setAnimationClass(styles.fadeOut);
    }
  }, [isVisible]);

  if (!isVisible || !bounds) {
    return null;
  }

  const getIndicatorStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: '#5457ff',
      borderRadius: '2px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(84, 87, 255, 0.3)',
      transition: 'all 0.2s ease'
    };

    if (orientation === 'horizontal') {
      // Horizontal drop indicator (for vertical layouts)
      if (position === 'before') {
        return {
          ...baseStyle,
          left: bounds.x,
          top: bounds.y - 2,
          width: bounds.width,
          height: 4
        };
      } else if (position === 'after') {
        return {
          ...baseStyle,
          left: bounds.x,
          top: bounds.y + bounds.height - 2,
          width: bounds.width,
          height: 4
        };
      } else {
        // Inside - show as border highlight
        return {
          ...baseStyle,
          left: bounds.x - 2,
          top: bounds.y - 2,
          width: bounds.width + 4,
          height: bounds.height + 4,
          backgroundColor: 'transparent',
          border: '2px solid #5457ff',
          borderRadius: '6px'
        };
      }
    } else {
      // Vertical drop indicator (for horizontal layouts)
      if (position === 'before') {
        return {
          ...baseStyle,
          left: bounds.x - 2,
          top: bounds.y,
          width: 4,
          height: bounds.height
        };
      } else if (position === 'after') {
        return {
          ...baseStyle,
          left: bounds.x + bounds.width - 2,
          top: bounds.y,
          width: 4,
          height: bounds.height
        };
      } else {
        // Inside - show as border highlight
        return {
          ...baseStyle,
          left: bounds.x - 2,
          top: bounds.y - 2,
          width: bounds.width + 4,
          height: bounds.height + 4,
          backgroundColor: 'transparent',
          border: '2px solid #5457ff',
          borderRadius: '6px'
        };
      }
    }
  };

  return (
    <div
      className={`${styles.dropIndicator} ${animationClass} ${styles[position]}`}
      style={getIndicatorStyle()}
    >
      {position === 'inside' && (
        <div className={styles.dropMessage}>
          Drop here
        </div>
      )}
    </div>
  );
};

// Hook for managing drop indicators
export const useDropIndicator = () => {
  const [indicators, setIndicators] = useState<Array<{
    id: string;
    position: 'before' | 'after' | 'inside';
    bounds: { x: number; y: number; width: number; height: number };
    orientation: 'horizontal' | 'vertical';
  }>>([]);

  const showIndicator = (
    id: string,
    position: 'before' | 'after' | 'inside',
    bounds: { x: number; y: number; width: number; height: number },
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ) => {
    setIndicators(prev => [
      ...prev.filter(indicator => indicator.id !== id),
      { id, position, bounds, orientation }
    ]);
  };

  const hideIndicator = (id: string) => {
    setIndicators(prev => prev.filter(indicator => indicator.id !== id));
  };

  const clearAllIndicators = () => {
    setIndicators([]);
  };

  const DropIndicators = () => (
    <>
      {indicators.map(indicator => (
        <DropIndicator
          key={indicator.id}
          isVisible={true}
          position={indicator.position}
          bounds={indicator.bounds}
          orientation={indicator.orientation}
        />
      ))}
    </>
  );

  return {
    showIndicator,
    hideIndicator,
    clearAllIndicators,
    DropIndicators,
    hasIndicators: indicators.length > 0
  };
};