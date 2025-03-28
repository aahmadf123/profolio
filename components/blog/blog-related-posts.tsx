"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAchievements } from "@/lib/use-achievements"

// Sample blog post data (simplified version)
const blogPosts = [
  {
    id: "quantum-robotics-future",
    title: "The Future of Quantum Computing in Robotics",
    excerpt:
      "Exploring how quantum algorithms can revolutionize path planning and decision making in autonomous robotic systems.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-11-10",
    category: "Quantum Computing",
  },
  {
    id: "drone-swarm-intelligence",
    title: "Swarm Intelligence: Coordinating Drone Fleets",
    excerpt:
      "How biomimetic algorithms inspired by bees and ants are enabling unprecedented coordination in drone swarm operations.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-10-25",
    category: "Drones",
  },
  {
    id: "reinforcement-learning-robotics",
    title: "Reinforcement Learning Breakthroughs in Robotic Manipulation",
    excerpt:
      "Recent advances in reinforcement learning are making robotic manipulation more adaptable and precise than ever before.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-10-12",
    category: "AI",
  },
  {
    id: "quantum-optimization-challenges",
    title: "Overcoming Challenges in Quantum Optimization",
    excerpt:
      "Addressing the practical limitations and future potential of quantum computing for solving complex optimization problems.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-09-30",
    category: "Quantum Computing",
  },
]

interface BlogRelatedPostsProps {
  currentPostId: string
}

export function BlogRelatedPosts({ currentPostId }: BlogRelatedPostsProps) {
  const { unlockAchievement } = useAchievements()

  // Get related posts (excluding current post)
  const relatedPosts = blogPosts.filter((post) => post.id !== currentPostId).slice(0, 3)

  // Handle reading a blog post
  const handleReadPost = () => {
    unlockAchievement("knowledge_seeker")
  }

  return (
    <div className="container mx-auto px-4 mb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.id}`} onClick={handleReadPost}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{post.category}</Badge>
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

