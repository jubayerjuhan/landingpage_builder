import { create } from 'zustand';
import { createSectionFromConfig, createRowWithColumns } from '../utils/elementFactory';
import useElementStore from './elementStore';

export interface SectionConfig {
  type: 'full-width' | 'wide' | 'medium' | 'small';
  maxWidth?: string;
  backgroundColor?: string;
  padding?: string;
}

export interface RowConfig {
  columns: number;
  gap?: string;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

export interface ModalStore {
  // Modal states
  showAddSectionModal: boolean;
  showAddRowModal: boolean;
  
  // Modal data
  sectionConfig: SectionConfig | null;
  rowConfig: RowConfig | null;
  targetParentId: string | null;
  
  // Modal actions
  openAddSectionModal: (parentId?: string) => void;
  closeAddSectionModal: () => void;
  openAddRowModal: (parentId: string) => void;
  closeAddRowModal: () => void;
  
  // Configuration setters
  setSectionConfig: (config: SectionConfig) => void;
  setRowConfig: (config: RowConfig) => void;
  
  // Confirmation actions
  confirmSectionAdd: () => void;
  confirmRowAdd: () => void;
  
  // Reset
  resetModals: () => void;
}

const useModalStore = create<ModalStore>((set, get) => ({
  // Initial states
  showAddSectionModal: false,
  showAddRowModal: false,
  sectionConfig: null,
  rowConfig: null,
  targetParentId: null,
  
  // Modal actions
  openAddSectionModal: (parentId = null) => {
    set({
      showAddSectionModal: true,
      targetParentId: parentId,
      sectionConfig: {
        type: 'full-width',
        backgroundColor: 'transparent',
        padding: '4rem 0'
      }
    });
  },
  
  closeAddSectionModal: () => {
    set({
      showAddSectionModal: false,
      targetParentId: null,
      sectionConfig: null
    });
  },
  
  openAddRowModal: (parentId: string) => {
    set({
      showAddRowModal: true,
      targetParentId: parentId,
      rowConfig: {
        columns: 1,
        gap: '1rem',
        alignment: 'stretch'
      }
    });
  },
  
  closeAddRowModal: () => {
    set({
      showAddRowModal: false,
      targetParentId: null,
      rowConfig: null
    });
  },
  
  // Configuration setters
  setSectionConfig: (config: SectionConfig) => {
    set({ sectionConfig: config });
  },
  
  setRowConfig: (config: RowConfig) => {
    set({ rowConfig: config });
  },
  
  // Confirmation actions - creates actual elements
  confirmSectionAdd: () => {
    const { sectionConfig, targetParentId } = get();
    if (sectionConfig) {
      try {
        // Create the section element
        const sectionElement = createSectionFromConfig(sectionConfig);
        
        // Add to element store
        const elementStore = useElementStore.getState();
        
        if (targetParentId) {
          // Add as child to specific parent
          elementStore.addElementWithChildren(sectionElement, targetParentId);
        } else {
          // Add to root level
          elementStore.addElementWithChildren(sectionElement);
        }
        
        // Select the newly created section
        elementStore.selectElement(sectionElement.id);
        
        console.log('✅ Section created:', sectionElement);
        get().closeAddSectionModal();
      } catch (error) {
        console.error('❌ Failed to create section:', error);
      }
    }
  },
  
  confirmRowAdd: () => {
    const { rowConfig, targetParentId } = get();
    if (rowConfig && targetParentId) {
      try {
        // Create the row with columns
        const rowElement = createRowWithColumns(rowConfig);
        
        // Add to element store as child of target parent
        const elementStore = useElementStore.getState();
        elementStore.addElementWithChildren(rowElement, targetParentId);
        
        // Select the newly created row
        elementStore.selectElement(rowElement.id);
        
        console.log('✅ Row with columns created:', rowElement);
        get().closeAddRowModal();
      } catch (error) {
        console.error('❌ Failed to create row:', error);
      }
    }
  },
  
  // Reset all modals
  resetModals: () => {
    set({
      showAddSectionModal: false,
      showAddRowModal: false,
      sectionConfig: null,
      rowConfig: null,
      targetParentId: null
    });
  }
}));

export default useModalStore;