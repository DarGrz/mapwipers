import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

// Client with service role key for server-side operations (full access)
export const supabaseServiceRole = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Client with anon key for client-side operations (limited access)
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

// For Next.js client components
export const supabase = supabaseAnon
