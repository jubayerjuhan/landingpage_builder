import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import './Accordion.module.scss';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string; }>;
}

export const Accordion: React.FC<AccordionProps> = ({ 
  title, 
  children, 
  defaultOpen = false,
  icon: Icon
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion">
      <button 
        className="accordion__header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="accordion__title-section">
          {Icon && <Icon size={16} className="accordion__title-icon" />}
          <span className="accordion__title">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown size={16} className="accordion__icon" />
        ) : (
          <ChevronRight size={16} className="accordion__icon" />
        )}
      </button>
      {isOpen && (
        <div className="accordion__content">
          {children}
        </div>
      )}
    </div>
  );
};