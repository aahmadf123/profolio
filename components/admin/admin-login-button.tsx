"use client"

import { useState, useEffect } from "react"
import { Settings, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuthContext } from "@/components/auth-provider"

export function AdminLoginButton() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const { isAuthenticated } = useAuthContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything during SSR to avoid hydration issues
  if (!isMounted) return null

  const handleClick = () => {
    if (isAuthenticated) {
      router.push("/admin")
    } else {
      router.push("/login")
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className={`fixed bottom-4 left-4 z-40 p-3 rounded-full shadow-md transition-all duration-300 ${
              isAuthenticated
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                : "bg-background/80 backdrop-blur-sm border border-border hover:bg-muted"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={isAuthenticated ? "Edit Site" : "Admin Login"}
          >
            {isAuthenticated ? (
              <Edit
                className="h-5 w-5"
                style={{
                  transform: isHovered ? "rotate(15deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            ) : (
              <Settings
                className="h-5 w-5 text-muted-foreground"
                style={{
                  transform: isHovered ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            )}
            {isAuthenticated && isHovered && (
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isAuthenticated ? "Edit Site" : "Admin Login"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
