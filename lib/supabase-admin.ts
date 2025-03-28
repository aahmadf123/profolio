import { createClient } from "@supabase/supabase-js"

let adminClient: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (adminClient) return adminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase admin credentials are missing")
  }

  try {
    adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    return adminClient
  } catch (error) {
    console.error("Error initializing Supabase admin client:", error)
    throw new Error("Failed to initialize Supabase admin client")
  }
}

export const supabaseAdmin = (() => {
  try {
    return getSupabaseAdmin()
  } catch (error) {
    console.error("Error accessing Supabase admin client:", error)
    return null
  }
})()

