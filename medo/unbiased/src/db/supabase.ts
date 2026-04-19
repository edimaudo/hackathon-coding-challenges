
2            import { createClient } from "@supabase/supabase-js";
3
4            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
5            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
6
7            export const supabase = createClient(supabaseUrl, supabaseAnonKey);
8            