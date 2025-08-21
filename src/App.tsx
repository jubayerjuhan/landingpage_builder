import React from 'react';
import { BuilderPage } from './pages/BuilderPage';
import { TestNewComponents } from './components/TestNewComponents';

function App() {
  // Temporarily show the test component to verify the new system works
  if (window.location.search.includes('test=true')) {
    return <TestNewComponents />;
  }
  
  return <BuilderPage />;
}

export default App;
