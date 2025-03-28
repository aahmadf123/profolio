import { getRedisClient } from "../redis-client"

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number // 1-100
  icon?: string
  color?: string
  featured: boolean
  order: number
}

const SKILLS_KEY = "skills"
const SKILL_CATEGORIES_KEY = "skill:categories"

export async function createSkill(skill: Omit<Skill, "id">): Promise<Skill> {
  const redis = getRedisClient()

  // Generate a unique ID
  const id = `skill_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const newSkill: Skill = {
    ...skill,
    id,
  }

  // Store the skill
  await redis.hset(SKILLS_KEY, { [id]: JSON.stringify(newSkill) })

  // Add to category set if not exists
  await redis.sadd(SKILL_CATEGORIES_KEY, skill.category)

  return newSkill
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const redis = getRedisClient()

  const skillJson = await redis.hget(SKILLS_KEY, id)

  if (!skillJson) return null

  return JSON.parse(skillJson as string) as Skill
}

export async function getAllSkills(options?: {
  category?: string
  featuredOnly?: boolean
}): Promise<Skill[]> {
  const redis = getRedisClient()

  // Get all skills
  const skillsObj = await redis.hgetall(SKILLS_KEY)

  if (!skillsObj) return []

  // Convert to array of skills
  let skills = Object.values(skillsObj).map((json) => JSON.parse(json as string) as Skill)

  // Filter by category if requested
  if (options?.category) {
    skills = skills.filter((skill) => skill.category === options.category)
  }

  // Filter featured only if requested
  if (options?.featuredOnly) {
    skills = skills.filter((skill) => skill.featured)
  }

  // Sort by order
  skills.sort((a, b) => a.order - b.order)

  return skills
}

export async function getSkillCategories(): Promise<string[]> {
  const redis = getRedisClient()

  const categories = await redis.smembers(SKILL_CATEGORIES_KEY)

  return categories as string[]
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
  const redis = getRedisClient()

  // Get the existing skill
  const existingSkill = await getSkillById(id)

  if (!existingSkill) return null

  // Handle category change
  if (updates.category && updates.category !== existingSkill.category) {
    // Add new category to set
    await redis.sadd(SKILL_CATEGORIES_KEY, updates.category)
  }

  // Update the skill
  const updatedSkill: Skill = {
    ...existingSkill,
    ...updates,
  }

  // Store the updated skill
  await redis.hset(SKILLS_KEY, { [id]: JSON.stringify(updatedSkill) })

  return updatedSkill
}

export async function deleteSkill(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the skill
  await redis.hdel(SKILLS_KEY, id)

  return true
}

