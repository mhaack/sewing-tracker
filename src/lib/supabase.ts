import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Supabase configuration
const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your .env file.\n' +
    'Required variables: SUPABASE_URL and SUPABASE_ANON_KEY'
  );
}

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Export types for convenience
export type { Database };
