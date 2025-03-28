import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/storage/init-data"
import { testRedisConnection } from "@/lib/redis-client"

export async function GET(request: NextRequest) {
  try {
    // Check if Redis is connected
    const isConnected = await testRedisConnection()

    if (!isConnected) {
      return NextResponse.json({ success: false, error: "Failed to connect to Redis" }, { status: 500 })
    }

    // Initialize the database with sample data
    const success = await initializeDatabase()

    if (!success) {
      return NextResponse.json({ success: false, error: "Failed to initialize database" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Redis database initialized successfully" })
  } catch (error) {
    console.error("Error initializing Redis:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

