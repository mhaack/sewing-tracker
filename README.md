# Sewing Tracker

A beautiful sewing project tracker built with Lit and Supabase. Track your projects, materials, time spent, and costs all in one place.

[![Repository](https://img.shields.io/badge/GitHub-mhaack%2Fsewing--tracker-blue)](https://github.com/mhaack/sewing-tracker)

## 🔗 Repository

**GitHub**: [https://github.com/mhaack/sewing-tracker](https://github.com/mhaack/sewing-tracker)

## Features

- **Project Management**: Create, edit, and delete sewing projects
- **Track Materials**: Record fabrics used with array support
- **Cost Tracking**: Monitor money spent on each project
- **Time Tracking**: Log hours spent sewing
- **Instagram Integration**: Link projects to Instagram posts
- **Real-time Updates**: See changes instantly with Supabase real-time
- **Cloud Storage**: All data stored securely in Supabase PostgreSQL
- **Type Safety**: Full TypeScript support

## Tech Stack

- **Frontend**: Lit (Web Components)
- **Backend**: Supabase (PostgreSQL, Real-time)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with elegant design system
- **Hosting**: Netlify (deployment ready)

## Getting Started

Choose your path:

### Quick Start (10 minutes)
```bash
# Read this first
cat QUICK_START.md
```

### Detailed Setup
```bash
# Read this for in-depth instructions
cat SUPABASE_SETUP.md
```

## Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get up and running in 10 minutes
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete setup guide with troubleshooting
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - File organization and architecture

## Project Structure

```
sewing-tracker/
├── supabase/
│   ├── migrations/          # Database schema
│   │   ├── 001_create_projects_table.sql
│   │   └── 002_create_storage_bucket.sql
│   └── seed.sql            # Sample data
├── src/
│   ├── lib/
│   │   └── supabase.ts     # Supabase client
│   ├── services/
│   │   └── projectService.ts  # CRUD operations
│   ├── types/
│   │   └── database.ts     # TypeScript types
│   └── examples/
│       └── react-integration.tsx  # React example
├── .env.example            # Environment template
├── package.json            # Dependencies
└── tsconfig.json          # TypeScript config
```

## Database Schema

### Projects Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Project name (required) |
| instagram_link | text | Instagram post URL |
| fabrics | text[] | Array of fabric names |
| money_spent | numeric | Cost in dollars |
| fabric_used | numeric | Fabric in meters |
| time_spent | numeric | Time in hours |
| comments | text | Project notes |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

## API Usage

### Initialize Client

```typescript
import { supabase } from './lib/supabase';
```

### Using the Service Layer (Recommended)

```typescript
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  subscribeToProjects
} from './services/projectService';

// Fetch all projects
const projects = await getProjects();

// Create a project
const newProject = await createProject({
  name: 'Summer Dress',
  fabrics: ['Cotton', 'Linen'],
  moneySpent: 45.50,
  fabricUsed: 2.5,
  timeSpent: 8.0,
  comments: 'First dress project!'
});

// Update a project
await updateProject(projectId, {
  name: 'Updated Name',
  moneySpent: 50.00
});

// Delete a project
await deleteProject(projectId);

// Subscribe to real-time updates
const unsubscribe = subscribeToProjects((payload) => {
  console.log('Change detected:', payload);
});
```

### Direct Supabase Queries

```typescript
import { supabase } from './lib/supabase';

// Fetch projects
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .order('created_at', { ascending: false });

// Insert project
const { data, error } = await supabase
  .from('projects')
  .insert({
    name: 'New Project',
    fabrics: ['Cotton']
  })
  .select()
  .single();
```

## TypeScript Types

```typescript
import type { ProjectData } from './types/database';

const project: ProjectData = {
  name: 'Floral Dress',
  instagramLink: 'https://instagram.com/p/example',
  fabrics: ['Cotton floral print', 'Cotton lining'],
  moneySpent: 45.50,
  fabricUsed: 2.5,
  timeSpent: 8.0,
  comments: 'Great project!'
};
```

## Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from: Supabase Dashboard → Settings → API

## Scripts

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

## Features in Detail

### Automatic Timestamps

The database automatically manages `created_at` and `updated_at` timestamps:
- `created_at`: Set when record is created
- `updated_at`: Updated automatically on every change

### Array Support

The `fabrics` column uses PostgreSQL arrays, allowing multiple fabric entries per project:

```typescript
fabrics: ['Cotton floral print', 'Cotton lining', 'Interfacing']
```

### Real-time Subscriptions

Get instant updates when data changes:

```typescript
subscribeToProjects((payload) => {
  if (payload.eventType === 'INSERT') {
    // New project added
  } else if (payload.eventType === 'UPDATE') {
    // Project updated
  } else if (payload.eventType === 'DELETE') {
    // Project deleted
  }
});
```

### Row Level Security

Database access is controlled by RLS policies:
- Currently configured for public access (development)
- Can be restricted to authenticated users (production)
- See SUPABASE_SETUP.md for security recommendations

## Optional Features

### Photo Storage

Run the storage migration to enable photo uploads:

```sql
-- In Supabase SQL Editor
\i supabase/migrations/002_create_storage_bucket.sql
```

Then upload photos:

```typescript
const { data, error } = await supabase.storage
  .from('project-photos')
  .upload(`${projectId}/photo.jpg`, file);
```

### Statistics View

Get aggregated statistics:

```typescript
import { getProjectStats } from './services/projectService';

const stats = await getProjectStats();
// {
//   totalProjects: 10,
//   totalSpent: 450.00,
//   totalFabric: 25.5,
//   totalTime: 80.0
// }
```

## Migration from localStorage

The original app uses localStorage. To migrate to Supabase:

1. See `src/examples/react-integration.tsx` for a complete example
2. Replace localStorage calls with service functions
3. Add loading and error states
4. Optionally add real-time subscriptions

Key changes:
```typescript
// Before
localStorage.setItem('projects', JSON.stringify(projects));
const saved = localStorage.getItem('projects');

// After
await createProject(project);
const projects = await getProjects();
```

## Production Considerations

### Security

1. **Add Authentication**:
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'password'
   });
   ```

2. **Update RLS Policies**:
   ```sql
   -- Only allow authenticated users
   CREATE POLICY "Authenticated users only"
     ON projects FOR ALL
     USING (auth.role() = 'authenticated');
   ```

3. **Add User Ownership**:
   ```sql
   ALTER TABLE projects ADD COLUMN user_id UUID REFERENCES auth.users(id);
   ```

### Performance

- Indexes are already configured for `created_at` and `name`
- Consider pagination for large datasets:
  ```typescript
  const { data } = await supabase
    .from('projects')
    .select('*')
    .range(0, 9); // First 10 items
  ```

### Monitoring

- Use Supabase Dashboard for usage metrics
- Enable logging for debugging
- Set up alerts for errors

## Troubleshooting

See the [SUPABASE_SETUP.md](SUPABASE_SETUP.md) troubleshooting section.

Common issues:
- Environment variables not set
- Migration SQL not run
- API keys incorrect
- RLS policies missing

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Arrays](https://www.postgresql.org/docs/current/arrays.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Support

- Check the documentation files in this project
- Visit [Supabase Discord](https://discord.supabase.com)
- Review [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)

---

Built with love by sewers, for sewers.
