"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfilePicture({ className = "h-32 w-32" }: { className?: string }) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch the profile picture URL from your API or database
    // For now, we'll check if there's a stored URL in localStorage
    const storedPicture = localStorage.getItem("profilePicture")
    if (storedPicture) {
      setProfilePicture(storedPicture)
    }
  }, [])

  return (
    <div
      className={`relative ${isHovered ? "animate-pulse-glow" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className={`${className} transition-all duration-300 ${isHovered ? "scale-105" : ""}`}>
        <AvatarImage src={profilePicture || "/placeholder.svg?height=200&width=200"} alt="Profile" />
        <AvatarFallback>
          <User className="h-12 w-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      {isHovered && (
        <div className="absolute inset-0 rounded-full pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-2 border-primary/50"></div>
        </div>
      )}
    </div>
  )
}

