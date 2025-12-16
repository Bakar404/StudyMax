import { createClient } from "@supabase/supabase-js";

// Use environment variables if available (for local development)
// Otherwise use hardcoded values (for production/GitHub Pages)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vcichgycwmanxkigmjvh.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaWNoZ3ljd21hbnhraWdtanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzIxODksImV4cCI6MjA4MTQwODE4OX0.crPnAbGmTqWTrkAAr0gMl3CyoohI7sUm220aK8mrqwk";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
