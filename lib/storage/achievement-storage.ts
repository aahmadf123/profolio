import { getRedisClient } from "../redis-client"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  color: string
  criteria: {
    type: "pageView" | "buttonClick" | "timeSpent" | "custom"
    target: number
    currentValue?: number
  }
  unlocked: boolean
  unlockedAt?: string
  createdAt: string
  updatedAt: string
}

const ACHIEVEMENTS_KEY = "achievements"
const USER_ACHIEVEMENTS_KEY = "user:achievements"

export async function createAchievement(
  achievement: Omit<Achievement, "id" | "createdAt" | "updatedAt">,
): Promise<Achievement> {
  const redis = getRedisClient()

  // Generate a unique ID
  const id = `achievement_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const newAchievement: Achievement = {
    ...achievement,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Store the achievement
  await redis.hset(ACHIEVEMENTS_KEY, { [id]: JSON.stringify(newAchievement) })

  return newAchievement
}

export async function getAchievementById(id: string): Promise<Achievement | null> {
  const redis = getRedisClient()

  const achievementJson = await redis.hget(ACHIEVEMENTS_KEY, id)

  if (!achievementJson) return null

  return JSON.parse(achievementJson as string) as Achievement
}

export async function getAllAchievements(): Promise<Achievement[]> {
  const redis = getRedisClient()

  // Get all achievements
  const achievementsObj = await redis.hgetall(ACHIEVEMENTS_KEY)

  if (!achievementsObj) return []

  // Convert to array of achievements
  const achievements = Object.values(achievementsObj).map((json) => JSON.parse(json as string) as Achievement)

  return achievements
}

export async function updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement | null> {
  const redis = getRedisClient()

  // Get the existing achievement
  const existingAchievement = await getAchievementById(id)

  if (!existingAchievement) return null

  // Update the achievement
  const updatedAchievement: Achievement = {
    ...existingAchievement,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // Store the updated achievement
  await redis.hset(ACHIEVEMENTS_KEY, { [id]: JSON.stringify(updatedAchievement) })

  return updatedAchievement
}

export async function deleteAchievement(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the achievement
  await redis.hdel(ACHIEVEMENTS_KEY, id)

  return true
}

export async function getUserAchievements(userEmail: string): Promise<Achievement[]> {
  const redis = getRedisClient()

  // Get user's achievements
  const userAchievementsJson = await redis.get(`${USER_ACHIEVEMENTS_KEY}:${userEmail}`)

  if (!userAchievementsJson) return []

  const userAchievementIds = JSON.parse(userAchievementsJson as string) as string[]

  // Get all achievements
  const achievements = await getAllAchievements()

  // Filter to only include user's achievements
  return achievements.filter((achievement) => userAchievementIds.includes(achievement.id))
}

export async function unlockAchievement(userEmail: string, achievementId: string): Promise<Achievement | null> {
  const redis = getRedisClient()

  // Get the achievement
  const achievement = await getAchievementById(achievementId)

  if (!achievement) return null

  // Update the achievement to unlocked
  const updatedAchievement = await updateAchievement(achievementId, {
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  })

  if (!updatedAchievement) return null

  // Get user's achievements
  const userAchievementsJson = await redis.get(`${USER_ACHIEVEMENTS_KEY}:${userEmail}`)

  let userAchievementIds: string[] = []

  if (userAchievementsJson) {
    userAchievementIds = JSON.parse(userAchievementsJson as string) as string[]
  }

  // Add the achievement to the user's achievements if not already there
  if (!userAchievementIds.includes(achievementId)) {
    userAchievementIds.push(achievementId)

    // Store the updated user achievements
    await redis.set(`${USER_ACHIEVEMENTS_KEY}:${userEmail}`, JSON.stringify(userAchievementIds))
  }

  return updatedAchievement
}

export async function updateAchievementProgress(
  userEmail: string,
  achievementId: string,
  progress: number,
): Promise<Achievement | null> {
  const redis = getRedisClient()

  // Get the achievement
  const achievement = await getAchievementById(achievementId)

  if (!achievement) return null

  // Update the achievement progress
  const updatedAchievement = await updateAchievement(achievementId, {
    criteria: {
      ...achievement.criteria,
      currentValue: progress,
    },
  })

  // Check if the achievement should be unlocked
  if (
    updatedAchievement &&
    !updatedAchievement.unlocked &&
    updatedAchievement.criteria.currentValue !== undefined &&
    updatedAchievement.criteria.currentValue >= updatedAchievement.criteria.target
  ) {
    return unlockAchievement(userEmail, achievementId)
  }

  return updatedAchievement
}

