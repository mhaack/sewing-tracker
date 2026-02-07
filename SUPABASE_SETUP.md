# Supabase Backend Setup Guide

This guide will walk you through setting up the Supabase backend for the Sewing Tracker app.

## Overview

The Sewing Tracker uses Supabase as its backend, providing:
- PostgreSQL database for storing project data
- Real-time subscriptions for live updates
- Storage buckets for project photos (optional feature)
- Automatic timestamps and data validation

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Basic familiarity with SQL and JavaScript/TypeScript

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `sewing-tracker` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Select "Free" for development
4. Click "Create new project"
5. Wait for the project to finish setting up (2-3 minutes)

## Step 2: Get Your API Keys

Once your project is ready:

1. In your Supabase dashboard, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key**: A long JWT token starting with `eyJ...`

## Step 3: Configure Environment Variables

1. In your project directory, copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

## Step 4: Run Database Migrations

You have two options to set up the database schema:

### Option A: Using Supabase SQL Editor (Recommended for beginners)

1. In your Supabase dashboard, go to **SQL Editor** (in the left sidebar)
2. Click **New Query**
3. Copy the contents of `supabase/migrations/001_create_projects_table.sql`
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned"

7. Repeat for the storage bucket (optional):
   - Create another new query
   - Copy contents of `supabase/migrations/002_create_storage_bucket.sql`
   - Run the query

### Option B: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 5: (Optional) Add Sample Data

To test the application with sample data:

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy the contents of `supabase/seed.sql`
4. Paste and run the query
5. You should now have 5 sample projects in your database

You can view the data:
- Go to **Table Editor** in the sidebar
- Select the `projects` table
- You'll see the sample projects

## Step 6: Verify the Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see the `projects` table with these columns:
   - `id` (uuid)
   - `name` (text)
   - `instagram_link` (text, nullable)
   - `fabrics` (text array)
   - `money_spent` (numeric)
   - `fabric_used` (numeric)
   - `time_spent` (numeric)
   - `comments` (text, nullable)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

3. Check the **Database** → **Policies** section:
   - The `projects` table should have RLS enabled
   - You should see 4 policies allowing public CRUD operations

## Database Schema

### Projects Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | uuid | Unique identifier | Primary key, auto-generated |
| `name` | text | Project name | Required |
| `instagram_link` | text | Link to Instagram post | Optional |
| `fabrics` | text[] | Array of fabric names | Default: empty array |
| `money_spent` | numeric(10,2) | Money spent in dollars | Default: 0 |
| `fabric_used` | numeric(10,2) | Fabric used in meters | Default: 0 |
| `time_spent` | numeric(10,2) | Time spent in hours | Default: 0 |
| `comments` | text | Project notes | Optional |
| `created_at` | timestamptz | Creation timestamp | Auto-generated |
| `updated_at` | timestamptz | Last update timestamp | Auto-updated |

### Indexes

- `idx_projects_created_at`: Optimizes sorting by creation date
- `idx_projects_name`: Optimizes searching by name

### Triggers

- `set_updated_at`: Automatically updates `updated_at` timestamp on row updates

## Using the API in Your Application

### Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Initialize Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
```

### Example Operations

**Fetch all projects:**
```typescript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .order('created_at', { ascending: false });
```

**Create a project:**
```typescript
const { data, error } = await supabase
  .from('projects')
  .insert({
    name: 'My New Project',
    fabrics: ['Cotton', 'Linen'],
    money_spent: 25.50,
    fabric_used: 2.0,
    time_spent: 5.0
  })
  .select()
  .single();
```

**Update a project:**
```typescript
const { data, error } = await supabase
  .from('projects')
  .update({ name: 'Updated Name' })
  .eq('id', projectId)
  .select()
  .single();
```

**Delete a project:**
```typescript
const { error } = await supabase
  .from('projects')
  .delete()
  .eq('id', projectId);
```

## Project Service Layer

The application includes a complete service layer in `src/services/projectService.ts` that provides:

- `getProjects()` - Fetch all projects
- `getProject(id)` - Fetch a single project
- `createProject(data)` - Create a new project
- `updateProject(id, data)` - Update a project
- `deleteProject(id)` - Delete a project
- `getProjectStats()` - Get aggregated statistics
- `subscribeToProjects(callback)` - Subscribe to real-time changes

These functions handle all data transformations between the frontend (camelCase) and database (snake_case).

## Storage Bucket (Optional)

A storage bucket named `project-photos` is configured for storing project images. To use it:

```typescript
// Upload a photo
const { data, error } = await supabase.storage
  .from('project-photos')
  .upload(`${projectId}/photo.jpg`, file);

// Get public URL
const { data } = supabase.storage
  .from('project-photos')
  .getPublicUrl(`${projectId}/photo.jpg`);
```

## Security Considerations

### Current Setup (Development)

The current configuration allows **public access** to all operations. This is fine for:
- Development and testing
- Personal projects
- Prototypes

### Production Recommendations

For production applications, you should:

1. **Enable Authentication:**
   ```sql
   -- Update policies to require authentication
   CREATE POLICY "Authenticated users can read"
     ON projects FOR SELECT
     USING (auth.role() = 'authenticated');
   ```

2. **Add User Ownership:**
   ```sql
   -- Add user_id column
   ALTER TABLE projects ADD COLUMN user_id UUID REFERENCES auth.users(id);

   -- Update policies to check ownership
   CREATE POLICY "Users can only edit their own projects"
     ON projects FOR UPDATE
     USING (auth.uid() = user_id);
   ```

3. **Validate Data:**
   - Add check constraints for numeric fields
   - Limit array sizes
   - Validate URLs

4. **Rate Limiting:**
   - Configure rate limits in Supabase dashboard
   - Use edge functions for complex validation

## Troubleshooting

### "relation 'projects' does not exist"
- Make sure you ran the migration SQL successfully
- Check the SQL Editor for any error messages
- Verify you're connected to the correct project

### "Invalid API key"
- Double-check your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Make sure there are no extra spaces or quotes
- Verify the keys are from the correct project

### "Row Level Security policy violation"
- Check that RLS policies are created correctly
- In the table editor, click on the table → Policies tab
- Ensure policies allow the operation you're trying to perform

### Connection Issues
- Verify your internet connection
- Check if Supabase is experiencing downtime: https://status.supabase.com
- Try accessing the Supabase dashboard

## Next Steps

1. Integrate the service layer into your React components
2. Add error handling and loading states
3. Implement real-time subscriptions for live updates
4. Add photo upload functionality
5. Consider adding authentication for multi-user support
6. Add data validation on the frontend
7. Implement search and filtering features

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Array Types](https://www.postgresql.org/docs/current/arrays.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Support

If you encounter any issues:
- Check the [Supabase Discord](https://discord.supabase.com)
- Review the [GitHub Issues](https://github.com/supabase/supabase/issues)
- Consult the [Supabase Documentation](https://supabase.com/docs)
