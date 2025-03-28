"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, Briefcase, GraduationCap, Award, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EditableText } from "@/components/editable-text"
import { useAchievements } from "@/lib/use-achievements"
import { ProfilePicture } from "@/components/profile-picture"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TimelineEvent {
  id: string
  year: string
  title: string
  description: string
  location: string
  type: "education" | "work" | "achievement"
  details?: string
  image?: string
  link?: string
}

export function AboutSection() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const { unlockAchievement } = useAchievements()
  const avatarRef = useRef<HTMLDivElement>(null)

  // Sample timeline events with added images
  const timelineEvents: TimelineEvent[] = [
    {
      id: "education-1",
      year: "2015-2019",
      title: "Bachelor of Science in Robotics Engineering",
      description:
        "Graduated with honors, focusing on autonomous systems and machine learning applications in robotics.",
      location: "Massachusetts Institute of Technology, USA",
      type: "education",
      details:
        "Completed thesis on 'Neural Networks for Robotic Path Planning in Dynamic Environments'. Participated in the MIT Robotics Team, winning 2nd place in the International Robotics Competition. Coursework included Advanced Algorithms, Machine Learning, Computer Vision, and Embedded Systems.",
      image: "/placeholder.svg?height=400&width=600",
      link: "https://mit.edu",
    },
    {
      id: "work-1",
      year: "2019-2020",
      title: "Robotics Engineer Intern",
      description:
        "Developed control algorithms for autonomous drones and contributed to computer vision systems for object detection.",
      location: "Boston Dynamics, USA",
      type: "work",
      details:
        "Worked on the Spot robot platform, implementing vision-based navigation algorithms. Collaborated with a team of 5 engineers to improve object detection accuracy by 35%. Presented research findings at the company's quarterly technology showcase.",
      image: "/placeholder.svg?height=400&width=600",
      link: "https://bostondynamics.com",
    },
    {
      id: "education-2",
      year: "2020-2022",
      title: "Master of Science in Artificial Intelligence",
      description:
        "Specialized in reinforcement learning and quantum computing applications for optimization problems.",
      location: "Stanford University, USA",
      type: "education",
      details:
        "Research focus on quantum algorithms for reinforcement learning. Published 2 papers in top-tier AI conferences. Teaching assistant for 'Introduction to Machine Learning' and 'Advanced Reinforcement Learning' courses.",
      image: "/placeholder.svg?height=400&width=600",
      link: "https://stanford.edu",
    },
    {
      id: "work-2",
      year: "2022-Present",
      title: "AI Research Scientist",
      description:
        "Leading research in quantum optimization algorithms for robotics applications and drone swarm coordination.",
      location: "Quantum AI Labs, Malaysia",
      type: "work",
      details:
        "Leading a team of 3 researchers exploring quantum computing applications in multi-agent systems. Secured $1.2M in research funding. Developed novel algorithms that improve coordination efficiency by 40% compared to classical approaches.",
      image: "/placeholder.svg?height=400&width=600",
      link: "https://example.com/quantum-ai-labs",
    },
    {
      id: "achievement-1",
      year: "2023",
      title: "Published Research Paper",
      description:
        'First-authored a paper on "Quantum Optimization for Multi-Agent Robotic Systems" in Nature Robotics.',
      location: "International Conference on Robotics and Automation",
      type: "achievement",
      details:
        "Paper received the 'Best Paper Award' and has been cited over 50 times within the first 6 months. Research demonstrated a 60% improvement in computational efficiency for complex path planning problems using quantum algorithms.",
      image: "/placeholder.svg?height=400&width=600",
      link: "https://example.com/paper",
    },
  ]

  // Handle event click
  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
    unlockAchievement("explorer")
  }

  // Toggle expanded state for an event
  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "education":
        return <GraduationCap className="h-5 w-5" />
      case "work":
        return <Briefcase className="h-5 w-5" />
      case "achievement":
        return <Award className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  // Handle image click to show in dialog
  const handleImageClick = (image: string) => {
    setActiveImage(image)
  }

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <div className="flex flex-col items-center max-w-3xl mx-auto">
            <motion.div
              ref={avatarRef}
              className="relative mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-[#3BB2F1] rounded-full opacity-75 blur-sm animate-pulse"></div>
              <ProfilePicture className="h-40 w-40 border-4 border-background shadow-lg relative" />
            </motion.div>
            <EditableText
              id="about-description"
              defaultValue="I'm a passionate technologist with expertise in robotics, AI, and quantum computing. My journey has taken me from academic research to industry applications, always pushing the boundaries of what's possible."
              className="text-muted-foreground"
            />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto mt-16">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-border" />

          {/* Timeline events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-background border-2 border-primary dark:border-[#3BB2F1] flex items-center justify-center z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {getEventIcon(event.type)}
                </motion.div>

                {/* Event card */}
                <div className={`w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                  <Card
                    className="overflow-hidden transition-all hover:shadow-md cursor-pointer dark:bg-gradient-to-b dark:from-background dark:to-background/80 dark:hover:shadow-[0_10px_20px_-10px_rgba(59,178,241,0.3)]"
                    onClick={() => toggleEventExpansion(event.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-primary">
                          {getEventIcon(event.type)}
                          <span className="font-medium">{event.year}</span>
                        </div>
                        <Badge
                          variant={
                            event.type === "education" ? "default" : event.type === "work" ? "secondary" : "outline"
                          }
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{event.title}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>

                      {/* Expandable details */}
                      <AnimatePresence>
                        {expandedEvents.has(event.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t space-y-3">
                              <p className="text-sm">{event.details}</p>

                              {event.image && (
                                <div
                                  className="relative overflow-hidden rounded-md aspect-video bg-muted cursor-pointer group"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleImageClick(event.image || "")
                                  }}
                                >
                                  <img
                                    src={event.image || "/placeholder.svg"}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm">
                                      View Larger
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {event.link && (
                                <div className="flex justify-end">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 h-6 text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      window.open(event.link, "_blank")
                                    }}
                                  >
                                    Learn More <ExternalLink className="ml-1 h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEventClick(event)
                          }}
                        >
                          <span className="text-xs mr-1">Details</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${expandedEvents.has(event.id) ? "rotate-90" : ""}`}
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected event details dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {getEventIcon(selectedEvent.type)}
                    {selectedEvent.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{selectedEvent.year}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>

                  {selectedEvent.image && (
                    <div className="overflow-hidden rounded-md aspect-video bg-muted">
                      <img
                        src={selectedEvent.image || "/placeholder.svg"}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <p className="text-muted-foreground">{selectedEvent.description}</p>
                    {selectedEvent.details && (
                      <div className="bg-muted/50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Additional Details</h4>
                        <p className="text-sm">{selectedEvent.details}</p>
                      </div>
                    )}
                  </div>

                  {selectedEvent.link && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => window.open(selectedEvent.link, "_blank")}
                      >
                        Visit Website <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Image preview dialog */}
        <Dialog open={!!activeImage} onOpenChange={() => setActiveImage(null)}>
          <DialogContent className="sm:max-w-[800px] p-1">
            {activeImage && (
              <img src={activeImage || "/placeholder.svg"} alt="Preview" className="w-full h-auto rounded-md" />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

