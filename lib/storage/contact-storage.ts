import { getRedisClient } from "../redis-client"

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
  read: boolean
  replied: boolean
}

const CONTACT_MESSAGES_KEY = "contact:messages"

export async function createContactMessage(
  message: Omit<ContactMessage, "id" | "timestamp" | "read" | "replied">,
): Promise<ContactMessage> {
  const redis = getRedisClient()

  // Generate a unique ID
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const newMessage: ContactMessage = {
    ...message,
    id,
    timestamp: new Date().toISOString(),
    read: false,
    replied: false,
  }

  // Store the message
  await redis.hset(CONTACT_MESSAGES_KEY, { [id]: JSON.stringify(newMessage) })

  return newMessage
}

export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
  const redis = getRedisClient()

  const messageJson = await redis.hget(CONTACT_MESSAGES_KEY, id)

  if (!messageJson) return null

  return JSON.parse(messageJson as string) as ContactMessage
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const redis = getRedisClient()

  // Get all messages
  const messagesObj = await redis.hgetall(CONTACT_MESSAGES_KEY)

  if (!messagesObj) return []

  // Convert to array of messages
  const messages = Object.values(messagesObj).map((json) => JSON.parse(json as string) as ContactMessage)

  // Sort by timestamp (newest first)
  messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return messages
}

export async function updateContactMessage(
  id: string,
  updates: Partial<ContactMessage>,
): Promise<ContactMessage | null> {
  const redis = getRedisClient()

  // Get the existing message
  const existingMessage = await getContactMessageById(id)

  if (!existingMessage) return null

  // Update the message
  const updatedMessage: ContactMessage = {
    ...existingMessage,
    ...updates,
  }

  // Store the updated message
  await redis.hset(CONTACT_MESSAGES_KEY, { [id]: JSON.stringify(updatedMessage) })

  return updatedMessage
}

export async function markContactMessageAsRead(id: string): Promise<ContactMessage | null> {
  return updateContactMessage(id, { read: true })
}

export async function markContactMessageAsReplied(id: string): Promise<ContactMessage | null> {
  return updateContactMessage(id, { replied: true })
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the message
  await redis.hdel(CONTACT_MESSAGES_KEY, id)

  return true
}

