import { NextResponse } from "next/server"
import { getRedisClient } from "@/lib/redis-client"

export async function GET() {
  try {
    const redis = getRedisClient()
    const testKey = "test:zadd"
    const testId = `test_${Date.now()}`

    // Test different ZADD formats
    const results = {
      format1: null,
      format2: null,
      format3: null,
      format4: null,
      working: false,
    }

    try {
      // Format 1: zadd(key, score, member)
      await redis.zadd(testKey, Date.now().toString(), `${testId}_1`)
      results.format1 = "success"
    } catch (error) {
      results.format1 = error.message
    }

    try {
      // Format 2: zadd(key, [score, member])
      await redis.zadd(testKey, [Date.now().toString(), `${testId}_2`])
      results.format2 = "success"
    } catch (error) {
      results.format2 = error.message
    }

    try {
      // Format 3: zadd(key, { score, member })
      await redis.zadd(testKey, { score: Date.now().toString(), member: `${testId}_3` })
      results.format3 = "success"
    } catch (error) {
      results.format3 = error.message
    }

    try {
      // Format 4: zadd(key, [[score, member]])
      await redis.zadd(testKey, [[Date.now().toString(), `${testId}_4`]])
      results.format4 = "success"
    } catch (error) {
      results.format4 = error.message
    }

    // Check which format worked by retrieving the members
    const members = await redis.zrange(testKey, 0, -1)
    results.members = members

    // Determine which format worked
    results.working = members.some((m) => m.includes(testId))

    // Clean up
    await redis.del(testKey)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
