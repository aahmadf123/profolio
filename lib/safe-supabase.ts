"use client"

import { supabase } from "./supabase-client"

// Helper function to safely use Supabase on the client side
export function useSafeSupabase() {
  // Check if we're on the client side
  const isClient = typeof window !== "undefined"

  // Check if Supabase client is initialized
  const isInitialized = supabase !== null

  // Check if environment variables are available
  const hasEnvVars = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return an object with the client and status information
  return {
    supabase: isClient && isInitialized ? supabase : null,
    isReady: isClient && isInitialized && hasEnvVars,
    error: !isClient
      ? "Server-side rendering"
      : !isInitialized
        ? "Client not initialized"
        : !hasEnvVars
          ? "Missing environment variables"
          : null,
  }
}

