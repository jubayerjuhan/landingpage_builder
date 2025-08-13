import React from 'react';
import type { StyleObject } from '../../../types/styles';
import styles from './Input.module.scss';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  customStyles?: StyleObject;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  label,
  error,
  customStyles,
  className
}) => {
  const inputClasses = [
    styles.input,
    error && styles.error,
    className
  ].filter(Boolean).join(' ');

  const inlineStyles: React.CSSProperties = customStyles ? {
    backgroundColor: customStyles.backgroundColor,
    padding: customStyles.padding,
    margin: customStyles.margin,
    borderRadius: customStyles.borderRadius,
    fontSize: customStyles.fontSize,
    fontWeight: customStyles.fontWeight,
    color: customStyles.color,
    width: customStyles.width,
    height: customStyles.height
  } : {};

  const inputElement = (
    <input
      type={type}
      className={inputClasses}
      style={inlineStyles}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    />
  );

  if (label || error) {
    return (
      <div className={styles.inputGroup}>
        {label && <label className={styles.label}>{label}</label>}
        {inputElement}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

  return inputElement;
};