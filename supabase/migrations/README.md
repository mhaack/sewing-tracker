# Database Migrations

This folder contains the SQL migration file for the Supabase database.

## Migration File

### `001_create_projects_table.sql`

This single migration file creates the complete database schema with all required fields.

#### Tables Created
- **projects** - Main table storing all sewing project information

#### Fields
- `id` (UUID, primary key)
- `name` (TEXT, required - project name)
- `instagram_link` (TEXT, optional - Instagram post URL)
- `fabrics` (TEXT[], array of fabric names)
- `money_spent` (NUMERIC, total cost in currency)
- `fabric_used` (NUMERIC, meters of fabric used)
- `time_spent` (NUMERIC, hours spent on project)
- `comments` (TEXT, notes and learnings)
- `project_date` (DATE, completion or start date)
- `status` (TEXT, project status: Geplant, In Bearbeitung, Fertig)
- `pattern_brand` (TEXT, optional - pattern/schnittmuster brand)
- `purchased_from` (TEXT, optional - shop name)
- `created_at` (TIMESTAMPTZ, auto-set)
- `updated_at` (TIMESTAMPTZ, auto-updated)

#### Indexes
- `idx_projects_created_at` - Fast sorting by creation date
- `idx_projects_name` - Fast searching by name
- `idx_projects_project_date` - Fast sorting by project date
- `idx_projects_status` - Fast filtering by status

#### Features
- Automatic `updated_at` timestamp update via trigger
- Row Level Security (RLS) enabled with public access policies
- Comprehensive column documentation via SQL comments

## How to Run

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the content of `001_create_projects_table.sql`
4. Execute the SQL script

**Note:** This single file creates the complete database schema - no additional migrations needed.

## Sample Data

After running the migration, you can optionally execute `seed.sql` to populate the database with sample projects for testing.
