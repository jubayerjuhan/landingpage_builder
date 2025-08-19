import React from 'react';
import styles from './FormField.module.scss';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label text for the form field */
  label?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Form control element(s) */
  children: React.ReactNode;
  
  /** Additional CSS class names */
  className?: string;
  
  /** Unique identifier for the field */
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className = '',
  id,
  ...props
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div 
      className={`${styles.formField} ${error ? styles.hasError : ''} ${className}`}
      {...props}
    >
      {label && (
        <label 
          htmlFor={fieldId} 
          className={styles.label}
        >
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.fieldWrapper}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              id: fieldId,
              'aria-invalid': !!error,
              'aria-describedby': error ? `${fieldId}-error` : undefined,
              ...child.props
            });
          }
          return child;
        })}
      </div>
      
      {error && (
        <div 
          id={`${fieldId}-error`}
          className={styles.error}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};