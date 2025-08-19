import React from 'react';
import { PanelProps } from './Panel.types';
import styles from './Panel.module.scss';

export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  const panelClasses = [
    styles.panel,
    styles[`panel--${variant}`],
    styles[`panel--padding-${padding}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={panelClasses} {...props}>
      {children}
    </div>
  );
};

// Compound components
Panel.Header = ({ children, className = '' }) => (
  <div className={`${styles.panelHeader} ${className}`}>
    {children}
  </div>
);

Panel.Title = ({ children, className = '' }) => (
  <h3 className={`${styles.panelTitle} ${className}`}>
    {children}
  </h3>
);

Panel.Actions = ({ children, className = '' }) => (
  <div className={`${styles.panelActions} ${className}`}>
    {children}
  </div>
);

Panel.Body = ({ children, className = '' }) => (
  <div className={`${styles.panelBody} ${className}`}>
    {children}
  </div>
);

Panel.Footer = ({ children, className = '' }) => (
  <div className={`${styles.panelFooter} ${className}`}>
    {children}
  </div>
);