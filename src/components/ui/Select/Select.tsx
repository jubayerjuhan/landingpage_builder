import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.scss';

export interface SelectOption {
  /** Display text for the option */
  label: string;
  
  /** Value for the option */
  value: string;
  
  /** Whether the option is disabled */
  disabled?: boolean;
  
  /** Optional icon for the option */
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of options to display */
  options: SelectOption[];
  
  /** Currently selected value */
  value?: string;
  
  /** Callback when selection changes */
  onChange: (value: string) => void;
  
  /** Placeholder text when no option is selected */
  placeholder?: string;
  
  /** Whether the select is disabled */
  disabled?: boolean;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Visual variant */
  variant?: 'default' | 'outline' | 'filled';
  
  /** Whether to show error state */
  error?: boolean;
  
  /** Additional CSS class names */
  className?: string;
  
  /** Whether the dropdown should open upward */
  dropUp?: boolean;
  
  /** Maximum height of the dropdown */
  maxDropdownHeight?: number;
}

export const Select: React.FC<SelectProps> = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  size = 'md',
  variant = 'default',
  error = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const selectClasses = [
    styles.select,
    styles[`select--${size}`],
    styles[`select--${variant}`],
    isOpen && styles['select--open'],
    disabled && styles['select--disabled'],
    error && styles['select--error'],
    className
  ].filter(Boolean).join(' ');

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setHighlightedIndex(-1);
      }
    }
  };

  const handleOptionClick = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleOptionClick(options[highlightedIndex]);
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div 
      ref={selectRef}
      className={selectClasses}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-disabled={disabled}
      {...props}
    >
      <div 
        className={styles.selectTrigger}
        onClick={handleToggle}
      >
        <span className={styles.selectValue}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={styles.selectIcon}
          size={16}
        />
      </div>

      {isOpen && (
        <ul 
          ref={listRef}
          className={styles.selectDropdown}
          role="listbox"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`${styles.selectOption} ${
                index === highlightedIndex ? styles['selectOption--highlighted'] : ''
              } ${
                option.value === value ? styles['selectOption--selected'] : ''
              }`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};