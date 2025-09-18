import React, { useState, useEffect } from 'react';
import { Link, Unlink } from 'lucide-react';
import styles from './SpacingControl.module.scss';

export interface SpacingValues {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

interface SpacingControlProps {
  label: string;
  values: SpacingValues;
  onChange: (values: SpacingValues) => void;
  type?: 'padding' | 'margin';
}

export const SpacingControl: React.FC<SpacingControlProps> = ({
  label,
  values,
  onChange,
  type = 'padding'
}) => {
  const [isLinked, setIsLinked] = useState(false); // Start unlinked by default
  const [localValues, setLocalValues] = useState<SpacingValues>({
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    ...values
  });

  // Update local values when props change
  useEffect(() => {
    setLocalValues(prev => ({ ...prev, ...values }));
  }, [values]);

  // Note: Removed auto-linking logic to allow individual control

  const handleValueChange = (side: keyof SpacingValues, value: string) => {
    const numValue = value === '' ? '0' : value;
    const pxValue = numValue + 'px';

    let newValues: SpacingValues;

    if (isLinked) {
      // When linked, update all sides
      newValues = {
        top: pxValue,
        right: pxValue,
        bottom: pxValue,
        left: pxValue
      };
    } else {
      // When unlinked, update only the specific side
      newValues = {
        ...localValues,
        [side]: pxValue
      };
    }

    setLocalValues(newValues);
    onChange(newValues);
  };

  const toggleLinked = () => {
    setIsLinked(!isLinked);

    if (!isLinked) {
      // When switching to linked, use the top value for all sides
      const uniformValue = localValues.top || '0px';
      const newValues = {
        top: uniformValue,
        right: uniformValue,
        bottom: uniformValue,
        left: uniformValue
      };
      setLocalValues(newValues);
      onChange(newValues);
    }
  };

  const getDisplayValue = (value?: string) => {
    if (!value) return '';
    return value.replace('px', '');
  };

  return (
    <div className={styles.spacingControl}>
      <div className={styles.header}>
        <label className={styles.label}>{label}</label>
        <button
          type="button"
          className={`${styles.linkButton} ${isLinked ? styles.linked : styles.unlinked}`}
          onClick={toggleLinked}
          title={isLinked ? 'Unlink values' : 'Link values'}
        >
          {isLinked ? <Link size={14} /> : <Unlink size={14} />}
        </button>
      </div>

      <div className={styles.boxModel}>
        {/* Top input */}
        <div className={styles.inputTop}>
          <input
            type="number"
            value={getDisplayValue(localValues.top)}
            onChange={(e) => handleValueChange('top', e.target.value)}
            className={styles.input}
            placeholder="Top"
            min="0"
            title={`Top: ${localValues.top || '0px'}`}
          />
        </div>

        {/* Left input */}
        <div className={styles.inputLeft}>
          <input
            type="number"
            value={getDisplayValue(localValues.left)}
            onChange={(e) => handleValueChange('left', e.target.value)}
            className={styles.input}
            placeholder="Left"
            min="0"
            title={`Left: ${localValues.left || '0px'}`}
          />
        </div>

        {/* Center area (content representation) */}
        <div className={styles.contentArea}>
          <div className={styles.contentBox}>
            <span className={styles.contentLabel}>Content</span>
          </div>
        </div>

        {/* Right input */}
        <div className={styles.inputRight}>
          <input
            type="number"
            value={getDisplayValue(localValues.right)}
            onChange={(e) => handleValueChange('right', e.target.value)}
            className={styles.input}
            placeholder="Right"
            min="0"
            title={`Right: ${localValues.right || '0px'}`}
          />
        </div>

        {/* Bottom input */}
        <div className={styles.inputBottom}>
          <input
            type="number"
            value={getDisplayValue(localValues.bottom)}
            onChange={(e) => handleValueChange('bottom', e.target.value)}
            className={styles.input}
            placeholder="Bottom"
            min="0"
            title={`Bottom: ${localValues.bottom || '0px'}`}
          />
        </div>
      </div>
    </div>
  );
};