/**
 * Database type definitions for Supabase
 * These types are generated based on the database schema
 */

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

/**
 * Project entity representing a sewing project
 */
export interface Project {
  id: string;
  name: string;
  instagram_link: string | null;
  fabrics: string[];
  money_spent: number;
  fabric_used: number;
  time_spent: number;
  comments: string | null;
  project_date: string | null;
  status: string | null;
  pattern_brand: string | null;
  purchased_from: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Project insert type (excludes auto-generated fields)
 */
export interface ProjectInsert {
  id?: string;
  name: string;
  instagram_link?: string | null;
  fabrics?: string[];
  project_date?: string | null;
  status?: string | null;
  pattern_brand?: string | null;
  purchased_from?: string | null;
  money_spent?: number;
  fabric_used?: number;
  time_spent?: number;
  comments?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Project update type (all fields optional)
 */
export interface ProjectUpdate {
  name?: string;
  instagram_link?: string | null;
  fabrics?: string[];
  money_spent?: number;
  fabric_used?: number;
  time_spent?: number;
  comments?: string | null;
  project_date?: string | null;
  status?: string | null;
  pattern_brand?: string | null;
  purchased_from?: string | null;
  updated_at?: string;
}

/**
 * Frontend-friendly project type with camelCase properties
 */
export interface ProjectData {
  id?: string;
  name: string;
  instagramLink?: string;
  fabrics: string[];
  moneySpent: number;
  fabricUsed: number;
  timeSpent: number;
  comments?: string;
  projectDate?: string;
  status?: string;
  patternBrand?: string;
  purchasedFrom?: string;
  createdAt?: string;
  updatedAt?: string;
}
