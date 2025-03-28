import { NextResponse } from "next/server"
import { checkServiceStatus } from "@/lib/service-status"

export async function GET() {
  try {
    const status = await checkServiceStatus()

    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

