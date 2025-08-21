import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import useElementStore from '../../stores/elementStore';
import useCanvasStore from '../../stores/canvasStore';
import useModalStore from '../../stores/modalStore';
import { ElementWrapper } from '../elements/ElementWrapper';
import { addColumnToRow, removeColumnFromRow, duplicateColumnInRow, getRowStats } from '../../utils/rowManager';
import { Plus, Layout, Grid3X3, MoreHorizontal, Copy, Trash2, ChevronRight } from 'lucide-react';
import type { BuilderElement } from '../../types/builder';

export const EnhancedCanvas: React.FC = () => {
  const { elements, selectedElementId, selectElement, clearSelection, updateElement } = useElementStore();
  const { viewportMode, showGrid, showSnapGuides } = useCanvasStore();
  const { openAddSectionModal, openAddRowModal } = useModalStore();
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: 'enhanced-canvas',
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only clear selection if clicking on canvas directly
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  const handleAddSection = () => {
    clearSelection();
    openAddSectionModal();
  };

  // Row Management Functions
  const handleAddColumn = (rowElement: BuilderElement) => {
    try {
      const updatedRow = addColumnToRow(rowElement);
      updateElement(updatedRow.id, updatedRow);
      setActiveRowMenu(null);
    } catch (error) {
      console.error('Failed to add column:', error);
    }
  };

  const handleRemoveColumn = (rowElement: BuilderElement, columnIndex: number) => {
    try {
      const updatedRow = removeColumnFromRow(rowElement, columnIndex);
      updateElement(updatedRow.id, updatedRow);
      setActiveRowMenu(null);
    } catch (error) {
      console.error('Failed to remove column:', error);
    }
  };

  const handleDuplicateColumn = (rowElement: BuilderElement, columnIndex: number) => {
    try {
      const updatedRow = duplicateColumnInRow(rowElement, columnIndex);
      updateElement(updatedRow.id, updatedRow);
      setActiveRowMenu(null);
    } catch (error) {
      console.error('Failed to duplicate column:', error);
    }
  };

  const renderSectionBoundaries = (element: BuilderElement) => {
    if (element.type !== 'section') return null;

    const isSelected = selectedElementId === element.id;
    const isEmpty = !element.children || element.children.length === 0;

    return (
      <div
        key={element.id}
        className={`canvas-section ${isSelected ? 'canvas-section--selected' : ''} ${isEmpty ? 'canvas-section--empty' : ''}`}
        onClick={() => selectElement(element.id)}
        style={{
          margin: '1rem 0',
          padding: '1.5rem',
          border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: isEmpty ? '#f9fafb' : 'white',
          position: 'relative',
          transition: 'all 0.2s ease',
          minHeight: isEmpty ? '120px' : 'auto'
        }}
      >
        {/* Section Header */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '12px',
          backgroundColor: isSelected ? '#3b82f6' : '#6b7280',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Layout size={12} />
          {element.name || 'Section'}
        </div>

        {/* Add Row Button for Empty Sections */}
        {isEmpty && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80px',
            color: '#9ca3af'
          }}>
            <Grid3X3 size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
              Section is empty
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openAddRowModal(element.id);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={12} />
              Add Row
            </button>
          </div>
        )}

        {/* Section Content - Rows */}
        {element.children && element.children.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {element.children.map(row => renderRowBoundaries(row, element.id))}
          </div>
        )}
      </div>
    );
  };

  const renderRowBoundaries = (element: BuilderElement, sectionId: string) => {
    if (element.type !== 'row') return null;

    const isSelected = selectedElementId === element.id;
    const isEmpty = !element.children || element.children.length === 0;
    const rowStats = getRowStats(element);
    const showMenu = activeRowMenu === element.id;

    return (
      <div
        key={element.id}
        className={`canvas-row ${isSelected ? 'canvas-row--selected' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(element.id);
        }}
        style={{
          margin: '0.75rem 0',
          padding: '1rem',
          border: isSelected ? '2px solid #10b981' : '1px dashed #d1d5db',
          borderRadius: '6px',
          backgroundColor: isSelected ? '#f0fdf4' : '#fafafa',
          position: 'relative',
          transition: 'all 0.2s ease'
        }}
      >
        {/* Row Header */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '12px',
          backgroundColor: isSelected ? '#10b981' : '#9ca3af',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Grid3X3 size={10} />
          {element.name || 'Row'}
          {rowStats && (
            <span style={{ opacity: 0.8 }}>
              ({rowStats.columnCount} cols)
            </span>
          )}
        </div>

        {/* Row Management Menu */}
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '12px',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddColumn(element);
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Plus size={10} />
              Col
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveRowMenu(showMenu ? null : element.id);
              }}
              style={{
                padding: '4px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <MoreHorizontal size={10} />
            </button>

            {/* Row Actions Menu */}
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 20,
                minWidth: '150px'
              }}>
                <div style={{ padding: '4px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddRowModal(sectionId);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={12} />
                    Add Row Below
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Row Content - Columns */}
        <div style={{
          display: 'flex',
          gap: element.properties?.gap || '1rem',
          alignItems: element.properties?.alignment === 'stretch' ? 'stretch' : element.properties?.alignment || 'flex-start',
          minHeight: isEmpty ? '60px' : 'auto'
        }}>
          {element.children && element.children.length > 0 ? (
            element.children.map((column, columnIndex) => 
              renderColumnBoundaries(column, columnIndex, element)
            )
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '12px'
            }}>
              Empty Row
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderColumnBoundaries = (element: BuilderElement, columnIndex: number, rowElement: BuilderElement) => {
    if (element.type !== 'column') return null;

    const isSelected = selectedElementId === element.id;
    const isEmpty = !element.children || element.children.length === 0;
    const canRemoveColumn = rowElement.children && rowElement.children.length > 1;

    return (
      <div
        key={element.id}
        className={`canvas-column ${isSelected ? 'canvas-column--selected' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(element.id);
        }}
        style={{
          flex: 1,
          padding: '0.75rem',
          border: isSelected ? '2px solid #f59e0b' : '1px dashed #e5e7eb',
          borderRadius: '4px',
          backgroundColor: isSelected ? '#fffbeb' : isEmpty ? '#f9fafb' : 'white',
          position: 'relative',
          minHeight: '80px',
          transition: 'all 0.2s ease'
        }}
      >
        {/* Column Header */}
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '8px',
          backgroundColor: isSelected ? '#f59e0b' : '#d1d5db',
          color: isSelected ? 'white' : '#374151',
          padding: '1px 6px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '600'
        }}>
          {element.name || 'Col'}
        </div>

        {/* Column Management */}
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '4px',
            display: 'flex',
            gap: '2px'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateColumn(rowElement, columnIndex);
              }}
              style={{
                padding: '2px 4px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '8px',
                cursor: 'pointer'
              }}
              title="Duplicate Column"
            >
              <Copy size={8} />
            </button>
            
            {canRemoveColumn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveColumn(rowElement, columnIndex);
                }}
                style={{
                  padding: '2px 4px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '8px',
                  cursor: 'pointer'
                }}
                title="Remove Column"
              >
                <Trash2 size={8} />
              </button>
            )}
          </div>
        )}

        {/* Column Content */}
        <div style={{ marginTop: '4px' }}>
          {isEmpty ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              color: '#9ca3af',
              fontSize: '11px',
              fontStyle: 'italic'
            }}>
              Drop elements here
            </div>
          ) : (
            element.children?.map(child => (
              <ElementWrapper 
                key={child.id} 
                element={child}
                isSelected={selectedElementId === child.id}
                onSelect={selectElement}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`enhanced-canvas ${viewportMode.toLowerCase()}`}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        position: 'relative'
      }}
    >
      {/* Canvas Controls */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>
            Enhanced Canvas
          </h2>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {viewportMode}
          </div>
        </div>
        
        <button
          onClick={handleAddSection}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {/* Canvas Content */}
      <div 
        ref={setNodeRef}
        className={`canvas-content ${isOver ? 'canvas-content--over' : ''}`}
        onClick={handleCanvasClick}
        style={{
          padding: '2rem',
          minHeight: 'calc(100vh - 80px)'
        }}
      >
        {elements.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: '#9ca3af',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🏗️</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '20px', fontWeight: '600' }}>
              Canvas is Ready
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '14px', maxWidth: '400px' }}>
              Start building by adding sections. Each section can contain rows, and each row can contain columns with your content.
            </p>
            <button
              onClick={handleAddSection}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={20} />
              Create First Section
            </button>
          </div>
        ) : (
          <SortableContext items={elements.map(el => el.id)} strategy={verticalListSortingStrategy}>
            <div className="canvas-sections">
              {elements.map(element => renderSectionBoundaries(element))}
            </div>
          </SortableContext>
        )}
      </div>

      {/* Visual Aids */}
      {showGrid && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
          opacity: 0.3
        }} />
      )}
    </div>
  );
};