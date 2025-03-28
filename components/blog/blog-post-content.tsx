"use client"

import { motion } from "framer-motion"

interface BlogPostContentProps {
  content: string
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="container mx-auto px-4 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />

        <div className="flex flex-wrap gap-2 mt-8">
          <span className="text-sm font-medium">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {["Quantum Computing", "Robotics", "AI", "Research"].map((tag) => (
              <span key={tag} className="text-sm bg-muted px-2 py-1 rounded-md hover:bg-muted/80 cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

