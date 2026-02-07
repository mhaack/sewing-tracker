import { supabase } from '../lib/supabase';
import type { Project, ProjectInsert, ProjectUpdate, ProjectData } from '../types/database';

/**
 * Project Service
 * Handles all CRUD operations for sewing projects
 */

/**
 * Convert database snake_case to frontend camelCase
 */
function toProjectData(project: Project): ProjectData {
  return {
    id: project.id,
    name: project.name,
    instagramLink: project.instagram_link || '',
    fabrics: project.fabrics || [],
    moneySpent: project.money_spent || 0,
    fabricUsed: project.fabric_used || 0,
    timeSpent: project.time_spent || 0,
    comments: project.comments || '',
    projectDate: project.project_date || undefined,
    status: project.status || '',
    patternBrand: project.pattern_brand || '',
    purchasedFrom: project.purchased_from || '',
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
}

/**
 * Convert frontend camelCase to database snake_case
 */
function toProjectInsert(data: ProjectData): ProjectInsert {
  return {
    name: data.name,
    instagram_link: data.instagramLink || null,
    fabrics: data.fabrics || [],
    money_spent: data.moneySpent || 0,
    fabric_used: data.fabricUsed || 0,
    time_spent: data.timeSpent || 0,
    comments: data.comments || null,
    project_date: data.projectDate || null,
    status: data.status || null,
    pattern_brand: data.patternBrand || null,
    purchased_from: data.purchasedFrom || null,
  };
}

/**
 * Get all projects, ordered by project date (newest first), then by creation date
 */
export async function getProjects(): Promise<ProjectData[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('project_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return data.map(toProjectData);
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<ProjectData | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching project:', error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return toProjectData(data);
}

/**
 * Create a new project
 */
export async function createProject(projectData: ProjectData): Promise<ProjectData> {
  const insertData = toProjectInsert(projectData);

  const { data, error } = await supabase
    .from('projects')
    .insert(insertData as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from insert operation');
  }

  return toProjectData(data as Project);
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, projectData: Partial<ProjectData>): Promise<ProjectData> {
  const updateData: ProjectUpdate = {};

  // Only include fields that are provided
  if (projectData.name !== undefined) updateData.name = projectData.name;
  if (projectData.instagramLink !== undefined) {
    updateData.instagram_link = projectData.instagramLink || null;
  }
  if (projectData.fabrics !== undefined) updateData.fabrics = projectData.fabrics;
  if (projectData.moneySpent !== undefined) updateData.money_spent = projectData.moneySpent;
  if (projectData.fabricUsed !== undefined) updateData.fabric_used = projectData.fabricUsed;
  if (projectData.timeSpent !== undefined) updateData.time_spent = projectData.timeSpent;
  if (projectData.comments !== undefined) {
    updateData.comments = projectData.comments || null;
  }
  if (projectData.status !== undefined) {
    updateData.status = projectData.status || null;
  }
  if (projectData.patternBrand !== undefined) {
    updateData.pattern_brand = projectData.patternBrand || null;
  }
  if (projectData.purchasedFrom !== undefined) {
    updateData.purchased_from = projectData.purchasedFrom || null;
  }
  if (projectData.projectDate !== undefined) {
    updateData.project_date = projectData.projectDate || null;
  }

  // Always update the timestamp
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await (supabase as any)
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw new Error(`Failed to update project: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from update operation');
  }

  return toProjectData(data as Project);
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

/**
 * Get project statistics
 */
export async function getProjectStats(): Promise<{
  totalProjects: number;
  totalSpent: number;
  totalFabric: number;
  totalTime: number;
}> {
  const { data, error } = await supabase
    .from('projects')
    .select('money_spent, fabric_used, time_spent');

  if (error) {
    console.error('Error fetching project stats:', error);
    throw new Error(`Failed to fetch project stats: ${error.message}`);
  }

  const projects = data as Array<{ money_spent: number; fabric_used: number; time_spent: number }>;

  return {
    totalProjects: projects.length,
    totalSpent: projects.reduce((sum, p) => sum + (p.money_spent || 0), 0),
    totalFabric: projects.reduce((sum, p) => sum + (p.fabric_used || 0), 0),
    totalTime: projects.reduce((sum, p) => sum + (p.time_spent || 0), 0),
  };
}

/**
 * Subscribe to real-time changes in the projects table
 */
export function subscribeToProjects(
  callback: (payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE'; new?: Project; old?: Project }) => void
) {
  const channel = supabase
    .channel('projects-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as Project,
          old: payload.old as Project,
        });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}
