import React from 'react';
import { ModalContainer } from './modals';
import { EnhancedCanvas } from './Canvas/EnhancedCanvas';
import useModalStore from '../stores/modalStore';
import useElementStore from '../stores/elementStore';

export const TestPhase2Integration: React.FC = () => {
  const { openAddSectionModal, openAddRowModal } = useModalStore();
  const { elements, selectedElementId, selectElement, clearSelection } = useElementStore();

  const handleAddSection = () => {
    clearSelection(); // Add to root level
    openAddSectionModal();
  };

  const handleAddRowToSection = (sectionId: string) => {
    selectElement(sectionId);
    openAddRowModal(sectionId);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc' 
    }}>
      {/* Left Panel - Controls */}
      <div style={{ 
        width: '320px', 
        backgroundColor: 'white', 
        borderRight: '1px solid #e5e7eb',
        padding: '1.5rem',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          margin: '0 0 1.5rem 0', 
          color: '#111827',
          fontSize: '1.25rem',
          fontWeight: '700'
        }}>
          Phase 2: Modal Integration
        </h2>
        
        {/* Add Section Button */}
        <button
          onClick={handleAddSection}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '1rem',
            transition: 'all 0.2s',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#3b82f6';
          }}
        >
          ✨ Add New Section
        </button>

        {/* Elements List */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: '#374151',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Canvas Elements ({elements.length})
          </h3>
          
          {elements.length === 0 ? (
            <div style={{
              padding: '2rem 1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                No sections yet.<br/>
                Click "Add New Section" to start!
              </p>
            </div>
          ) : (
            <div style={{ space: '0.5rem' }}>
              {elements.map((element) => (
                <div
                  key={element.id}
                  onClick={() => selectElement(element.id)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: selectedElementId === element.id ? '#dbeafe' : '#f9fafb',
                    border: selectedElementId === element.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#111827',
                      fontSize: '14px'
                    }}>
                      {element.name || element.type}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      backgroundColor: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}>
                      {element.type}
                    </span>
                  </div>
                  
                  {element.type === 'section' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddRowToSection(element.id);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Row
                    </button>
                  )}
                  
                  {/* Show children count */}
                  {element.children && element.children.length > 0 && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#059669'
                    }}>
                      {element.children.length} child element(s)
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Element Info */}
        {selectedElement && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#1e40af',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Selected Element
            </h4>
            <p style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '13px',
              color: '#1f2937'
            }}>
              <strong>Name:</strong> {selectedElement.name || 'Untitled'}<br/>
              <strong>Type:</strong> {selectedElement.type}<br/>
              <strong>Children:</strong> {selectedElement.children?.length || 0}
            </p>
          </div>
        )}
      </div>

      {/* Right Panel - Enhanced Canvas */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto'
      }}>
        <EnhancedCanvas />
      </div>

      {/* Render modals */}
      <ModalContainer />
    </div>
  );
};