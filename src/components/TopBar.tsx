import React from 'react';
import { Undo, Redo, Eye, Globe } from 'lucide-react';
import './TopBar.module.scss';

export const TopBar: React.FC = () => {
  return (
    <div className="topbar">
      <div className="topbar__left">
        <div className="topbar__logo">Builder</div>
      </div>
      
      <div className="topbar__center">
        <button className="topbar__button topbar__button--secondary">
          <Undo size={16} />
          <span>Undo</span>
        </button>
        <button className="topbar__button topbar__button--secondary">
          <Redo size={16} />
          <span>Redo</span>
        </button>
        <button className="topbar__button topbar__button--secondary">
          <Eye size={16} />
          <span>Preview</span>
        </button>
      </div>

      <div className="topbar__right">
        <button className="topbar__button topbar__button--primary">
          <Globe size={16} />
          <span>Publish</span>
        </button>
      </div>
    </div>
  );
};