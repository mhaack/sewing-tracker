// Re-export ProjectData from database types for component use
export type { ProjectData as Project } from './database';

export interface ProjectStats {
  totalProjects: number;
  totalSpent: number;
  totalFabric: number;
  totalTime: number;
}
