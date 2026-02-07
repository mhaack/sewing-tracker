# Project Structure

This document outlines the organization of the Sewing Tracker project files.

## Directory Structure

```
sewing-tracker/
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_projects_table.sql   # Database schema
│   │   └── 002_create_storage_bucket.sql   # Storage configuration
│   └── seed.sql                             # Sample data for testing
├── src/
│   ├── lib/
│   │   └── supabase.ts                      # Supabase client initialization
│   ├── services/
│   │   └── projectService.ts                # CRUD operations & business logic
│   ├── types/
│   │   └── database.ts                      # TypeScript type definitions
│   └── examples/
│       └── react-integration.tsx            # Example React integration
├── .env.example                             # Environment variables template
├── .gitignore                               # Git ignore rules
├── package.json                             # Project dependencies
├── tsconfig.json                            # TypeScript configuration
├── SUPABASE_SETUP.md                        # Setup instructions
├── PROJECT_STRUCTURE.md                     # This file
├── app.js                                   # Original React app (localStorage)
├── index.html                               # HTML entry point
└── style.css                                # Styles

```

## File Descriptions

### Configuration Files

**`.env.example`**
- Template for environment variables
- Copy to `.env` and fill in your Supabase credentials
- Never commit `.env` to version control

**`tsconfig.json`**
- TypeScript compiler configuration
- Targets ES2020 with strict type checking
- Configured for modern bundlers (Vite)

**`package.json`**
- Project metadata and dependencies
- Scripts for development and building
- Main dependency: `@supabase/supabase-js`

**`.gitignore`**
- Specifies files to exclude from version control
- Includes `.env`, `node_modules/`, and build outputs

### Supabase Files

**`supabase/migrations/001_create_projects_table.sql`**
- Creates the `projects` table with all columns
- Adds indexes for performance
- Sets up automatic `updated_at` trigger
- Configures Row Level Security (RLS) policies
- **Usage**: Run this SQL in Supabase SQL Editor

**`supabase/migrations/002_create_storage_bucket.sql`**
- Creates a storage bucket for project photos
- Configures access policies for the bucket
- Optional: Only needed if you want photo uploads
- **Usage**: Run this SQL if you want storage features

**`supabase/seed.sql`**
- Sample data for testing
- Contains 5 example sewing projects
- **Usage**: Run this to populate your database with test data

### Source Code (TypeScript)

**`src/lib/supabase.ts`**
- Initializes and exports the Supabase client
- Reads environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
- Configures authentication persistence
- **Import**: `import { supabase } from '@/lib/supabase'`

**`src/types/database.ts`**
- TypeScript type definitions for the database schema
- **Types**:
  - `Database`: Overall database structure
  - `Project`: Row type (database format, snake_case)
  - `ProjectInsert`: Type for inserting new records
  - `ProjectUpdate`: Type for updating records
  - `ProjectData`: Frontend-friendly type (camelCase)
- **Import**: `import type { ProjectData } from '@/types/database'`

**`src/services/projectService.ts`**
- Business logic and CRUD operations
- Handles data transformation (snake_case ↔ camelCase)
- **Functions**:
  - `getProjects()`: Fetch all projects
  - `getProject(id)`: Fetch single project
  - `createProject(data)`: Create new project
  - `updateProject(id, data)`: Update existing project
  - `deleteProject(id)`: Delete project
  - `getProjectStats()`: Get aggregated statistics
  - `subscribeToProjects(callback)`: Real-time updates
- **Import**: `import { getProjects, createProject } from '@/services/projectService'`

**`src/examples/react-integration.tsx`**
- Complete example of integrating Supabase with React
- Shows how to replace localStorage with Supabase
- Includes error handling and loading states
- Demonstrates real-time subscriptions
- **Usage**: Reference this when updating your React app

### Original Application Files

**`index.html`**
- HTML entry point with embedded styles
- Loads React and Babel from CDN
- Contains inline React application
- **Note**: Will need to be split for proper TypeScript/Vite setup

**`app.js`**
- Original React application using localStorage
- Currently stores data in browser only
- **Migration**: See `react-integration.tsx` for Supabase version

**`style.css`**
- Application styles (if extracted from HTML)

## Data Flow

```
Frontend (React)          Service Layer              Supabase
     │                         │                         │
     │  getProjects()          │                         │
     ├────────────────────────>│  SELECT * FROM          │
     │                         │  projects               │
     │                         ├────────────────────────>│
     │                         │                         │
     │                         │<────────────────────────┤
     │  ProjectData[]          │                         │
     │<────────────────────────┤                         │
     │                         │                         │
     │  createProject(data)    │                         │
     ├────────────────────────>│  INSERT INTO            │
     │                         │  projects               │
     │                         ├────────────────────────>│
     │                         │                         │
     │  Real-time Updates      │  Postgres LISTEN/       │
     │<────────────────────────┤<────────────────────────┤
     │                         │  NOTIFY                 │
```

## Type Conversions

The service layer handles conversion between frontend and database formats:

**Frontend (camelCase)** → **Database (snake_case)**
```typescript
{
  name: "Floral Dress",
  instagramLink: "https://...",
  fabrics: ["Cotton", "Linen"],
  moneySpent: 45.50,
  fabricUsed: 2.5,
  timeSpent: 8.0,
  comments: "Great project!"
}

↓ toProjectInsert()

{
  name: "Floral Dress",
  instagram_link: "https://...",
  fabrics: ["Cotton", "Linen"],
  money_spent: 45.50,
  fabric_used: 2.5,
  time_spent: 8.0,
  comments: "Great project!"
}
```

**Database** → **Frontend**
```typescript
{
  id: "uuid...",
  name: "Floral Dress",
  instagram_link: "https://...",
  fabrics: ["Cotton", "Linen"],
  money_spent: 45.50,
  fabric_used: 2.5,
  time_spent: 8.0,
  comments: "Great project!",
  created_at: "2024-02-06T12:00:00Z",
  updated_at: "2024-02-06T12:00:00Z"
}

↓ toProjectData()

{
  id: "uuid...",
  name: "Floral Dress",
  instagramLink: "https://...",
  fabrics: ["Cotton", "Linen"],
  moneySpent: 45.50,
  fabricUsed: 2.5,
  timeSpent: 8.0,
  comments: "Great project!",
  createdAt: "2024-02-06T12:00:00Z",
  updatedAt: "2024-02-06T12:00:00Z"
}
```

## Environment Variables

Required variables in `.env`:

```env
# Get these from Supabase Dashboard → Settings → API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...

# Environment variables for Supabase connection:
# VITE_ prefix is required for Vite to expose these to the browser
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

The `supabase.ts` client supports both naming conventions.

## Usage Examples

### Fetching Projects

```typescript
import { getProjects } from '@/services/projectService';

const projects = await getProjects();
console.log(projects); // Array of ProjectData
```

### Creating a Project

```typescript
import { createProject } from '@/services/projectService';

const newProject = await createProject({
  name: 'Summer Dress',
  fabrics: ['Cotton'],
  moneySpent: 25.00,
  fabricUsed: 2.0,
  timeSpent: 5.0,
  instagramLink: '',
  comments: ''
});
```

### Real-time Subscriptions

```typescript
import { subscribeToProjects } from '@/services/projectService';

const unsubscribe = subscribeToProjects((payload) => {
  if (payload.eventType === 'INSERT') {
    console.log('New project added:', payload.new);
  } else if (payload.eventType === 'UPDATE') {
    console.log('Project updated:', payload.new);
  } else if (payload.eventType === 'DELETE') {
    console.log('Project deleted:', payload.old);
  }
});

// Later: unsubscribe when component unmounts
unsubscribe();
```

## Next Steps

1. **Set up Supabase**: Follow `SUPABASE_SETUP.md`
2. **Configure environment**: Copy `.env.example` to `.env`
3. **Run migrations**: Execute SQL files in Supabase SQL Editor
4. **Update React app**: Use `react-integration.tsx` as reference
5. **Test with sample data**: Run `seed.sql` for test projects

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
