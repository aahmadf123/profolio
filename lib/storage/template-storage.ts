import { getRedisClient } from "../redis-client"

export interface ContentTemplate {
  id: string
  name: string
  description: string
  category: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const TEMPLATES_KEY = "templates"
const TEMPLATE_CATEGORIES_KEY = "template:categories"
const TEMPLATE_TAGS_KEY = "template:tags"

export async function createTemplate(
  template: Omit<ContentTemplate, "id" | "createdAt" | "updatedAt">,
): Promise<ContentTemplate> {
  const redis = getRedisClient()

  // Generate a unique ID
  const id = `template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const newTemplate: ContentTemplate = {
    ...template,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Store the template
  await redis.hset(TEMPLATES_KEY, { [id]: JSON.stringify(newTemplate) })

  // Add category to set
  await redis.sadd(TEMPLATE_CATEGORIES_KEY, template.category)

  // Add tags to set
  if (template.tags.length > 0) {
    await redis.sadd(TEMPLATE_TAGS_KEY, ...template.tags)
  }

  return newTemplate
}

export async function getTemplateById(id: string): Promise<ContentTemplate | null> {
  const redis = getRedisClient()

  const templateJson = await redis.hget(TEMPLATES_KEY, id)

  if (!templateJson) return null

  return JSON.parse(templateJson as string) as ContentTemplate
}

export async function getAllTemplates(options?: {
  category?: string
  tags?: string[]
}): Promise<ContentTemplate[]> {
  const redis = getRedisClient()

  // Get all templates
  const templatesObj = await redis.hgetall(TEMPLATES_KEY)

  if (!templatesObj) return []

  // Convert to array of templates
  let templates = Object.values(templatesObj).map((json) => JSON.parse(json as string) as ContentTemplate)

  // Filter by category if requested
  if (options?.category) {
    templates = templates.filter((template) => template.category === options.category)
  }

  // Filter by tags if requested
  if (options?.tags && options.tags.length > 0) {
    templates = templates.filter((template) => options.tags!.some((tag) => template.tags.includes(tag)))
  }

  // Sort by name
  templates.sort((a, b) => a.name.localeCompare(b.name))

  return templates
}

export async function getTemplateCategories(): Promise<string[]> {
  const redis = getRedisClient()

  const categories = await redis.smembers(TEMPLATE_CATEGORIES_KEY)

  return categories as string[]
}

export async function getTemplateTags(): Promise<string[]> {
  const redis = getRedisClient()

  const tags = await redis.smembers(TEMPLATE_TAGS_KEY)

  return tags as string[]
}

export async function updateTemplate(id: string, updates: Partial<ContentTemplate>): Promise<ContentTemplate | null> {
  const redis = getRedisClient()

  // Get the existing template
  const existingTemplate = await getTemplateById(id)

  if (!existingTemplate) return null

  // Handle category change
  if (updates.category && updates.category !== existingTemplate.category) {
    // Add new category to set
    await redis.sadd(TEMPLATE_CATEGORIES_KEY, updates.category)
  }

  // Handle tags change
  if (updates.tags) {
    // Add new tags to set
    if (updates.tags.length > 0) {
      await redis.sadd(TEMPLATE_TAGS_KEY, ...updates.tags)
    }
  }

  // Update the template
  const updatedTemplate: ContentTemplate = {
    ...existingTemplate,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // Store the updated template
  await redis.hset(TEMPLATES_KEY, { [id]: JSON.stringify(updatedTemplate) })

  return updatedTemplate
}

export async function deleteTemplate(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the template
  await redis.hdel(TEMPLATES_KEY, id)

  return true
}

