import { testRedisConnection } from "./redis-client"
import { createClient } from "@supabase/supabase-js"

export interface ServiceStatus {
  redis: {
    available: boolean
    message: string
    details?: any
  }
  supabase: {
    available: boolean
    message: string
    details?: any
  }
  timestamp: string
}

export async function checkServiceStatus(): Promise<ServiceStatus> {
  const timestamp = new Date().toISOString()

  // Check Redis status
  let redisStatus = {
    available: false,
    message: "Not checked",
  }

  try {
    const redisResult = await testRedisConnection()
    redisStatus = {
      available: redisResult.success,
      message: redisResult.message,
      details: redisResult.details,
    }
  } catch (error) {
    redisStatus = {
      available: false,
      message: error instanceof Error ? error.message : String(error),
    }
  }

  // Check Supabase status
  let supabaseStatus = {
    available: false,
    message: "Not checked",
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      supabaseStatus = {
        available: false,
        message: "Supabase environment variables are missing",
      }
    } else {
      // Create a temporary admin client to check status
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Try to get system health
      const { data, error } = await supabase.from("_health").select("*").limit(1)

      if (error) {
        supabaseStatus = {
          available: false,
          message: error.message,
          details: error,
        }
      } else {
        supabaseStatus = {
          available: true,
          message: "Supabase connection successful",
          details: { healthCheck: data },
        }
      }
    }
  } catch (error) {
    supabaseStatus = {
      available: false,
      message: error instanceof Error ? error.message : String(error),
    }
  }

  return {
    redis: redisStatus,
    supabase: supabaseStatus,
    timestamp,
  }
}

