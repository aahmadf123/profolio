import { Redis } from "@upstash/redis"

let redisClient: Redis | null = null

// Get or create a Redis client
export function getRedisClient(): Redis | null {
  // If we already have a client, return it
  if (redisClient) {
    return redisClient
  }

  try {
    // Check for different possible environment variable combinations
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL

    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN

    // If we don't have the required environment variables, return null
    if (!url || !token) {
      return null
    }

    // Create a new Redis client
    redisClient = new Redis({
      url,
      token,
    })

    return redisClient
  } catch (error) {
    // If we can't create a client, return null
    return null
  }
}

// Test the Redis connection
export async function testRedisConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const redis = getRedisClient()

    if (!redis) {
      return {
        success: false,
        message: "Redis client could not be initialized. Check environment variables.",
      }
    }

    // Try a simple ping operation with a timeout
    const pingPromise = redis.ping()
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error("Redis ping timed out after 3 seconds")), 3000)
    })

    const pong = await Promise.race([pingPromise, timeoutPromise])

    if (pong === "PONG") {
      return {
        success: true,
        message: "Redis connection successful",
      }
    } else {
      return {
        success: false,
        message: `Unexpected response from Redis ping: ${pong}`,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

