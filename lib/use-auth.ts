"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function useAuth(requireAuth = false) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const authStatus = localStorage.getItem("isAuthenticated") === "true"
        const email = localStorage.getItem("userEmail")

        setIsAuthenticated(authStatus)
        setUserEmail(email)
        setIsLoading(false)

        // If authentication is required and user is not authenticated, redirect to login
        if (requireAuth && !authStatus && pathname !== "/login") {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [requireAuth, router, pathname])

  const login = (email: string) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    setIsAuthenticated(true)
    setUserEmail(email)
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    setIsAuthenticated(false)
    setUserEmail(null)
    router.push("/")
  }

  return { isAuthenticated, isLoading, userEmail, login, logout }
}

