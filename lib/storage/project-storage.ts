import { getRedisClient } from "../redis-client"

export interface Project {
  id: string
  title: string
  description: string
  imageUrl?: string
  demoUrl?: string
  repoUrl?: string
  technologies: string[]
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

const PROJECTS_KEY = "projects"

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  const redis = getRedisClient()

  // Generate a unique ID
  const id = `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const newProject: Project = {
    ...project,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Store the project
  await redis.hset(PROJECTS_KEY, { [id]: JSON.stringify(newProject) })

  return newProject
}

export async function getProjectById(id: string): Promise<Project | null> {
  const redis = getRedisClient()

  const projectJson = await redis.hget(PROJECTS_KEY, id)

  if (!projectJson) return null

  return JSON.parse(projectJson as string) as Project
}

export async function getAllProjects(options?: {
  featuredOnly?: boolean
  limit?: number
  offset?: number
}): Promise<Project[]> {
  const redis = getRedisClient()

  // Get all projects
  const projectsObj = await redis.hgetall(PROJECTS_KEY)

  if (!projectsObj) return []

  // Convert to array of projects
  let projects = Object.values(projectsObj).map((json) => JSON.parse(json as string) as Project)

  // Filter featured only if requested
  if (options?.featuredOnly) {
    projects = projects.filter((project) => project.featured)
  }

  // Sort by order
  projects.sort((a, b) => a.order - b.order)

  // Apply pagination
  if (options?.offset || options?.limit) {
    const offset = options?.offset || 0
    const limit = options?.limit || projects.length

    projects = projects.slice(offset, offset + limit)
  }

  return projects
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const redis = getRedisClient()

  // Get the existing project
  const existingProject = await getProjectById(id)

  if (!existingProject) return null

  // Update the project
  const updatedProject: Project = {
    ...existingProject,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // Store the updated project
  await redis.hset(PROJECTS_KEY, { [id]: JSON.stringify(updatedProject) })

  return updatedProject
}

export async function deleteProject(id: string): Promise<boolean> {
  const redis = getRedisClient()

  // Remove the project
  await redis.hdel(PROJECTS_KEY, id)

  return true
}

