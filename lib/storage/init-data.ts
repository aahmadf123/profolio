import { createBlogPost } from "./blog-storage"
import { createProject } from "./project-storage"
import { createSkill } from "./skill-storage"
import { updateSettings } from "./settings-storage"
import { testRedisConnection } from "../redis-client"

export async function initializeDatabase() {
  try {
    // Test Redis connection
    const isConnected = await testRedisConnection()

    if (!isConnected) {
      console.error("Failed to connect to Redis. Database initialization aborted.")
      return false
    }

    console.log("Initializing database with sample data...")

    // Initialize site settings
    await updateSettings({
      siteName: "My Portfolio",
      siteDescription: "A showcase of my work and skills",
      ownerName: "John Doe",
      ownerTitle: "Full Stack Developer",
      ownerBio: "I am a passionate developer with experience in building web applications.",
      contactEmail: "john@example.com",
      socialLinks: {
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
      },
      theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#10b981",
        accentColor: "#f59e0b",
        darkMode: true,
      },
      seo: {
        keywords: ["developer", "portfolio", "web development", "react", "next.js"],
      },
    })

    // Initialize blog posts
    await createBlogPost({
      slug: "getting-started-with-nextjs",
      title: "Getting Started with Next.js",
      content: `
# Getting Started with Next.js

Next.js is a React framework that enables server-side rendering and static site generation.

## Why Next.js?

- **Server-side Rendering**: Improves performance and SEO
- **Static Site Generation**: Pre-renders pages at build time
- **API Routes**: Create API endpoints easily
- **File-based Routing**: Simple and intuitive routing
- **Built-in CSS Support**: Supports CSS Modules, Sass, and more

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your application.
      `,
      excerpt: "Learn how to get started with Next.js, a React framework for production.",
      publishedAt: new Date().toISOString(),
      published: true,
      tags: ["Next.js", "React", "Web Development"],
      author: "John Doe",
    })

    await createBlogPost({
      slug: "mastering-typescript",
      title: "Mastering TypeScript",
      content: `
# Mastering TypeScript

TypeScript is a strongly typed programming language that builds on JavaScript.

## Benefits of TypeScript

- **Static Type Checking**: Catch errors at compile time
- **Better IDE Support**: Improved autocompletion and refactoring
- **Enhanced Readability**: Types serve as documentation
- **Safer Refactoring**: Types help prevent breaking changes

## Basic Types

\`\`\`typescript
// Basic types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// Interfaces
interface User {
  name: string;
  id: number;
}

// Classes
class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
\`\`\`
      `,
      excerpt: "Learn how to use TypeScript effectively in your projects.",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      published: true,
      tags: ["TypeScript", "JavaScript", "Programming"],
      author: "John Doe",
    })

    // Initialize projects
    await createProject({
      title: "E-commerce Platform",
      description: "A full-featured e-commerce platform built with Next.js, TypeScript, and Tailwind CSS.",
      imageUrl: "/placeholder.svg?height=600&width=800",
      demoUrl: "https://example.com/demo",
      repoUrl: "https://github.com/example/ecommerce",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "Supabase"],
      featured: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    await createProject({
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates.",
      imageUrl: "/placeholder.svg?height=600&width=800",
      demoUrl: "https://example.com/tasks-demo",
      repoUrl: "https://github.com/example/tasks",
      technologies: ["React", "Firebase", "Material UI", "Redux"],
      featured: true,
      order: 2,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    // Initialize skills
    await createSkill({
      name: "React",
      category: "Frontend",
      proficiency: 90,
      icon: "react",
      color: "#61dafb",
      featured: true,
      order: 1,
    })

    await createSkill({
      name: "TypeScript",
      category: "Languages",
      proficiency: 85,
      icon: "typescript",
      color: "#3178c6",
      featured: true,
      order: 2,
    })

    await createSkill({
      name: "Node.js",
      category: "Backend",
      proficiency: 80,
      icon: "nodejs",
      color: "#339933",
      featured: true,
      order: 3,
    })

    await createSkill({
      name: "Next.js",
      category: "Frontend",
      proficiency: 85,
      icon: "nextjs",
      color: "#000000",
      featured: true,
      order: 4,
    })

    await createSkill({
      name: "Tailwind CSS",
      category: "Frontend",
      proficiency: 90,
      icon: "tailwindcss",
      color: "#38b2ac",
      featured: true,
      order: 5,
    })

    console.log("Database initialized successfully!")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}

