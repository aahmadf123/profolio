"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github, ChevronRight, Filter, X, Play, Maximize2, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditableProjects } from "@/components/editable-projects"
import { useAchievements } from "@/lib/use-achievements"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  links: {
    demo?: string
    github?: string
    paper?: string
  }
  featured: boolean
  preview?: {
    type: "image" | "video" | "gif" | "interactive"
    url: string
    embedCode?: string
  }
}

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewedProjects, setViewedProjects] = useState<Set<string>>(new Set())
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">("newest")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { unlockAchievement } = useAchievements()

  // Sample projects data with previews
  const projects: Project[] = [
    {
      id: "project-1",
      title: "Autonomous Drone Swarm",
      description:
        "Developed a swarm intelligence algorithm for coordinating multiple drones in complex environments, enabling collaborative mapping and search operations.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Robotics",
      technologies: ["Python", "ROS", "Computer Vision", "PX4"],
      links: {
        demo: "https://example.com/demo",
        github: "https://github.com/yourusername/drone-swarm",
      },
      featured: true,
      preview: {
        type: "video",
        url: "https://player.vimeo.com/video/367695719?h=f16c67d2e7",
        embedCode:
          '<iframe src="https://player.vimeo.com/video/367695719?h=f16c67d2e7" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>',
      },
    },
    {
      id: "project-2",
      title: "Quantum Optimization for Robotics",
      description:
        "Implemented quantum annealing algorithms to solve complex path planning and resource allocation problems for robotic systems.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Quantum Computing",
      technologies: ["Qiskit", "Python", "D-Wave Ocean", "MATLAB"],
      links: {
        paper: "https://example.com/paper",
        github: "https://github.com/yourusername/quantum-robotics",
      },
      featured: true,
      preview: {
        type: "interactive",
        url: "https://quantum-circuit-simulator.netlify.app/",
      },
    },
    {
      id: "project-3",
      title: "Reinforcement Learning for Robotic Manipulation",
      description:
        "Trained a robotic arm to perform complex manipulation tasks using deep reinforcement learning algorithms.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Artificial Intelligence",
      technologies: ["PyTorch", "OpenAI Gym", "ROS", "C++"],
      links: {
        demo: "https://example.com/demo",
        github: "https://github.com/yourusername/rl-manipulation",
      },
      featured: false,
      preview: {
        type: "gif",
        url: "/placeholder.svg?height=500&width=700",
      },
    },
    {
      id: "project-4",
      title: "Drone-based Agricultural Monitoring",
      description:
        "Developed a system for automated crop health monitoring using drones equipped with multispectral cameras and machine learning algorithms.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Aviation",
      technologies: ["Python", "TensorFlow", "Computer Vision", "DJI SDK"],
      links: {
        github: "https://github.com/yourusername/agri-drone",
      },
      featured: false,
      preview: {
        type: "image",
        url: "/placeholder.svg?height=600&width=800",
      },
    },
    {
      id: "project-5",
      title: "MLOps Pipeline for Robotics",
      description:
        "Built an end-to-end MLOps pipeline for training, deploying, and monitoring machine learning models for robotic applications.",
      image: "/placeholder.svg?height=400&width=600",
      category: "MLOps",
      technologies: ["Kubernetes", "Docker", "MLflow", "Python"],
      links: {
        github: "https://github.com/yourusername/robotics-mlops",
      },
      featured: false,
      preview: {
        type: "image",
        url: "/placeholder.svg?height=600&width=800",
      },
    },
    {
      id: "project-6",
      title: "Space Debris Tracking System",
      description:
        "Developed an algorithm for tracking and predicting the trajectory of space debris using radar data and orbital mechanics models.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Space Technologies",
      technologies: ["Python", "MATLAB", "GMAT", "Machine Learning"],
      links: {
        paper: "https://example.com/paper",
      },
      featured: false,
      preview: {
        type: "video",
        url: "https://player.vimeo.com/video/367695719?h=f16c67d2e7",
        embedCode:
          '<iframe src="https://player.vimeo.com/video/367695719?h=f16c67d2e7" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>',
      },
    },
  ]

  // Get unique categories
  const categories = Array.from(new Set(projects.map((project) => project.category)))

  // Sort projects
  const sortProjects = (projects: Project[]) => {
    switch (sortBy) {
      case "newest":
        return [...projects].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
      case "oldest":
        return [...projects].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? 1 : -1))
      case "az":
        return [...projects].sort((a, b) => a.title.localeCompare(b.title))
      case "za":
        return [...projects].sort((a, b) => b.title.localeCompare(a.title))
      default:
        return projects
    }
  }

  // Filter projects based on category
  const filteredProjects = sortProjects(
    projects.filter((project) => {
      return selectedCategory ? project.category === selectedCategory : true
    }),
  )

  // Featured projects
  const featuredProjects = sortProjects(projects.filter((project) => project.featured))

  // Handle project click
  const handleProjectClick = (projectId: string) => {
    // Track viewed projects
    const newViewedProjects = new Set(viewedProjects)
    newViewedProjects.add(projectId)
    setViewedProjects(newViewedProjects)

    // If 3 or more projects have been viewed, unlock achievement
    if (newViewedProjects.size >= 3) {
      unlockAchievement("curious")
    }
  }

  // Handle preview click
  const handlePreviewClick = (project: Project) => {
    setSelectedProject(project)
    setPreviewOpen(true)
    unlockAchievement("media_buff")
  }

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category))
  }

  // Clear category filter
  const clearCategoryFilter = () => {
    setSelectedCategory(null)
  }

  // Toggle fullscreen for video
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen()
        }
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Projects</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore my portfolio of projects spanning robotics, AI, quantum computing, and more.
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Badge>
                ))}
                {selectedCategory && (
                  <Button variant="ghost" size="sm" onClick={clearCategoryFilter} className="text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <select
                  className="text-sm bg-transparent border rounded-md px-2 py-1"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
              </div>
            </div>
          </div>

          <TabsContent value="all">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variants={itemVariants}
                  onClick={() => handleProjectClick(project.id)}
                  onPreviewClick={() => handlePreviewClick(project)}
                />
              ))}
            </motion.div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found in this category.</p>
                <Button variant="outline" onClick={clearCategoryFilter} className="mt-4">
                  Show All Projects
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="featured">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProjects
                .filter((project) => (selectedCategory ? project.category === selectedCategory : true))
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    variants={itemVariants}
                    onClick={() => handleProjectClick(project.id)}
                    onPreviewClick={() => handlePreviewClick(project)}
                  />
                ))}
            </motion.div>

            {featuredProjects.filter((project) => (selectedCategory ? project.category === selectedCategory : true))
              .length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No featured projects found in this category.</p>
                <Button variant="outline" onClick={clearCategoryFilter} className="mt-4">
                  Show All Featured Projects
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Editable Projects Component */}
        <EditableProjects />

        {/* Project Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent
            className={`${isFullscreen ? "fixed inset-0 w-screen h-screen max-w-none rounded-none" : "sm:max-w-3xl"}`}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedProject?.title}</span>
                {(selectedProject?.preview?.type === "video" || selectedProject?.preview?.type === "interactive") && (
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedProject?.preview?.type === "video" ? (
                <div className="aspect-video w-full">
                  {selectedProject.preview.embedCode ? (
                    <div
                      className="w-full h-full rounded-md overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: selectedProject.preview.embedCode }}
                    />
                  ) : (
                    <iframe
                      src={selectedProject.preview.url}
                      className="w-full h-full rounded-md"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      ref={videoRef as any}
                    ></iframe>
                  )}
                </div>
              ) : selectedProject?.preview?.type === "interactive" ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={selectedProject.preview.url}
                    className="w-full h-full rounded-md"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : selectedProject?.preview?.type === "gif" ? (
                <img
                  src={selectedProject.preview.url || "/placeholder.svg"}
                  alt={selectedProject.title}
                  className="w-full rounded-md"
                />
              ) : (
                <img
                  src={selectedProject?.preview?.url || selectedProject?.image || ""}
                  alt={selectedProject?.title}
                  className="w-full rounded-md"
                />
              )}
              <div className="mt-4">
                <p className="text-muted-foreground">{selectedProject?.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedProject?.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {selectedProject?.links.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedProject.links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                  )}
                  {selectedProject?.links.demo && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedProject.links.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {selectedProject?.links.paper && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedProject.links.paper} target="_blank" rel="noopener noreferrer">
                        <Code className="mr-2 h-4 w-4" />
                        Research Paper
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: Project
  variants?: any
  onClick: () => void
  onPreviewClick: () => void
}

function ProjectCard({ project, variants, onClick, onPreviewClick }: ProjectCardProps) {
  return (
    <motion.div variants={variants} className="h-full">
      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] dark:bg-gradient-to-b dark:from-background dark:to-background/80 dark:hover:shadow-[0_10px_20px_-10px_rgba(59,178,241,0.3)]">
        <div className="aspect-video overflow-hidden bg-muted relative group">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onPreviewClick()
              }}
              className="dark:bg-[#3BB2F1]/20 dark:text-[#3BB2F1] dark:hover:bg-[#3BB2F1]/30"
            >
              <Play className="h-4 w-4 mr-2" />
              {project.preview?.type === "video"
                ? "Watch Video"
                : project.preview?.type === "interactive"
                  ? "Try Demo"
                  : "Preview"}
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Badge>{project.category}</Badge>
            {project.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          <h3 className="font-semibold text-xl mb-2">{project.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub repository"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Live demo"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClick} className="group">
              Details
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
