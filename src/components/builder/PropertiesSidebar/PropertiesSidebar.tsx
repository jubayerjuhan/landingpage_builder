import React, { useState } from 'react';
import {
  Settings,
  Type,
  Palette,
  Box,
  ChevronDown,
  Eye,
  Copy,
  Trash2,
  Move,
  Layers,
  Ruler,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Play,
  Image as ImageIcon,
  MousePointer,
  Menu,
} from 'lucide-react';
import { useBuilderStore } from '../../../stores/builderStore';
import { SpacingControl, type SpacingValues } from './SpacingControl';
import { ImageUpload } from '../../ui/ImageUpload';
import styles from './PropertiesSidebar.module.scss';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

const TEXT_COMPONENT_TYPES: string[] = ['heading', 'paragraph', 'text', 'link'];
const CONTENT_COMPONENT_TYPES: string[] = ['heading', 'paragraph', 'text', 'button', 'link'];
const LAYOUT_COMPONENT_TYPES: string[] = ['layout', 'section', 'row', 'column', 'container'];

const normalizeHref = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '#';

  const lower = trimmed.toLowerCase();
  const hasProtocol = lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:') || lower.startsWith('tel:');
  const isAnchor = trimmed.startsWith('#');
  const isRelativePath = trimmed.startsWith('/');

  if (hasProtocol || isAnchor || isRelativePath) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`${styles.section} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sectionHeader} onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className={styles.sectionHeaderLeft}>
          <div className={styles.sectionIcon}>{icon}</div>
          <span className={styles.sectionTitle}>{title}</span>
        </div>
        <ChevronDown size={14} className={styles.toggleIcon} />
      </div>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};

export const PropertiesSidebar: React.FC = () => {
  const { selectedElementId, elements, updateElement, deleteElement } = useBuilderStore();

  const selectedElement = selectedElementId
    ? elements.find(el => el.id === selectedElementId)
    : null;

  if (!selectedElement) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Settings size={18} />
            </div>
            <span className={styles.headerTitle}>Properties</span>
          </div>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <Box size={48} />
            <h3>No Element Selected</h3>
            <p>Select an element to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const isContentComponent = CONTENT_COMPONENT_TYPES.includes(selectedElement.type);
  const isTextComponent = TEXT_COMPONENT_TYPES.includes(selectedElement.type);
  const isLayoutComponent = LAYOUT_COMPONENT_TYPES.includes(selectedElement.type);

  const handlePropertyChange = (property: string, value: any) => {
    if (property === 'content' && (selectedElement.type === 'button' || selectedElement.type === 'link')) {
      // For interactive text elements, keep content as object with text property
      const currentContent = typeof selectedElement.content === 'object' && selectedElement.content
        ? selectedElement.content
        : {};

      updateElement(selectedElement.id, {
        content: { ...currentContent, text: value },
        properties: {
          ...selectedElement.properties,
          content: {
            ...(selectedElement.properties?.content || {}),
            text: value
          }
        }
      });
    } else {
      updateElement(selectedElement.id, { [property]: value });
    }
  };

  const handleContentPropertyChange = (property: string, value: any) => {
    const currentContent = typeof selectedElement.content === 'object' && selectedElement.content
      ? selectedElement.content
      : {};

    const newValue = property === 'href' && typeof value === 'string'
      ? normalizeHref(value)
      : value;

    const newContent = { ...currentContent, [property]: newValue };

    updateElement(selectedElement.id, {
      content: newContent,
      properties: {
        ...selectedElement.properties,
        content: {
          ...(selectedElement.properties?.content || {}),
          [property]: newValue
        }
      }
    });
  };

  const handleComponentPropertyChange = (property: string, value: any) => {
    updateElement(selectedElement.id, {
      properties: {
        ...selectedElement.properties,
        component: {
          ...(selectedElement.properties?.component || {}),
          [property]: value
        }
      }
    });
  };

  const updateComponentList = (
    key: 'items' | 'tabs',
    list: Array<{ title?: string; content?: string }>
  ) => {
    updateElement(selectedElement.id, {
      properties: {
        ...selectedElement.properties,
        component: {
          ...(selectedElement.properties?.component || {}),
          [key]: list
        }
      }
    });
  };

  const updateComponentItems = (items: Array<{ title?: string; content?: string }>) => {
    updateComponentList('items', items);
  };

  const updateComponentTabs = (tabs: Array<{ title?: string; content?: string }>) => {
    updateComponentList('tabs', tabs);
  };

  const getAccordionItems = (): Array<{ title: string; content: string }> => {
    const rawItems = (selectedElement.properties?.component as any)?.items;
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      return rawItems.map((item) => ({
        title: typeof item?.title === 'string' ? item.title : '',
        content: typeof item?.content === 'string' ? item.content : ''
      }));
    }
    return [
      {
        title: 'Accordion Item 1',
        content: 'This is the content for the first accordion item.'
      },
      {
        title: 'Accordion Item 2',
        content: 'This is the content for the second accordion item.'
      }
    ];
  };

  const getTabItems = (): Array<{ title: string; content: string }> => {
    const rawTabs = (selectedElement.properties?.component as any)?.tabs;
    if (Array.isArray(rawTabs) && rawTabs.length > 0) {
      return rawTabs.map((tab) => ({
        title: typeof tab?.title === 'string' ? tab.title : '',
        content: typeof tab?.content === 'string' ? tab.content : ''
      }));
    }

    return [
      {
        title: 'Tab 1',
        content: 'This is the content for tab 1.'
      },
      {
        title: 'Tab 2',
        content: 'This is the content for tab 2.'
      },
      {
        title: 'Tab 3',
        content: 'This is the content for tab 3.'
      }
    ];
  };

  const handleStyleChange = (styleProperty: string, value: string) => {
    const currentStyles = selectedElement.styles || {};
    updateElement(selectedElement.id, {
      styles: { ...currentStyles, [styleProperty]: value },
    });
  };

  const handleSpacingControlChange = (type: 'padding' | 'margin', values: SpacingValues) => {
    const currentProperties = selectedElement.properties || {};
    const currentSpacing = currentProperties.spacing || {};

    const updatedSpacing = { ...currentSpacing };

    if (type === 'padding') {
      updatedSpacing.paddingTop = values.top;
      updatedSpacing.paddingRight = values.right;
      updatedSpacing.paddingBottom = values.bottom;
      updatedSpacing.paddingLeft = values.left;

      // For backward compatibility, if all values are the same, also set the general padding
      if (
        values.top === values.right &&
        values.right === values.bottom &&
        values.bottom === values.left
      ) {
        updatedSpacing.padding = values.top;
      } else {
        // Remove general padding if individual values differ
        delete updatedSpacing.padding;
      }
    } else {
      updatedSpacing.marginTop = values.top;
      updatedSpacing.marginRight = values.right;
      updatedSpacing.marginBottom = values.bottom;
      updatedSpacing.marginLeft = values.left;

      // For backward compatibility, if all values are the same, also set the general margin
      if (
        values.top === values.right &&
        values.right === values.bottom &&
        values.bottom === values.left
      ) {
        updatedSpacing.margin = values.top;
      } else {
        // Remove general margin if individual values differ
        delete updatedSpacing.margin;
      }
    }

    updateElement(selectedElement.id, {
      properties: {
        ...currentProperties,
        spacing: updatedSpacing,
      },
    });
  };

  const handleDelete = () => {
    if (selectedElement) {
      deleteElement(selectedElement.id);
    }
  };

  const getElementDisplayName = (type: string) => {
    const displayNames: Record<string, string> = {
      heading: 'Heading',
      paragraph: 'Paragraph',
      text: 'Text',
      button: 'Button',
      image: 'Image',
      layout: 'Layout',
      row: 'Row',
      column: 'Column',
    };
    return displayNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getPaddingValues = (): SpacingValues => {
    const spacing = selectedElement.properties?.spacing;

    // Check if any individual padding values exist
    const hasIndividualValues = spacing?.paddingTop || spacing?.paddingRight ||
                                spacing?.paddingBottom || spacing?.paddingLeft;

    // If no individual values exist, use general padding as fallback for all sides
    // Otherwise, use individual values with '0px' as fallback
    if (!hasIndividualValues && spacing?.padding) {
      return {
        top: spacing.padding,
        right: spacing.padding,
        bottom: spacing.padding,
        left: spacing.padding,
      };
    }

    return {
      top: spacing?.paddingTop || '0px',
      right: spacing?.paddingRight || '0px',
      bottom: spacing?.paddingBottom || '0px',
      left: spacing?.paddingLeft || '0px',
    };
  };

  const getMarginValues = (): SpacingValues => {
    const spacing = selectedElement.properties?.spacing;

    // Check if any individual margin values exist
    const hasIndividualValues = spacing?.marginTop || spacing?.marginRight ||
                                spacing?.marginBottom || spacing?.marginLeft;

    // If no individual values exist, use general margin as fallback for all sides
    // Otherwise, use individual values with '0px' as fallback
    if (!hasIndividualValues && spacing?.margin) {
      return {
        top: spacing.margin,
        right: spacing.margin,
        bottom: spacing.margin,
        left: spacing.margin,
      };
    }

    return {
      top: spacing?.marginTop || '0px',
      right: spacing?.marginRight || '0px',
      bottom: spacing?.marginBottom || '0px',
      left: spacing?.marginLeft || '0px',
    };
  };

  return (
    <div className={styles.sidebar}>
      {/* Enhanced Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Settings size={18} />
          </div>
          <span className={styles.headerTitle}>Properties</span>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.headerButton} title="Duplicate Element">
            <Copy size={14} />
          </button>
          <button className={styles.headerButton} title="Hide Element">
            <Eye size={14} />
          </button>
          <button className={styles.headerButton} onClick={handleDelete} title="Delete Element">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className={styles.sidebarContent}>
        {/* Element Info */}
        <CollapsibleSection title="Element Info" icon={<Layers size={16} />}>
          <div className={styles.elementInfo}>
            <div className={styles.elementType}>{getElementDisplayName(selectedElement.type)}</div>
            <div className={styles.elementId}>ID: {selectedElement.id.slice(-8)}</div>
          </div>
        </CollapsibleSection>

        {/* Content Properties */}
        {isContentComponent && (
          <CollapsibleSection title="Content" icon={<Type size={16} />}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Text Content</label>
              <textarea
                value={(() => {
                  if (selectedElement.type === 'button') {
                    if (typeof selectedElement.content === 'string') {
                      return selectedElement.content;
                    } else if (typeof selectedElement.content === 'object' && selectedElement.content) {
                      return selectedElement.content.text || selectedElement.content.content || '';
                    }
                    return selectedElement.properties?.content?.text || '';
                  }
                  return typeof selectedElement.content === 'string' ? selectedElement.content : selectedElement.content?.text || '';
                })()}
                onChange={e => handlePropertyChange('content', e.target.value)}
                className={styles.textarea}
                placeholder="Enter your text here..."
              />
            </div>
            {/* Button-specific URL field */}
            {selectedElement.type === 'button' && (
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Link URL</label>
                <input
                  type="url"
                  value={
                    typeof selectedElement.content === 'object' && selectedElement.content
                      ? (selectedElement.content.href || '')
                      : ''
                  }
                  onChange={e => handleContentPropertyChange('href', e.target.value)}
                  className={styles.input}
                  placeholder="https://example.com"
                />
              </div>
            )}

            {/* Link-specific fields */}
            {selectedElement.type === 'link' && (
              <>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Link URL</label>
                  <input
                    type="url"
                    value={
                      typeof selectedElement.content === 'object' && selectedElement.content
                        ? (selectedElement.content.href || '')
                        : selectedElement.properties?.content?.href || ''
                    }
                    onChange={e => handleContentPropertyChange('href', e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.checkboxLabel}>
                    <span>Open in new tab</span>
                    <input
                      type="checkbox"
                      checked={(() => {
                        const content = typeof selectedElement.content === 'object' && selectedElement.content
                          ? selectedElement.content
                          : selectedElement.properties?.content;
                        return (content?.target || '_self') === '_blank';
                      })()}
                      onChange={e => handleContentPropertyChange('target', e.target.checked ? '_blank' : '_self')}
                    />
                  </label>
                </div>
              </>
            )}
          </CollapsibleSection>
        )}

        {/* Button Properties */}
        {selectedElement.type === 'button' && (
          <CollapsibleSection title="Button Style" icon={<MousePointer size={16} />}>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Variant</label>
                <select
                  value={selectedElement.properties?.component?.variant || 'primary'}
                  onChange={e => handleComponentPropertyChange('variant', e.target.value)}
                  className={styles.select}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Size</label>
                <select
                  value={selectedElement.properties?.component?.size || 'md'}
                  onChange={e => handleComponentPropertyChange('size', e.target.value)}
                  className={styles.select}
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>
            </div>

            {/* Button Colors */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Button Background</label>
              <div className={styles.colorField}>
                <div
                  className={styles.colorPreview}
                  style={
                    { '--color': selectedElement.styles?.backgroundColor || '#3b82f6' } as React.CSSProperties
                  }
                />
                <input
                  type="color"
                  value={selectedElement.styles?.backgroundColor || '#3b82f6'}
                  onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                  className={styles.colorInput}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Button Text Color</label>
              <div className={styles.colorField}>
                <div
                  className={styles.colorPreview}
                  style={
                    { '--color': selectedElement.styles?.color || '#ffffff' } as React.CSSProperties
                  }
                />
                <input
                  type="color"
                  value={selectedElement.styles?.color || '#ffffff'}
                  onChange={e => handleStyleChange('color', e.target.value)}
                  className={styles.colorInput}
                />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Accordion Properties */}
        {selectedElement.type === 'accordion' && (() => {
          const items = getAccordionItems();

          const handleItemChange = (index: number, field: 'title' | 'content', value: string) => {
            const updated = items.map((item, idx) =>
              idx === index ? { ...item, [field]: value } : item
            );
            updateComponentItems(updated);
          };

          const handleAddItem = () => {
            updateComponentItems([
              ...items,
              {
                title: `Accordion Item ${items.length + 1}`,
                content: 'New accordion content'
              }
            ]);
          };

          const handleRemoveItem = (index: number) => {
            if (items.length <= 1) return;
            updateComponentItems(items.filter((_, idx) => idx !== index));
          };

          const allowMultiple = (selectedElement.properties?.component as any)?.allowMultiple !== false;

          return (
            <CollapsibleSection title="Accordion Settings" icon={<Menu size={16} />}>
              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <span>Allow multiple sections open</span>
                  <input
                    type="checkbox"
                    checked={allowMultiple}
                    onChange={(e) => handleComponentPropertyChange('allowMultiple', e.target.checked)}
                  />
                </label>
              </div>

              <div className={styles.fieldList}>
                {items.map((item, index) => (
                  <div key={index} className={styles.fieldCard}>
                    <div className={styles.fieldCardHeader}>
                      <span>Item {index + 1}</span>
                      <button
                        className={styles.removeItemButton}
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length <= 1}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                        className={styles.input}
                        placeholder="Accordion title"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Content</label>
                      <textarea
                        value={item.content}
                        onChange={(e) => handleItemChange(index, 'content', e.target.value)}
                        className={styles.textarea}
                        rows={3}
                        placeholder="Accordion content"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.addItemButton} onClick={handleAddItem} type="button">
                + Add Item
              </button>
            </CollapsibleSection>
          );
        })()}

        {/* Tabs Properties */}
        {selectedElement.type === 'tabs' && (() => {
          const tabs = getTabItems();
          const componentConfig = (selectedElement.properties?.component || {}) as Record<string, unknown>;

          const clampIndex = (value: number, length: number) => {
            if (!Number.isInteger(value)) {
              return 0;
            }
            if (length <= 0) {
              return 0;
            }
            return Math.min(Math.max(value, 0), length - 1);
          };

          const currentDefaultActive = clampIndex(
            typeof componentConfig.defaultActive === 'number'
              ? componentConfig.defaultActive
              : 0,
            tabs.length
          );

          const handleTabsUpdate = (nextTabs: Array<{ title: string; content: string }>) => {
            updateComponentTabs(nextTabs);

            const clamped = clampIndex(currentDefaultActive, nextTabs.length);
            if (clamped !== currentDefaultActive) {
              handleComponentPropertyChange('defaultActive', clamped);
            }
          };

          const handleTabChange = (index: number, field: 'title' | 'content', value: string) => {
            const updated = tabs.map((tab, idx) =>
              idx === index ? { ...tab, [field]: value } : tab
            );
            handleTabsUpdate(updated);
          };

          const handleAddTab = () => {
            const nextTabs = [
              ...tabs,
              {
                title: `Tab ${tabs.length + 1}`,
                content: 'New tab content'
              }
            ];

            handleTabsUpdate(nextTabs);
          };

          const handleRemoveTab = (index: number) => {
            if (tabs.length <= 1) {
              return;
            }

            const nextTabs = tabs.filter((_, idx) => idx !== index);
            handleTabsUpdate(nextTabs);
          };

          const handleDefaultActiveChange = (value: number) => {
            handleComponentPropertyChange('defaultActive', clampIndex(value, tabs.length));
          };

          return (
            <CollapsibleSection title="Tabs Settings" icon={<Menu size={16} />}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Default Active Tab</label>
                <select
                  value={currentDefaultActive}
                  onChange={(e) => handleDefaultActiveChange(Number(e.target.value))}
                  className={styles.select}
                >
                  {tabs.map((tab, index) => (
                    <option key={index} value={index}>
                      {tab.title || `Tab ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldList}>
                {tabs.map((tab, index) => (
                  <div key={index} className={styles.fieldCard}>
                    <div className={styles.fieldCardHeader}>
                      <span>Tab {index + 1}</span>
                      <button
                        className={styles.removeItemButton}
                        onClick={() => handleRemoveTab(index)}
                        disabled={tabs.length <= 1}
                        title="Remove tab"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Title</label>
                      <input
                        type="text"
                        value={tab.title}
                        onChange={(e) => handleTabChange(index, 'title', e.target.value)}
                        className={styles.input}
                        placeholder="Tab title"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Content</label>
                      <textarea
                        value={tab.content}
                        onChange={(e) => handleTabChange(index, 'content', e.target.value)}
                        className={styles.textarea}
                        rows={3}
                        placeholder="Tab content"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.addItemButton} onClick={handleAddTab} type="button">
                + Add Tab
              </button>
            </CollapsibleSection>
          );
        })()}

        {/* Image Properties */}
        {selectedElement.type === 'image' && (
          <CollapsibleSection title="Image" icon={<ImageIcon size={16} />}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Image Source</label>
              <ImageUpload
                value={
                  typeof selectedElement.content === 'object' && selectedElement.content
                    ? (selectedElement.content.src || '')
                    : ''
                }
                onChange={(value) => handleContentPropertyChange('src', value)}
                onImageData={(data) => {
                  // Update alt text if provided
                  if (data.alt) {
                    handleContentPropertyChange('alt', data.alt);
                  }
                }}
                placeholder="Click to upload or drag & drop"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Alt Text</label>
              <input
                type="text"
                value={
                  typeof selectedElement.content === 'object' && selectedElement.content
                    ? (selectedElement.content.alt || '')
                    : ''
                }
                onChange={e => handleContentPropertyChange('alt', e.target.value)}
                className={styles.input}
                placeholder="Describe the image for SEO and accessibility"
              />
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Object Fit</label>
                <select
                  value={selectedElement.styles?.objectFit || 'cover'}
                  onChange={e => handleStyleChange('objectFit', e.target.value)}
                  className={styles.select}
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                  <option value="none">None</option>
                  <option value="scale-down">Scale Down</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Aspect Ratio</label>
                <select
                  value={selectedElement.styles?.aspectRatio || 'auto'}
                  onChange={e => handleStyleChange('aspectRatio', e.target.value)}
                  className={styles.select}
                >
                  <option value="auto">Auto</option>
                  <option value="1/1">1:1 (Square)</option>
                  <option value="16/9">16:9 (Wide)</option>
                  <option value="4/3">4:3 (Standard)</option>
                  <option value="21/9">21:9 (Ultra Wide)</option>
                </select>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Video Properties */}
        {selectedElement.type === 'video' && (() => {
          const contentObj = (typeof selectedElement.content === 'object' && selectedElement.content)
            ? (selectedElement.content as Record<string, unknown>)
            : ((selectedElement.properties?.content as Record<string, unknown>) || {});
          const componentProps = (selectedElement.properties?.component as Record<string, unknown>) || {};

          const stringValue = (value: unknown) => (typeof value === 'string' ? value : '');
          const booleanValue = (value: unknown, fallback: boolean) => (typeof value === 'boolean' ? value : fallback);

          const controlsEnabled = booleanValue(componentProps.controls, true);
          const autoplayEnabled = booleanValue(componentProps.autoplay, false);
          const mutedEnabled = booleanValue(componentProps.muted, true);
          const loopEnabled = booleanValue(componentProps.loop, false);

          return (
            <CollapsibleSection title="Video" icon={<Play size={16} />}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Video URL</label>
                <input
                  type="url"
                  value={stringValue(contentObj.src)}
                  onChange={e => handleContentPropertyChange('src', e.target.value)}
                  className={styles.input}
                  placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Poster Image</label>
                <input
                  type="url"
                  value={stringValue(contentObj.poster)}
                  onChange={e => handleContentPropertyChange('poster', e.target.value)}
                  className={styles.input}
                  placeholder="Optional cover image shown before playback"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Thumbnails VTT</label>
                <input
                  type="url"
                  value={stringValue(componentProps.thumbnails)}
                  onChange={e => handleComponentPropertyChange('thumbnails', e.target.value)}
                  className={styles.input}
                  placeholder="Sprite sheet VTT for hover previews"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Video Title</label>
                <input
                  type="text"
                  value={stringValue(contentObj.title)}
                  onChange={e => handleContentPropertyChange('title', e.target.value)}
                  className={styles.input}
                  placeholder="Used for accessibility and export markup"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <span>Show Controls</span>
                  <input
                    type="checkbox"
                    checked={controlsEnabled}
                    onChange={e => handleComponentPropertyChange('controls', e.target.checked)}
                  />
                </label>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <span>Autoplay</span>
                  <input
                    type="checkbox"
                    checked={autoplayEnabled}
                    onChange={e => handleComponentPropertyChange('autoplay', e.target.checked)}
                  />
                </label>
                <div className={styles.helperText}>
                  Browsers require muted autoplay; audio stays muted in the editor.
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <span>Start Muted</span>
                  <input
                    type="checkbox"
                    checked={mutedEnabled}
                    onChange={e => handleComponentPropertyChange('muted', e.target.checked)}
                  />
                </label>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <span>Loop Video</span>
                  <input
                    type="checkbox"
                    checked={loopEnabled}
                    onChange={e => handleComponentPropertyChange('loop', e.target.checked)}
                  />
                </label>
              </div>
            </CollapsibleSection>
          );
        })()}

        {/* Typography Properties */}
        {isTextComponent && (
          <CollapsibleSection title="Typography" icon={<Type size={16} />}>
            {/* Font Size and Weight */}
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Font Size</label>
                <input
                  type="number"
                  value={selectedElement.styles?.fontSize?.replace('px', '') || ''}
                  onChange={e => handleStyleChange('fontSize', `${e.target.value}px`)}
                  className={styles.input}
                  placeholder="16"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Font Weight</label>
                <select
                  value={selectedElement.styles?.fontWeight || 'normal'}
                  onChange={e => handleStyleChange('fontWeight', e.target.value)}
                  className={styles.select}
                >
                  <option value="300">Light</option>
                  <option value="normal">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>
            </div>

            {/* Text Color */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Text Color</label>
              <div className={styles.colorField}>
                <div
                  className={styles.colorPreview}
                  style={
                    { '--color': selectedElement.styles?.color || '#000000' } as React.CSSProperties
                  }
                />
                <input
                  type="color"
                  value={selectedElement.styles?.color || '#000000'}
                  onChange={e => handleStyleChange('color', e.target.value)}
                  className={styles.colorInput}
                />
              </div>
            </div>

            {/* Text Alignment */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Text Alignment</label>
              <div className={styles.fieldGroupThree}>
                <button
                  className={`btn btn--ghost ${
                    selectedElement.styles?.textAlign === 'left' ? 'btn--primary' : ''
                  }`}
                  onClick={() => handleStyleChange('textAlign', 'left')}
                  title="Align Left"
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  className={`btn btn--ghost ${
                    selectedElement.styles?.textAlign === 'center' ? 'btn--primary' : ''
                  }`}
                  onClick={() => handleStyleChange('textAlign', 'center')}
                  title="Align Center"
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  className={`btn btn--ghost ${
                    selectedElement.styles?.textAlign === 'right' ? 'btn--primary' : ''
                  }`}
                  onClick={() => handleStyleChange('textAlign', 'right')}
                  title="Align Right"
                >
                  <AlignRight size={16} />
                </button>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Layout & Position */}
        {isLayoutComponent && (
          <CollapsibleSection title="Layout" icon={<Move size={16} />}>
            {/* Dimensions */}
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Width</label>
                <input
                  type="text"
                  value={selectedElement.styles?.width || ''}
                  onChange={e => handleStyleChange('width', e.target.value)}
                  className={styles.input}
                  placeholder="auto"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Height</label>
                <input
                  type="text"
                  value={selectedElement.styles?.height || ''}
                  onChange={e => handleStyleChange('height', e.target.value)}
                  className={styles.input}
                  placeholder="auto"
                />
              </div>
            </div>

            {/* Display and Position */}
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Display</label>
                <select
                  value={selectedElement.styles?.display || 'block'}
                  onChange={e => handleStyleChange('display', e.target.value)}
                  className={styles.select}
                >
                  <option value="block">Block</option>
                  <option value="inline-block">Inline Block</option>
                  <option value="flex">Flex</option>
                  <option value="inline-flex">Inline Flex</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Position</label>
                <select
                  value={selectedElement.styles?.position || 'static'}
                  onChange={e => handleStyleChange('position', e.target.value)}
                  className={styles.select}
                >
                  <option value="static">Static</option>
                  <option value="relative">Relative</option>
                  <option value="absolute">Absolute</option>
                  <option value="fixed">Fixed</option>
                  <option value="sticky">Sticky</option>
                </select>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Spacing Properties */}
        {isLayoutComponent && (
          <CollapsibleSection title="Spacing" icon={<Ruler size={16} />}>
            {/* Padding Control */}
            <SpacingControl
              label="Padding"
              values={getPaddingValues()}
              onChange={values => handleSpacingControlChange('padding', values)}
              type="padding"
            />

            {/* Margin Control */}
            <SpacingControl
              label="Margin"
              values={getMarginValues()}
              onChange={values => handleSpacingControlChange('margin', values)}
              type="margin"
            />
          </CollapsibleSection>
        )}

        {/* Style Properties */}
        {isLayoutComponent && (
          <CollapsibleSection title="Appearance" icon={<Palette size={16} />}>
            {/* Background */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Background Color</label>
              <div className={styles.colorField}>
                <div
                  className={styles.colorPreview}
                  style={
                    {
                      '--color': selectedElement.styles?.backgroundColor || '#ffffff',
                    } as React.CSSProperties
                  }
                />
                <input
                  type="color"
                  value={selectedElement.styles?.backgroundColor || '#ffffff'}
                  onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                  className={styles.colorInput}
                />
              </div>
            </div>

            {/* Border */}
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Border Width</label>
                <input
                  type="number"
                  value={selectedElement.styles?.borderWidth?.replace('px', '') || ''}
                  onChange={e => handleStyleChange('borderWidth', `${e.target.value}px`)}
                  className={styles.input}
                  placeholder="0"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Border Radius</label>
                <input
                  type="number"
                  value={selectedElement.styles?.borderRadius?.replace('px', '') || ''}
                  onChange={e => handleStyleChange('borderRadius', `${e.target.value}px`)}
                  className={styles.input}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Border Color */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Border Color</label>
              <div className={styles.colorField}>
                <div
                  className={styles.colorPreview}
                  style={
                    {
                      '--color': selectedElement.styles?.borderColor || '#e5e7eb',
                    } as React.CSSProperties
                  }
                />
                <input
                  type="color"
                  value={selectedElement.styles?.borderColor || '#e5e7eb'}
                  onChange={e => handleStyleChange('borderColor', e.target.value)}
                  className={styles.colorInput}
                />
              </div>
            </div>

            {/* Shadow */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Box Shadow</label>
              <select
                value={selectedElement.styles?.boxShadow || 'none'}
                onChange={e => handleStyleChange('boxShadow', e.target.value)}
                className={styles.select}
              >
                <option value="none">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.1)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                <option value="0 25px 50px rgba(0,0,0,0.25)">Extra Large</option>
              </select>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};
