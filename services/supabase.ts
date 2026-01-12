import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in various environments
const getEnv = (key: string): string => {
  try {
    // Check import.meta.env (Vite)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      // @ts-ignore
      return (import.meta as any).env[key] || '';
    }
    
    // Check process.env (Node/Webpack/pollyfills)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[key] || '';
    }
  } catch (e) {
    console.warn('Error reading environment variable:', key, e);
  }
  
  return '';
};

const envUrl = getEnv('VITE_SUPABASE_URL');
const envKey = getEnv('VITE_SUPABASE_ANON_KEY');

// check if keys are actually present
export const isConfigured = !!envUrl && !!envKey;

// Use placeholders to prevent createClient from throwing invalid URL errors during initial render if config is missing
const supabaseUrl = envUrl || 'https://placeholder.supabase.co';
const supabaseKey = envKey || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);