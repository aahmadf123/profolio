"use client"

import { useState, useEffect } from "react"
import { Award, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Achievement } from "@/lib/use-achievements"

interface AchievementNotificationProps {
  achievement: Achievement
  onDismiss: () => void
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Auto dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 500) // Wait for animation to complete
    }, 5000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(dismissTimer)
    }
  }, [onDismiss])

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg transition-all duration-500 transform",
        "bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm text-primary-foreground",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="bg-background/20 p-2 rounded-full">
          <Award className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
          <p className="text-sm font-medium">{achievement.title}</p>
          <p className="text-xs mt-1 text-primary-foreground/80">{achievement.description}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onDismiss, 500) // Wait for animation to complete
          }}
          className="text-primary-foreground/80 hover:text-primary-foreground"
          aria-label="Dismiss notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

