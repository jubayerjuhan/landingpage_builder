import React, { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Search, 
  Layout, 
  Palette, 
  FileText,
  // Layout Components
  Square as SingleColumnIcon,
  Columns2, 
  Columns3, 
  Columns4,
  // Content Components
  Type, 
  AlignLeft, 
  List,
  Quote,
  Code2,
  // Media Components
  Image, 
  Video, 
  Camera,
  Play,
  // Interactive Components
  Square, 
  Link, 
  ChevronDown,
  Grid3X3,
  MessageCircle,
  Eye,
  // Form Components
  Square as FormInput,
  AlignLeft as TextareaIcon,
  CheckSquare,
  Calendar,
  // Business Components
  DollarSign,
  Star,
  Users,
  HelpCircle,
  Phone
} from 'lucide-react';
import styles from './Sidebar.module.scss';

type TabId = 'layouts' | 'components' | 'templates';

interface DraggableItemProps {
  id: string;
  type: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
}

interface ComponentCategory {
  title: string;
  items: Array<{
    id: string;
    type: string;
    icon: React.ReactNode;
    label: string;
    description?: string;
  }>;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, type, icon, label, description }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { type }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.elementCard} ${isDragging ? styles.dragging : ''}`}
      title={description}
    >
      <div className={styles.elementIcon}>
        {icon}
      </div>
      <div className={styles.elementInfo}>
        <span className={styles.elementLabel}>{label}</span>
        {description && (
          <span className={styles.elementDescription}>{description}</span>
        )}
      </div>
    </div>
  );
};

const LayoutCard: React.FC<DraggableItemProps> = ({ id, type, icon, label, description }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { type }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.layoutCard} ${isDragging ? styles.dragging : ''}`}
      title={description}
    >
      <div className={styles.layoutIcon}>
        {icon}
      </div>
      <div className={styles.layoutInfo}>
        <span className={styles.layoutLabel}>{label}</span>
        <span className={styles.layoutDescription}>{description}</span>
      </div>
    </div>
  );
};

const LayoutTab: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const layouts = [
    { id: 'single-column-layout', type: 'single-column', icon: <SingleColumnIcon size={32} />, label: 'Single Column', description: 'One column layout' },
    { id: 'two-column-layout', type: 'two-column', icon: <Columns2 size={32} />, label: '2 Columns', description: 'Two equal columns' },
    { id: 'three-column-layout', type: 'three-column', icon: <Columns3 size={32} />, label: '3 Columns', description: 'Three equal columns' },
    { id: 'four-column-layout', type: 'four-column', icon: <Columns4 size={32} />, label: '4 Columns', description: 'Four equal columns' },
  ];

  const filteredLayouts = layouts.filter(layout => 
    layout.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.tabContent}>
      <div className={styles.layoutGrid}>
        {filteredLayouts.map(layout => (
          <LayoutCard key={layout.id} {...layout} />
        ))}
      </div>
      {filteredLayouts.length === 0 && (
        <div className={styles.emptyState}>
          <Layout size={48} />
          <p>No layouts found</p>
        </div>
      )}
    </div>
  );
};

const ComponentsTab: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const categories: ComponentCategory[] = [
    {
      title: 'Content',
      items: [
        { id: 'heading-element', type: 'heading', icon: <Type size={20} />, label: 'Heading', description: 'Page title or section header' },
        { id: 'paragraph-element', type: 'paragraph', icon: <AlignLeft size={20} />, label: 'Paragraph', description: 'Body text content' },
        { id: 'text-element', type: 'text', icon: <FileText size={20} />, label: 'Text', description: 'Inline text element' },
        { id: 'list-element', type: 'list', icon: <List size={20} />, label: 'List', description: 'Bulleted or numbered list' },
        { id: 'quote-element', type: 'quote', icon: <Quote size={20} />, label: 'Quote', description: 'Blockquote or testimonial' },
        { id: 'code-element', type: 'code', icon: <Code2 size={20} />, label: 'Code Block', description: 'Syntax highlighted code' },
      ]
    },
    {
      title: 'Media',
      items: [
        { id: 'image-element', type: 'image', icon: <Image size={20} />, label: 'Image', description: 'Single image with caption' },
        { id: 'video-element', type: 'video', icon: <Video size={20} />, label: 'Video', description: 'Embedded video player' },
        { id: 'gallery-element', type: 'gallery', icon: <Camera size={20} />, label: 'Gallery', description: 'Image gallery grid' },
        { id: 'background-video-element', type: 'background-video', icon: <Play size={20} />, label: 'Background Video', description: 'Full-width background video' },
      ]
    },
    {
      title: 'Interactive',
      items: [
        { id: 'button-element', type: 'button', icon: <Square size={20} />, label: 'Button', description: 'Call-to-action button' },
        { id: 'link-element', type: 'link', icon: <Link size={20} />, label: 'Link', description: 'Text or button link' },
        { id: 'accordion-element', type: 'accordion', icon: <ChevronDown size={20} />, label: 'Accordion', description: 'Collapsible content sections' },
        { id: 'tabs-element', type: 'tabs', icon: <Grid3X3 size={20} />, label: 'Tabs', description: 'Tabbed content interface' },
        { id: 'modal-element', type: 'modal', icon: <MessageCircle size={20} />, label: 'Modal', description: 'Popup overlay window' },
        { id: 'popup-element', type: 'popup', icon: <Eye size={20} />, label: 'Popup', description: 'Hover or click popup' },
      ]
    },
    {
      title: 'Forms',
      items: [
        { id: 'input-element', type: 'input', icon: <FormInput size={20} />, label: 'Input Field', description: 'Single line text input' },
        { id: 'textarea-element', type: 'textarea', icon: <TextareaIcon size={20} />, label: 'Textarea', description: 'Multi-line text input' },
        { id: 'checkbox-element', type: 'checkbox', icon: <CheckSquare size={20} />, label: 'Checkbox', description: 'Multiple choice option' },
        { id: 'date-element', type: 'date', icon: <Calendar size={20} />, label: 'Date Picker', description: 'Date selection input' },
      ]
    },
    {
      title: 'Business',
      items: [
        { id: 'pricing-element', type: 'pricing', icon: <DollarSign size={20} />, label: 'Pricing Table', description: 'Product pricing comparison' },
        { id: 'testimonial-element', type: 'testimonial', icon: <Star size={20} />, label: 'Testimonial', description: 'Customer review card' },
        { id: 'team-element', type: 'team', icon: <Users size={20} />, label: 'Team Member', description: 'Staff profile card' },
        { id: 'faq-element', type: 'faq', icon: <HelpCircle size={20} />, label: 'FAQ', description: 'Frequently asked questions' },
        { id: 'contact-element', type: 'contact', icon: <Phone size={20} />, label: 'Contact Card', description: 'Contact information display' },
      ]
    }
  ];

  const filteredCategories = categories
    .map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.items.length > 0);

  return (
    <div className={styles.tabContent}>
      {filteredCategories.map(category => (
        <div key={category.title} className={styles.category}>
          <h4 className={styles.categoryTitle}>{category.title}</h4>
          <div className={styles.componentGrid}>
            {category.items.map(item => (
              <DraggableItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      ))}
      {filteredCategories.length === 0 && (
        <div className={styles.emptyState}>
          <Palette size={48} />
          <p>No components found</p>
        </div>
      )}
    </div>
  );
};

const TemplatesTab: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const templates = [
    { name: 'Hero Section', category: 'Landing' },
    { name: 'Navigation Bar', category: 'Layout' },
    { name: 'Footer', category: 'Layout' },
    { name: 'Pricing Cards', category: 'Business' },
    { name: 'Feature Grid', category: 'Content' },
    { name: 'Testimonials', category: 'Social' },
  ];

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.tabContent}>
      <div className={styles.templatesGrid}>
        {filteredTemplates.map(template => (
          <div key={template.name} className={styles.templateCard}>
            <div className={styles.templatePreview}>
              <FileText size={32} />
            </div>
            <div className={styles.templateInfo}>
              <span className={styles.templateName}>{template.name}</span>
              <span className={styles.templateCategory}>{template.category}</span>
            </div>
          </div>
        ))}
      </div>
      {filteredTemplates.length === 0 && (
        <div className={styles.emptyState}>
          <FileText size={48} />
          <p>No templates found</p>
        </div>
      )}
      <div className={styles.comingSoon}>
        <p>More templates coming soon!</p>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('components');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'layouts' as TabId, label: 'Layouts', icon: Layout },
    { id: 'components' as TabId, label: 'Components', icon: Palette },
    { id: 'templates' as TabId, label: 'Templates', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'layouts':
        return <LayoutTab searchTerm={searchTerm} />;
      case 'components':
        return <ComponentsTab searchTerm={searchTerm} />;
      case 'templates':
        return <TemplatesTab searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.sidebar}>
      {/* Header with Tabs */}
      <div className={styles.sidebarHeader}>
        <div className={styles.tabs}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
              >
                <Icon size={16} />
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.sidebarContent}>
        {renderTabContent()}
      </div>
    </div>
  );
};