"use client"

import { useState, useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"

export interface Achievement {
  id: string
  title: string
  description: string
  icon?: string
  unlocked: boolean
  unlockedAt?: string
}

// Define all possible achievements
const allAchievements: Achievement[] = [
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit all sections of the website",
    unlocked: false,
  },
  {
    id: "curious",
    title: "Curious Mind",
    description: "View details of at least 3 different projects",
    unlocked: false,
  },
  {
    id: "tech_enthusiast",
    title: "Tech Enthusiast",
    description: "Explore all skill categories",
    unlocked: false,
  },
  {
    id: "map_traveler",
    title: "World Traveler",
    description: "Interact with the world map",
    unlocked: false,
  },
  {
    id: "chatbot_friend",
    title: "AI Companion",
    description: "Have a conversation with the AI chatbot",
    unlocked: false,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Switch to dark mode",
    unlocked: false,
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Switch to light mode",
    unlocked: false,
  },
  {
    id: "media_buff",
    title: "Media Buff",
    description: "Watch a video or interact with 3D content",
    unlocked: false,
  },
  {
    id: "knowledge_seeker",
    title: "Knowledge Seeker",
    description: "Read a blog post",
    unlocked: false,
  },
  {
    id: "future_visionary",
    title: "Future Visionary",
    description: "Explore the future aspirations section",
    unlocked: false,
  },
]

export function useAchievements() {
  // Load achievements from local storage
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>("portfolio-achievements", allAchievements)

  // Track current achievement notification
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)

  // Unlock an achievement
  const unlockAchievement = useCallback(
    (id: string) => {
      setAchievements((prev) => {
        const updatedAchievements = prev.map((achievement) => {
          if (achievement.id === id && !achievement.unlocked) {
            const unlockedAchievement = {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date().toISOString(),
            }

            // Set current achievement for notification
            setCurrentAchievement(unlockedAchievement)

            return unlockedAchievement
          }
          return achievement
        })

        return updatedAchievements
      })
    },
    [setAchievements],
  )

  // Dismiss the current achievement notification
  const dismissAchievement = useCallback(() => {
    setCurrentAchievement(null)
  }, [])

  // Check if an achievement is unlocked
  const isAchievementUnlocked = useCallback(
    (id: string) => {
      return achievements.find((a) => a.id === id)?.unlocked || false
    },
    [achievements],
  )

  // Get all unlocked achievements
  const unlockedAchievements = achievements.filter((a) => a.unlocked)

  // Get achievement progress
  const achievementProgress = {
    total: achievements.length,
    unlocked: unlockedAchievements.length,
    percentage: Math.round((unlockedAchievements.length / achievements.length) * 100),
  }

  return {
    achievements,
    unlockAchievement,
    isAchievementUnlocked,
    unlockedAchievements,
    achievementProgress,
    currentAchievement,
    dismissAchievement,
  }
}

