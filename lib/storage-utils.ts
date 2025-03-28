import { getRedisClient } from "./redis-client"
import { supabase } from "./supabase-client"

// Check if Redis is available
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const redis = getRedisClient()
    const pong = await redis.ping()
    return pong === "PONG"
  } catch (error) {
    console.error("Redis availability check failed:", error)
    return false
  }
}

// Check if Supabase is available
export async function isSupabaseAvailable(): Promise<boolean> {
  try {
    if (!supabase) return false

    // Try a simple query
    const { data, error } = await supabase.from("_health").select("*").limit(1)

    return !error
  } catch (error) {
    console.error("Supabase availability check failed:", error)
    return false
  }
}

// Generic function to try Redis first, then fall back to Supabase
export async function withFallback<T>(
  redisFunction: () => Promise<T>,
  supabaseFunction: () => Promise<T>,
  options: { preferRedis?: boolean } = {},
): Promise<T> {
  const { preferRedis = true } = options

  try {
    if (preferRedis) {
      // Try Redis first
      const redisAvailable = await isRedisAvailable()

      if (redisAvailable) {
        try {
          return await redisFunction()
        } catch (redisError) {
          console.error("Redis operation failed, falling back to Supabase:", redisError)
          // Fall back to Supabase
          return await supabaseFunction()
        }
      } else {
        // Redis not available, use Supabase
        return await supabaseFunction()
      }
    } else {
      // Try Supabase first
      const supabaseAvailable = await isSupabaseAvailable()

      if (supabaseAvailable) {
        try {
          return await supabaseFunction()
        } catch (supabaseError) {
          console.error("Supabase operation failed, falling back to Redis:", supabaseError)
          // Fall back to Redis
          return await redisFunction()
        }
      } else {
        // Supabase not available, use Redis
        return await redisFunction()
      }
    }
  } catch (error) {
    console.error("Both Redis and Supabase operations failed:", error)
    throw error
  }
}

