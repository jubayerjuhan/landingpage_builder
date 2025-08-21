import React from 'react';
import { AddSectionModal } from './AddSectionModal';
import { AddRowModal } from './AddRowModal';

/**
 * Container component that renders all modals
 * This should be placed at the root level of the app
 */
export const ModalContainer: React.FC = () => {
  return (
    <>
      <AddSectionModal />
      <AddRowModal />
    </>
  );
};