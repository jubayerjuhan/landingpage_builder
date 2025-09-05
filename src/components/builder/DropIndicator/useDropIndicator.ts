import React, { useState } from 'react';
import { DropIndicator } from './DropIndicator';

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
    <React.Fragment>
      {indicators.map(indicator => (
        <DropIndicator
          key={indicator.id}
          isVisible={true}
          position={indicator.position}
          bounds={indicator.bounds}
          orientation={indicator.orientation}
        />
      ))}
    </React.Fragment>
  );

  return {
    showIndicator,
    hideIndicator,
    clearAllIndicators,
    DropIndicators,
    hasIndicators: indicators.length > 0
  };
};