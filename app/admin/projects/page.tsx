"use client"

import { Suspense, useState } from "react"
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash,
  Calendar,
  ExternalLink,
  Github,
  ArrowUpDown,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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
  createdAt: string
  updatedAt: string
}

function ProjectsPageContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"title" | "date">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  // Sample projects data (from the user's existing project)
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
      createdAt: "2023-05-15T14:30:00Z",
      updatedAt: "2023-09-20T09:15:00Z",
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
      createdAt: "2023-03-10T11:45:00Z",
      updatedAt: "2023-08-05T16:20:00Z",
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
      createdAt: "2022-11-20T08:30:00Z",
      updatedAt: "2023-07-12T13:45:00Z",
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
      createdAt: "2022-08-05T10:15:00Z",
      updatedAt: "2023-06-18T09:30:00Z",
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
      createdAt: "2022-06-15T14:20:00Z",
      updatedAt: "2023-04-22T11:10:00Z",
    },
  ]

  // Get unique categories
  const categories = Array.from(new Set(projects.map((project) => project.category)))

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory ? project.category === selectedCategory : true

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else {
        return sortOrder === "asc"
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

  // Edit project
  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }

  // Save project
  const handleSaveProject = () => {
    if (!selectedProject) return

    // In a real app, this would be an API call
    toast({
      title: "Project Saved",
      description: `Successfully saved ${selectedProject.title}`,
    })

    setIsDialogOpen(false)
    setSelectedProject(null)
  }

  // Delete project
  const handleDeleteProject = () => {
    if (!selectedProject) return

    // In a real app, this would be an API call
    toast({
      title: "Project Deleted",
      description: `Successfully deleted ${selectedProject.title}`,
    })

    setIsDeleteDialogOpen(false)
    setSelectedProject(null)
  }

  // Toggle sort order
  const toggleSort = (field: "title" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1" onClick={() => setSelectedProject(null)}>
              <PlusCircle className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                {selectedProject ? "Update your project details below." : "Fill in the details of your new project."}
              </DialogDescription>
            </DialogHeader>
            {selectedProject !== null || isDialogOpen ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={selectedProject?.title || ""}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject!,
                        title: e.target.value,
                      } as Project)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project"
                    className="min-h-[120px]"
                    value={selectedProject?.description || ""}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject!,
                        description: e.target.value,
                      } as Project)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Robotics, AI"
                      value={selectedProject?.category || ""}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject!,
                          category: e.target.value,
                        } as Project)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      placeholder="Image path or URL"
                      value={selectedProject?.image || ""}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject!,
                          image: e.target.value,
                        } as Project)
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="technologies">Technologies (comma separated)</Label>
                  <Input
                    id="technologies"
                    placeholder="e.g., React, Node.js, Python"
                    value={selectedProject?.technologies.join(", ") || ""}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject!,
                        technologies: e.target.value.split(",").map((tech) => tech.trim()),
                      } as Project)
                    }
                  />
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="demo-link">Demo Link</Label>
                    <Input
                      id="demo-link"
                      placeholder="https://example.com"
                      value={selectedProject?.links.demo || ""}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject!,
                          links: {
                            ...selectedProject!.links,
                            demo: e.target.value,
                          },
                        } as Project)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="github-link">GitHub Link</Label>
                    <Input
                      id="github-link"
                      placeholder="https://github.com/..."
                      value={selectedProject?.links.github || ""}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject!,
                          links: {
                            ...selectedProject!.links,
                            github: e.target.value,
                          },
                        } as Project)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="paper-link">Paper Link</Label>
                    <Input
                      id="paper-link"
                      placeholder="https://arxiv.org/..."
                      value={selectedProject?.links.paper || ""}
                      onChange={(e) =>
                        setSelectedProject({
                          ...selectedProject!,
                          links: {
                            ...selectedProject!.links,
                            paper: e.target.value,
                          },
                        } as Project)
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={selectedProject?.featured || false}
                    onCheckedChange={(checked) =>
                      setSelectedProject({
                        ...selectedProject!,
                        featured: checked as boolean,
                      } as Project)
                    }
                  />
                  <Label htmlFor="featured">Mark as featured project</Label>
                </div>
              </div>
            ) : null}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject}>{selectedProject?.id ? "Update Project" : "Add Project"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this project? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedProject && (
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-semibold">{selectedProject.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProject.category}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProject}>
                Delete Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by category */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedCategory || "All Categories"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>All Categories</DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
              <div className="col-span-5 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1 p-0 font-medium" onClick={() => toggleSort("title")}>
                  Project
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="col-span-2 text-center">Category</div>
              <div className="col-span-2 text-center">
                <Button variant="ghost" size="sm" className="gap-1 p-0 font-medium" onClick={() => toggleSort("date")}>
                  Updated
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="col-span-1 text-center">Featured</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredProjects.map((project) => (
              <div key={project.id} className="grid grid-cols-12 items-center p-4 border-t">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="h-10 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{project.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {project.technologies.slice(0, 3).join(", ")}
                      {project.technologies.length > 3 && "..."}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <div className="col-span-2 text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(project.updatedAt)}
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  {project.featured ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                  )}
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(project)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No projects found.</p>
                {(searchQuery || selectedCategory) && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory(null)
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Create a wrapper component that uses Suspense
function ProjectsWrapper() {
  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <ProjectsPageContent />
    </Suspense>
  )
}

export default function ProjectsPage() {
  return <ProjectsWrapper />
}

