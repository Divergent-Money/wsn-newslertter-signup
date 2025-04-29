
import { createClient } from '@supabase/supabase-js';

// Use the values directly from the client.ts file
const supabaseUrl = "https://jotwffwmmfubaawfnwrp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdHdmZndtbWZ1YmFhd2Zud3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MTEyNjQsImV4cCI6MjA1OTM4NzI2NH0.d-bxtCPYJhhP12kyriJlPdtwd-bbrpBJ5lvxWv8fmhs";

// Create a fresh instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Don't persist auth state for newsletter signups
  }
});

// Add an authentication state change listener for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session?.user?.id || "No user");
});

// Check if we're authenticated on load
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log("Current auth session:", session ? `Authenticated as ${session.user.id}` : "Not authenticated");
});
