import { NextResponse } from "next/server"
import { getLogCounts, getLogSources } from "@/lib/storage/log-storage"

export async function GET() {
  try {
    // Get log counts by level
    const counts = await getLogCounts()

    // Get log sources
    const sources = await getLogSources()

    // Return combined results
    return NextResponse.json({
      success: true,
      data: {
        counts,
        sources,
        total: Object.values(counts).reduce((sum, count) => sum + count, 0),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in logs status endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

