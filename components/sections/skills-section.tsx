"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X, Link, ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "@/components/ui/lucide-icon"
import { useAchievements } from "@/lib/use-achievements"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useInView } from "framer-motion"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  level: "beginner" | "intermediate" | "advanced" | "expert"
  description: string
  icon: string
  tools: string[]
  relatedProjects?: Array<{
    id: string
    title: string
    url: string
  }>
}

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [animatedSkills, setAnimatedSkills] = useState<Set<string>>(new Set())
  const { unlockAchievement } = useAchievements()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  // Sample skills data with related projects and skill levels
  const skills: Skill[] = [
    {
      id: "skill-1",
      name: "Machine Learning",
      category: "Artificial Intelligence",
      proficiency: 90,
      level: "expert",
      description:
        "Expertise in supervised and unsupervised learning algorithms, deep learning, and neural networks for various applications.",
      icon: "Brain",
      tools: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras"],
      relatedProjects: [
        { id: "project-3", title: "Reinforcement Learning for Robotic Manipulation", url: "#projects" },
        { id: "project-4", title: "Drone-based Agricultural Monitoring", url: "#projects" },
      ],
    },
    {
      id: "skill-2",
      name: "Robotics",
      category: "Robotics",
      proficiency: 85,
      level: "advanced",
      description:
        "Specialized in robot kinematics, dynamics, control systems, and autonomous navigation for various robotic platforms.",
      icon: "Cpu",
      tools: ["ROS", "Gazebo", "MATLAB", "Arduino"],
      relatedProjects: [
        { id: "project-1", title: "Autonomous Drone Swarm", url: "#projects" },
        { id: "project-3", title: "Reinforcement Learning for Robotic Manipulation", url: "#projects" },
      ],
    },
    {
      id: "skill-3",
      name: "Quantum Computing",
      category: "Quantum Optimization",
      proficiency: 80,
      level: "advanced",
      description:
        "Knowledge of quantum algorithms, quantum annealing, and quantum machine learning for optimization problems.",
      icon: "Atom",
      tools: ["Qiskit", "D-Wave Ocean", "Cirq", "Pennylane"],
      relatedProjects: [{ id: "project-2", title: "Quantum Optimization for Robotics", url: "#projects" }],
    },
    {
      id: "skill-4",
      name: "Computer Vision",
      category: "Artificial Intelligence",
      proficiency: 85,
      level: "advanced",
      description:
        "Proficient in image processing, object detection, segmentation, and tracking for various applications.",
      icon: "Eye",
      tools: ["OpenCV", "YOLO", "MediaPipe", "TensorFlow Vision"],
      relatedProjects: [
        { id: "project-1", title: "Autonomous Drone Swarm", url: "#projects" },
        { id: "project-4", title: "Drone-based Agricultural Monitoring", url: "#projects" },
      ],
    },
    {
      id: "skill-5",
      name: "Drone Technology",
      category: "Aviation",
      proficiency: 90,
      level: "expert",
      description:
        "Expert in drone design, flight dynamics, control systems, and autonomous navigation for various applications.",
      icon: "Plane",
      tools: ["PX4", "ArduPilot", "DJI SDK", "Mission Planner"],
      relatedProjects: [
        { id: "project-1", title: "Autonomous Drone Swarm", url: "#projects" },
        { id: "project-4", title: "Drone-based Agricultural Monitoring", url: "#projects" },
      ],
    },
    {
      id: "skill-6",
      name: "Reinforcement Learning",
      category: "Artificial Intelligence",
      proficiency: 80,
      level: "advanced",
      description: "Experience in developing RL algorithms for robotics, game playing, and optimization problems.",
      icon: "Zap",
      tools: ["OpenAI Gym", "Stable Baselines", "RLlib", "TensorFlow Agents"],
      relatedProjects: [
        { id: "project-3", title: "Reinforcement Learning for Robotic Manipulation", url: "#projects" },
      ],
    },
    {
      id: "skill-7",
      name: "MLOps",
      category: "MLOps",
      proficiency: 75,
      level: "intermediate",
      description: "Knowledge of ML model deployment, monitoring, and maintenance in production environments.",
      icon: "GitBranch",
      tools: ["Docker", "Kubernetes", "MLflow", "Kubeflow"],
      relatedProjects: [{ id: "project-5", title: "MLOps Pipeline for Robotics", url: "#projects" }],
    },
    {
      id: "skill-8",
      name: "Space Technologies",
      category: "Space Technologies",
      proficiency: 70,
      level: "intermediate",
      description: "Understanding of satellite systems, space robotics, and orbital mechanics for space applications.",
      icon: "Rocket",
      tools: ["GMAT", "STK", "NASA SPICE", "Orekit"],
      relatedProjects: [{ id: "project-6", title: "Space Debris Tracking System", url: "#projects" }],
    },
  ]

  // Get unique categories
  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  // Filter skills based on category and search query
  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory ? skill.category === selectedCategory : true
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tools.some((tool) => tool.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Handle skill click
  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsDialogOpen(true)
    unlockAchievement("tech_enthusiast")
  }

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category))

    // If all categories have been clicked, unlock achievement
    if (!categories.some((cat) => cat !== category && !localStorage.getItem(`clicked-category-${cat}`))) {
      unlockAchievement("tech_enthusiast")
    }

    // Mark category as clicked
    localStorage.setItem(`clicked-category-${category}`, "true")
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory(null)
    setSearchQuery("")
  }

  // Animate proficiency bars when in view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedSkills(new Set(skills.map((skill) => skill.id)))
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isInView, skills])

  // Get skill level badge
  const getSkillLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Star className="h-3 w-3 mr-1 fill-current" /> Beginner
          </Badge>
        )
      case "intermediate":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Star className="h-3 w-3 mr-1 fill-current" /> Intermediate
          </Badge>
        )
      case "advanced":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="ml-1">Advanced</span>
          </Badge>
        )
      case "expert":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-400/20">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="ml-1">Expert</span>
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore my technical expertise across various domains, from artificial intelligence and robotics to quantum
            computing and aviation.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search skills, tools, or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
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
            {(selectedCategory || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Skills grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className="h-full cursor-pointer card-enhanced dark:bg-gradient-card transition-all duration-300 hover:shadow-card-hover dark:hover:shadow-card-dark-hover"
                      onClick={() => handleSkillClick(skill)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            <LucideIcon name={skill.icon as any} className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">{skill.name}</h3>
                              {getSkillLevelBadge(skill.level)}
                            </div>
                            <Badge variant="secondary" className="mt-1">
                              {skill.category}
                            </Badge>

                            {/* Enhanced animated proficiency bar */}
                            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-[#3BB2F1] dark:from-[#3BB2F1] dark:to-[#00ADB5] shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{
                                  width: animatedSkills.has(skill.id) ? `${skill.proficiency}%` : "0%",
                                }}
                                transition={{
                                  duration: 1.5,
                                  ease: "easeOut",
                                  delay: index * 0.1,
                                }}
                              />
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                              <span>Proficiency</span>
                              <span className="font-medium">{skill.proficiency}%</span>
                            </div>

                            {/* Short description */}
                            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{skill.description}</p>

                            {/* Tools */}
                            <div className="mt-3 flex flex-wrap gap-1">
                              {skill.tools.slice(0, 3).map((tool) => (
                                <Badge key={tool} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                              {skill.tools.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{skill.tools.length - 3} more
                                </Badge>
                              )}
                            </div>

                            {/* Enhanced related projects indicator */}
                            {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                              <div className="mt-3 flex items-center text-xs interactive-link">
                                <Link className="h-3 w-3 mr-1" />
                                <span className="underline">
                                  {skill.relatedProjects.length} related project
                                  {skill.relatedProjects.length > 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>Click to view details about {skill.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </div>

        {/* No results */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No skills found matching your filters.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Skill details dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] dark:bg-gradient-card">
            {selectedSkill && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <LucideIcon name={selectedSkill.icon as any} className="h-5 w-5 text-primary" />
                    {selectedSkill.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{selectedSkill.category}</Badge>
                    {getSkillLevelBadge(selectedSkill.level)}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Proficiency</span>
                      <span className="text-sm font-medium">{selectedSkill.proficiency}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-[#3BB2F1] dark:from-[#3BB2F1] dark:to-[#00ADB5]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${selectedSkill.proficiency}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground">{selectedSkill.description}</p>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.tools.map((tool) => (
                        <Badge key={tool} variant="outline">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedSkill.relatedProjects && selectedSkill.relatedProjects.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Related Projects</h4>
                      <div className="space-y-2">
                        {selectedSkill.relatedProjects.map((project) => (
                          <a
                            key={project.id}
                            href={project.url}
                            className="flex items-center justify-between p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors interactive-link"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            <span>{project.title}</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

