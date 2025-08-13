import { ComponentType, type AnyComponent } from '../types/components';

export const createComponentFromTemplate = (type: ComponentType): AnyComponent => {
  const id = `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const baseComponent = {
    id,
    type,
    styles: {
      margin: '8px',
      padding: '8px'
    }
  };

  switch (type) {
    case ComponentType.BUTTON:
      return {
        ...baseComponent,
        type: ComponentType.BUTTON,
        content: 'Click me',
        variant: 'primary' as const,
        size: 'md' as const,
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#007bff',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px'
        }
      };

    case ComponentType.TEXT:
      return {
        ...baseComponent,
        type: ComponentType.TEXT,
        content: 'Edit this text content',
        tag: 'p' as const,
        styles: {
          ...baseComponent.styles,
          fontSize: '16px',
          color: '#333333',
          lineHeight: '1.5'
        }
      };

    case ComponentType.HEADING:
      return {
        ...baseComponent,
        type: ComponentType.HEADING,
        content: 'Your Heading Here',
        level: 2 as const,
        styles: {
          ...baseComponent.styles,
          fontSize: '24px',
          fontWeight: '600',
          color: '#333333',
          margin: '0 0 16px 0'
        }
      };

    case ComponentType.IMAGE:
      return {
        ...baseComponent,
        type: ComponentType.IMAGE,
        src: 'https://via.placeholder.com/300x200?text=Your+Image',
        alt: 'Placeholder image',
        loading: 'lazy' as const,
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '200px',
          borderRadius: '8px'
        }
      };

    case ComponentType.INPUT:
      return {
        ...baseComponent,
        type: ComponentType.INPUT,
        placeholder: 'Enter your text...',
        value: '',
        inputType: 'text' as const,
        required: false,
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#ffffff',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '16px',
          width: '300px'
        }
      };

    case ComponentType.CONTAINER:
      return {
        ...baseComponent,
        type: ComponentType.CONTAINER,
        children: [],
        maxWidth: '100%',
        centered: false,
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '8px',
          width: '100%',
          minHeight: '120px'
        }
      };

    case ComponentType.TEXTAREA:
      return {
        ...baseComponent,
        type: ComponentType.TEXTAREA,
        placeholder: 'Enter your message...',
        value: '',
        rows: 4,
        required: false,
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#ffffff',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '16px',
          width: '300px',
          minHeight: '100px'
        }
      };

    case ComponentType.CARD:
      return {
        ...baseComponent,
        type: ComponentType.CARD,
        children: [],
        shadow: true,
        border: false,
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '300px'
        }
      };

    default:
      return {
        ...baseComponent,
        type: ComponentType.TEXT,
        content: 'Unknown component',
        tag: 'div' as const
      };
  }
};