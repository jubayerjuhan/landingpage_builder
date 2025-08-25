import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { setupStoreIntegration, persistenceUtils } from './stores';

// Initialize store integration and persistence
setupStoreIntegration();

// Load any previously saved state
persistenceUtils.loadFromLocalStorage();

// Setup auto-save every 30 seconds
const cleanupAutoSave = persistenceUtils.setupAutoSave(30000);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  persistenceUtils.saveToLocalStorage();
  cleanupAutoSave?.();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
