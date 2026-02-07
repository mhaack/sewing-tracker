# Atelier - Sewing Project Tracker

A beautiful, modern sewing project tracker built with Vite, Lit, and TypeScript.

## Features

- Track sewing projects with detailed information
- Record fabrics used, costs, time spent, and measurements
- Beautiful "Atelier" design with custom fonts and colors
- Responsive layout for mobile and desktop
- Local storage support (Supabase integration available)
- Real-time statistics dashboard

## Tech Stack

- **Vite** - Fast build tool and dev server
- **Lit** - Lightweight web components library
- **TypeScript** - Type-safe development
- **CSS Custom Properties** - Theming and design system
- **Local Storage** - Data persistence (Supabase ready)

## Project Structure

```
src/
├── components/          # Lit web components
│   ├── app-shell.ts    # Main app component
│   ├── app-header.ts   # Header with stats
│   ├── project-form.ts # Add/edit project form
│   ├── project-card.ts # Individual project display
│   ├── project-list.ts # Project grid/list
│   └── stats-bar.ts    # Statistics display
├── types/              # TypeScript type definitions
│   ├── project.ts      # Project interfaces
│   └── database.ts     # Database types (for Supabase)
├── utils/              # Utility functions
│   └── storage.ts      # LocalStorage utilities
├── styles/             # Global styles
│   └── global.css      # CSS variables and base styles
└── main.ts             # App entry point

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Design System

### Colors

- **Cream** (#faf8f5) - Background
- **Terracotta** (#c17b63) - Primary accent
- **Sage** (#9db19d) - Secondary accent
- **Rose** (#b67a7f) - Delete actions
- **Charcoal** (#2d2d2d) - Text

### Typography

- **Cormorant Garamond** - Serif font for headings
- **Outfit** - Sans-serif font for body text

## Components

### App Shell (`app-shell`)

The main application component that manages state and coordinates child components.

**Properties:**
- Manages project list
- Handles form visibility
- Coordinates CRUD operations

### App Header (`app-header`)

Header component with branding and statistics bar.

**Properties:**
- `showForm` - Boolean to show/hide form
- `stats` - ProjectStats object

**Events:**
- `toggle-form` - Fired when new project button is clicked

### Project Form (`project-form`)

Form for creating and editing projects.

**Properties:**
- `editingProject` - Project to edit (null for new project)

**Events:**
- `submit-project` - Fired when form is submitted
- `cancel-form` - Fired when form is cancelled

### Project Card (`project-card`)

Displays an individual project with all its details.

**Properties:**
- `project` - Project object
- `index` - Card index for animation delay

**Events:**
- `edit-project` - Fired when edit button is clicked
- `delete-project` - Fired when delete button is clicked

### Project List (`project-list`)

Grid layout for displaying all projects.

**Properties:**
- `projects` - Array of Project objects

### Stats Bar (`stats-bar`)

Displays aggregated statistics across all projects.

**Properties:**
- `stats` - ProjectStats object with totals

## Data Model

### Project Interface

```typescript
interface Project {
  id: number;
  name: string;
  instagramLink: string;
  fabrics: string[];
  moneySpent: string;
  fabricUsed: string;
  timeSpent: string;
  comments: string;
}
```

### Project Stats Interface

```typescript
interface ProjectStats {
  totalProjects: number;
  totalSpent: number;
  totalFabric: number;
  totalTime: number;
}
```

## Storage

Currently uses browser localStorage for data persistence. Data is automatically saved when projects are created, updated, or deleted.

### Supabase Integration (Optional)

The project includes Supabase types and service layer for future backend integration. To enable:

1. Copy `.env.example` to `.env`
2. Add your Supabase credentials
3. Uncomment Supabase imports in components
4. Replace localStorage calls with Supabase service calls

## Animations

- Form slide down animation
- Project card fade-in-up with staggered delays
- Fabric tag fade-in animation
- Hover effects on cards and buttons

## Browser Support

Modern browsers with ES2020+ and Web Components support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Code Style

- Use TypeScript for type safety
- Follow Lit conventions for web components
- Use decorators for properties and state
- Keep components focused and single-purpose
- Use CSS custom properties for theming

### Adding New Components

1. Create component file in `src/components/`
2. Define component class with `@customElement` decorator
3. Define properties with `@property` or `@state` decorators
4. Implement `render()` method
5. Add component styles with `static styles`
6. Import in parent component or `main.ts`

## License

ISC

## Future Enhancements

- [ ] Supabase backend integration
- [ ] User authentication
- [ ] Image uploads for projects
- [ ] Pattern library integration
- [ ] Export/import functionality
- [ ] Tags and filtering
- [ ] Search functionality
- [ ] Dark mode
