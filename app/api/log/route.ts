import { type NextRequest, NextResponse } from "next/server"
import type { LogLevel } from "@/lib/logging-service"
import { createLogEntry } from "@/lib/storage/log-storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { level, message, source, user_email, details } = body

    if (!level || !message || !source) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Always log to console as a fallback
    console.log(`[API LOG] [${level.toUpperCase()}] ${message}`, { source, user_email, details })

    try {
      // Log the entry - this will use Redis if available or memory if not
      const logEntry = await createLogEntry(
        level as LogLevel,
        message,
        source,
        user_email || null,
        details || null,
      )

      return NextResponse.json({
        success: true,
        data: logEntry,
      })
    } catch (loggingError) {
      // Return success anyway to prevent app from breaking
      return NextResponse.json({
        success: true,
        fallback: true,
        message: "Log stored in console only",
      })
    }
  } catch (error) {
    console.error("Error processing log request:", error)
    let errorMessage = "Internal server error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 })
  }
}
