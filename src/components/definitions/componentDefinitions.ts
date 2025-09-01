import { 
  Type, 
  Layout, 
  Image, 
  Square, 
  MousePointer,
  AlignLeft,
  Link2,
  Container,
  Columns,
  Minus,
  List,
  Quote,
  Code,
  Play,
  Star,
  Grid3x3,
  FileImage,
  Zap,
  Menu,
  MoreHorizontal,
  FileText,
  Phone,
  DollarSign,
  MessageCircle,
  HelpCircle,
  Users,
  CreditCard,
  Code2,
  Palette,
  Settings
} from 'lucide-react';

import type {
  ComponentDefinition,
  ComponentCategoryInfo,
  PropertySchema
} from '../../types/builder';
import {
  ComponentType,
  ComponentCategory,
  PropertyFieldType,
  ViewportMode
} from '../../types/builder';

// Component category definitions
export const COMPONENT_CATEGORIES: Record<ComponentCategory, ComponentCategoryInfo> = {
  [ComponentCategory.LAYOUT]: {
    id: ComponentCategory.LAYOUT,
    name: 'Layout',
    icon: Layout,
    description: 'Structure and organize your content',
    defaultOpen: true,
    order: 1
  },
  [ComponentCategory.CONTENT]: {
    id: ComponentCategory.CONTENT,
    name: 'Content',
    icon: Type,
    description: 'Text, headings, and content elements',
    defaultOpen: true,
    order: 2
  },
  [ComponentCategory.MEDIA]: {
    id: ComponentCategory.MEDIA,
    name: 'Media',
    icon: Image,
    description: 'Images, videos, and multimedia',
    defaultOpen: true,
    order: 3
  },
  [ComponentCategory.INTERACTIVE]: {
    id: ComponentCategory.INTERACTIVE,
    name: 'Interactive',
    icon: MousePointer,
    description: 'Buttons, links, and interactive elements',
    defaultOpen: true,
    order: 4
  },
  [ComponentCategory.FORMS]: {
    id: ComponentCategory.FORMS,
    name: 'Forms',
    icon: FileText,
    description: 'Form inputs and submission elements',
    defaultOpen: false,
    order: 5
  },
  [ComponentCategory.BUSINESS]: {
    id: ComponentCategory.BUSINESS,
    name: 'Business',
    icon: DollarSign,
    description: 'Business-focused components',
    defaultOpen: false,
    order: 6
  },
  [ComponentCategory.ADVANCED]: {
    id: ComponentCategory.ADVANCED,
    name: 'Advanced',
    icon: Settings,
    description: 'Advanced and custom components',
    defaultOpen: false,
    order: 7
  }
};

// Base property schemas
const baseContentProperties: PropertySchema = {
  content: {
    label: 'Content',
    icon: Type,
    order: 1,
    fields: {
      text: {
        type: PropertyFieldType.TEXTAREA,
        label: 'Text Content',
        placeholder: 'Enter your text...',
        rows: 3
      }
    }
  },
  appearance: {
    label: 'Appearance',
    icon: Palette,
    order: 2,
    fields: {
      backgroundColor: {
        type: PropertyFieldType.COLOR,
        label: 'Background Color',
        defaultValue: 'transparent'
      },
      textColor: {
        type: PropertyFieldType.COLOR,
        label: 'Text Color',
        defaultValue: '#333333'
      }
    }
  },
  spacing: {
    label: 'Spacing',
    icon: Square,
    order: 3,
    fields: {
      margin: {
        type: PropertyFieldType.SPACING,
        label: 'Margin',
        responsive: true
      },
      padding: {
        type: PropertyFieldType.SPACING,
        label: 'Padding',
        responsive: true
      }
    }
  }
};

// Component definitions
export const COMPONENT_DEFINITIONS: Record<ComponentType, ComponentDefinition> = {
  // Layout Components
  [ComponentType.SECTION]: {
    type: ComponentType.SECTION,
    name: 'Section',
    icon: Container,
    category: ComponentCategory.LAYOUT,
    description: 'A full-width section container for organizing content',
    tags: ['layout', 'container', 'structure'],
    canHaveChildren: true,
    acceptsChildren: [
      ComponentType.CONTAINER,
      ComponentType.ROW,
      ComponentType.HEADING,
      ComponentType.PARAGRAPH,
      ComponentType.IMAGE,
      ComponentType.BUTTON
    ],
    defaultProps: {
      type: ComponentType.SECTION,
      content: '',
      properties: {
        layout: {
          display: 'block',
          width: '100%'
        },
        spacing: {
          padding: '0'
        }
      },
      styles: {
        [ViewportMode.DESKTOP]: {
          display: 'block',
          width: '100%',
          padding: '0'
        }
      }
    },
    propertySchema: {
      ...baseContentProperties,
      layout: {
        label: 'Layout',
        icon: Layout,
        order: 4,
        fields: {
          fullWidth: {
            type: PropertyFieldType.CHECKBOX,
            label: 'Full Width',
            defaultValue: true
          },
          maxWidth: {
            type: PropertyFieldType.TEXT,
            label: 'Max Width',
            placeholder: '1200px',
            conditional: {
              field: 'fullWidth',
              value: false,
              operator: 'equals'
            }
          }
        }
      }
    }
  },

  [ComponentType.CONTAINER]: {
    type: ComponentType.CONTAINER,
    name: 'Container',
    icon: Square,
    category: ComponentCategory.LAYOUT,
    description: 'A flexible container for grouping elements',
    tags: ['layout', 'container', 'wrapper'],
    canHaveChildren: true,
    acceptsChildren: [
      ComponentType.ROW,
      ComponentType.COLUMN,
      ComponentType.HEADING,
      ComponentType.PARAGRAPH,
      ComponentType.IMAGE,
      ComponentType.BUTTON,
      ComponentType.CONTAINER
    ],
    defaultProps: {
      type: ComponentType.CONTAINER,
      content: '',
      properties: {
        layout: {
          display: 'flex',
          flexDirection: 'column'
        },
        spacing: {
          padding: '0'
        }
      },
      styles: {
        [ViewportMode.DESKTOP]: {
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          gap: '1rem'
        }
      }
    },
    propertySchema: {
      ...baseContentProperties,
      layout: {
        label: 'Flex Layout',
        icon: Layout,
        order: 4,
        fields: {
          direction: {
            type: PropertyFieldType.SELECT,
            label: 'Direction',
            options: [
              { label: 'Column', value: 'column' },
              { label: 'Row', value: 'row' },
              { label: 'Column Reverse', value: 'column-reverse' },
              { label: 'Row Reverse', value: 'row-reverse' }
            ],
            defaultValue: 'column'
          },
          justifyContent: {
            type: PropertyFieldType.SELECT,
            label: 'Justify Content',
            options: [
              { label: 'Start', value: 'flex-start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'flex-end' },
              { label: 'Space Between', value: 'space-between' },
              { label: 'Space Around', value: 'space-around' }
            ],
            defaultValue: 'flex-start'
          },
          alignItems: {
            type: PropertyFieldType.SELECT,
            label: 'Align Items',
            options: [
              { label: 'Stretch', value: 'stretch' },
              { label: 'Start', value: 'flex-start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'flex-end' }
            ],
            defaultValue: 'stretch'
          },
          gap: {
            type: PropertyFieldType.TEXT,
            label: 'Gap',
            placeholder: '1rem',
            defaultValue: '1rem'
          }
        }
      }
    }
  },

  [ComponentType.ROW]: {
    type: ComponentType.ROW,
    name: 'Row',
    icon: Columns,
    category: ComponentCategory.LAYOUT,
    description: 'A horizontal row container for columns',
    tags: ['layout', 'row', 'columns'],
    canHaveChildren: true,
    acceptsChildren: [ComponentType.COLUMN],
    defaultProps: {
      type: ComponentType.ROW,
      content: '',
      properties: {
        layout: {
          display: 'flex',
          flexDirection: 'row'
        }
      },
      styles: {
        [ViewportMode.DESKTOP]: {
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem'
        }
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.COLUMN]: {
    type: ComponentType.COLUMN,
    name: 'Column',
    icon: Square,
    category: ComponentCategory.LAYOUT,
    description: 'A column within a row',
    tags: ['layout', 'column'],
    canHaveChildren: true,
    canBeChildOf: [ComponentType.ROW],
    defaultProps: {
      type: ComponentType.COLUMN,
      content: '',
      properties: {
        layout: {
          flex: '1'
        }
      },
      styles: {
        [ViewportMode.DESKTOP]: {
          flex: '1',
          padding: '0'
        }
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.SPACER]: {
    type: ComponentType.SPACER,
    name: 'Spacer',
    icon: Minus,
    category: ComponentCategory.LAYOUT,
    description: 'Add vertical or horizontal space',
    tags: ['layout', 'spacing'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.SPACER,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {
          height: '2rem'
        }
      }
    },
    propertySchema: {
      spacing: {
        label: 'Spacing',
        icon: Square,
        order: 1,
        fields: {
          height: {
            type: PropertyFieldType.TEXT,
            label: 'Height',
            placeholder: '2rem',
            defaultValue: '2rem'
          }
        }
      }
    }
  },

  [ComponentType.DIVIDER]: {
    type: ComponentType.DIVIDER,
    name: 'Divider',
    icon: Minus,
    category: ComponentCategory.LAYOUT,
    description: 'A visual separator line',
    tags: ['layout', 'separator', 'line'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.DIVIDER,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {
          height: '1px',
          backgroundColor: '#e0e0e0',
          margin: '0'
        }
      }
    },
    propertySchema: baseContentProperties
  },

  // Content Components
  [ComponentType.HEADING]: {
    type: ComponentType.HEADING,
    name: 'Heading',
    icon: Type,
    category: ComponentCategory.CONTENT,
    description: 'Headings from H1 to H6',
    tags: ['text', 'heading', 'title'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.HEADING,
      content: 'Your Heading Here',
      properties: {
        content: {
          text: 'Your Heading Here'
        },
        typography: {
          fontSize: '2rem',
          fontWeight: 'bold'
        }
      },
      styles: {
        [ViewportMode.DESKTOP]: {
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '0',
          padding: '0',
          color: '#333'
        }
      }
    },
    propertySchema: {
      ...baseContentProperties,
      typography: {
        label: 'Typography',
        icon: Type,
        order: 2,
        fields: {
          level: {
            type: PropertyFieldType.SELECT,
            label: 'Heading Level',
            options: [
              { label: 'H1', value: '1' },
              { label: 'H2', value: '2' },
              { label: 'H3', value: '3' },
              { label: 'H4', value: '4' },
              { label: 'H5', value: '5' },
              { label: 'H6', value: '6' }
            ],
            defaultValue: '2'
          },
          fontSize: {
            type: PropertyFieldType.TEXT,
            label: 'Font Size',
            placeholder: '2rem',
            responsive: true
          },
          fontWeight: {
            type: PropertyFieldType.SELECT,
            label: 'Font Weight',
            options: [
              { label: 'Normal', value: 'normal' },
              { label: 'Bold', value: 'bold' },
              { label: 'Light', value: '300' },
              { label: 'Medium', value: '500' },
              { label: 'Semi Bold', value: '600' },
              { label: 'Extra Bold', value: '800' }
            ],
            defaultValue: 'bold'
          },
          textAlign: {
            type: PropertyFieldType.SELECT,
            label: 'Text Align',
            options: [
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' }
            ],
            defaultValue: 'left'
          }
        }
      }
    }
  },

  [ComponentType.PARAGRAPH]: {
    type: ComponentType.PARAGRAPH,
    name: 'Paragraph',
    icon: AlignLeft,
    category: ComponentCategory.CONTENT,
    description: 'Regular paragraph text',
    tags: ['text', 'paragraph', 'content'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.PARAGRAPH,
      content: 'Add your paragraph content here. You can write as much text as you need.',
      properties: {
        content: {
          text: 'Add your paragraph content here. You can write as much text as you need.'
        }
      },
      styles: {
        [ViewportMode.DESKTOP]: {
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#666',
          margin: '0', padding: '0'
        }
      }
    },
    propertySchema: {
      ...baseContentProperties,
      typography: {
        label: 'Typography',
        icon: Type,
        order: 2,
        fields: {
          fontSize: {
            type: PropertyFieldType.TEXT,
            label: 'Font Size',
            placeholder: '1rem',
            responsive: true
          },
          lineHeight: {
            type: PropertyFieldType.TEXT,
            label: 'Line Height',
            placeholder: '1.6'
          },
          textAlign: {
            type: PropertyFieldType.SELECT,
            label: 'Text Align',
            options: [
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
              { label: 'Justify', value: 'justify' }
            ],
            defaultValue: 'left'
          }
        }
      }
    }
  },

  [ComponentType.TEXT]: {
    type: ComponentType.TEXT,
    name: 'Text',
    icon: Type,
    category: ComponentCategory.CONTENT,
    description: 'Inline text element',
    tags: ['text', 'inline'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.TEXT,
      content: 'Text content',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.LIST]: {
    type: ComponentType.LIST,
    name: 'List',
    icon: List,
    category: ComponentCategory.CONTENT,
    description: 'Ordered or unordered list',
    tags: ['list', 'bullet', 'numbered'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.LIST,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.QUOTE]: {
    type: ComponentType.QUOTE,
    name: 'Quote',
    icon: Quote,
    category: ComponentCategory.CONTENT,
    description: 'Blockquote for testimonials and quotes',
    tags: ['quote', 'testimonial', 'blockquote'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.QUOTE,
      content: '"This is a quote or testimonial."',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.CODE_BLOCK]: {
    type: ComponentType.CODE_BLOCK,
    name: 'Code Block',
    icon: Code,
    category: ComponentCategory.CONTENT,
    description: 'Display formatted code',
    tags: ['code', 'pre', 'programming'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.CODE_BLOCK,
      content: 'console.log("Hello World");',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  // Media Components
  [ComponentType.IMAGE]: {
    type: ComponentType.IMAGE,
    name: 'Image',
    icon: Image,
    category: ComponentCategory.MEDIA,
    description: 'Display images with responsive options',
    tags: ['media', 'image', 'photo'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.IMAGE,
      content: '',
      properties: {
        content: {
          src: 'https://via.placeholder.com/400x300',
          alt: 'Placeholder image'
        }
      },
      styles: {
        [ViewportMode.DESKTOP]: {
          maxWidth: '100%',
          height: 'auto'
        }
      }
    },
    propertySchema: {
      image: {
        label: 'Image',
        icon: Image,
        order: 1,
        fields: {
          src: {
            type: PropertyFieldType.IMAGE,
            label: 'Image Source',
            placeholder: 'Enter image URL or upload...'
          },
          alt: {
            type: PropertyFieldType.TEXT,
            label: 'Alt Text',
            placeholder: 'Describe the image...'
          }
        }
      },
      ...baseContentProperties
    }
  },

  [ComponentType.VIDEO]: {
    type: ComponentType.VIDEO,
    name: 'Video',
    icon: Play,
    category: ComponentCategory.MEDIA,
    description: 'Embed videos from YouTube, Vimeo, or direct files',
    tags: ['media', 'video', 'embed'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.VIDEO,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.ICON]: {
    type: ComponentType.ICON,
    name: 'Icon',
    icon: Star,
    category: ComponentCategory.MEDIA,
    description: 'Display icons from icon libraries',
    tags: ['icon', 'symbol', 'graphic'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.ICON,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.GALLERY]: {
    type: ComponentType.GALLERY,
    name: 'Gallery',
    icon: Grid3x3,
    category: ComponentCategory.MEDIA,
    description: 'Image gallery with grid layout',
    tags: ['gallery', 'images', 'grid'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.GALLERY,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.BACKGROUND_VIDEO]: {
    type: ComponentType.BACKGROUND_VIDEO,
    name: 'Background Video',
    icon: FileImage,
    category: ComponentCategory.MEDIA,
    description: 'Video background for sections',
    tags: ['video', 'background', 'hero'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.BACKGROUND_VIDEO,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  // Interactive Components
  [ComponentType.BUTTON]: {
    type: ComponentType.BUTTON,
    name: 'Button',
    icon: MousePointer,
    category: ComponentCategory.INTERACTIVE,
    description: 'Call-to-action buttons with various styles',
    tags: ['button', 'cta', 'click', 'action'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.BUTTON,
      content: 'Click me',
      properties: {
        content: {
          text: 'Click me',
          href: '#'
        }
      },
      styles: {
        [ViewportMode.DESKTOP]: {
          padding: '0',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontSize: '1rem',
          textDecoration: 'none',
          display: 'inline-block'
        }
      }
    },
    propertySchema: {
      ...baseContentProperties,
      button: {
        label: 'Button',
        icon: MousePointer,
        order: 2,
        fields: {
          variant: {
            type: PropertyFieldType.SELECT,
            label: 'Style',
            options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Secondary', value: 'secondary' },
              { label: 'Outline', value: 'outline' },
              { label: 'Ghost', value: 'ghost' }
            ],
            defaultValue: 'primary'
          },
          size: {
            type: PropertyFieldType.SELECT,
            label: 'Size',
            options: [
              { label: 'Small', value: 'sm' },
              { label: 'Medium', value: 'md' },
              { label: 'Large', value: 'lg' }
            ],
            defaultValue: 'md'
          },
          href: {
            type: PropertyFieldType.URL,
            label: 'Link URL',
            placeholder: 'https://example.com'
          }
        }
      }
    }
  },

  [ComponentType.LINK]: {
    type: ComponentType.LINK,
    name: 'Link',
    icon: Link2,
    category: ComponentCategory.INTERACTIVE,
    description: 'Text links for navigation',
    tags: ['link', 'anchor', 'navigation'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.LINK,
      content: 'Link text',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  // Add more component definitions for remaining types...
  // Form Components
  [ComponentType.INPUT]: {
    type: ComponentType.INPUT,
    name: 'Input',
    icon: FileText,
    category: ComponentCategory.FORMS,
    description: 'Text input field',
    tags: ['form', 'input', 'text'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.INPUT,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.TEXTAREA]: {
    type: ComponentType.TEXTAREA,
    name: 'Textarea',
    icon: FileText,
    category: ComponentCategory.FORMS,
    description: 'Multi-line text input',
    tags: ['form', 'textarea', 'multiline'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.TEXTAREA,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.SELECT]: {
    type: ComponentType.SELECT,
    name: 'Select',
    icon: MoreHorizontal,
    category: ComponentCategory.FORMS,
    description: 'Dropdown selection',
    tags: ['form', 'select', 'dropdown'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.SELECT,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.CHECKBOX]: {
    type: ComponentType.CHECKBOX,
    name: 'Checkbox',
    icon: Square,
    category: ComponentCategory.FORMS,
    description: 'Checkbox input',
    tags: ['form', 'checkbox', 'boolean'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.CHECKBOX,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.RADIO]: {
    type: ComponentType.RADIO,
    name: 'Radio',
    icon: Square,
    category: ComponentCategory.FORMS,
    description: 'Radio button input',
    tags: ['form', 'radio', 'choice'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.RADIO,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.FORM]: {
    type: ComponentType.FORM,
    name: 'Form',
    icon: FileText,
    category: ComponentCategory.FORMS,
    description: 'Form container with submission handling',
    tags: ['form', 'container', 'submission'],
    canHaveChildren: true,
    acceptsChildren: [
      ComponentType.INPUT,
      ComponentType.TEXTAREA,
      ComponentType.SELECT,
      ComponentType.CHECKBOX,
      ComponentType.RADIO,
      ComponentType.BUTTON
    ],
    defaultProps: {
      type: ComponentType.FORM,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  // Business Components (simplified for now)
  [ComponentType.PRICING_TABLE]: {
    type: ComponentType.PRICING_TABLE,
    name: 'Pricing Table',
    icon: CreditCard,
    category: ComponentCategory.BUSINESS,
    description: 'Pricing plans comparison table',
    tags: ['pricing', 'plans', 'business'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.PRICING_TABLE,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.TESTIMONIAL]: {
    type: ComponentType.TESTIMONIAL,
    name: 'Testimonial',
    icon: MessageCircle,
    category: ComponentCategory.BUSINESS,
    description: 'Customer testimonial with photo and quote',
    tags: ['testimonial', 'review', 'social proof'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.TESTIMONIAL,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.FAQ]: {
    type: ComponentType.FAQ,
    name: 'FAQ',
    icon: HelpCircle,
    category: ComponentCategory.BUSINESS,
    description: 'Frequently asked questions accordion',
    tags: ['faq', 'questions', 'accordion'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.FAQ,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.TEAM_MEMBER]: {
    type: ComponentType.TEAM_MEMBER,
    name: 'Team Member',
    icon: Users,
    category: ComponentCategory.BUSINESS,
    description: 'Team member card with photo and info',
    tags: ['team', 'member', 'profile'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.TEAM_MEMBER,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.CONTACT_CARD]: {
    type: ComponentType.CONTACT_CARD,
    name: 'Contact Card',
    icon: Phone,
    category: ComponentCategory.BUSINESS,
    description: 'Contact information display card',
    tags: ['contact', 'info', 'card'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.CONTACT_CARD,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  // Advanced Components (simplified for now)
  [ComponentType.ACCORDION]: {
    type: ComponentType.ACCORDION,
    name: 'Accordion',
    icon: Menu,
    category: ComponentCategory.ADVANCED,
    description: 'Collapsible content sections',
    tags: ['accordion', 'collapsible', 'expand'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.ACCORDION,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.TABS]: {
    type: ComponentType.TABS,
    name: 'Tabs',
    icon: Menu,
    category: ComponentCategory.ADVANCED,
    description: 'Tabbed content interface',
    tags: ['tabs', 'navigation', 'content'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.TABS,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.MODAL]: {
    type: ComponentType.MODAL,
    name: 'Modal',
    icon: Square,
    category: ComponentCategory.ADVANCED,
    description: 'Modal dialog overlay',
    tags: ['modal', 'dialog', 'overlay'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.MODAL,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.POPUP]: {
    type: ComponentType.POPUP,
    name: 'Popup',
    icon: Zap,
    category: ComponentCategory.ADVANCED,
    description: 'Popup notification or tooltip',
    tags: ['popup', 'notification', 'tooltip'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.POPUP,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.HTML_BLOCK]: {
    type: ComponentType.HTML_BLOCK,
    name: 'HTML Block',
    icon: Code2,
    category: ComponentCategory.ADVANCED,
    description: 'Custom HTML code block',
    tags: ['html', 'custom', 'code'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.HTML_BLOCK,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.EMBED]: {
    type: ComponentType.EMBED,
    name: 'Embed',
    icon: Code,
    category: ComponentCategory.ADVANCED,
    description: 'Embed external content',
    tags: ['embed', 'iframe', 'external'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.EMBED,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  },

  [ComponentType.CUSTOM_CSS]: {
    type: ComponentType.CUSTOM_CSS,
    name: 'Custom CSS',
    icon: Palette,
    category: ComponentCategory.ADVANCED,
    description: 'Custom CSS styles block',
    tags: ['css', 'custom', 'styles'],
    canHaveChildren: false,
    defaultProps: {
      type: ComponentType.CUSTOM_CSS,
      content: '',
      properties: {},
      styles: {
        [ViewportMode.DESKTOP]: {}
      }
    },
    propertySchema: baseContentProperties
  }
};

// Utility functions
export const getComponentDefinition = (type: ComponentType): ComponentDefinition => {
  return COMPONENT_DEFINITIONS[type];
};

export const getComponentsByCategory = (category: ComponentCategory): ComponentDefinition[] => {
  return Object.values(COMPONENT_DEFINITIONS).filter(def => def.category === category);
};

export const getCategoryInfo = (category: ComponentCategory): ComponentCategoryInfo => {
  return COMPONENT_CATEGORIES[category];
};

export const getAllCategories = (): ComponentCategoryInfo[] => {
  return Object.values(COMPONENT_CATEGORIES).sort((a, b) => a.order - b.order);
};

export const searchComponents = (query: string): ComponentDefinition[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(COMPONENT_DEFINITIONS).filter(def => 
    def.name.toLowerCase().includes(lowerQuery) ||
    def.description.toLowerCase().includes(lowerQuery) ||
    def.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};