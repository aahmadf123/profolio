"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowDown, ExternalLink, Github, ChevronRight, Code, Cpu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAchievements } from "@/lib/use-achievements"
import { NameDisplay } from "@/components/name-display"
import { EditableText } from "@/components/editable-text"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)
  const { unlockAchievement } = useAchievements()
  const typingRef = useRef<NodeJS.Timeout | null>(null)

  const phrases = [
    "Robotics Engineer",
    "AI Researcher",
    "Quantum Optimization Specialist",
    "Drone Enthusiast",
    "Aviation Expert",
  ]

  // Enhanced typing animation effect with variable speed
  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[currentPhraseIndex]

      // Set typing speed based on action (typing vs deleting)
      const speed = isDeleting ? 50 : Math.random() * 50 + 80

      if (!isDeleting && typedText === currentPhrase) {
        // Pause at the end of typing before deleting
        setTypingSpeed(2000) // Pause for 2 seconds
        setIsDeleting(true)
      } else if (isDeleting && typedText === "") {
        // Move to next phrase after deleting
        setIsDeleting(false)
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        setTypingSpeed(500) // Slight pause before typing new phrase
      } else {
        // Update text based on typing or deleting
        setTypedText((prev) =>
          isDeleting ? prev.substring(0, prev.length - 1) : currentPhrase.substring(0, prev.length + 1),
        )
        setTypingSpeed(speed)
      }
    }

    // Clear any existing timeout
    if (typingRef.current) clearTimeout(typingRef.current)

    // Set new timeout
    typingRef.current = setTimeout(handleTyping, typingSpeed)

    // Cleanup
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current)
    }
  }, [currentPhraseIndex, isDeleting, phrases, typedText, typingSpeed])

  // Scroll to section functions
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
    unlockAchievement("explorer")
  }

  // Featured project data
  const featuredProject = {
    title: "Autonomous Drone Swarm",
    description:
      "Developed a swarm intelligence algorithm for coordinating multiple drones in complex environments, enabling collaborative mapping and search operations.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: ["Python", "ROS", "Computer Vision", "PX4"],
    links: {
      demo: "https://example.com/demo",
      github: "https://github.com/yourusername/drone-swarm",
    },
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20">
      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="block">Hello, I'm</span>
            <NameDisplay className="text-primary" />
          </h1>

          <h2 className="text-2xl md:text-3xl font-medium">
            <span>I'm a </span>
            <span className="text-primary min-h-[1.5em] inline-block">
              {typedText}
              <span className="animate-blink">|</span>
            </span>
          </h2>

          <div className="max-w-2xl mx-auto">
            <EditableText
              id="hero-description"
              defaultValue="Passionate about leveraging cutting-edge technologies to solve complex problems in robotics, artificial intelligence, and quantum computing."
              className="text-muted-foreground text-lg"
            />
          </div>

          {/* Quick Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-8 flex flex-wrap justify-center gap-4"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => scrollToSection("about")}
                    variant="outline"
                    size="lg"
                    className="group bg-background/50 backdrop-blur-sm hover:bg-primary/10 border-primary/20"
                  >
                    <User className="mr-2 h-5 w-5 text-primary group-hover:animate-pulse" />
                    About Me
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Learn about my background and experience</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => scrollToSection("skills")}
                    variant="outline"
                    size="lg"
                    className="group bg-background/50 backdrop-blur-sm hover:bg-primary/10 border-primary/20"
                  >
                    <Cpu className="mr-2 h-5 w-5 text-primary group-hover:animate-pulse" />
                    Skills
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Explore my technical expertise</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => scrollToSection("projects")}
                    variant="outline"
                    size="lg"
                    className="group bg-background/50 backdrop-blur-sm hover:bg-primary/10 border-primary/20"
                  >
                    <Code className="mr-2 h-5 w-5 text-primary group-hover:animate-pulse" />
                    Projects
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View my portfolio of work</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => scrollToSection("contact")}
                    variant="primary"
                    size="lg"
                    className="group bg-primary hover:bg-primary/90 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-500 opacity-90"></span>
                    <span className="relative z-10 flex items-center">
                      <ChevronRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      Get In Touch
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Contact me for opportunities</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Project Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="container mx-auto px-4 mt-16 z-10"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-center">Featured Project</h3>
          <Card className="overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:scale-[1.01] dark:bg-gradient-to-b dark:from-background dark:to-background/80 dark:hover:shadow-[0_10px_20px_-10px_rgba(59,178,241,0.3)]">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="aspect-video overflow-hidden bg-muted relative group">
                <img
                  src={featuredProject.image || "/placeholder.svg"}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="dark:bg-[#3BB2F1]/20 dark:text-[#3BB2F1] dark:hover:bg-[#3BB2F1]/30"
                  >
                    View Demo
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{featuredProject.title}</h3>
                  <p className="text-muted-foreground mb-4">{featuredProject.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredProject.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {featuredProject.links.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={featuredProject.links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Code
                        </a>
                      </Button>
                    )}
                    {featuredProject.links.demo && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={featuredProject.links.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                  <Button variant="default" size="sm" asChild>
                    <a href="#projects">View All Projects</a>
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        animate={{
          y: [0, 10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <ArrowDown className="h-6 w-6 text-primary" />
      </motion.div>
    </section>
  )
}

