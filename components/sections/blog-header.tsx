"use client"

import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function BlogHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample categories
  const categories = ["All", "Robotics", "AI", "Quantum Computing", "Drones", "Machine Learning", "Research"]

  return (
    <div className="container mx-auto px-4 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore my thoughts, research, and insights on robotics, artificial intelligence, quantum computing, and more.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category, index) => (
            <Badge key={category} variant={index === 0 ? "default" : "outline"} className="cursor-pointer">
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

