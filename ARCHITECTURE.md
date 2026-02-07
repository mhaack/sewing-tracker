# Architecture Overview

This document explains the architecture of the Sewing Tracker application with Supabase backend.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Application (Browser)                 │   │
│  │  - User Interface                                        │   │
│  │  - State Management (useState, useEffect)                │   │
│  │  - Form Handling                                         │   │
│  │  - Event Handlers                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Import
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer (TypeScript)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              projectService.ts                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  - getProjects()                                   │  │   │
│  │  │  - getProject(id)                                  │  │   │
│  │  │  - createProject(data)                             │  │   │
│  │  │  - updateProject(id, data)                         │  │   │
│  │  │  - deleteProject(id)                               │  │   │
│  │  │  - getProjectStats()                               │  │   │
│  │  │  - subscribeToProjects(callback)                   │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  Data Transformation Layer:                               │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  toProjectData()   - DB → Frontend (snake→camel)  │  │   │
│  │  │  toProjectInsert() - Frontend → DB (camel→snake)  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Uses
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Client Layer                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  supabase.ts                             │   │
│  │  - Creates configured Supabase client                    │   │
│  │  - Handles authentication persistence                    │   │
│  │  - Manages environment variables                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS/WebSocket
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   PostgreSQL Database                    │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  projects table                                    │  │   │
│  │  │  - id (uuid, PK)                                   │  │   │
│  │  │  - name (text)                                     │  │   │
│  │  │  - instagram_link (text, nullable)                │  │   │
│  │  │  - fabrics (text[])                               │  │   │
│  │  │  - money_spent (numeric)                          │  │   │
│  │  │  - fabric_used (numeric)                          │  │   │
│  │  │  - time_spent (numeric)                           │  │   │
│  │  │  - comments (text, nullable)                      │  │   │
│  │  │  - created_at (timestamptz)                       │  │   │
│  │  │  - updated_at (timestamptz)                       │  │   │
│  │  │                                                       │  │   │
│  │  │  Indexes:                                             │  │   │
│  │  │  - idx_projects_created_at                           │  │   │
│  │  │  - idx_projects_name                                 │  │   │
│  │  │                                                       │  │   │
│  │  │  Triggers:                                            │  │   │
│  │  │  - set_updated_at (auto-update timestamp)           │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Row Level Security (RLS)                    │   │
│  │  - Allow public read access                              │   │
│  │  - Allow public insert access                            │   │
│  │  - Allow public update access                            │   │
│  │  - Allow public delete access                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 Real-time Engine                         │   │
│  │  - Postgres LISTEN/NOTIFY                                │   │
│  │  - WebSocket connections                                  │   │
│  │  - Change Data Capture (CDC)                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Storage (Optional)                      │   │
│  │  Bucket: project-photos                                  │   │
│  │  - Public read access                                     │   │
│  │  - Public write access                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Read Operation (GET Projects)

```
User Action                  Service Layer              Supabase
    │                             │                         │
    │  Click "Load Projects"      │                         │
    ├────────────────────────────>│                         │
    │                             │                         │
    │                             │  SELECT * FROM          │
    │                             │  projects               │
    │                             │  ORDER BY created_at    │
    │                             ├────────────────────────>│
    │                             │                         │
    │                             │  [PostgreSQL Query]     │
    │                             │                         │
    │                             │<────────────────────────┤
    │                             │  [{id, name, ...}]      │
    │                             │                         │
    │  [Transform to camelCase]   │                         │
    │                             │                         │
    │<────────────────────────────┤                         │
    │  ProjectData[]              │                         │
    │                             │                         │
    │  [Render in UI]             │                         │
    ▼                             │                         │
```

### Create Operation (POST Project)

```
User Action                  Service Layer              Supabase
    │                             │                         │
    │  Submit Form                │                         │
    ├────────────────────────────>│                         │
    │  {name, instagramLink,      │                         │
    │   fabrics, ...}             │                         │
    │                             │                         │
    │  [Transform to snake_case]  │                         │
    │                             │                         │
    │                             │  INSERT INTO            │
    │                             │  projects               │
    │                             │  (name, instagram_link, │
    │                             │   fabrics, ...)         │
    │                             │  VALUES (...)           │
    │                             │  RETURNING *            │
    │                             ├────────────────────────>│
    │                             │                         │
    │                             │  [Generate UUID]        │
    │                             │  [Set timestamps]       │
    │                             │  [Insert row]           │
    │                             │                         │
    │                             │<────────────────────────┤
    │                             │  {id, name, ...}        │
    │                             │                         │
    │  [Transform to camelCase]   │                         │
    │                             │                         │
    │<────────────────────────────┤                         │
    │  ProjectData                │                         │
    │                             │                         │
    │  [Update UI]                │                         │
    ▼                             │                         │
                                  │
                                  │  [Trigger Real-time]
                                  ▼
                            Other Clients
                        (Via WebSocket)
```

### Real-time Subscription

```
Client A                     Supabase                   Client B
    │                             │                         │
    │  subscribeToProjects()      │                         │
    ├────────────────────────────>│                         │
    │  [WebSocket Connect]        │                         │
    │<────────────────────────────┤                         │
    │  Connected                  │                         │
    │                             │                         │
    │                             │  subscribeToProjects()  │
    │                             │<────────────────────────┤
    │                             │  [WebSocket Connect]    │
    │                             │────────────────────────>│
    │                             │  Connected              │
    │                             │                         │
    │  createProject(...)         │                         │
    ├────────────────────────────>│                         │
    │                             │                         │
    │                    [INSERT to database]               │
    │                             │                         │
    │<────────────────────────────┤                         │
    │  {eventType: 'INSERT',      │                         │
    │   new: {...}}               │                         │
    │                             │                         │
    │                             ├────────────────────────>│
    │                             │  {eventType: 'INSERT',  │
    │                             │   new: {...}}           │
    │                             │                         │
    │  [Update UI]                │                [Update UI]
    ▼                             │                         ▼
```

## Type System Flow

```
┌──────────────────────────┐
│   Database Schema        │
│   (PostgreSQL)           │
│                          │
│   projects table:        │
│   - id: uuid             │
│   - name: text           │
│   - instagram_link: text │
│   - fabrics: text[]      │
│   - money_spent: numeric │
│   ...                    │
└────────────┬─────────────┘
             │
             │ Defined in
             ▼
┌──────────────────────────┐
│   TypeScript Types       │
│   (database.ts)          │
│                          │
│   interface Project {    │
│     id: string;          │
│     name: string;        │
│     instagram_link: ... │
│     fabrics: string[];   │
│     money_spent: number; │
│     ...                  │
│   }                      │
└────────────┬─────────────┘
             │
             │ Transformed by
             ▼
┌──────────────────────────┐
│   Frontend Types         │
│   (database.ts)          │
│                          │
│   interface ProjectData {│
│     id?: string;         │
│     name: string;        │
│     instagramLink?: ...  │
│     fabrics: string[];   │
│     moneySpent: number;  │
│     ...                  │
│   }                      │
└────────────┬─────────────┘
             │
             │ Used in
             ▼
┌──────────────────────────┐
│   React Components       │
│   (app.tsx)              │
│                          │
│   const [projects,       │
│     setProjects]         │
│   = useState<            │
│       ProjectData[]>()   │
│                          │
└──────────────────────────┘
```

## File Dependencies

```
index.html
    └── React CDN
        └── app.js (or app.tsx)
            └── imports projectService.ts
                ├── imports supabase.ts
                │   ├── imports @supabase/supabase-js
                │   └── imports database.ts (types)
                └── imports database.ts (types)
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                        Public Internet                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTPS Only
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Edge                           │
│  - Rate Limiting                                             │
│  - DDoS Protection                                           │
│  - API Key Validation                                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ Validated Request
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Row Level Security (RLS)                   │
│                                                              │
│  Policy: "Allow public read access"                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  SELECT * FROM projects WHERE true;                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  Policy: "Allow public insert access"                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  INSERT INTO projects (...) WHERE true;               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  (Similar for UPDATE and DELETE)                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ Policy Passed
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  - Execute query                                             │
│  - Return results                                            │
└─────────────────────────────────────────────────────────────┘
```

### Production Security Model (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Edge                           │
│  - API Key Validation                                        │
│  - Rate Limiting                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Authentication Layer                       │
│  - Verify JWT token                                          │
│  - Extract user ID                                           │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Row Level Security (RLS)                   │
│                                                              │
│  Policy: "Users can read their own projects"                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  SELECT * FROM projects                               │  │
│  │  WHERE user_id = auth.uid();                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  Policy: "Users can insert their own projects"              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  INSERT INTO projects (...)                           │  │
│  │  WHERE user_id = auth.uid();                          │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

### Database Level

1. **Indexes**:
   ```sql
   CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
   CREATE INDEX idx_projects_name ON projects(name);
   ```

2. **Query Optimization**:
   - Use `.select('*')` only when needed
   - Select specific columns: `.select('id, name, created_at')`
   - Use pagination: `.range(0, 9)`

3. **Connection Pooling**:
   - Handled automatically by Supabase
   - Persistent connections for real-time

### Application Level

1. **Caching**:
   ```typescript
   // Cache projects in React state
   const [projects, setProjects] = useState<ProjectData[]>([]);
   ```

2. **Debouncing**:
   ```typescript
   // Debounce search queries
   const debouncedSearch = useMemo(
     () => debounce(searchProjects, 300),
     []
   );
   ```

3. **Lazy Loading**:
   ```typescript
   // Load projects on demand
   useEffect(() => {
     if (visible) loadProjects();
   }, [visible]);
   ```

## Error Handling Strategy

```
User Action
    │
    ├─> Service Layer
    │       │
    │       ├─> Try Supabase Operation
    │       │       │
    │       │       ├─> Success
    │       │       │   └─> Transform Data
    │       │       │       └─> Return to User
    │       │       │
    │       │       └─> Error
    │       │           ├─> Log Error (console.error)
    │       │           ├─> Throw Descriptive Error
    │       │           └─> Return to User
    │       │
    │       └─> Catch in Component
    │               ├─> Set Error State
    │               ├─> Display Error Message
    │               └─> Allow Retry
    │
    └─> User sees error message
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CDN / Hosting                           │
│                   (Vercel, Netlify, etc.)                    │
│                                                              │
│  Static Assets:                                              │
│  - index.html                                                │
│  - app.js / app.tsx (bundled)                               │
│  - style.css                                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ API Calls
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                          │
│                   (Database + API + Storage)                 │
│                                                              │
│  Region: [Your Selected Region]                             │
│  Tier: Free / Pro / Enterprise                              │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Details

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React | UI components and state management |
| Type System | TypeScript | Type safety and developer experience |
| Build Tool | Vite | Fast bundling and dev server |
| Backend Platform | Supabase | Database, API, real-time, storage |
| Database | PostgreSQL | Relational data storage |
| Real-time | Supabase Real-time | WebSocket-based updates |
| Authentication | Supabase Auth (optional) | User management |
| Storage | Supabase Storage (optional) | File uploads |

## Scalability Considerations

### Current Setup (Development)
- Suitable for: Personal projects, prototypes, small teams
- Concurrent users: ~100
- Database size: Unlimited on free tier
- Storage: 1GB on free tier

### Production Setup
- Add authentication and user isolation
- Enable database replication (Pro tier)
- Use connection pooling
- Implement caching strategies
- Monitor with Supabase analytics

### High-Scale Setup
- Upgrade to Pro/Enterprise tier
- Enable read replicas
- Use edge functions for complex logic
- Implement CDN for static assets
- Add rate limiting per user
- Use database partitioning for large datasets

## Next Steps

For implementation details and setup instructions, see:
- [QUICK_START.md](QUICK_START.md) - Getting started
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Detailed setup
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Code organization
