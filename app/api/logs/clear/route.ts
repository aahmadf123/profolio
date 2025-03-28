import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { logActivityServer } from "@/lib/logging-service"

export async function DELETE(request: Request) {
  try {
    // Get user info from the request if available
    const userEmail = request.headers.get("x-user-email")

    // Log the clear action before actually clearing
    await logActivityServer("warning", "Admin cleared all logs", "admin", userEmail || undefined)

    // Clear all logs except the one we just created
    const { error } = await supabaseAdmin.from("system_logs").delete().neq("message", "Admin cleared all logs")

    if (error) {
      console.error("Error clearing logs:", error)
      return NextResponse.json({ error: "Failed to clear logs" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to clear logs:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

