"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, X, FileText, Cpu, BookOpen, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  type: "project" | "blog" | "skill" | "page"
  icon: React.ReactNode
  keywords?: string[]
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Mock search results with keywords for better matching
  const allResults: SearchResult[] = [
    {
      id: "project-1",
      title: "Autonomous Drone Swarm",
      description: "Developed a swarm intelligence algorithm for coordinating multiple drones",
      url: "/#projects",
      type: "project",
      icon: <Cpu className="h-4 w-4" />,
      keywords: ["drone", "swarm", "robotics", "autonomous", "AI"],
    },
    {
      id: "blog-1",
      title: "The Future of Quantum Computing in Robotics",
      description: "Exploring how quantum algorithms can revolutionize path planning",
      url: "/blog/quantum-robotics-future",
      type: "blog",
      icon: <BookOpen className="h-4 w-4" />,
      keywords: ["quantum", "computing", "robotics", "algorithms", "future"],
    },
    {
      id: "skill-1",
      title: "Machine Learning",
      description: "Expertise in supervised and unsupervised learning algorithms",
      url: "/#skills",
      type: "skill",
      icon: <Cpu className="h-4 w-4" />,
      keywords: ["ML", "AI", "neural networks", "deep learning", "algorithms"],
    },
    {
      id: "skill-2",
      title: "Quantum Computing",
      description: "Knowledge of quantum algorithms and quantum machine learning",
      url: "/#skills",
      type: "skill",
      icon: <Cpu className="h-4 w-4" />,
      keywords: ["quantum", "qubits", "algorithms", "optimization"],
    },
    {
      id: "project-2",
      title: "Quantum Optimization for Robotics",
      description: "Implemented quantum annealing algorithms for robotic systems",
      url: "/#projects",
      type: "project",
      icon: <Cpu className="h-4 w-4" />,
      keywords: ["quantum", "optimization", "robotics", "algorithms"],
    },
    {
      id: "page-1",
      title: "About Me",
      description: "Learn more about my background and experience",
      url: "/#about",
      type: "page",
      icon: <User className="h-4 w-4" />,
      keywords: ["about", "background", "experience", "education", "work"],
    },
    {
      id: "page-2",
      title: "Resume",
      description: "View my professional resume",
      url: "/resume",
      type: "page",
      icon: <FileText className="h-4 w-4" />,
      keywords: ["resume", "CV", "experience", "skills", "education"],
    },
  ]

  // Perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      setSelectedIndex(-1)
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      // Filter results based on search query with improved matching
      const filtered = allResults.filter((result) => {
        const query = searchQuery.toLowerCase()

        // Check title and description
        if (result.title.toLowerCase().includes(query) || result.description.toLowerCase().includes(query)) {
          return true
        }

        // Check keywords for better matching
        if (
          result.keywords &&
          result.keywords.some(
            (keyword) => keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase()),
          )
        ) {
          return true
        }

        return false
      })

      // Sort results by relevance (title matches first)
      filtered.sort((a, b) => {
        const aInTitle = a.title.toLowerCase().includes(searchQuery.toLowerCase())
        const bInTitle = b.title.toLowerCase().includes(searchQuery.toLowerCase())

        if (aInTitle && !bInTitle) return -1
        if (!aInTitle && bInTitle) return 1
        return 0
      })

      setResults(filtered)
      setIsLoading(false)
      setSelectedIndex(filtered.length > 0 ? 0 : -1)
    }, 150) // Reduced delay for more responsive feel

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle key press events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search dialog on Ctrl+K or Command+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(true)
      }

      // Close dialog on Escape
      if (e.key === "Escape") {
        onOpenChange(false)
      }

      // Navigate results with arrow keys
      if (open && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault()
          window.location.href = results[selectedIndex].url
          onOpenChange(false)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange, results, selectedIndex])

  // Scroll selected result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setResults([])
      setSelectedIndex(-1)
    } else {
      // Focus input when dialog opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="flex items-center border-b p-4">
          <Search className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
          <Input
            ref={inputRef}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
            placeholder="Search for anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4" ref={resultsRef}>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Searching...</span>
            </div>
          ) : searchQuery && results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No results found for "{searchQuery}"</div>
          ) : (
            <AnimatePresence>
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15, delay: index * 0.05 }}
                >
                  <Link
                    href={result.url}
                    onClick={() => onOpenChange(false)}
                    className={`block p-3 rounded-md transition-colors mb-1 ${
                      selectedIndex === index ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md ${
                          selectedIndex === index ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
                        }`}
                      >
                        {result.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {searchQuery && results.length > 0 && (
            <div className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-2">
              <span>Navigate with</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↓</kbd>
              <span>and</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

