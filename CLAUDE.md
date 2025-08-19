# Landing Page Builder Project

## Overview
A modern website/landing page builder similar to GoHighLevel and other professional builders, built with React, TypeScript, and modern web technologies.

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

### 🚧 Phase 2: Component Library (IN PROGRESS)
- **Component Definitions**: 25+ professional components defined
  - Layout: Section, Container, Row, Column, Spacer, Divider
  - Content: Heading, Paragraph, Text, List, Quote, Code Block
  - Media: Image, Video, Icon, Gallery, Background Video
  - Interactive: Button, Link, Accordion, Tabs, Modal, Popup
  - Forms: Input, Textarea, Select, Checkbox, Radio, Form
  - Business: Pricing Table, Testimonial, FAQ, Team Member, Contact Card
  - Advanced: HTML Block, Embed, Custom CSS
- **Property Schemas**: Dynamic property definitions for each component
- **Component Categories**: Organized with icons and descriptions

### 📋 Phase 3: Dynamic Property Editor (PENDING)
- Context-aware property panels
- Live preview updates
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
- [ ] Drag-and-drop page builder
- [ ] Component palette with reusable elements
- [ ] Real-time visual editing
- [ ] Responsive design controls
- [ ] Undo/redo functionality
- [ ] Copy/paste components
- [ ] Layer management

### Components Library
- [ ] Text elements (headings, paragraphs)
- [ ] Media (images, videos, icons)
- [ ] Layout (containers, columns, spacers)
- [ ] Forms (input fields, buttons, contact forms)
- [ ] Navigation (menus, breadcrumbs)
- [ ] Interactive (accordions, tabs, modals)
- [ ] E-commerce (product cards, pricing tables)

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

## Notes
- Focus on user experience and intuitive design
- Ensure mobile-first responsive design
- Maintain clean, maintainable code structure
- Follow React best practices and patterns