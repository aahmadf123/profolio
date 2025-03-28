"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { logInfo } from "@/lib/logging-service"

function AuthAwareLoggerContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { userEmail, isAuthenticated } = useAuthContext()

  // Log authentication events
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!userEmail) return

    // We'll log when authentication state changes
    const logAuthChange = async () => {
      try {
        await logInfo(isAuthenticated ? "User authenticated" : "User logged out", "auth", userEmail)
      } catch (error) {
        console.error("Failed to log auth change:", error)
      }
    }

    logAuthChange()
  }, [isAuthenticated, userEmail])

  return null
}

export function AuthAwareLogger() {
  return (
    <Suspense fallback={null}>
      <AuthAwareLoggerContent />
    </Suspense>
  )
}

