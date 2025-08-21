import React from 'react';
import { ModalContainer } from './modals';
import useModalStore from '../stores/modalStore';

export const TestModalSystem: React.FC = () => {
  const { openAddSectionModal, openAddRowModal } = useModalStore();

  const handleTestSectionModal = () => {
    openAddSectionModal();
  };

  const handleTestRowModal = () => {
    openAddRowModal('test-section-id');
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem', color: '#111827' }}>
        Modal System Test
      </h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={handleTestSectionModal}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#3b82f6';
          }}
        >
          Test Add Section Modal
        </button>
        
        <button
          onClick={handleTestRowModal}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#059669';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#10b981';
          }}
        >
          Test Add Row Modal
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
        <h2 style={{ margin: '0 0 1rem 0', color: '#1e40af' }}>
          ✅ Modal System Features
        </h2>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
          <li>✅ <strong>AddSectionModal</strong> - Choose section types (Full Width, Wide, Medium, Small)</li>
          <li>✅ <strong>AddRowModal</strong> - Select column layouts (1-6 columns) with gap and alignment settings</li>
          <li>✅ <strong>Modal Store</strong> - Zustand state management for modal data</li>
          <li>✅ <strong>GoHighLevel Styling</strong> - Matching visual design and UX patterns</li>
          <li>✅ <strong>Modal Container</strong> - Centralized modal rendering system</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>
          📋 Next Steps
        </h3>
        <p style={{ margin: 0, color: '#92400e' }}>
          Phase 1 Complete! Ready to implement Phase 2: Canvas System Integration
        </p>
      </div>

      {/* Render modals */}
      <ModalContainer />
    </div>
  );
};