import { getRedisClient } from "../redis-client"

export interface SiteSettings {
  siteName: string
  siteDescription: string
  ownerName: string
  ownerTitle: string
  ownerBio: string
  contactEmail: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
    youtube?: string
    [key: string]: string | undefined
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    darkMode: boolean
  }
  seo: {
    keywords: string[]
    googleAnalyticsId?: string
  }
  profilePictureUrl?: string
  resumeUrl?: string
  updatedAt: string
}

const SETTINGS_KEY = "site:settings"

// Get default settings
export function getDefaultSettings(): SiteSettings {
  return {
    siteName: "My Personal Website",
    siteDescription: "A showcase of my work and skills",
    ownerName: "John Doe",
    ownerTitle: "Software Developer",
    ownerBio: "I am a passionate software developer with experience in web development.",
    contactEmail: "contact@example.com",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
    theme: {
      primaryColor: "#3b82f6",
      secondaryColor: "#10b981",
      accentColor: "#f59e0b",
      darkMode: true,
    },
    seo: {
      keywords: ["developer", "portfolio", "web development"],
    },
    updatedAt: new Date().toISOString(),
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const redis = getRedisClient()

  try {
    const settingsJson = await redis.get(SETTINGS_KEY)

    if (!settingsJson) {
      // Initialize with default settings if none exist
      const defaultSettings = getDefaultSettings()
      await updateSettings(defaultSettings)
      return defaultSettings
    }

    return JSON.parse(settingsJson as string) as SiteSettings
  } catch (error) {
    console.error("Error getting settings:", error)
    return getDefaultSettings()
  }
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const redis = getRedisClient()

  // Get current settings
  const currentSettings = await getSettings()

  // Deep merge the updates
  const updatedSettings: SiteSettings = {
    ...currentSettings,
    ...updates,
    socialLinks: {
      ...currentSettings.socialLinks,
      ...(updates.socialLinks || {}),
    },
    theme: {
      ...currentSettings.theme,
      ...(updates.theme || {}),
    },
    seo: {
      ...currentSettings.seo,
      ...(updates.seo || {}),
    },
    updatedAt: new Date().toISOString(),
  }

  // Store the updated settings
  await redis.set(SETTINGS_KEY, JSON.stringify(updatedSettings))

  return updatedSettings
}

