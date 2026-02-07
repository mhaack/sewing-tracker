-- Create the projects table
-- This table stores all sewing project information
-- Migration: Complete schema with all fields

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    instagram_link TEXT,
    fabrics TEXT[] DEFAULT '{}',
    money_spent NUMERIC(10, 2) DEFAULT 0,
    fabric_used NUMERIC(10, 2) DEFAULT 0,
    time_spent NUMERIC(10, 2) DEFAULT 0,
    comments TEXT,
    project_date DATE,
    status TEXT,
    pattern_brand TEXT,
    purchased_from TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_name ON public.projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_project_date ON public.projects(project_date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before any update
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- Note: In production, you may want to add authentication and restrict access

-- Allow anyone to read projects
CREATE POLICY "Allow public read access"
    ON public.projects
    FOR SELECT
    USING (true);

-- Allow anyone to insert projects
CREATE POLICY "Allow public insert access"
    ON public.projects
    FOR INSERT
    WITH CHECK (true);

-- Allow anyone to update projects
CREATE POLICY "Allow public update access"
    ON public.projects
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow anyone to delete projects
CREATE POLICY "Allow public delete access"
    ON public.projects
    FOR DELETE
    USING (true);

-- Add comments to the table and columns for documentation
COMMENT ON TABLE public.projects IS 'Stores information about sewing projects';
COMMENT ON COLUMN public.projects.id IS 'Unique identifier for the project';
COMMENT ON COLUMN public.projects.name IS 'Name of the sewing project';
COMMENT ON COLUMN public.projects.instagram_link IS 'Link to Instagram post showcasing the project';
COMMENT ON COLUMN public.projects.fabrics IS 'Array of fabric names/types used in the project';
COMMENT ON COLUMN public.projects.money_spent IS 'Total money spent on materials (in dollars/currency)';
COMMENT ON COLUMN public.projects.fabric_used IS 'Total fabric used (in meters)';
COMMENT ON COLUMN public.projects.time_spent IS 'Total time spent on the project (in hours)';
COMMENT ON COLUMN public.projects.comments IS 'Additional notes, challenges, or learnings from the project';
COMMENT ON COLUMN public.projects.project_date IS 'Date when the project was completed or started';
COMMENT ON COLUMN public.projects.status IS 'Project status (In Bearbeitung, Geplant, Fertig, etc.)';
COMMENT ON COLUMN public.projects.pattern_brand IS 'Pattern/design brand or creator (e.g., Burda, Simplicity)';
COMMENT ON COLUMN public.projects.purchased_from IS 'Shop where fabrics were purchased';
COMMENT ON COLUMN public.projects.created_at IS 'Timestamp when the project was created';
COMMENT ON COLUMN public.projects.updated_at IS 'Timestamp when the project was last updated';
