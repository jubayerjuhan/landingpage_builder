import React, { useState } from 'react';
import { Link2, Unlink2, RotateCcw } from 'lucide-react';
import styles from './SpacingControl.module.scss';

interface SpacingValue {
  top: string | number;
  right: string | number;
  bottom: string | number;
  left: string | number;
}

interface SpacingControlProps {
  label: string;
  value: SpacingValue;
  onChange: (value: SpacingValue) => void;
  presets?: number[];
  showReset?: boolean;
}

/**
 * Professional Spacing Control Component
 * Similar to Webflow and Figma's spacing controls
 */
export const SpacingControl: React.FC<SpacingControlProps> = ({
  label,
  value,
  onChange,
  presets = [0, 8, 16, 24, 32, 48],
  showReset = true,
}) => {
  const [linked, setLinked] = useState(false);
  const [unit, setUnit] = useState<'px' | 'rem' | '%' | 'auto'>('px');
  
  // Ensure value has default structure
  const safeValue: SpacingValue = {
    top: value?.top || '0',
    right: value?.right || '0', 
    bottom: value?.bottom || '0',
    left: value?.left || '0',
  };
  
  // Parse value to number
  const parseValue = (val: string | number | undefined): number => {
    if (!val || val === 'auto') return 0;
    if (typeof val === 'number') return val;
    return parseInt(val) || 0;
  };
  
  // Format value with unit
  const formatValue = (val: number): string | number => {
    if (unit === 'auto') return 'auto';
    if (unit === 'px') return `${val}px`;
    if (unit === 'rem') return `${val / 16}rem`;
    if (unit === '%') return `${val}%`;
    return val;
  };
  
  // Handle individual side change
  const handleSideChange = (side: keyof SpacingValue, newValue: string) => {
    const numValue = parseInt(newValue) || 0;
    
    if (linked) {
      // Apply to all sides when linked
      onChange({
        top: formatValue(numValue),
        right: formatValue(numValue),
        bottom: formatValue(numValue),
        left: formatValue(numValue),
      });
    } else {
      // Apply to specific side only
      onChange({
        ...value,
        [side]: formatValue(numValue),
      });
    }
  };
  
  // Handle preset click
  const handlePresetClick = (presetValue: number) => {
    onChange({
      top: formatValue(presetValue),
      right: formatValue(presetValue),
      bottom: formatValue(presetValue),
      left: formatValue(presetValue),
    });
  };
  
  // Reset to default
  const handleReset = () => {
    onChange({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  };
  
  // Toggle linked state
  const toggleLinked = () => {
    const newLinked = !linked;
    setLinked(newLinked);
    
    // If linking, set all values to top value
    if (newLinked) {
      const topValue = safeValue.top;
      onChange({
        top: topValue,
        right: topValue,
        bottom: topValue,
        left: topValue,
      });
    }
  };
  
  return (
    <div className={styles.spacingControl}>
      <div className={styles.header}>
        <label className={styles.label}>{label}</label>
        <div className={styles.actions}>
          <button
            className={`${styles.linkButton} ${linked ? styles.linked : ''}`}
            onClick={toggleLinked}
            title={linked ? 'Unlink sides' : 'Link all sides'}
          >
            {linked ? <Link2 size={14} /> : <Unlink2 size={14} />}
          </button>
          {showReset && (
            <button
              className={styles.resetButton}
              onClick={handleReset}
              title="Reset to default"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>
      
      {/* Box Model Visual */}
      <div className={styles.boxModel}>
        <div className={styles.boxOuter}>
          {/* Top */}
          <input
            type="number"
            className={styles.inputTop}
            value={parseValue(safeValue.top)}
            onChange={(e) => handleSideChange('top', e.target.value)}
            placeholder="0"
          />
          
          <div className={styles.boxMiddle}>
            {/* Left */}
            <input
              type="number"
              className={styles.inputLeft}
              value={parseValue(safeValue.left)}
              onChange={(e) => handleSideChange('left', e.target.value)}
              placeholder="0"
              disabled={linked}
            />
            
            {/* Center box */}
            <div className={styles.boxCenter}>
              <span className={styles.boxLabel}>{label}</span>
            </div>
            
            {/* Right */}
            <input
              type="number"
              className={styles.inputRight}
              value={parseValue(safeValue.right)}
              onChange={(e) => handleSideChange('right', e.target.value)}
              placeholder="0"
              disabled={linked}
            />
          </div>
          
          {/* Bottom */}
          <input
            type="number"
            className={styles.inputBottom}
            value={parseValue(safeValue.bottom)}
            onChange={(e) => handleSideChange('bottom', e.target.value)}
            placeholder="0"
            disabled={linked}
          />
        </div>
      </div>
      
      {/* Unit Selector */}
      <div className={styles.unitSelector}>
        <button
          className={`${styles.unitButton} ${unit === 'px' ? styles.active : ''}`}
          onClick={() => setUnit('px')}
        >
          px
        </button>
        <button
          className={`${styles.unitButton} ${unit === 'rem' ? styles.active : ''}`}
          onClick={() => setUnit('rem')}
        >
          rem
        </button>
        <button
          className={`${styles.unitButton} ${unit === '%' ? styles.active : ''}`}
          onClick={() => setUnit('%')}
        >
          %
        </button>
        <button
          className={`${styles.unitButton} ${unit === 'auto' ? styles.active : ''}`}
          onClick={() => setUnit('auto')}
        >
          auto
        </button>
      </div>
      
      {/* Preset Values */}
      <div className={styles.presets}>
        {presets.map((preset) => (
          <button
            key={preset}
            className={styles.presetButton}
            onClick={() => handlePresetClick(preset)}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};