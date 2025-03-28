'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function AutoLoggerContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize auth state with defaults from localStorage directly
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [loggingEnabled, setLoggingEnabled] = useState(true)
  const [loggingErrors, setLoggingErrors] = useState(0)

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Check localStorage for auth status
    try {
      const storedAuth = localStorage.getItem('isAuthenticated')
      const email = localStorage.getItem('userEmail')

      setIsAuthenticated(storedAuth === 'true')
      setUserEmail(email)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
  }, [])

  // Log page navigation
  useEffect(() => {
    if (!isClient || !loggingEnabled) return

    // Skip logging for image and API requests
    if (pathname.startsWith('/api/') || pathname.match(/\.(jpg|jpeg|png|gif|svg|ico)$/i)) {
      return
    }

    const logPageView = async () => {
      try {
        // Use the API route instead of direct server function
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

        const response = await fetch('/api/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            level: 'info',
            message: `Page viewed: ${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
            source: 'navigation',
            user_email: userEmail,
          }),
          signal: controller.signal,
        })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('Logging request timed out, continuing anyway')
            } else {
              console.error('Failed to log page view (fetch):', error)
              setLoggingErrors((prev) => prev + 1)
            }
          })
          .finally(() => {
            clearTimeout(timeoutId)
          })

        if (response && !response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.error('Failed to log page view:', error)
        setLoggingErrors((prev) => prev + 1)

        // Disable logging if we encounter persistent errors
        if (loggingErrors > 3) {
          console.warn('Disabling logging due to persistent errors')
          setLoggingEnabled(false)
        }
      }
    }

    // Don't await this to prevent blocking rendering
    logPageView().catch((error) => {
      console.error('Unhandled error in logPageView:', error)
    })
  }, [pathname, searchParams, userEmail, isClient, loggingEnabled, loggingErrors])

  // Log errors
  useEffect(() => {
    if (!isClient || !loggingEnabled) return

    const handleError = async (event: ErrorEvent) => {
      // Skip logging errors from the logging system itself to avoid loops
      if (event.message.includes('logging') || event.message.includes('fetch failed')) {
        console.warn('Skipping logging for logging-related error:', event.message)
        return
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

        const response = await fetch('/api/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            level: 'error',
            message: `Client error: ${event.message}`,
            source: 'client',
            user_email: isAuthenticated ? userEmail : undefined,
            details: `${event.filename}:${event.lineno}:${event.colno}
${event.error?.stack || 'No stack trace'}`,
          }),
          signal: controller.signal,
        })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('Logging request timed out, continuing anyway')
            } else {
              console.error('Failed to log error (fetch):', error)
              setLoggingErrors((prev) => prev + 1)
            }
          })
          .finally(() => {
            clearTimeout(timeoutId)
          })

        if (response && !response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.error('Failed to log error:', error)
        setLoggingErrors((prev) => prev + 1)

        // Disable logging if we encounter persistent errors
        if (loggingErrors > 3) {
          console.warn('Disabling logging due to persistent errors')
          setLoggingEnabled(false)
        }
      }
    }

    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [userEmail, isAuthenticated, isClient, loggingEnabled, loggingErrors])

  return null
}

export function AutoLogger() {
  return (
    <Suspense fallback={null}>
      <AutoLoggerContent />
    </Suspense>
  )
}
