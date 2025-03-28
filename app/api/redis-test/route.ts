import { NextResponse } from "next/server"
import { getRedisClient, testRedisConnection } from "@/lib/redis-client"

export async function GET() {
  try {
    // Test the Redis connection
    const connectionTest = await testRedisConnection()

    // Check environment variables (without exposing tokens)
    const envCheck = {
      UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL ? "Set" : "Missing",
      UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN ? "Set" : "Missing",
      KV_REST_API_URL: !!process.env.KV_REST_API_URL ? "Set" : "Missing",
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN ? "Set" : "Missing",
    }

    // Test a simple set/get operation
    let setGetTest = { success: false, message: "Not attempted" }

    if (connectionTest.success) {
      try {
        const redis = getRedisClient()
        const testKey = `test:${Date.now()}`
        const testValue = `test-value-${Date.now()}`

        // Test set operation
        await redis.set(testKey, testValue)

        // Test get operation
        const retrievedValue = await redis.get(testKey)

        // Clean up
        await redis.del(testKey)

        setGetTest = {
          success: retrievedValue === testValue,
          message:
            retrievedValue === testValue
              ? "Set/Get operation successful"
              : `Set/Get operation failed: expected "${testValue}" but got "${retrievedValue}"`,
        }
      } catch (error) {
        setGetTest = {
          success: false,
          message: `Set/Get operation failed: ${error instanceof Error ? error.message : String(error)}`,
        }
      }
    }

    // Test a zadd operation (which was causing issues)
    let zaddTest = { success: false, message: "Not attempted" }

    if (connectionTest.success) {
      try {
        const redis = getRedisClient()
        const testKey = `test:sorted:${Date.now()}`
        const testScore = Date.now()
        const testMember = `member-${Date.now()}`

        // Test zadd operation with the correct format
        await redis.zadd(testKey, { score: testScore, member: testMember })

        // Test zrange operation
        const members = await redis.zrange(testKey, 0, -1)

        // Clean up
        await redis.del(testKey)

        zaddTest = {
          success: members.includes(testMember),
          message: members.includes(testMember)
            ? "ZADD operation successful"
            : `ZADD operation failed: member not found in result`,
        }
      } catch (error) {
        zaddTest = {
          success: false,
          message: `ZADD operation failed: ${error instanceof Error ? error.message : String(error)}`,
        }
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      connectionTest,
      envCheck,
      setGetTest,
      zaddTest,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
