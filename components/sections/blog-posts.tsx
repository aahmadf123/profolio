"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAchievements } from "@/lib/use-achievements"

// Sample blog post data
const blogPosts = [
  {
    id: "quantum-robotics-future",
    title: "The Future of Quantum Computing in Robotics",
    excerpt:
      "Exploring how quantum algorithms can revolutionize path planning and decision making in autonomous robotic systems.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-11-10",
    readTime: "8 min read",
    author: "Your Name",
    category: "Quantum Computing",
    featured: true,
  },
  {
    id: "drone-swarm-intelligence",
    title: "Swarm Intelligence: Coordinating Drone Fleets",
    excerpt:
      "How biomimetic algorithms inspired by bees and ants are enabling unprecedented coordination in drone swarm operations.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-10-25",
    readTime: "6 min read",
    author: "Your Name",
    category: "Drones",
    featured: false,
  },
  {
    id: "reinforcement-learning-robotics",
    title: "Reinforcement Learning Breakthroughs in Robotic Manipulation",
    excerpt:
      "Recent advances in reinforcement learning are making robotic manipulation more adaptable and precise than ever before.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-10-12",
    readTime: "10 min read",
    author: "Your Name",
    category: "AI",
    featured: false,
  },
  {
    id: "quantum-optimization-challenges",
    title: "Overcoming Challenges in Quantum Optimization",
    excerpt:
      "Addressing the practical limitations and future potential of quantum computing for solving complex optimization problems.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-09-30",
    readTime: "7 min read",
    author: "Your Name",
    category: "Quantum Computing",
    featured: false,
  },
  {
    id: "computer-vision-drones",
    title: "Computer Vision Advancements for Aerial Surveillance",
    excerpt:
      "How deep learning and computer vision are transforming aerial surveillance and monitoring capabilities of modern drones.",
    coverImage: "/placeholder.svg?height=400&width=800",
    date: "2023-09-15",
    readTime: "5 min read",
    author: "Your Name",
    category: "Machine Learning",
    featured: false,
  },
]

export function BlogPosts() {
  const { unlockAchievement } = useAchievements()
  const [visiblePosts, setVisiblePosts] = useState(4)

  // Handle reading a blog post
  const handleReadPost = () => {
    unlockAchievement("knowledge_seeker")
  }

  // Load more posts
  const loadMorePosts = () => {
    setVisiblePosts((prev) => Math.min(prev + 4, blogPosts.length))
  }

  // Featured post (first one)
  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0]

  // Other posts (excluding featured)
  const otherPosts = blogPosts.filter((post) => post.id !== featuredPost.id).slice(0, visiblePosts - 1)

  return (
    <div className="container mx-auto px-4">
      {/* Featured Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <Link href={`/blog/${featuredPost.id}`} onClick={handleReadPost}>
          <Card className="overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-[2/1] overflow-hidden bg-muted">
              <img
                src={featuredPost.coverImage || "/placeholder.svg"}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <Badge className="mb-3">{featuredPost.category}</Badge>
              <h2 className="text-2xl font-bold mb-3">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(featuredPost.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      {/* Other Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.id}`} onClick={handleReadPost}>
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
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-3">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {visiblePosts < blogPosts.length && (
        <div className="text-center mt-12">
          <Button onClick={loadMorePosts} variant="outline" className="group">
            Load More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

