"use client"

import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client
export const supabase = (() => {
  // Only initialize on the client side
  if (typeof window === "undefined") {
    return null as any // Return a placeholder during SSR
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if keys are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")

    // Return a mock client that logs errors instead of failing
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.reject(new Error("Supabase not configured")),
            data: null,
            error: new Error("Supabase not configured"),
          }),
          data: null,
          error: new Error("Supabase not configured"),
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.reject(new Error("Supabase not configured")),
            data: null,
            error: new Error("Supabase not configured"),
          }),
          data: null,
          error: new Error("Supabase not configured"),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.reject(new Error("Supabase not configured")),
              data: null,
              error: new Error("Supabase not configured"),
            }),
            data: null,
            error: new Error("Supabase not configured"),
          }),
          data: null,
          error: new Error("Supabase not configured"),
        }),
        delete: () => ({
          eq: () => ({
            data: null,
            error: new Error("Supabase not configured"),
          }),
          data: null,
          error: new Error("Supabase not configured"),
        }),
      }),
      storage: {
        from: () => ({
          upload: () => Promise.reject(new Error("Supabase not configured")),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
          list: () => Promise.reject(new Error("Supabase not configured")),
          remove: () => Promise.reject(new Error("Supabase not configured")),
        }),
      },
      auth: {
        signIn: () => Promise.reject(new Error("Supabase not configured")),
        signOut: () => Promise.reject(new Error("Supabase not configured")),
        onAuthStateChange: () => ({ data: null, unsubscribe: () => {} }),
      },
    }
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    return null as any // Return a placeholder on error
  }
})()

// Helper to generate a unique filename
export const generateUniqueFilename = (file: File) => {
  const extension = file.name.split(".").pop()
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  return `${timestamp}-${randomString}.${extension}`
}

// Storage buckets
export const STORAGE_BUCKETS = {
  MEDIA: "media",
  PROJECTS: "projects",
  AVATARS: "avatars",
  RESUMES: "resumes",
}
