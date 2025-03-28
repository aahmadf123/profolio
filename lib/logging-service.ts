"use server"

import { getLogs, createLogEntry, type LogEntry as StorageLogEntry } from "./storage/log-storage"

export type LogLevel = "info" | "warning" | "error" | "success"

export type LogFilters = {
  level?: LogLevel
  source?: string
  timeRange?: string
  searchTerm?: string
  limit?: number
}

export interface LogEntry extends StorageLogEntry {}

// Log activity to the database (server-side)
export async function logActivityServer(
  level: LogLevel,
  message: string,
  source: string,
  userEmail?: string,
  details?: string,
) {
  // Always log to console as a fallback
  console.log(`[${level.toUpperCase()}] ${message}`, { source, userEmail, details })

  try {
    // Store log in Redis with fallback to memory
    const logEntry = await createLogEntry(level, message, source, userEmail || null, details || null)
    return { success: true, data: logEntry }
  } catch (error) {
    console.error("Error in logActivityServer:", error)
    return { success: true, fallback: true, error: error instanceof Error ? error.message : String(error) }
  }
}

// These functions are kept for server components to use directly
export async function logInfo(message: string, source: string, userEmail?: string, details?: string) {
  return await logActivityServer("info", message, source, userEmail, details)
}

export async function logError(message: string, source: string, userEmail?: string, details?: string) {
  return await logActivityServer("error", message, source, userEmail, details)
}

export async function logWarning(message: string, source: string, userEmail?: string, details?: string) {
  return await logActivityServer("warning", message, source, userEmail, details)
}

export async function logSuccess(message: string, source: string, userEmail?: string, details?: string) {
  return await logActivityServer("success", message, source, userEmail, details)
}

export async function fetchLogs(filters: LogFilters = {}) {
  try {
    const logs = await getLogs({
      level: filters.level,
      source: filters.source,
      timeRange: filters.timeRange,
      searchTerm: filters.searchTerm,
      limit: filters.limit,
    })

    return { data: logs, error: null }
  } catch (error) {
    console.error("Error in fetchLogs:", error)
    return { data: [], error: error instanceof Error ? error.message : String(error) }
  }
}

export async function logActivity(
  level: LogLevel,
  message: string,
  source: string,
  userEmail?: string,
  details?: string,
) {
  return await logActivityServer(level, message, source, userEmail, details)
}

