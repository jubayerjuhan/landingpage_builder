import React from 'react';
import { BuilderPage } from './pages/BuilderPage';
import { TestNewComponents } from './components/TestNewComponents';
import { TestModalSystem } from './components/TestModalSystem';
import { TestPhase2Integration } from './components/TestPhase2Integration';
import { TestPhase2Complete } from './components/TestPhase2Complete';

function App() {
  // Test pages
  if (window.location.search.includes('test=components')) {
    return <TestNewComponents />;
  }
  
  if (window.location.search.includes('test=modals')) {
    return <TestModalSystem />;
  }

  if (window.location.search.includes('test=phase2')) {
    return <TestPhase2Integration />;
  }

  if (window.location.search.includes('test=complete')) {
    return <TestPhase2Complete />;
  }
  
  // Show Phase 2 complete by default for ?test=true
  if (window.location.search.includes('test=true')) {
    return <TestPhase2Complete />;
  }
  
  return <BuilderPage />;
}

export default App;
