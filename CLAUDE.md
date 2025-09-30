# Landing Page Builder Project

## Overview
A modern website/landing page builder similar to GoHighLevel and other professional builders, built with React, TypeScript, and modern web technologies.

## Important Development Conventions

### CSS Modules Convention
**ALWAYS use CSS Modules for styling components:**
- Use `.module.scss` files for component styles
- Import styles as: `import styles from './ComponentName.module.scss'`
- Apply styles using: `className={styles.className}` (NOT `className="className"`)
- Use camelCase for class names in SCSS files (e.g., `.topBar`, `.leftSidebar`, `.buttonPrimary`)
- This ensures locally scoped styles and prevents CSS conflicts

**CRITICAL REMINDER FOR ALL NEW COMPONENTS:**
- Never use plain class names like `className="header"` or `className="button"`
- Always use the styles object: `className={styles.header}` or `className={styles.button}`
- For multiple classes: `className={`${styles.button} ${styles.primary}`}`
- This convention is mandatory for all component styling in this project

## Project Goals
Create a no-code drag-and-drop website builder with features like:
- Visual page builder with drag-and-drop interface
- Component library (text, images, buttons, forms, etc.)
- Responsive design for mobile/desktop
- Template library
- Real-time preview
- Export functionality
- Lead generation tools
- SEO optimization features

## Technology Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Sass
- **Drag & Drop**: @dnd-kit
- **State Management**: Zustand
- **Icons**: Lucide React

## Development Commands
```bash
# Start development server
pnpm run dev

# Type check
pnpm run typecheck

# Lint code
pnpm run lint

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Package Manager
This project uses **pnpm** as the package manager. Always use pnpm commands.

## Current Implementation Status

### ✅ Phase 1: Core Architecture (COMPLETED)
- **Unified Type System**: Comprehensive TypeScript interfaces for all components
- **Multi-Store State Management**: Professional Zustand stores
  - ElementStore: Element CRUD, selection, clipboard operations
  - CanvasStore: Viewport management, visual aids, canvas state
  - HistoryStore: Undo/redo with batching, 50+ action types
  - UIStore: Panel management, notifications, loading states
- **Enhanced Drag & Drop**: Professional @dnd-kit integration
  - Multi-zone dropping with visual feedback
  - Snap-to-grid and snap-to-elements
  - Drag previews and drop indicators
  - Constraint validation and component relationships

### ✅ Phase 2: Component Library (CORE COMPLETED)
- **Component Architecture**: Professional component system implemented
  - ElementWrapper: Consistent interaction handling (selection, hover, drag-and-drop)
  - ElementRenderer: Modern renderer using BuilderElement system
  - styleUtils: Converts BuilderElement properties to CSS styles
  - elementFactory: Creates elements from COMPONENT_DEFINITIONS
- **Implemented Components** (20+ functional):
  - ✅ **Layout** (6): Section, Container, Row, Column, Spacer, Divider
  - ✅ **Content** (6): Heading, Paragraph, Text, List, Quote, Code Block
  - ✅ **Media** (5): Image, Video, Icon, Gallery, Background Video
  - ✅ **Interactive** (6): Button, Link, Accordion, Tabs, Modal, Popup
  - ✅ **Forms** (2): Input, Textarea
  - 📋 **Business** (5): Pricing Table, Testimonial, FAQ, Team Member, Contact Card - *PENDING*
  - 📋 **Advanced** (3): HTML Block, Embed, Custom CSS - *PENDING*
- **Property Schemas**: Complete dynamic property definitions for each component
- **Responsive Support**: Viewport-aware styling and breakpoint management
- **Development Server**: Running on port 5555 with test page at `/?test=true`

### 📋 Phase 2.5: Property Editor Integration (PENDING)
- Dynamic property panels based on component schemas
- Live preview updates when properties change
- Responsive editing controls for different viewports
- Validation and conditional field display

### 📋 Phase 3: Advanced Features (PENDING)
- Template system with professional designs
- Advanced drag-and-drop with constraints
- Responsive design controls
- Batch editing capabilities

### 📋 Phase 4: Template System & Export (PENDING)
- Professional template library
- Export to HTML/CSS/React
- Performance optimization
- SEO optimization

## Key Features to Implement
Based on research of modern builders like GoHighLevel:

### Core Builder Features
- [x] Drag-and-drop page builder (foundation ready)
- [x] Component palette with reusable elements
- [x] Real-time visual editing (ElementRenderer)
- [ ] Responsive design controls (partially implemented)
- [x] Undo/redo functionality (HistoryStore)
- [x] Copy/paste components (ElementStore)
- [ ] Layer management

### Components Library  
- [x] Text elements (headings, paragraphs, text)
- [x] Media (images, videos, icons, galleries)
- [x] Layout (containers, columns, spacers, sections)
- [x] Forms (input fields, textareas) 
- [ ] Navigation (menus, breadcrumbs) - *Advanced components pending*
- [x] Interactive (accordions, tabs, modals, buttons)
- [ ] E-commerce (product cards, pricing tables) - *Business components pending*

### Templates & Themes
- [ ] Template library with industry-specific designs
- [ ] Theme customization (colors, fonts, spacing)
- [ ] Global styles management
- [ ] Brand kit integration

### Advanced Features
- [ ] SEO optimization tools
- [ ] Performance optimization
- [ ] A/B testing capabilities
- [ ] Analytics integration
- [ ] Form submission handling
- [ ] Lead capture tools
- [ ] Export to HTML/CSS
- [ ] Custom domain support

## Current Architecture
- Component-based architecture with reusable UI elements
- State management with Zustand for builder state
- SCSS modules for component styling
- TypeScript for type safety

## Current Development Status (Updated September 2025)

### 🚀 CURRENT STATUS: PRODUCTION-READY FOUNDATION
**Status**: ✅ **FULLY FUNCTIONAL BUILDER**

### **✅ COMPLETED CORE SYSTEM**
- **Architecture**: Modern React 19 + TypeScript + Vite + 7 Zustand stores
- **Builder Engine**: Professional drag-and-drop with @dnd-kit, multi-zone dropping
- **Canvas System**: Advanced canvas with zoom (25-200%), grid, rulers, preview mode
- **Element System**: Complete Section → Row → Column → Element hierarchy
- **Editing Features**: Selection, inline editing, resize handles, drag reordering, undo/redo
- **Property Editor**: Working property editor with component-specific controls
- **Video Integration**: Vidstack player fully integrated across all components

### **✅ COMPONENT LIBRARY STATUS**
- **Layout** (✅ Complete): Section, Container, Row, Column, Spacer, Divider
- **Content** (✅ Complete): Heading, Paragraph, Text, List, Quote, Code Block
- **Media** (✅ Complete): Image, Video, Icon, Gallery, Background Video
- **Interactive** (✅ Complete): Button, Link, Accordion, Tabs, Modal, Popup
- **Forms** (✅ Complete): Input, Textarea
- **Business** (📋 Pending): Pricing Table, Testimonial, FAQ, Team Member, Contact Card
- **Advanced** (📋 Pending): HTML Block, Embed, Custom CSS

### **✅ PROFESSIONAL FEATURES WORKING**
1. **Visual Builder**: Full drag-and-drop with visual feedback
2. **Layout Management**: Automatic section/row/column creation
3. **Element Editing**: Click to select, double-click to edit text, resize handles
4. **Property Panel**: Dynamic property controls for each component type
5. **Preview Mode**: Full-screen preview with escape key toggle
6. **Canvas Controls**: Zoom, grid overlay, rulers, responsive viewport simulation
7. **History**: Complete undo/redo system with keyboard shortcuts

### **📋 IMMEDIATE PRIORITIES**

#### **Phase 1: Complete Component Library (1-2 hours)**
- Implement missing Business components (5 components)
- Implement missing Advanced components (3 components)
- Ensure all components work with existing property editor

#### **Phase 2: Enhanced Property Editor (2-3 hours)**
- Grouped property panels (Layout, Typography, Colors, Spacing)
- Responsive editing controls (desktop/tablet/mobile breakpoints)
- Advanced styling options (shadows, borders, animations)
- Live preview updates

#### **Phase 3: Template System (3-4 hours)**
- Pre-built section templates (Hero, Navbar, Footer, Pricing, etc.)
- Template gallery with preview
- One-click template insertion
- Template categories and search

#### **Phase 4: Professional Features (2-3 hours)**
- Export to HTML/CSS
- Save/Load functionality
- Performance optimizations
- Advanced responsive controls

### **🎯 TRANSFORMATION ROADMAP**
The foundation is solid. Focus areas for professional SaaS transformation:

1. **UI/UX Polish**: Enhanced design system, better visual hierarchy
2. **Template Library**: 20+ professional pre-built sections
3. **Export System**: One-click deployment, HTML/CSS generation
4. **Advanced Editing**: Multi-select, batch operations, advanced styling
5. **Performance**: Lazy loading, optimized rendering, large page support

### **Development Server**
- **URL**: http://localhost:5556/ (auto-increments if 5555 in use)
- **Test Pages**: Add `?test=true` for component testing
- **Commands**: `pnpm run dev`, `pnpm run build`, `pnpm run typecheck`

## Notes
- Focus on user experience and intuitive design
- Ensure mobile-first responsive design
- Maintain clean, maintainable code structure
- Follow React best practices and patterns
- **Development server runs on port 5555**

## Git Commit Guidelines
- **NEVER include "Generated with Claude Code" or "Co-Authored-By: Claude" messages in git commits**
- Keep commit messages clean and professional
- Focus on describing the actual changes made