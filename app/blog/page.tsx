import { MainLayout } from "@/components/layout/main-layout"
import { BlogHeader } from "@/components/sections/blog-header"
import { BlogPosts } from "@/components/sections/blog-posts"

export const metadata = {
  title: "Blog | Portfolio",
  description: "Read the latest articles about robotics, AI, and quantum computing",
}

export default function BlogPage() {
  return (
    <MainLayout>
      <div className="min-h-screen py-20">
        <BlogHeader />
        <BlogPosts />
      </div>
    </MainLayout>
  )
}

