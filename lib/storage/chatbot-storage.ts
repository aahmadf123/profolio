import { getRedisClient } from "../redis-client"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  sessionId: string
}

export interface ChatSession {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

export interface ChatbotSettings {
  name: string
  greeting: string
  personality: string
  knowledgeBase: string[]
  enabled: boolean
  updatedAt: string
}

const CHATBOT_SETTINGS_KEY = "chatbot:settings"
const CHAT_SESSIONS_KEY = "chatbot:sessions"
const CHAT_MESSAGES_KEY = "chatbot:messages"

// Get default chatbot settings
export function getDefaultChatbotSettings(): ChatbotSettings {
  return {
    name: "Portfolio Assistant",
    greeting: "Hello! I'm your portfolio assistant. How can I help you today?",
    personality: "Friendly, helpful, and knowledgeable about my portfolio and work.",
    knowledgeBase: ["portfolio", "projects", "skills", "contact"],
    enabled: true,
    updatedAt: new Date().toISOString(),
  }
}

export async function getChatbotSettings(): Promise<ChatbotSettings> {
  const redis = getRedisClient()

  try {
    const settingsJson = await redis.get(CHATBOT_SETTINGS_KEY)

    if (!settingsJson) {
      // Initialize with default settings if none exist
      const defaultSettings = getDefaultChatbotSettings()
      await updateChatbotSettings(defaultSettings)
      return defaultSettings
    }

    return JSON.parse(settingsJson as string) as ChatbotSettings
  } catch (error) {
    console.error("Error getting chatbot settings:", error)
    return getDefaultChatbotSettings()
  }
}

export async function updateChatbotSettings(updates: Partial<ChatbotSettings>): Promise<ChatbotSettings> {
  const redis = getRedisClient()

  // Get current settings
  const currentSettings = await getChatbotSettings()

  // Deep merge the updates
  const updatedSettings: ChatbotSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // Store the updated settings
  await redis.set(CHATBOT_SETTINGS_KEY, JSON.stringify(updatedSettings))

  return updatedSettings
}

export async function createChatSession(name = "New Chat"): Promise<ChatSession> {
  const redis = getRedisClient()

  // Generate a unique ID
  const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const timestamp = new Date().toISOString()

  const session: ChatSession = {
    id,
    name,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: [],
  }

  // Store the session
  await redis.hset(CHAT_SESSIONS_KEY, { [id]: JSON.stringify(session) })

  return session
}

export async function getChatSessionById(id: string): Promise<ChatSession | null> {
  const redis = getRedisClient()

  const sessionJson = await redis.hget(CHAT_SESSIONS_KEY, id)

  if (!sessionJson) return null

  const session = JSON.parse(sessionJson as string) as ChatSession

  // Get messages for this session
  const messagesObj = await redis.hgetall(`${CHAT_MESSAGES_KEY}:${id}`)

  if (messagesObj) {
    session.messages = Object.values(messagesObj)
      .map((json) => JSON.parse(json as string) as ChatMessage)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  return session
}

export async function getAllChatSessions(): Promise<Omit<ChatSession, "messages">[]> {
  const redis = getRedisClient()

  // Get all sessions
  const sessionsObj = await redis.hgetall(CHAT_SESSIONS_KEY)

  if (!sessionsObj) return []

  // Convert to array of sessions without the messages field
  const sessions = Object.values(sessionsObj).map((json) => {
    const session = JSON.parse(json as string) as ChatSession
    const { messages, ...sessionWithoutMessages } = session
    return sessionWithoutMessages
  })

  // Sort by updatedAt (newest first)
  sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return sessions
}

export async function addMessageToSession(
  sessionId: string,
  role: ChatMessage["role"],
  content: string,
): Promise<ChatMessage> {
  const redis = getRedisClient()

  // Get the session
  const session = await getChatSessionById(sessionId)

  if (!session) {
    throw new Error(`Chat session with ID ${sessionId} not found`)
  }

  // Generate a unique ID
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const timestamp = new Date().toISOString()

  const message: ChatMessage = {
    id,
    role,
    content,
    timestamp,
    sessionId,
  }

  // Store the message
  await redis.hset(`${CHAT_MESSAGES_KEY}:${sessionId}`, { [id]: JSON.stringify(message) })

  // Update the session's updatedAt timestamp
  await redis.hset(CHAT_SESSIONS_KEY, {
    [sessionId]: JSON.stringify({
      ...session,
      updatedAt: timestamp,
    }),
  })

  return message
}

export async function deleteChatSession(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the session
  await redis.hdel(CHAT_SESSIONS_KEY, id)

  // Remove all messages for this session
  const messagesObj = await redis.hgetall(`${CHAT_MESSAGES_KEY}:${id}`)

  if (messagesObj && Object.keys(messagesObj).length > 0) {
    await redis.hdel(`${CHAT_MESSAGES_KEY}:${id}`, ...Object.keys(messagesObj))
  }

  return true
}

export async function clearChatMessages(sessionId: string): Promise<boolean> {
  const redis = getRedisClient()

  // Get the session
  const session = await getChatSessionById(sessionId)

  if (!session) {
    throw new Error(`Chat session with ID ${sessionId} not found`)
  }

  // Remove all messages for this session
  const messagesObj = await redis.hgetall(`${CHAT_MESSAGES_KEY}:${sessionId}`)

  if (messagesObj && Object.keys(messagesObj).length > 0) {
    await redis.hdel(`${CHAT_MESSAGES_KEY}:${sessionId}`, ...Object.keys(messagesObj))
  }

  return true
}

