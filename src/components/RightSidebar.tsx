import React from 'react';
import { useBuilderStore } from '../app/store';
import { Accordion } from './shared/Accordion';
import { Settings } from 'lucide-react';
import './RightSidebar.module.scss';

export const RightSidebar: React.FC = () => {
  const { selectedElementId } = useBuilderStore();

  return (
    <div className="right-sidebar">
      <div className="right-sidebar__header">
        <Settings size={16} />
        <h3>Properties</h3>
      </div>
      
      <div className="right-sidebar__content">
        {selectedElementId ? (
          <div>
            <div className="element-info">
              <div className="element-info__label">Selected Element</div>
              <div className="element-info__value">{selectedElementId}</div>
            </div>

            <Accordion title="Spacing" defaultOpen={true}>
              <div className="property-group">
                <div className="property-item">
                  <label className="property-label">Margin</label>
                  <div className="property-inputs">
                    <input type="number" placeholder="0" className="property-input" />
                    <span className="property-unit">px</span>
                  </div>
                </div>
                <div className="property-item">
                  <label className="property-label">Padding</label>
                  <div className="property-inputs">
                    <input type="number" placeholder="0" className="property-input" />
                    <span className="property-unit">px</span>
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion title="Color">
              <div className="property-group">
                <div className="property-item">
                  <label className="property-label">Background</label>
                  <div className="color-picker">
                    <input type="color" className="color-input" defaultValue="#ffffff" />
                    <input type="text" placeholder="#ffffff" className="color-text" />
                  </div>
                </div>
                <div className="property-item">
                  <label className="property-label">Text Color</label>
                  <div className="color-picker">
                    <input type="color" className="color-input" defaultValue="#000000" />
                    <input type="text" placeholder="#000000" className="color-text" />
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion title="Effects">
              <div className="property-group">
                <div className="property-item">
                  <label className="property-label">Opacity</label>
                  <input type="range" min="0" max="100" defaultValue="100" className="range-input" />
                </div>
                <div className="property-item">
                  <label className="property-label">Border Radius</label>
                  <div className="property-inputs">
                    <input type="number" placeholder="0" className="property-input" />
                    <span className="property-unit">px</span>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
        ) : (
          <div className="no-selection">
            <Settings size={48} className="no-selection__icon" />
            <h4 className="no-selection__title">Select an element to inspect</h4>
            <p className="no-selection__description">
              Click on any element in the canvas to view and edit its properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
};