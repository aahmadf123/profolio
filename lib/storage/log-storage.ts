import { getRedisClient } from "../redis-client"
import type { LogLevel } from "../logging-service"

export interface LogEntry {
  id: string
  level: LogLevel
  message: string
  source: string
  user_email?: string
  details?: string
  created_at: string
  timestamp: number
}

// In-memory fallback for when Redis is unavailable
const memoryLogs: LogEntry[] = []
const MAX_MEMORY_LOGS = 100

// Generate a unique ID for log entries
function generateLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Create a new log entry
export async function createLogEntry(
  level: LogLevel,
  message: string,
  source: string,
  userEmail?: string | null,
  details?: string | null,
): Promise<LogEntry> {
  // Create log entry with all required fields
  const timestamp = Date.now()
  const logEntry: LogEntry = {
    id: generateLogId(),
    level,
    message: message || "No message provided",
    source: source || "unknown",
    created_at: new Date().toISOString(),
    timestamp,
  }

  // Only add optional fields if they have values
  if (userEmail) logEntry.user_email = userEmail
  if (details) logEntry.details = details

  // Always store in memory as a backup
  memoryLogs.push(logEntry)

  // Keep memory logs under the limit
  if (memoryLogs.length > MAX_MEMORY_LOGS) {
    memoryLogs.shift() // Remove oldest log
  }

  // Try to store in Redis, but don't throw if it fails
  try {
    const redis = getRedisClient()
    if (!redis) {
      // Redis client not available, just use memory storage
      return logEntry
    }

    // Store the log entry data as a hash
    const logData: Record<string, string> = {
      id: logEntry.id,
      level: logEntry.level,
      message: logEntry.message,
      source: logEntry.source,
      created_at: logEntry.created_at,
      timestamp: timestamp.toString(),
    }

    // Add optional fields only if they exist
    if (logEntry.user_email) logData.user_email = logEntry.user_email
    if (logEntry.details) logData.details = logEntry.details

    // Use Promise.all to run Redis operations in parallel
    await Promise.all([
      // Store the log data
      redis.hmset(`log:${logEntry.id}`, logData),

      // Add to timestamp index
      redis.set(`log:timestamp:${timestamp}:${logEntry.id}`, logEntry.id),

      // Add to level index
      redis.sadd(`logs:level:${level}`, logEntry.id),

      // Add to source index
      redis.sadd(`logs:source:${source}`, logEntry.id),

      // Add to the main logs set
      redis.sadd("logs:all", logEntry.id),
    ]).catch((err) => {
      // Silently catch Redis errors - we already have the log in memory
      console.log("Redis storage operation failed, using memory fallback")
    })
  } catch (error) {
    // Silently catch Redis errors - we already have the log in memory
    console.log("Redis storage operation failed, using memory fallback")
  }

  // Always return the log entry
  return logEntry
}

// Get logs with filtering
export async function getLogs(
  filters: {
    level?: LogLevel
    source?: string
    timeRange?: string
    searchTerm?: string
    limit?: number
  } = {},
): Promise<LogEntry[]> {
  const limit = filters.limit || 100

  // Try to get logs from Redis first
  try {
    const redis = getRedisClient()
    if (!redis) {
      // Redis client not available, use memory logs
      return getMemoryLogs(filters, limit)
    }

    // Start with all logs
    let logIds = await redis.smembers("logs:all")

    // If no logs in Redis, fall back to memory
    if (!logIds || logIds.length === 0) {
      return getMemoryLogs(filters, limit)
    }

    // If we have level or source filters, we need to intersect with those sets
    if (filters.level) {
      const levelLogIds = await redis.smembers(`logs:level:${filters.level}`)
      logIds = logIds.filter((id) => levelLogIds.includes(id))
    }

    if (filters.source) {
      const sourceLogIds = await redis.smembers(`logs:source:${filters.source}`)
      logIds = logIds.filter((id) => sourceLogIds.includes(id))
    }

    // Get the actual log entries
    const logEntries: LogEntry[] = []
    for (const id of logIds) {
      try {
        const logData = await redis.hgetall(`log:${id}`)

        // Skip if no data found
        if (!logData || Object.keys(logData).length === 0) continue

        const logEntry = logData as unknown as LogEntry

        // Apply time range filter if needed
        if (filters.timeRange) {
          const timestamp = Number.parseInt(logData.timestamp || "0")
          const now = Date.now()
          let startTime = 0

          switch (filters.timeRange) {
            case "24h":
              startTime = now - 24 * 60 * 60 * 1000
              break
            case "7d":
              startTime = now - 7 * 24 * 60 * 60 * 1000
              break
            case "30d":
              startTime = now - 30 * 24 * 60 * 60 * 1000
              break
          }

          if (timestamp < startTime) continue
        }

        // Apply search term filter if needed
        if (filters.searchTerm && !logEntry.message.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          continue
        }

        logEntries.push(logEntry)
      } catch (error) {
        // Continue with other logs
      }
    }

    // Sort by timestamp (newest first)
    logEntries.sort((a, b) => {
      const timestampA = Number.parseInt(a.timestamp?.toString() || "0")
      const timestampB = Number.parseInt(b.timestamp?.toString() || "0")
      return timestampB - timestampA
    })

    // Apply limit
    return logEntries.slice(0, limit)
  } catch (error) {
    // Fall back to memory logs
    return getMemoryLogs(filters, limit)
  }
}

// Helper function to get logs from memory
function getMemoryLogs(
  filters: {
    level?: LogLevel
    source?: string
    timeRange?: string
    searchTerm?: string
  } = {},
  limit = 100,
): LogEntry[] {
  let filteredLogs = [...memoryLogs]

  // Apply filters
  if (filters.level) {
    filteredLogs = filteredLogs.filter((log) => log.level === filters.level)
  }

  if (filters.source) {
    filteredLogs = filteredLogs.filter((log) => log.source === filters.source)
  }

  if (filters.searchTerm) {
    filteredLogs = filteredLogs.filter((log) => log.message.toLowerCase().includes(filters.searchTerm!.toLowerCase()))
  }

  if (filters.timeRange) {
    const now = Date.now()
    let startTime = 0

    switch (filters.timeRange) {
      case "24h":
        startTime = now - 24 * 60 * 60 * 1000
        break
      case "7d":
        startTime = now - 7 * 24 * 60 * 60 * 1000
        break
      case "30d":
        startTime = now - 30 * 24 * 60 * 60 * 1000
        break
    }

    filteredLogs = filteredLogs.filter((log) => log.timestamp >= startTime)
  }

  // Sort by timestamp (newest first)
  filteredLogs.sort((a, b) => b.timestamp - a.timestamp)

  // Apply limit
  return filteredLogs.slice(0, limit)
}

// Clear all logs
export async function clearLogs(): Promise<boolean> {
  // Clear memory logs
  memoryLogs.length = 0

  // Try to clear Redis logs
  try {
    const redis = getRedisClient()
    if (!redis) {
      // Redis client not available, but we cleared memory logs
      return true
    }

    // Get all log IDs
    const logIds = await redis.smembers("logs:all")

    // Delete each log entry
    for (const id of logIds) {
      await redis.del(`log:${id}`)
    }

    // Delete timestamp keys
    const timestampKeys = await redis.keys("log:timestamp:*")
    for (const key of timestampKeys) {
      await redis.del(key)
    }

    // Delete the indexes
    const levels: LogLevel[] = ["info", "warning", "error", "success"]
    for (const level of levels) {
      await redis.del(`logs:level:${level}`)
    }

    const sourceKeys = await redis.keys("logs:source:*")
    for (const key of sourceKeys) {
      await redis.del(key)
    }

    // Delete the main logs set
    await redis.del("logs:all")

    return true
  } catch (error) {
    // We still cleared memory logs, so return success
    return true
  }
}

// Get the count of logs for each level
export async function getLogCounts(): Promise<Record<LogLevel, number>> {
  // Initialize with zeros
  const counts: Record<LogLevel, number> = {
    info: 0,
    warning: 0,
    error: 0,
    success: 0,
  }

  // Try to get counts from Redis
  try {
    const redis = getRedisClient()
    if (redis) {
      const levels: LogLevel[] = ["info", "warning", "error", "success"]

      for (const level of levels) {
        counts[level] = await redis.scard(`logs:level:${level}`)
      }

      // If we have any logs in Redis, return those counts
      if (Object.values(counts).some((count) => count > 0)) {
        return counts
      }
    }
  } catch (error) {
    // Fall back to memory logs
  }

  // Count memory logs
  memoryLogs.forEach((log) => {
    counts[log.level]++
  })

  return counts
}

// Get all log sources
export async function getLogSources(): Promise<string[]> {
  // Try to get sources from Redis
  try {
    const redis = getRedisClient()
    if (redis) {
      const sourceKeys = await redis.keys("logs:source:*")
      const sources = sourceKeys.map((key) => key.replace("logs:source:", ""))

      // If we have sources in Redis, return those
      if (sources.length > 0) {
        return sources
      }
    }
  } catch (error) {
    // Fall back to memory logs
  }

  // Get sources from memory logs
  const sources = new Set<string>()
  memoryLogs.forEach((log) => {
    sources.add(log.source)
  })

  return Array.from(sources)
}

