import { supabase } from "./supabase-client"
import { getSupabaseAdmin } from "./supabase-admin"

// Upload a file to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  path: string,
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    // Try with client-side Supabase first
    let client = supabase

    // If client-side Supabase is not available, try with admin client
    if (!client) {
      try {
        client = getSupabaseAdmin()
      } catch (error) {
        throw new Error("No Supabase client available for file upload")
      }
    }

    // Upload the file
    const { data, error } = await client.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      throw error
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = client.storage.from(bucket).getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      url: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Delete a file from Supabase Storage
export async function deleteFile(
  bucket: string,
  path: string,
): Promise<{ success: boolean; error: null } | { success: false; error: string }> {
  try {
    // Try with client-side Supabase first
    let client = supabase

    // If client-side Supabase is not available, try with admin client
    if (!client) {
      try {
        client = getSupabaseAdmin()
      } catch (error) {
        throw new Error("No Supabase client available for file deletion")
      }
    }

    // Delete the file
    const { error } = await client.storage.from(bucket).remove([path])

    if (error) {
      throw error
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// List files in a Supabase Storage bucket
export async function listFiles(
  bucket: string,
  path = "",
): Promise<
  { files: Array<{ name: string; size: number; url: string }>; error: null } | { files: null; error: string }
> {
  try {
    // Try with client-side Supabase first
    let client = supabase

    // If client-side Supabase is not available, try with admin client
    if (!client) {
      try {
        client = getSupabaseAdmin()
      } catch (error) {
        throw new Error("No Supabase client available for listing files")
      }
    }

    // List files
    const { data, error } = await client.storage.from(bucket).list(path)

    if (error) {
      throw error
    }

    // Get public URLs for each file
    const files = data.map((item) => {
      const {
        data: { publicUrl },
      } = client.storage.from(bucket).getPublicUrl(`${path ? `${path}/` : ""}${item.name}`)

      return {
        name: item.name,
        size: item.metadata?.size || 0,
        url: publicUrl,
      }
    })

    return { files, error: null }
  } catch (error) {
    console.error("Error listing files:", error)
    return {
      files: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

