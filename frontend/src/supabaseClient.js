import { createClient } from "@supabase/supabase-js";

// Change process.env to import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables. Check your .env file and ensure they start with VITE_");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);