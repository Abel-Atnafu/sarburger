import { createClient } from '@supabase/supabase-js'

// TODO: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set — admin panel and live menu will not work.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
