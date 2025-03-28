import { getRedisClient } from "../redis-client"

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  coverImage?: string
  author: string
  published: boolean
  publishedAt: string
  updatedAt: string
  tags: string[]
}

// Keys for Redis
const BLOG_POSTS_KEY = "blog:posts"
const BLOG_POSTS_SET = "blog:posts:all"
const BLOG_POSTS_PUBLISHED = "blog:posts:published"
const BLOG_POSTS_DRAFTS = "blog:posts:drafts"
const BLOG_TAGS_SET = "blog:tags"

// Generate a unique ID for blog posts
function generatePostId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Create a slug from a title
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Create a new blog post
export async function createBlogPost(
  post: Omit<BlogPost, "id" | "slug" | "publishedAt" | "updatedAt">,
): Promise<BlogPost> {
  try {
    const redis = getRedisClient()

    const now = new Date().toISOString()
    const id = generatePostId()
    const slug = slugify(post.title)

    // Check if slug already exists
    const existingSlugs = await redis.smembers(`blog:slugs`)
    if (existingSlugs.includes(slug)) {
      // Add a unique suffix
      const uniqueSlug = `${slug}-${Date.now().toString().slice(-5)}`
      post.title = `${post.title} (${uniqueSlug})`
    }

    const newPost: BlogPost = {
      id,
      slug,
      ...post,
      publishedAt: post.published ? now : "",
      updatedAt: now,
    }

    // Store the post
    await redis.hset(`${BLOG_POSTS_KEY}:${id}`, newPost)

    // Add to the set of all posts
    await redis.sadd(BLOG_POSTS_SET, id)

    // Add to the appropriate set (published or draft)
    if (post.published) {
      await redis.sadd(BLOG_POSTS_PUBLISHED, id)
      await redis.zadd("blog:posts:published:timeline", [
        {
          score: new Date(now).getTime(),
          member: id,
        },
      ])
    } else {
      await redis.sadd(BLOG_POSTS_DRAFTS, id)
    }

    // Add to slug index
    await redis.sadd(`blog:slugs`, slug)

    // Add tags
    if (post.tags && post.tags.length > 0) {
      // Add each tag to the set of all tags
      for (const tag of post.tags) {
        await redis.sadd(BLOG_TAGS_SET, tag)
        await redis.sadd(`blog:tag:${tag}`, id)
      }
    }

    return newPost
  } catch (error) {
    console.error("Error creating blog post:", error)
    throw error
  }
}

// Get a blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const redis = getRedisClient()

    const post = await redis.hgetall(`${BLOG_POSTS_KEY}:${id}`)

    if (!post || Object.keys(post).length === 0) {
      return null
    }

    // Convert the post to the correct format
    const blogPost = post as unknown as BlogPost

    return blogPost
  } catch (error) {
    console.error(`Error getting blog post with ID ${id}:`, error)
    return null
  }
}

// Get a blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const redis = getRedisClient()

    // Check if slug exists
    const slugExists = await redis.sismember(`blog:slugs`, slug)

    if (!slugExists) {
      return null
    }

    // Get all post IDs
    const postIds = await redis.smembers(BLOG_POSTS_SET)

    // Find the post with the matching slug
    for (const id of postIds) {
      const post = await getBlogPostById(id)

      if (post && post.slug === slug) {
        return post
      }
    }

    return null
  } catch (error) {
    console.error(`Error getting blog post with slug ${slug}:`, error)
    return null
  }
}

// Get all blog posts
export async function getAllBlogPosts(
  options: {
    onlyPublished?: boolean
    limit?: number
    offset?: number
    tag?: string
  } = {},
): Promise<BlogPost[]> {
  try {
    const redis = getRedisClient()

    // Determine which set to use
    const setKey = options.onlyPublished ? BLOG_POSTS_PUBLISHED : BLOG_POSTS_SET

    // Get post IDs
    let postIds: string[]

    if (options.tag) {
      // Get posts with the specified tag
      postIds = await redis.smembers(`blog:tag:${options.tag}`)

      // Filter by published if needed
      if (options.onlyPublished) {
        const publishedIds = await redis.smembers(BLOG_POSTS_PUBLISHED)
        postIds = postIds.filter((id) => publishedIds.includes(id))
      }
    } else if (options.onlyPublished) {
      // Get published posts in order by published date
      postIds = await redis.zrevrange("blog:posts:published:timeline", 0, -1)
    } else {
      // Get all post IDs
      postIds = await redis.smembers(setKey)
    }

    // Apply pagination
    const offset = options.offset || 0
    const limit = options.limit || postIds.length
    const paginatedIds = postIds.slice(offset, offset + limit)

    // Get the posts
    const posts: BlogPost[] = []
    for (const id of paginatedIds) {
      const post = await getBlogPostById(id)
      if (post) {
        posts.push(post)
      }
    }

    return posts
  } catch (error) {
    console.error("Error getting all blog posts:", error)
    return []
  }
}

// Update a blog post
export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const redis = getRedisClient()

    // Get the existing post
    const existingPost = await getBlogPostById(id)

    if (!existingPost) {
      return null
    }

    // Prepare the updates
    const now = new Date().toISOString()
    const updatedPost: BlogPost = {
      ...existingPost,
      ...updates,
      updatedAt: now,
    }

    // Update publishedAt if the post is being published
    if (updates.published === true && !existingPost.published) {
      updatedPost.publishedAt = now
    }

    // Update the post
    await redis.hset(`${BLOG_POSTS_KEY}:${id}`, updatedPost)

    // Handle publication status change
    if (updates.published !== undefined && updates.published !== existingPost.published) {
      if (updates.published) {
        // Post is being published
        await redis.srem(BLOG_POSTS_DRAFTS, id)
        await redis.sadd(BLOG_POSTS_PUBLISHED, id)
        await redis.zadd("blog:posts:published:timeline", [
          {
            score: new Date(now).getTime(),
            member: id,
          },
        ])
      } else {
        // Post is being unpublished
        await redis.srem(BLOG_POSTS_PUBLISHED, id)
        await redis.sadd(BLOG_POSTS_DRAFTS, id)
        await redis.zrem("blog:posts:published:timeline", id)
      }
    }

    // Handle tag changes
    if (updates.tags) {
      // Remove old tags
      for (const tag of existingPost.tags) {
        if (!updates.tags.includes(tag)) {
          await redis.srem(`blog:tag:${tag}`, id)
        }
      }

      // Add new tags
      for (const tag of updates.tags) {
        if (!existingPost.tags.includes(tag)) {
          await redis.sadd(BLOG_TAGS_SET, tag)
          await redis.sadd(`blog:tag:${tag}`, id)
        }
      }
    }

    return updatedPost
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error)
    return null
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const redis = getRedisClient()

    // Get the post to delete
    const post = await getBlogPostById(id)

    if (!post) {
      return false
    }

    // Remove from sets
    await redis.srem(BLOG_POSTS_SET, id)
    await redis.srem(BLOG_POSTS_PUBLISHED, id)
    await redis.srem(BLOG_POSTS_DRAFTS, id)
    await redis.zrem("blog:posts:published:timeline", id)

    // Remove from slug index
    await redis.srem(`blog:slugs`, post.slug)

    // Remove from tag indexes
    for (const tag of post.tags) {
      await redis.srem(`blog:tag:${tag}`, id)
    }

    // Delete the post
    await redis.del(`${BLOG_POSTS_KEY}:${id}`)

    return true
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error)
    return false
  }
}

// Get all blog tags
export async function getAllBlogTags(): Promise<string[]> {
  try {
    const redis = getRedisClient()

    const tags = await redis.smembers(BLOG_TAGS_SET)

    return tags
  } catch (error) {
    console.error("Error getting all blog tags:", error)
    return []
  }
}

