import { getRedisClient } from "../redis-client"
import crypto from "crypto"

export interface User {
  email: string
  passwordHash: string
  role: "admin" | "editor" | "viewer"
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

const USERS_KEY = "users"
const SESSIONS_KEY = "sessions"
const SESSION_EXPIRY = 60 * 60 * 24 * 7 // 7 days in seconds

// Hash a password
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, "sha512").toString("hex")

  return { hash, salt: generatedSalt }
}

// Verify a password
function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: newHash } = hashPassword(password, salt)
  return newHash === hash
}

export async function createUser(email: string, password: string, role: User["role"] = "admin"): Promise<User> {
  const redis = getRedisClient()

  // Check if user already exists
  const existingUser = await redis.hget(USERS_KEY, email)

  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash the password
  const salt = crypto.randomBytes(16).toString("hex")
  const { hash } = hashPassword(password, salt)

  const user: User & { salt: string } = {
    email,
    passwordHash: hash,
    salt,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Store the user
  await redis.hset(USERS_KEY, { [email]: JSON.stringify(user) })

  // Return the user without the salt
  const { salt: _, ...userWithoutSalt } = user
  return userWithoutSalt
}

export async function authenticateUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const redis = getRedisClient()

  // Get the user
  const userJson = await redis.hget(USERS_KEY, email)

  if (!userJson) return null

  const user = JSON.parse(userJson as string) as User & { salt: string }

  // Verify the password
  if (!verifyPassword(password, user.passwordHash, user.salt)) {
    return null
  }

  // Generate a session token
  const token = crypto.randomBytes(32).toString("hex")

  // Store the session
  await redis.hset(SESSIONS_KEY, {
    [token]: JSON.stringify({
      email,
      createdAt: new Date().toISOString(),
    }),
  })

  // Set expiry on the session
  await redis.expire(`${SESSIONS_KEY}:${token}`, SESSION_EXPIRY)

  // Update last login
  const updatedUser = {
    ...user,
    lastLogin: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await redis.hset(USERS_KEY, { [email]: JSON.stringify(updatedUser) })

  // Return the user without the salt
  const { salt: _, ...userWithoutSalt } = updatedUser
  return { user: userWithoutSalt, token }
}

export async function validateSession(token: string): Promise<User | null> {
  const redis = getRedisClient()

  // Get the session
  const sessionJson = await redis.hget(SESSIONS_KEY, token)

  if (!sessionJson) return null

  const session = JSON.parse(sessionJson as string) as { email: string }

  // Get the user
  const userJson = await redis.hget(USERS_KEY, session.email)

  if (!userJson) return null

  const user = JSON.parse(userJson as string) as User & { salt: string }

  // Return the user without the salt
  const { salt: _, ...userWithoutSalt } = user
  return userWithoutSalt
}

export async function logoutUser(token: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the session
  await redis.hdel(SESSIONS_KEY, token)

  return true
}

export async function updateUser(email: string, updates: Partial<User> & { password?: string }): Promise<User | null> {
  const redis = getRedisClient()

  // Get the existing user
  const userJson = await redis.hget(USERS_KEY, email)

  if (!userJson) return null

  const user = JSON.parse(userJson as string) as User & { salt: string }

  // Handle password update
  if (updates.password) {
    const { hash } = hashPassword(updates.password, user.salt)
    updates.passwordHash = hash
    delete updates.password
  }

  // Update the user
  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // Store the updated user
  await redis.hset(USERS_KEY, { [email]: JSON.stringify(updatedUser) })

  // Return the user without the salt
  const { salt: _, ...userWithoutSalt } = updatedUser
  return userWithoutSalt
}

