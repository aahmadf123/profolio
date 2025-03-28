import { getRedisClient } from "../redis-client"

export interface Backup {
  id: string
  name: string
  description?: string
  timestamp: string
  size: number
  type: "full" | "partial"
  status: "pending" | "completed" | "failed"
  data: string // JSON string of the backup data
}

const BACKUPS_KEY = "backups"

export async function createBackup(name: string, type: Backup["type"] = "full", description?: string): Promise<Backup> {
  const redis = getRedisClient()

  // Generate a unique ID
  const id = `backup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const timestamp = new Date().toISOString()

  // Create a pending backup
  const pendingBackup: Backup = {
    id,
    name,
    description,
    timestamp,
    size: 0,
    type,
    status: "pending",
    data: "",
  }

  // Store the pending backup
  await redis.hset(BACKUPS_KEY, { [id]: JSON.stringify(pendingBackup) })

  try {
    // Collect data for the backup
    const backupData: Record<string, any> = {}

    if (type === "full" || type === "partial") {
      // Get all data from Redis for a full backup
      // For a partial backup, you can specify which keys to include

      // Get blog posts
      backupData.blogPosts = await redis.hgetall("blog:posts")

      // Get projects
      backupData.projects = await redis.hgetall("projects")

      // Get skills
      backupData.skills = await redis.hgetall("skills")

      // Get settings
      backupData.settings = await redis.get("site:settings")

      // Get media items
      backupData.media = await redis.hgetall("media:items")

      // Get templates
      backupData.templates = await redis.hgetall("templates")

      // Get achievements
      backupData.achievements = await redis.hgetall("achievements")
    }

    // Convert to JSON string
    const dataString = JSON.stringify(backupData)

    // Update the backup with the data
    const completedBackup: Backup = {
      ...pendingBackup,
      status: "completed",
      size: dataString.length,
      data: dataString,
    }

    // Store the completed backup
    await redis.hset(BACKUPS_KEY, { [id]: JSON.stringify(completedBackup) })

    return completedBackup
  } catch (error) {
    console.error("Error creating backup:", error)

    // Update the backup as failed
    const failedBackup: Backup = {
      ...pendingBackup,
      status: "failed",
      data: JSON.stringify({ error: (error as Error).message }),
    }

    // Store the failed backup
    await redis.hset(BACKUPS_KEY, { [id]: JSON.stringify(failedBackup) })

    return failedBackup
  }
}

export async function getBackupById(id: string): Promise<Backup | null> {
  const redis = getRedisClient()

  const backupJson = await redis.hget(BACKUPS_KEY, id)

  if (!backupJson) return null

  return JSON.parse(backupJson as string) as Backup
}

export async function getAllBackups(): Promise<Omit<Backup, "data">[]> {
  const redis = getRedisClient()

  // Get all backups
  const backupsObj = await redis.hgetall(BACKUPS_KEY)

  if (!backupsObj) return []

  // Convert to array of backups without the data field
  const backups = Object.values(backupsObj).map((json) => {
    const backup = JSON.parse(json as string) as Backup
    const { data, ...backupWithoutData } = backup
    return backupWithoutData
  })

  // Sort by timestamp (newest first)
  backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return backups
}

export async function restoreBackup(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Get the backup
  const backup = await getBackupById(id)

  if (!backup || backup.status !== "completed") return false

  try {
    // Parse the backup data
    const backupData = JSON.parse(backup.data)

    // Restore blog posts
    if (backupData.blogPosts) {
      // Clear existing data
      const existingPosts = await redis.hgetall("blog:posts")
      if (existingPosts) {
        await redis.hdel("blog:posts", ...Object.keys(existingPosts))
      }

      // Restore from backup
      for (const [key, value] of Object.entries(backupData.blogPosts)) {
        await redis.hset("blog:posts", { [key]: value })
      }
    }

    // Restore projects
    if (backupData.projects) {
      // Clear existing data
      const existingProjects = await redis.hgetall("projects")
      if (existingProjects) {
        await redis.hdel("projects", ...Object.keys(existingProjects))
      }

      // Restore from backup
      for (const [key, value] of Object.entries(backupData.projects)) {
        await redis.hset("projects", { [key]: value })
      }
    }

    // Restore skills
    if (backupData.skills) {
      // Clear existing data
      const existingSkills = await redis.hgetall("skills")
      if (existingSkills) {
        await redis.hdel("skills", ...Object.keys(existingSkills))
      }

      // Restore from backup
      for (const [key, value] of Object.entries(backupData.skills)) {
        await redis.hset("skills", { [key]: value })
      }
    }

    // Restore settings
    if (backupData.settings) {
      await redis.set("site:settings", backupData.settings)
    }

    // Restore media items
    if (backupData.media) {
      // Clear existing data
      const existingMedia = await redis.hgetall("media:items")
      if (existingMedia) {
        await redis.hdel("media:items", ...Object.keys(existingMedia))
      }

      // Restore from backup
      for (const [key, value] of Object.entries(backupData.media)) {
        await redis.hset("media:items", { [key]: value })
      }
    }

    // Restore templates
    if (backupData.templates) {
      // Clear existing data
      const existingTemplates = await redis.hgetall("templates")
      if (existingTemplates) {
        await redis.hdel("templates", ...Object.keys(existingTemplates))
      }

      // Restore from backup
      for (const [key, value] of Object.entries(backupData.templates)) {
        await redis.hset("templates", { [key]: value })
      }
    }

    // Restore achievements
    if (backupData.achievements) {
      // Clear existing data
      const existingAchievements = await redis.hgetall("achievements")
      if (existingAchievements) {
        await redis.hdel("achievements", ...Object.keys(existingAchievements))
      }

      // Restore from backup
      for (const [key, value] of Object.entries(backupData.achievements)) {
        await redis.hset("achievements", { [key]: value })
      }
    }

    return true
  } catch (error) {
    console.error("Error restoring backup:", error)
    return false
  }
}

export async function deleteBackup(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the backup
  await redis.hdel(BACKUPS_KEY, id)

  return true
}

