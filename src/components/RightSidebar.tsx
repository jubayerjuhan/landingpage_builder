import React, { useState } from 'react';
import { useBuilderStore } from '../app/store';
import { Accordion } from './shared/Accordion';
import { 
  Settings, 
  Layout,
  Type,
  Square,
  Zap,
  MousePointer2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import styles from './RightSidebar.module.scss';

type TabType = 'styles' | 'interaction';

export const RightSidebar: React.FC = () => {
  const { selectedElementId } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<TabType>('styles');

  const renderStylesPanel = () => (
    <div className={styles.panelContent}>
      <Accordion title="Layout" icon={Layout} defaultOpen={true}>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Display</label>
            <select className={styles.propertySelect}>
              <option value="block">Block</option>
              <option value="flex">Flex</option>
              <option value="inline">Inline</option>
              <option value="none">None</option>
            </select>
          </div>
          
          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Direction</label>
            <div className={styles.buttonGroup}>
              <button className={`${styles.iconButton} ${styles.active}`} title="Horizontal">
                ➡️
              </button>
              <button className={styles.iconButton} title="Vertical">
                ⬇️
              </button>
            </div>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Align</label>
            <div className={styles.buttonGroup}>
              <button className={styles.iconButton}>
                <AlignLeft size={14} />
              </button>
              <button className={`${styles.iconButton} ${styles.active}`}>
                <AlignCenter size={14} />
              </button>
              <button className={styles.iconButton}>
                <AlignRight size={14} />
              </button>
            </div>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Justify</label>
            <div className={styles.buttonGroup}>
              <button className={styles.iconButton}>Start</button>
              <button className={styles.iconButton}>Center</button>
              <button className={styles.iconButton}>End</button>
            </div>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Gap</label>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                placeholder="0" 
                className={styles.numberInput}
                defaultValue="0"
              />
              <span className={styles.unit}>px</span>
            </div>
          </div>
        </div>
      </Accordion>

      <Accordion title="Spacing" icon={Square} defaultOpen={true}>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Padding</label>
            <div className={styles.spacingBox}>
              <div className={styles.spacingGrid}>
                <input type="number" placeholder="20" className={styles.spacingInput} />
                <input type="number" placeholder="20" className={styles.spacingInput} />
                <input type="number" placeholder="20" className={styles.spacingInput} />
                <input type="number" placeholder="20" className={styles.spacingInput} />
              </div>
              <div className={styles.spacingLabels}>
                <span>T</span>
                <span>R</span>
                <span>B</span>
                <span>L</span>
              </div>
            </div>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Margin</label>
            <div className={styles.inputGroup}>
              <button className={styles.linkButton} title="Link all sides">🔗</button>
              <input 
                type="number" 
                placeholder="0" 
                className={styles.numberInput}
                defaultValue="0"
              />
              <span className={styles.unit}>px</span>
            </div>
          </div>
        </div>
      </Accordion>

      <Accordion title="Size" icon={Layout}>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Width</label>
            <select className={styles.propertySelect}>
              <option value="auto">Auto</option>
              <option value="100%">100%</option>
              <option value="fit-content">Fit Content</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Height</label>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                placeholder="Auto" 
                className={styles.numberInput}
              />
              <span className={styles.unit}>px</span>
            </div>
          </div>
        </div>
      </Accordion>

      <Accordion title="Typography" icon={Type}>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Font Family</label>
            <select className={styles.propertySelect}>
              <option value="inter">Inter</option>
              <option value="system">System</option>
              <option value="helvetica">Helvetica</option>
            </select>
          </div>

          <div className={styles.twoColumns}>
            <div className={styles.propertyItem}>
              <label className={styles.propertyLabel}>Size</label>
              <div className={styles.inputGroup}>
                <input 
                  type="number" 
                  defaultValue="16" 
                  className={styles.numberInput}
                />
                <span className={styles.unit}>px</span>
              </div>
            </div>

            <div className={styles.propertyItem}>
              <label className={styles.propertyLabel}>Weight</label>
              <select className={styles.propertySelect}>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Style</label>
            <div className={styles.buttonGroup}>
              <button className={styles.iconButton}>
                <Bold size={14} />
              </button>
              <button className={styles.iconButton}>
                <Italic size={14} />
              </button>
              <button className={styles.iconButton}>
                <Underline size={14} />
              </button>
            </div>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Alignment</label>
            <div className={styles.buttonGroup}>
              <button className={`${styles.iconButton} ${styles.active}`}>
                <AlignCenter size={14} />
              </button>
              <button className={styles.iconButton}>
                <AlignLeft size={14} />
              </button>
              <button className={styles.iconButton}>
                <AlignRight size={14} />
              </button>
            </div>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Color</label>
            <div className={styles.colorPicker}>
              <div className={styles.colorSwatch} style={{ backgroundColor: '#000000' }}></div>
              <input type="text" value="#000000" className={styles.colorInput} />
              <span className={styles.colorPercentage}>100%</span>
            </div>
          </div>
        </div>
      </Accordion>

      <Accordion title="Effect" icon={Zap}>
        <div className={styles.propertyGroup}>
          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Opacity</label>
            <div className={styles.sliderGroup}>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="100" 
                className={styles.slider}
              />
              <span className={styles.sliderValue}>100%</span>
            </div>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Box Shadow</label>
            <button className={styles.addButton}>+ Add Shadow</button>
          </div>

          <div className={styles.propertyItem}>
            <label className={styles.propertyLabel}>Border Radius</label>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                placeholder="0" 
                className={styles.numberInput}
              />
              <span className={styles.unit}>px</span>
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );

  const renderInteractionPanel = () => (
    <div className={styles.panelContent}>
      <div className={styles.comingSoon}>
        <MousePointer2 size={48} className={styles.comingSoonIcon} />
        <h4 className={styles.comingSoonTitle}>Interaction Coming Soon</h4>
        <p className={styles.comingSoonDescription}>
          Advanced interactions and animations will be available in a future update.
        </p>
      </div>
    </div>
  );

  return (
    <div className={styles.rightSidebar}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Settings size={16} />
          <span>Properties</span>
        </div>
      </div>
      
      <div className={styles.content}>
        {selectedElementId ? (
          <>
            <div className={styles.elementInfo}>
              <div className={styles.elementType}>Div_Block</div>
              <div className={styles.elementId}>{selectedElementId}</div>
            </div>

            <div className={styles.tabContainer}>
              <button
                className={`${styles.tab} ${activeTab === 'styles' ? styles.active : ''}`}
                onClick={() => setActiveTab('styles')}
              >
                Styles
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'interaction' ? styles.active : ''}`}
                onClick={() => setActiveTab('interaction')}
              >
                Interaction
              </button>
            </div>

            {activeTab === 'styles' ? renderStylesPanel() : renderInteractionPanel()}
          </>
        ) : (
          <div className={styles.noSelection}>
            <div className={styles.noSelectionIcon}>
              <Settings size={48} />
            </div>
            <h4 className={styles.noSelectionTitle}>Select an element to inspect</h4>
            <p className={styles.noSelectionDescription}>
              Click on any element in the canvas to view and edit its properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
};