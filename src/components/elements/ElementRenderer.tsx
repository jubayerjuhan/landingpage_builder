import React from 'react';
import type { BuilderElement } from '../../types/builder';
import { ComponentType } from '../../types/builder';

// Import all element components
import {
  Section,
  Container,
  Row,
  Column,
  Spacer,
  Divider,
  Heading,
  Paragraph,
  Text,
  List,
  Quote,
  CodeBlock,
  Image,
  Video,
  Icon,
  Gallery,
  BackgroundVideo,
  Button,
  Link,
  Accordion,
  Tabs,
  Modal,
  Popup,
  Input,
  Textarea,
} from './index';

// Import Business Components
import { PricingTable } from './Business/PricingTable';
import { Testimonial } from './Business/Testimonial';
import { FAQ } from './Business/FAQ';
import { TeamMember } from './Business/TeamMember';
import { ContactCard } from './Business/ContactCard';

// Import Advanced Components
import { HTMLBlock } from './Advanced/HTMLBlock';
import { Embed } from './Advanced/Embed';
import { CustomCSS } from './Advanced/CustomCSS';

interface ElementRendererProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

/**
 * Renders a BuilderElement using the appropriate component implementation
 */
export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, children }) => {
  // Render children recursively if the element has them
  const renderChildren = () => {
    if (!element.children || element.children.length === 0) {
      return children;
    }

    return element.children.map(child => <ElementRenderer key={child.id} element={child} />);
  };

  // Render the appropriate component based on type
  switch (element.type) {
    // Layout Components
    case ComponentType.LAYOUT:
      return <Section element={element}>{renderChildren()}</Section>;

    case ComponentType.SECTION:
      return <Section element={element}>{renderChildren()}</Section>;

    case ComponentType.CONTAINER:
      return <Container element={element}>{renderChildren()}</Container>;

    case ComponentType.ROW:
      return <Row element={element}>{renderChildren()}</Row>;

    case ComponentType.COLUMN:
      return <Column element={element}>{renderChildren()}</Column>;

    case ComponentType.SPACER:
      return <Spacer element={element} />;

    case ComponentType.DIVIDER:
      return <Divider element={element} />;

    // Content Components
    case ComponentType.HEADING:
      return <Heading element={element} />;

    case ComponentType.PARAGRAPH:
      return <Paragraph element={element} />;

    case ComponentType.TEXT:
      return <Text element={element} />;

    case ComponentType.LIST:
      return <List element={element} />;

    case ComponentType.QUOTE:
      return <Quote element={element} />;

    case ComponentType.CODE_BLOCK:
      return <CodeBlock element={element} />;
    // Backward compatibility: older projects may use 'code' as the type key
    case 'code' as unknown as ComponentType:
      return <CodeBlock element={{ ...element, type: ComponentType.CODE_BLOCK }} />;

    // Media Components
    case ComponentType.IMAGE:
      return <Image element={element} />;

    case ComponentType.VIDEO:
      return <Video element={element} />;

    case ComponentType.ICON:
      return <Icon element={element} />;

    case ComponentType.GALLERY:
      return <Gallery element={element} />;

    case ComponentType.BACKGROUND_VIDEO:
      return <BackgroundVideo element={element}>{renderChildren()}</BackgroundVideo>;

    // Interactive Components
    case ComponentType.BUTTON:
      return <Button element={element} />;

    case ComponentType.LINK:
      return <Link element={element} />;

    case ComponentType.ACCORDION:
      return <Accordion element={element} />;

    case ComponentType.TABS:
      return <Tabs element={element} />;

    case ComponentType.MODAL:
      return <Modal element={element} />;

    case ComponentType.POPUP:
      return <Popup element={element} />;

    // Form Components
    case ComponentType.INPUT:
      return <Input element={element} />;

    case ComponentType.TEXTAREA:
      return <Textarea element={element} />;

    // Business Components
    case ComponentType.PRICING_TABLE:
      return <PricingTable element={element} />;

    case ComponentType.TESTIMONIAL:
      return <Testimonial element={element} />;

    case ComponentType.FAQ:
      return <FAQ element={element} />;

    case ComponentType.TEAM_MEMBER:
      return <TeamMember element={element} />;

    case ComponentType.CONTACT_CARD:
      return <ContactCard element={element} />;

    // Advanced Components
    case ComponentType.HTML_BLOCK:
      return <HTMLBlock element={element} />;

    case ComponentType.EMBED:
      return <Embed element={element} />;

    case ComponentType.CUSTOM_CSS:
      return <CustomCSS element={element} />;

    // Fallback for unimplemented components
    default:
      return (
        <div
          style={{
            padding: '1rem',
            border: '2px dashed #fbbf24',
            borderRadius: '8px',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
          data-element-id={element.id}
          data-element-type={element.type}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Component Not Implemented
          </div>
          <div style={{ fontSize: '0.875rem' }}>Type: {element.type}</div>
          {children && <div style={{ marginTop: '1rem' }}>{renderChildren()}</div>}
        </div>
      );
  }
};
