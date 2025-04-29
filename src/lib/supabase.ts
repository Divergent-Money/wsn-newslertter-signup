
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = "https://jotwffwmmfubaawfnwrp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdHdmZndtbWZ1YmFhd2Zud3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MTEyNjQsImV4cCI6MjA1OTM4NzI2NH0.d-bxtCPYJhhP12kyriJlPdtwd-bbrpBJ5lvxWv8fmhs";

// Create a single instance of the Supabase client to use throughout the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Changed to true to maintain session state when needed
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Add debugging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session?.user?.id || "No user");
});

// Debug current auth session on load
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log("Current auth session:", session ? `Authenticated as ${session.user.id}` : "Not authenticated");
});
