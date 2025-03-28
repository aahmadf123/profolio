import { NextResponse } from "next/server"
import { createLogEntry, getLogs } from "@/lib/storage/log-storage"

export async function GET() {
  try {
    // Create a test log entry
    const testLog = await createLogEntry(
      "info",
      "Test log entry",
      "redis-test",
      "test@example.com",
      "This is a test log entry created by the test endpoint",
    )

    // Retrieve logs
    const logs = await getLogs({ limit: 10 })

    return NextResponse.json({
      success: true,
      testLog,
      recentLogs: logs.slice(0, 5),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}

