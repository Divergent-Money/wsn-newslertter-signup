
import { createClient } from '@supabase/supabase-js';

// Use the same values as in the client.ts file
const supabaseUrl = "https://jotwffwmmfubaawfnwrp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdHdmZndtbWZ1YmFhd2Zud3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MTEyNjQsImV4cCI6MjA1OTM4NzI2NH0.d-bxtCPYJhhP12kyriJlPdtwd-bbrpBJ5lvxWv8fmhs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
