import { getRedisClient } from "../redis-client"

export interface MediaItem {
  id: string
  filename: string
  url: string
  type: "image" | "document" | "video" | "audio" | "other"
  size: number
  width?: number
  height?: number
  duration?: number
  alt?: string
  caption?: string
  tags: string[]
  uploadedAt: string
}

const MEDIA_KEY = "media:items"
const MEDIA_TAGS_KEY = "media:tags"

export async function createMediaItem(item: Omit<MediaItem, "id" | "uploadedAt">): Promise<MediaItem> {
  const redis = getRedisClient()

  // Generate a unique ID
  const id = `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const newItem: MediaItem = {
    ...item,
    id,
    tags: item.tags || [],
    uploadedAt: new Date().toISOString(),
  }

  // Store the media item
  await redis.hset(MEDIA_KEY, { [id]: JSON.stringify(newItem) })

  // Add tags to set
  if (newItem.tags.length > 0) {
    await redis.sadd(MEDIA_TAGS_KEY, ...newItem.tags)
  }

  return newItem
}

export async function getMediaItemById(id: string): Promise<MediaItem | null> {
  const redis = getRedisClient()

  const itemJson = await redis.hget(MEDIA_KEY, id)

  if (!itemJson) return null

  return JSON.parse(itemJson as string) as MediaItem
}

export async function getAllMediaItems(options?: {
  type?: MediaItem["type"]
  tags?: string[]
  limit?: number
  offset?: number
}): Promise<MediaItem[]> {
  const redis = getRedisClient()

  // Get all media items
  const itemsObj = await redis.hgetall(MEDIA_KEY)

  if (!itemsObj) return []

  // Convert to array of media items
  let items = Object.values(itemsObj).map((json) => JSON.parse(json as string) as MediaItem)

  // Filter by type if requested
  if (options?.type) {
    items = items.filter((item) => item.type === options.type)
  }

  // Filter by tags if requested
  if (options?.tags && options.tags.length > 0) {
    items = items.filter((item) => options.tags!.some((tag) => item.tags.includes(tag)))
  }

  // Sort by upload date (newest first)
  items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  // Apply pagination
  if (options?.offset || options?.limit) {
    const offset = options?.offset || 0
    const limit = options?.limit || items.length

    items = items.slice(offset, offset + limit)
  }

  return items
}

export async function getMediaTags(): Promise<string[]> {
  const redis = getRedisClient()

  const tags = await redis.smembers(MEDIA_TAGS_KEY)

  return tags as string[]
}

export async function updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem | null> {
  const redis = getRedisClient()

  // Get the existing media item
  const existingItem = await getMediaItemById(id)

  if (!existingItem) return null

  // Handle tags change
  if (updates.tags) {
    // Add new tags to set
    if (updates.tags.length > 0) {
      await redis.sadd(MEDIA_TAGS_KEY, ...updates.tags)
    }
  }

  // Update the media item
  const updatedItem: MediaItem = {
    ...existingItem,
    ...updates,
  }

  // Store the updated media item
  await redis.hset(MEDIA_KEY, { [id]: JSON.stringify(updatedItem) })

  return updatedItem
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the media item
  await redis.hdel(MEDIA_KEY, id)

  return true
}

