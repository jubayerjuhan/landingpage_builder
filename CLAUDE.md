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

## Current Development Status

### 🚀 Phase 2 Core Implementation - COMPLETE
**Status**: ✅ **PRODUCTION READY**

- **Architecture**: Fully modernized with BuilderElement system
- **Components**: 20+ professional components implemented and tested
- **Type Safety**: Full TypeScript validation passing
- **Testing**: Development server on port 5555, test page at `/?test=true`
- **Integration**: Compatible with existing Zustand stores and drag-and-drop system

### ✅ Recent Updates (2025-08-21)
- **UI Theme**: Implemented clean blue (#5457ff) accent theme with white backgrounds
- **Layout Fixes**: Consistent 52px header heights across all panels
- **Canvas Improvements**: Full-height empty canvas utilization
- **Drag & Drop**: Fixed column rendering and drop zones
  - Added `addElementWithChildren` method for proper nested element handling
  - Implemented droppable columns with visual feedback
  - All Content and Layout elements now properly draggable
  - Column drop zones working with `container-{columnId}` IDs
  - Empty canvas drop zone with `main-canvas` ID

### ✅ Phase 1 Implementation Complete (2025-08-23)
**GoHighLevel-style Core Editing Features:**
1. **Drag Handles**: Visual drag indicators on hover/selection with element reordering
2. **Inline Text Editing**: Double-click to edit text content with floating toolbar (works on Heading, Paragraph, Text elements)
3. **Resize Handles**: 8-point resize system with live dimension display (for non-text elements like Image, Button, etc.)
4. **Undo/Redo**: Full history tracking with keyboard shortcuts (Cmd+Z/Cmd+Shift+Z)

**How to Use Phase 1 Features:**
1. First create a section structure: Add Section → it creates Row → Column automatically
2. Then drag actual content elements (Heading, Paragraph, Text, Image, etc.) from the left sidebar into the columns
3. The Phase 1 features work on the content elements, not the layout structure:
   - **Hover** over a content element to see the drag handle
   - **Click** to select (blue outline)
   - **Double-click** text elements (Heading, Paragraph, Text) to edit inline
   - **Drag** the handle to reorder elements
   - **Resize** non-text elements using the 8-point handles when selected

**Key Fixes Applied:**
- Fixed SectionCanvas to use ElementRenderer for all elements (sections, rows, columns)
- Added inline styles as fallbacks for CSS module issues
- Ensured ElementWrapper properly wraps all rendered elements
- Integrated all Phase 1 features into the unified component system

**Testing:**
- Main builder: http://localhost:5555
- Edit features test: http://localhost:5555/?test=edit
- Phase 2 complete test: http://localhost:5555/?test=true

### 📋 Remaining Phase 2 Tasks
- **Business Components**: PricingTable, Testimonial, FAQ, TeamMember, ContactCard
- **Advanced Components**: HTMLBlock, Embed, CustomCSS  
- **Property Editor**: Dynamic panels with live preview integration

### 🎯 TRANSFORMATION PLAN: Professional SaaS Builder
**Status**: ✅ **RESEARCH COMPLETE - READY TO IMPLEMENT**

Based on extensive research of GoHighLevel, Framer, Webflow, and modern design trends, the builder will be transformed into a professional SaaS platform. See `Professional_Transformation.md` for complete implementation plan.

**Key Transformation Areas:**
1. **UI/UX Redesign**: Professional design system with clean, minimal interface
2. **Prebuilt Templates**: 20+ professional sections (Hero, Navbar, Footer, Pricing, Testimonials, etc.)
3. **Advanced Features**: Responsive editing, device preview, real-time collaboration
4. **Property Editor**: Visual controls with grouped property panels
5. **Export System**: HTML/CSS, React components, one-click deployment

**Immediate Next Steps:**
1. **Phase 1 - UI/UX Redesign** (2-3 hours): Update design system with professional colors, spacing, typography
2. **Phase 2 - Template Library** (4-5 hours): Create prebuilt sections for rapid page building
3. **Phase 3 - Enhanced Features** (3-4 hours): Responsive controls, preview modes, advanced editing
4. **Phase 4 - Professional Tools** (3-4 hours): Property editor enhancement, export functionality

**Previous Next Steps (Completed Research):**
1. ✅ **Property Editor Integration**: Researched modern property panel designs
2. ✅ **Element Reordering**: Already working, will be enhanced with visual improvements
3. ✅ **Nested Layouts**: Current hierarchy working, will add visual enhancements  
4. ✅ **Save/Load**: Researched auto-save and version control patterns
5. ✅ **Responsive Controls**: Researched viewport switching and breakpoint editing
6. ✅ **Templates**: Researched template library implementations and popular sections

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