"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { logActivity } from "@/lib/logging-service"
import type { ReactNode } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  userEmail: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
  requireAuth?: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children, requireAuth = false }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("isAuthenticated")
      const email = localStorage.getItem("userEmail")

      const isAuth = storedAuth === "true"
      setIsAuthenticated(isAuth)
      setUserEmail(email)

      // Log authentication status
      if (isAuth && email) {
        logActivity("info", "User session restored", "auth", email).catch((err) =>
          console.error("Failed to log auth status:", err),
        )
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const auth = useAuth(requireAuth)

  const login = async (email: string, password: string) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    setIsAuthenticated(true)
    setUserEmail(email)
    await logActivity("success", "User logged in", "auth", email)
  }

  const logout = async () => {
    const email = localStorage.getItem("userEmail")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    setIsAuthenticated(false)
    setUserEmail(null)
    if (email) {
      await logActivity("info", "User logged out", "auth", email)
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    userEmail,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

