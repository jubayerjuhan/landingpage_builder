import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, AlignLeft, FileText, List, Square, Image, Columns, Columns2, Columns3, Columns4 } from 'lucide-react';
import styles from './Sidebar.module.scss';

interface DraggableItemProps {
  id: string;
  type: string;
  icon: React.ReactNode;
  label: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, type, icon, label }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { type }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.elementItem} ${isDragging ? styles.dragging : ''}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>Elements</h3>
      </div>
      
      <div className={styles.elementsList}>
        <div className={styles.category}>
          <h4 className={styles.categoryTitle}>Layout</h4>
          <div className={styles.categoryItems}>
            <DraggableItem
              id="single-column-layout"
              type="single-column"
              icon={<Columns size={20} />}
              label="Single Column"
            />
            <DraggableItem
              id="two-column-layout"
              type="two-column"
              icon={<Columns2 size={20} />}
              label="2 Columns"
            />
            <DraggableItem
              id="three-column-layout"
              type="three-column"
              icon={<Columns3 size={20} />}
              label="3 Columns"
            />
            <DraggableItem
              id="four-column-layout"
              type="four-column"
              icon={<Columns4 size={20} />}
              label="4 Columns"
            />
          </div>
        </div>

        <div className={styles.category}>
          <h4 className={styles.categoryTitle}>Text</h4>
          <div className={styles.categoryItems}>
            <DraggableItem
              id="heading-element"
              type="heading"
              icon={<Type size={20} />}
              label="Heading"
            />
            <DraggableItem
              id="paragraph-element"
              type="paragraph"
              icon={<AlignLeft size={20} />}
              label="Paragraph"
            />
            <DraggableItem
              id="text-element"
              type="text"
              icon={<FileText size={20} />}
              label="Text"
            />
          </div>
        </div>

        <div className={styles.category}>
          <h4 className={styles.categoryTitle}>Basic</h4>
          <div className={styles.categoryItems}>
            <DraggableItem
              id="button-element"
              type="button"
              icon={<Square size={20} />}
              label="Button"
            />
            <DraggableItem
              id="image-element"
              type="image"
              icon={<Image size={20} />}
              label="Image"
            />
            <DraggableItem
              id="list-element"
              type="list"
              icon={<List size={20} />}
              label="List"
            />
          </div>
        </div>
      </div>
    </div>
  );
};