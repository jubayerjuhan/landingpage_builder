import React from 'react';
import type { StyleObject } from '../../../types/styles';
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  customStyles?: StyleObject;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  customStyles,
  className,
  type = 'button'
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
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

  return (
    <button
      type={type}
      className={buttonClasses}
      style={inlineStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};